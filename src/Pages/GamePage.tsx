import Game from '../Game';
import Chat from '../components/Chat';
import * as React from 'react';
import {store} from '../config/store';
import {readyAction} from '../utils/socket-handler';
import {emitter} from '../utils/EventEmitter';

export let game;

export default function GamePage() {
    /**
     * Initialize game on page load.
     */
    const config: Phaser.IGameConfig = {
        width: 480,
        height: 800,
        renderer: Phaser.AUTO,
        parent: 'game',
        antialias: false, // Used to keep pixelated graphics.
        resolution: 1,
        forceSetTimeOut: false
    };

    game = new Game(config);

    return (
        <div>
            <div id="game"/>
            <Bottom/>
        </div>
    )
}

function Bottom() {
    const [lifePoints, setLifePoints] = React.useState(Array(5));
    const [gameOn, setGameOn] = React.useState(store.gameOn);
    const [playerOn, setPlayerOn] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const [isReadyHidden, setIsReadyHidden] = React.useState(false);

    emitter.subscribe('event:player_on', () => {
        setPlayerOn(true)
    });

    emitter.subscribe('event:game_on', () => {
        setGameOn(true)
    });

    emitter.subscribe('event:dead_warrior', () => {
        setLifePoints(lifePoints.slice(1))
    });

    emitter.subscribe('event:ready', () => {
        setIsReady(true)
    });

    emitter.subscribe('event:ready', () => {
        setIsReady(true)
    });

    function onReady() {
        readyAction();
        setIsReadyHidden(true);
    }

    if (playerOn) {
        return (
            <div style={{position: 'relative', width: 'calc(0.6 * 93vh)', maxWidth: '100vw', height: '7vh', margin: '0 auto'}}>
                <Chat/>
                {gameOn ?
                    <div className="fr mts">
                        {lifePoints.map((_, i) => <i className="nes-icon heart" key={i}/>)}
                    </div>
                    : <button className={isReady ? 'nes-btn is-success fr' : 'nes-btn is-disabled fr'}
                              onClick={onReady} hidden={isReadyHidden}>Ready</button>
                }
            </div>
        )
    } else {
        return <div/>
    }
}
