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
     * Make object dead.
     */
    // die() {
    //   this.alive = false;
    // }

    /**
     * Resurrect object.
     */
    // respawn(x, y) {
    //   this.body.x = this.x;
    //   this.body.y = this.y;
    //   this.alive = true;
    //   this.visible = true;
    // }

    /**
     * Setup object physics.
     */
    private physics() {
        this.anchor.set(0.5);
        this.game.physics.arcade.enable(this);
    }
}
