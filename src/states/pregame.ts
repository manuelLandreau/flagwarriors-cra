import {State} from '../interfaces/state';
import {store} from '../config/store';
import {socket} from '../utils/socketHandler';
import {emitter} from '../utils/EventEmitter';

/**
 * State to load all game resources.
 */
export class PregameState extends State {

    create() {
        if (store.sound) {
            this.add.audio('start').play();
        }

        this.add.image(0, 0, 'paper');

        emitter.subscribe('event:player_on', () => {
            this.game.state.start('Game', true, false);
        });

        if (!store.createJoin) {
            socket.emit('avalable_player');
        }
    }
}
