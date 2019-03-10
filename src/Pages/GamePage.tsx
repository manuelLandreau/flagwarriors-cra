import Game from '../Game';
import * as React from 'react';
import BottomBar from '../components/BottomBar';

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
            <BottomBar/>
        </div>
    )
}
