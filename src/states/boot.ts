import {State} from '../interfaces/state';
import logo from '../assets/img/fw.png';

/**
 * Boot state to set basic game options.
 */
export class BootState extends State {
    preload() {
        this.game.load.image('logo', logo);
    }

    create() {
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.state.start('Preload');
    }
}
