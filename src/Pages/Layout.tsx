import {Link} from 'react-router-dom';
import * as React from 'react';
import {store} from '../config/store';
import {lang} from '../config/lang';
import fw from '../assets/img/fw.png';

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

            <div className="mtl mbm pas txtcenter">
                <img src={fw} alt=""/>
            </div>

            <div className="pts txtcenter">{children}</div>
        </div>
    )
}
