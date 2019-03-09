import {Group} from 'phaser';
import Game from '../Game';
import {js as EasyStar} from 'easystarjs';
import {Warrior} from './Warrior';
import {store} from '../config/store';
import {fightAnimation, swordSound, walkAnimation} from '../utils/animation.helper';

/**
 * Ennemy class.
 */
export class Ennemy extends Warrior {

    newPosX: number;
    newPosY: number;
    pathx: number;
    pathy: number;
    path;
    move;
    attack;

    constructor(game: Game,
                x: number,
                y: number,
                name: string) {
        super(game, x, y, 'warrior', 0);

        // Physics
        this.body.immovable = true;
        this.scale.setTo(2);
        this.anchor.setTo(0.5, 0.5);
        this.newPosX = this.x;
        this.newPosY = this.y;
        this.pathx = this.x / 32;
        this.pathy = this.y / 16;
        this.path = new EasyStar();
        this.path.setAcceptableTiles([0]);
        this.path.setIterationsPerCalculation(1000);
        this.health = 150;
        this.animations.add('iddle', [0]);
        this.animations.add('south', [0, 1, 2, 3, 4]);
        this.animations.add('north', [5, 6, 7, 8, 9]);
        this.animations.add('east', [10, 11, 12, 13, 14]);
        this.animations.add('west', [15, 16, 17, 18, 19]);
        this.animations.add('sattack', [0, 20, 21, 22, 23, 24]);
        this.animations.add('nattack', [5, 25, 26, 27, 28, 29]);
        this.animations.add('eattack', [10, 30, 31, 32, 33, 34]);
        this.animations.add('wattack', [15, 35, 36, 37, 38, 39]);
        this.name = name;
        store.ennemies.push(this);
        store.all.add(this);

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
                        this.move.pause();
                    }
                    if (path && path[1]) {
                        // noinspection BadExpressionStatementJS
                        this.move.resume;
                        game.physics.arcade.moveToXY(this, path[1].x * 32, path[1].y * 16);

                        // Set obstacle on the caracter
                        // if (this.pathx != path[0].x || this.pathy != path[0].y)
                        // store.map.caracterObstacle(this.pathx, this.pathy, 0);
                        // store.map.caracterObstacle(path[0].x, path[0].y, 1);

                        walkAnimation(this, path[0].x, path[1].x, path[0].y, path[1].y);
                        store.all.sort('x', Group.SORT_ASCENDING);
                        store.all.sort('y', Group.SORT_ASCENDING);
                    } else {
                        this.body.velocity.x = 0;
                        this.body.velocity.y = 0;
                    }
                });
            this.path.calculate();
        });

        this.attack = game.time.events.loop(
            Phaser.Timer.SECOND,
            () => store.allies.forEach((ennemy) => {
                if (ennemy.alive && game.physics.arcade.distanceBetween(this, ennemy) < 32) {
                    fightAnimation(this, ennemy);
                    swordSound(store.sword1, store.sword2, store.pare);
                }
            })
        );

        this.events.onKilled.add(() => {
            const skeleton = game.add.sprite(this.x, this.y, 'skeleton');
            skeleton.anchor.setTo(0.5, 0.5);
            skeleton.animations.add('death', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
            skeleton.animations.play('death', 10, false);
            this.x = 0;
            this.y = 800;
        });
    }
}
