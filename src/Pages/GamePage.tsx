import Game from '../Game';
import Chat from '../components/Chat';
import * as React from 'react';

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
            <div style={{position: 'relative', width: 'calc(0.6 * 93vh)', maxWidth: '100vw', height: '7vh', margin: '0 auto'}}>
                <Chat/>
                {/*<button className="nes-btn is-success fr">Ready</button>*/}
                <div className="fr mts">
                    <i className="nes-icon heart"></i>
                    <i className="nes-icon heart"></i>
                    <i className="nes-icon heart"></i>
                    <i className="nes-icon heart"></i>
                    <i className="nes-icon heart"></i>
                </div>
            </div>
        </div>
    )
}
