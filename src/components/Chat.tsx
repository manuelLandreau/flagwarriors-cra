import * as React from 'react';
import {addResponseMessage, Widget} from 'react-chat-widget';
import '../assets/css/chat.css';
import {socket} from '../utils/socketHandler';
import {store} from '../config/store';

export default function Chat() {

    socket.on('ennemy_message', (message: string) => addResponseMessage(message));

    const handleNewUserMessage = (message: string) => socket.emit('ally_message', {gameId: store.gameId, message});

    return (
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                // profileAvatar={logo}
                title="Flag Warriors"
                subtitle="Chat with the ennemy !"
                launcher={handleToggle => (
                    <button className="nes-btn" onClick={handleToggle}>Chat</button>
                )}
            />
    );
}
