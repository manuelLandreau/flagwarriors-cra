import Chat from '../components/Chat';
import * as React from 'react';
import {store} from '../config/store';
import {readyAction} from '../utils/socket-handler';
import {emitter} from '../utils/EventEmitter';
import HelpModal from '../components/HelpModal';

export default function BottomBar() {
    const [lifePoints, setLifePoints] = React.useState([1, 2, 3, 4, 5]);
    const [gameOn, setGameOn] = React.useState(store.gameOn);
    const [playerOn, setPlayerOn] = React.useState(false);
    const [isReadyDisabled, setIsReadyDisabled] = React.useState(false);
    const [isButtonsHidden, setIsButtonsHidden] = React.useState(false);
    const [isUndoDisabled, setIsUndoDisabled] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(true);

    emitter.subscribe('event:player_on', () => {
        setPlayerOn(true)
    });

    emitter.subscribe('event:dead_warrior', () => {
        setLifePoints(lifePoints.slice(1))
    });

    emitter.subscribe('event:ready', () => {
        setIsReadyDisabled(true)
    });

    emitter.subscribe('event:ready', () => {
        setIsReadyDisabled(true)
    });

    emitter.subscribe('event:is_undo_disabled', val => {
        setIsUndoDisabled(val)
    });

    function toggleHelpModal() {
        setIsOpen(!isOpen)
    }

    function onReady() {
        readyAction();
        setIsButtonsHidden(true);
        setGameOn(true);
    }

    function onUndo() {
        emitter.emit('event:undo')
    }

    if (playerOn) {
        return (
            <div style={{position: 'relative', width: 'calc(0.6 * 93vh)', maxWidth: '100vw', height: '7vh', margin: '0 auto'}}>
                <Chat/>
                {gameOn ?
                    <div className="fr mts">
                        {lifePoints.map((i) => <i className="nes-icon heart" key={i}/>)}
                    </div>
                    : <button className={`nes-btn ${isReadyDisabled ? 'is-success' : 'is-disabled'} fr`}
                              disabled={!isReadyDisabled} onClick={onReady} hidden={isButtonsHidden}>Ready</button>
                }
                <button className={`nes-btn ${isUndoDisabled ? 'is-disabled' : ''} fr`}
                        onClick={onUndo} disabled={isUndoDisabled} hidden={isButtonsHidden}>
                    <span style={{fontSize: 42, lineHeight: 0.15}}>&#8630;</span>
                </button>
                <button className={`nes-btn is-primary fr`} onClick={toggleHelpModal} hidden={isButtonsHidden}>?</button>
                <HelpModal isOpen={isOpen} toggle={toggleHelpModal}/>
            </div>
        )
    } else {
        return <div/>
    }
}
