import {State} from '../interfaces/state';
import {store} from '../config/store';
import {lang} from '../config/lang';
import {socket} from '../utils/socket-handler';

/**
 * State to load all game resources.
 */
export class PregameState extends State {


    create() {

        // this.add.audio('start').play();

        this.add.image(0, 0, 'paper');

        const waitText = this.add.text(this.game.world.centerX, this.game.world.centerY, lang[store.selectedLang].WAITING_MENU, {
            fill: '#000000',
            font: 'bold 32px Almendra'
        });

        waitText.anchor.setTo(0.5);

        socket.on('game_id', data => {
            console.log(data.gameId);
            store.gameId = data.gameId
        });

        socket.on('game_on', () => {
            console.log('gameon');
            socket.emit('game_on_last', {gameId: store.gameId});
            this.game.state.start('Game', true, false)
        });

        socket.on('game_on_last', () => {
            this.game.state.start('Game', true, false)
        });

        socket.emit('avalable_player');
    }
};