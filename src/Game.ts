import 'pixi';
import 'p2';
import * as Phaser from 'phaser'
// import 'phaser-state-transition';
import './register-sw';
import {BootState} from './states/boot';
import {PreloadState} from './states/preload';
import {GameState} from './states/game';
import {store} from './config/store';
import {PregameState} from './states/pregame';

/**
 * Main game object.
 */
export default class Game extends Phaser.Game {

    constructor(config: Phaser.IGameConfig) {
        super(config);

        this.initStates();

        this.state.start('Boot');
    }

    /**
     * Creates all game states.
     */
    private initStates() {

        if (window.localStorage.getItem('lang') != null) {
            if (window.localStorage.getItem('lang') === 'fr') {
                store.selectedLang = 'fr';
            } else if (window.localStorage.getItem('lang') === 'es') {
                store.selectedLang = 'es';
            } else {
                store.selectedLang = 'en';
            }
        }

        if (window.localStorage.getItem('sound') !== null) {
            store.sound = window.localStorage.getItem('sound') === 'on';
        }

        this.state.add('Boot', BootState);
        this.state.add('Preload', PreloadState);
        this.state.add('Pregame', PregameState);
        this.state.add('Game', GameState);
    }
}
