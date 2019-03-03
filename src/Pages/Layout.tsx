import {Link} from 'react-router-dom';
import * as React from 'react';
import {store} from '../config/store';
import {lang} from '../config/lang';
import logo from '../logo.png';

export default function ({children}) {
    const [sound, setSound] = React.useState(store.sound);

    function toggleSound() {
        store.sound = !store.sound;
        setSound(store.sound);
    }

    return (
        <div>
            <header>
                <Link to="/languages" className="fl mas">
                    {lang[store.selectedLang].LANGUAGE}
                </Link>
                <a className="fr mas" style={{color: sound ? 'black' : 'lightgrey'}} onClick={toggleSound}>
                    🔊
                </a>
                <div className="clear"/>
            </header>

            <div className="mts txtcenter">
                <img src={logo} alt=""/>
                <h1>FlagWarriors</h1>
            </div>

            <div className="pts">{children}</div>

            <footer className="icon-list mtl pas">
                <div className="fr">
                    <i className="nes-icon github is-large"/>
                    <i className="nes-icon twitter is-large"/>
                </div>
                <div className="clear"/>
            </footer>
        </div>
    )
}
