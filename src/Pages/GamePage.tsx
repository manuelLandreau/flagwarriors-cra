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
        parent: 'root',
        antialias: false, // Used to keep pixelated graphics.
        resolution: 1,
        forceSetTimeOut: false
    };

    game = new Game(config);

    return (
        <div>
            <div id="root"/>
            <Chat/>
        </div>
    )
}
