import Game from '../Game';

/**
 * Abstract warrior class.
 */
export abstract class Warrior extends Phaser.Sprite {

    protected constructor(game: Game,
                          x: number,
                          y: number,
                          key: string,
                          frame: number) {
        super(game, x, y, key, frame);

        this.physics();
        this.game.world.add(this);
    }

    /**
     * Setup object physics.
     */
    private physics() {
        this.anchor.set(0.5);
        this.game.physics.arcade.enable(this);
    }
}
