import * as React from 'react';
import {lang} from '../config/lang';
import {store} from '../config/store';
import {Link} from 'react-router-dom';
import Layout from './Layout';
import removeOldCanvas from '../utils/removeOldCanvas';
import {socket} from '../utils/socketHandler';
import ErrorModal from '../components/ErrorModal';

export default function Hub({history}) {

    removeOldCanvas();

    const [gameName, setGameName] = React.useState('');
    const [loadingCreate, setLoadingCreate] = React.useState(false);
    const [loadingJoin, setLoadingJoin] = React.useState(false);
    const [joinError, setJoinError] = React.useState(false);
    const [createError, setCreateError] = React.useState(false);

    function handleChange(e) {
        setGameName(e.target.value);
    }

    function join() {
        store.createJoin = true;
        socket.emit('join_game', gameName);
        setLoadingJoin(true);
    }

    function create(e) {
        e.preventDefault();
        setCreateError(true);
        store.createJoin = true;
        socket.emit('created_game', gameName);
        setLoadingCreate(true);
    }

    function closeErrorModal() {
        setJoinError(false);
        setCreateError(false);
    }

    React.useEffect(() => {
        socket.on('game_id', data => {
            console.log('Game ID: ', data.gameId);
            store.gameId = data.gameId;
            setLoadingCreate(false);
            setLoadingJoin(false);
            history.push('/game');
        });
        return () => socket.removeListener('game_id');
    });

    socket.on('game_exists', () => {
        setCreateError(true);
        setLoadingCreate(false);
    });

    socket.on('game_not_exists', () => {
        setJoinError(true);
        setLoadingJoin(false);
    });

    return (
        <Layout>
            <section className="txtcenter pas">
                <form className="nes-field" onSubmit={create}>
                    <label htmlFor="name_field">{lang[store.selectedLang].FIND}</label>
                    <input type="text" id="name_field" className="nes-input" value={gameName} onChange={handleChange}/>
                    <div className="fl mtm">
                        <a onClick={join} className="nes-btn is-warning">{loadingJoin ? '...' : lang[store.selectedLang].JOIN}</a>
                        {/*<small className="mlm">{lang[store.selectedLang].OR}</small>*/}
                    </div>
                    <div className="fr mtm">
                        <input type="submit" className="nes-btn is-primary"
                               value={loadingCreate ? '...' : lang[store.selectedLang].CREATE}/>
                    </div>
                    <div className="clear"/>
                </form>
            </section>

            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '1rem'
            }}>
                <div className="fl">
                    <Link to="/" className="nes-btn">{lang[store.selectedLang].RETURN}</Link>
                </div>
            </div>

            <ErrorModal isOpen={joinError || createError} toggle={closeErrorModal}
                        title={joinError ? `Unable to join the game ${gameName}` : `Unable to create the game ${gameName}`}
                        text={joinError ? `${gameName} does not exist` : `Unable to create the game ${gameName}`}
            />
        </Layout>
    );
}

