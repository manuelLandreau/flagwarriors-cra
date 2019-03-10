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
import undo from '../assets/sprites/undo.png';
import grid from '../assets/sprites/grid.png';

// import ambiance from '../assets/sound/ambiance.mp3';
// import start from '../assets/sound/start.mp3';
// import canon from '../assets/sound/canon.mp3';
// import explosion from '../assets/sound/explosion.mp3';
// import sword1 from '../assets/sound/sword1.mp3';
// import sword2 from '../assets/sound/sword2.mp3';
// import pare from '../assets/sound/pare.mp3';

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
        this.load.image('undo', undo);
        this.load.image('grid', grid);
        this.load.audio('ambiance', './sounds/ambiance.mp3');
        this.load.audio('start', './sounds/start.mp3');
        this.load.audio('canon', './sounds/canon.mp3');
        this.load.audio('explosion', './sounds/explosion.mp3');
        this.load.audio('sword1', './sounds/sword1.mp3');
        this.load.audio('sword2', './sounds/sword2.mp3');
        this.load.audio('pare', './sounds/pare.mp3');

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
