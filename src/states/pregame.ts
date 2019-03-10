import {State} from '../interfaces/state';
import {store} from '../config/store';
import {lang} from '../config/lang';
import {socket} from '../utils/socketHandler';
import {emitter} from '../utils/EventEmitter';

/**
 * State to load all game resources.
 */
export class PregameState extends State {

    create() {
        // this.add.audio('start').play();

        this.add.image(0, 0, 'paper');

        const waitText = this.add.text(this.game.world.centerX, this.game.world.centerY, lang[store.selectedLang].WAITING_MENU, {
            fill: '#000000',
            font: 'bold 16px Press Start 2P'
        });

        waitText.anchor.setTo(0.5);

        emitter.subscribe('event:player_on', () => {
            this.game.state.start('Game', true, false);
        });

        if (!store.createJoin) {
            socket.emit('avalable_player');
        }
    }
}
