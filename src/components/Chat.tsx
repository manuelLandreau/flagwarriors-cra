import * as React from 'react';
import {addResponseMessage, Widget} from 'react-chat-widget';
import '../assets/css/chat.css';
import {socket} from '../utils/socket-handler';

export default function Chat() {

    socket.on('ennemy_message', (message: string) => addResponseMessage(message));

    const handleNewUserMessage = (message: string) => socket.emit('ally_message', {gameId: 1, message});

    return (
        <div className="App">
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                // profileAvatar={logo}
                title="Flag Warriors"
                subtitle="Chat with the ennemy !"
            />
        </div>
    );
}
