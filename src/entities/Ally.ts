import {Group} from 'phaser';
import Game from '../Game';
import {js as EasyStar} from 'easystarjs';
import {Warrior} from './Warrior';
import {store} from '../config/store';
import {lang} from '../config/lang';
import {socket} from '../utils/socket-handler';
import {walkAnimation, fightAnimation, swordSound} from '../utils/animation.helper';

const {gameId} = store;

/**
 * Ally class.
 */
export class Ally extends Warrior {

    selected: boolean;
    newPosX: number;
    newPosY: number;
    pathx: number;
    pathy: number;
    path: any;
    move: any;
    attack: any;
    name: string;

    constructor(game: Game,
                x: number,
                y: number,
                name: string) {
        super(game, x, y, 'warrior', 0);

        // Physics
        this.body.immovable = true;
        this.inputEnabled = true;
        this.scale.setTo(2);
        this.input.priorityID = 1;
        this.anchor.setTo(0.5, 0.5);
        this.selected = false;
        this.newPosX = this.x;
        this.newPosY = this.y;
        this.pathx = this.x / 32;
        this.pathy = this.y / 16;
        this.path = new EasyStar();
        this.path.setAcceptableTiles([0]);
        this.path.setIterationsPerCalculation(1000);
        this.health = 100;
        this.name = name;

        // Groups
        // @ts-ignore
        store.allies.push(this);
        store.all.add(this);

        // Animation
        this.animations.add('south', [0, 1, 2, 3, 4]);
        this.animations.add('north', [5, 6, 7, 8, 9]);
        this.animations.add('east', [10, 11, 12, 13, 14]);
        this.animations.add('west', [15, 16, 17, 18, 19]);
        this.animations.add('sattack', [0, 20, 21, 22, 23, 24]);
        this.animations.add('nattack', [5, 25, 26, 27, 28, 29]);
        this.animations.add('eattack', [10, 30, 31, 32, 33, 34]);
        this.animations.add('wattack', [15, 35, 36, 37, 38, 39]);
        this.events.onInputDown.add(this.select, this);

        game.input.onUp.add((pointer) => {
            if (store.gameOn && this.selected && pointer.x < 477 && pointer.y < 797 && pointer.x > 3 && pointer.y > 3) {
                this.newPosX = pointer.x;
                this.newPosY = pointer.y;

                this.move;
            }
        });

        this.move = game.time.events.loop(300, () => {
            this.path.setGrid(store.map.grid);
            this.path.findPath(
                Math.round(this.x / 32),
                Math.round(this.y / 16),
                Math.abs(Math.round(this.newPosX / 32)), // TODO: Bug to fix
                Math.abs(Math.round(this.newPosY / 16)),
                (path) => {
                    if (path === null) {
                        this.body.velocity.x = 0;
                        this.body.velocity.y = 0;
                        this.move.pause;
                    }
                    if (path && path[1]) {
                        this.move.resume;
                        game.physics.arcade.moveToXY(this, path[1].x * 32, path[1].y * 16);
                        walkAnimation(this, path[0].x, path[1].x, path[0].y, path[1].y);
                        store.all.sort('x', Group.SORT_ASCENDING);
                        store.all.sort('y', Group.SORT_ASCENDING);

                        // Set obstacle on the caracter and emit
                        if (this.pathx !== path[0].x || this.pathy !== path[0].y) {
                            socket.emit('is_moving', {
                                nextx: path[1].x * 32,
                                nexty: path[1].y * 16,
                                name: this.name,
                                gameId
                            });
                            // map.caracterObstacle(this.pathx, this.pathy, 0);
                        }
                        // map.caracterObstacle(path[0].x, path[0].y, 1);
                        this.pathx = path[0].x;
                        this.pathy = path[0].y;
                    } else {
                        if (this.body) {
                            this.body.velocity.setTo(0, 0);
                        }
                    }
                });
            this.path.calculate();
        });

        this.attack = game.time.events.loop(Phaser.Timer.SECOND, () => {
            store.ennemies.forEach((ennemy) => {
                if (ennemy.alive && game.physics.arcade.distanceBetween(this, ennemy) < 32) {
                    socket.emit('attack', {
                        name: ennemy.name,
                        damage: game.rnd.integerInRange(2, 6),
                        gameId: gameId
                    });
                    fightAnimation(this, ennemy);
                    swordSound(store.sword1, store.sword2, store.pare);
                    console.log('fight');
                }
            });
        });

        this.events.onKilled.add(() => {
            socket.emit('death', {name: this.name, gameId});
            const skeleton = game.add.sprite(this.x, this.y, 'skeleton');
            skeleton.anchor.setTo(0.5, 0.5);
            store.all.add(skeleton);
            skeleton.animations.add('death', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
            skeleton.animations.play('death', 10, false);
            this.x = 0;
            this.y = 800;
        });
    }

    select() {
        store.allies.map((caracter) => {
            caracter.selected = false;
        });
        this.selected = true;
    }

    getFlag() {
        if (this.game && this.game.physics.arcade.distanceBetween(this, store.theirFlag) < 32) {
            socket.emit('got_flag', {name: this.name, gameId});
            store.theirFlag.x = this.x;
            store.theirFlag.y = this.y - 24;
        }
    }

    // Damge is a native method from phaser
    giveDamage(lp) {
        this.health -= lp;
        if (this.health < 0) {
            if (this.alive) {
                store.deadWarior++;
            }
            this.kill();
            socket.emit('death', {name: this.name, gameId});
            if (store.deadWarior > 5) {
                socket.emit('we_have_a_looser', {gameId});
                const looser = this.game.add.text(this.game.world.centerX, this.game.world.centerY, lang[store.selectedLang].LOOSE, {
                    fill: '#000000',
                    font: 'bold 32px Almendra'
                });
                looser.anchor.setTo(0.5);
                // if (logged) {
                //     var body = {
                //         token: window.localStorage.getItem('jtw'),
                //         victory: false,
                //         defeat: true
                //     };
                //     $.ajax({
                //         url: '/update_ratio',
                //         type: 'PUT',
                //         data: body,
                //         success: function (data) {
                //             user_infos = data.infos;
                //         },
                //         error: function (err) {
                //         }
                //     });
                // }
                this.game.paused = true;
            }
        }
    }
}
