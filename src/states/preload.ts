import WebFont from 'webfont';
import {State} from '../interfaces/state';
import warrior from '../assets/sprites/warriors.png';
import blueWarrior from '../assets/sprites/blueWarriors.png';
import flags from '../assets/sprites/flags.png';
import skeleton from '../assets/sprites/skeleton.png';
import kaboom from '../assets/sprites/explode.png';
import walle from '../assets/sprites/wall2.png';
import tile from '../assets/sprites/empty.png';
import tower from '../assets/sprites/tower.png';
import arrow from '../assets/sprites/arrow.png';
import background from '../assets/sprites/bg.png';
import paper from '../assets/sprites/paper.png';
import start from '../assets/sprites/start.png';
import undo from '../assets/sprites/undo.png';
import grid from '../assets/sprites/grid.png';

/**
 * State to load all game resources.
 */
export class PreloadState extends State {

    loadText;
    ready = false;
    fontsReady = false;

    create() {
        this.loadText = this.add.text(
            this.game.world.centerX / 3,
            this.game.world.centerY, 'Chargement...',
            {fill: '#ffffff', font: 'Press Start 2P', fontSize: 22}
        );
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        this.loadResources();
    }

    update() {
        if (this.ready && this.fontsReady) {
            this.game.state.start('Pregame');
        }
    }

    fileComplete(progress) {
        this.loadText.setText('Chargement ' + progress + '%');
    }

    loadComplete() {
        this.ready = true;
    }

    loadResources() {
        this.load.spritesheet('warrior', warrior, 32, 32, 40);
        this.load.spritesheet('blueWarrior', blueWarrior, 32, 32, 40);
        this.load.spritesheet('flags', flags, 16, 16);
        this.load.spritesheet('skeleton', skeleton, 32, 32);
        this.load.spritesheet('kaboom', kaboom, 128, 128);
        this.load.image('walle', walle);
        this.load.image('tile', tile);
        this.load.image('tower', tower);
        this.load.image('arrow', arrow);
        this.load.image('background', background);
        this.load.image('paper', paper);
        this.load.image('start', start);
        this.load.image('undo', undo);
        this.load.image('grid', grid);
        // this.load.audio('ambiance', './assets/ambiance.mp3');
        // this.load.audio('start', './assets/start.mp3');
        // this.load.audio('canon', './assets/canon.mp3');
        // this.load.audio('explosion', './assets/explosion.mp3');
        // this.load.audio('sword1', './assets/sword1.mp3');
        // this.load.audio('sword2', './assets/sword2.mp3');.bind(this
        // this.load.audio('pare', './assets/pare.mp3');

        const WebFontConfig = {
            active: () => this.fontsReady = true, // The bind(this) ensures that the method will be used with your Phaser Game as context
            google: {
                families: ['Press Start 2P']
            }
        };
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', WebFontConfig.active, this);

        this.load.start();
    }
}
