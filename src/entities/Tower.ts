import Game from '../Game';
import {Warrior} from './Warrior';
import {store} from '../config/store';
import {socket} from '../utils/socket-handler';

/**
 * Tower class.
 */
export class Tower extends Warrior {

    ennemies;
    arrowAttack;

    constructor(game: Game,
                x: number,
                y: number,
                name: string,
                ennemies) {
        super(game, x, y, 'tower', 0);

        // Physics
        game.physics.arcade.enable(this);
        this.body.immovable = true;
        this.name = name;
        this.anchor.setTo(0.33, 0.5);
        this.ennemies = ennemies;
        store.all.add(this);

        this.arrowAttack = game.time.events.loop(
            Phaser.Timer.SECOND * 3,
            () => this.ennemies.forEach((ennemy) => {
                if (ennemy.alive && game.physics.arcade.distanceBetween(this, ennemy) < 150
                    || game.physics.arcade.distanceBetween(this, ennemy) < -150) {
                    const canon = game.add.audio('canon');
                    if (store.sound) {
                        canon.play();
                    }
                    const arrow = store.arrows.getFirstExists(false);
                    arrow.reset(this.x, this.y);
                    game.physics.arcade.enable(arrow);
                    arrow.body.onCollide = new Phaser.Signal();
                    arrow.body.onCollide.add(() => {
                        canon.stop();
                        const explosion = game.add.audio('explosion');
                        if (store.sound) {
                            explosion.play();
                        }
                        const kaboom = store.explosions.getFirstExists(false);
                        kaboom.reset(ennemy.body.x, ennemy.body.y);
                        kaboom.alpha = 0.7;
                        kaboom.play('kaboom', 30, false, true);
                        if (this.ennemies === ennemies) {
                            socket.emit('attack', {
                                name: ennemy.name,
                                damage: game.rnd.integerInRange(8, 15),
                                gameId: store.gameId
                            });
                        }
                        arrow.kill();
                    });
                    arrow.rotation = game.physics.arcade.angleToXY(arrow, ennemy.x, ennemy.y) + 1.6;
                    game.physics.arcade.moveToObject(arrow, ennemy, 300);
                }
            })
        )
    }
}
