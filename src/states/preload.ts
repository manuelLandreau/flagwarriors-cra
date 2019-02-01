import {State} from '../interfaces/state';

/**
 * State to load all game resources.
 */
export class PreloadState extends State {
    loadText;

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Transistion plugin
        // this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        // this.game.stateTransition.configure({
        //     duration: Phaser.Timer.SECOND * 0.8,
        //     ease: Phaser.Easing.Exponential.InOut,
        //     properties: {
        //         alpha: 0,
        //         scale: {
        //             x: 1.4,
        //             y: 1.4
        //         }
        //     }
        // });

        this.loadText = this.add.text(this.game.world.centerX / 2, this.game.world.centerY, 'Chargement...', {fill: '#ffffff'});
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        this.startLoad();
    }

    startLoad() {

        this.load.spritesheet('warrior', '../../assets/warrior.png', 32, 32, 40);
        this.load.spritesheet('blueWarrior', '../../assets/blueWarriors.png', 32, 32, 40);
        this.load.spritesheet('flags', '../../assets/flags.png', 16, 16);
        this.load.spritesheet('skeleton', '../../assets/skeleton.png', 32, 32);
        this.load.spritesheet('kaboom', '../../assets/explode.png', 128, 128);
        this.load.spritesheet('sound', '../../assets/sound.png', 32, 32);
        this.load.image('walle', '../../assets/wall2.png');
        this.load.image('tile', '../../assets/empty.png');
        this.load.image('tower', '../../assets/tower.png');
        this.load.image('arrow', '../../assets/arrow.png');
        this.load.image('background', '../../assets/bg.png');
        this.load.image('paper', '../../assets/paper.png');
        this.load.image('start', '../../assets/start.png');
        this.load.image('ready', '../../assets/contour.png');
        this.load.image('undo', '../../assets/undo.png');
        this.load.image('grid', '../../assets/grid.png');
        this.load.image('logout', '../../assets/logout.png');
        // this.load.audio('ambiance', '../../assets/ambiance.mp3');
        // this.load.audio('start', '../../assets/start.mp3');
        // this.load.audio('canon', '../../assets/canon.mp3');
        // this.load.audio('explosion', '../../assets/explosion.mp3');
        // this.load.audio('sword1', '../../assets/sword1.mp3');
        // this.load.audio('sword2', '../../assets/sword2.mp3');
        // this.load.audio('pare', '../../assets/pare.mp3');


        this.load.start();
    }

    fileComplete(progress) {
        this.loadText.setText('Chargement ' + progress + '%');
    }

    loadComplete() {
        this.game.state.start('Pregame');
    }
}
