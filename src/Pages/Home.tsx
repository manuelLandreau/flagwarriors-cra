import * as React from 'react';
import {Link} from 'react-router-dom';
import {store} from '../config/store';
import {lang} from '../config/lang';

export default function Home() {

    return (
        <div>
            <section className="txtcenter">
                <Link to="/game" className="nes-btn is-warning">
                    {lang[store.selectedLang].PLAY_RANDOM}
                </Link>
                <div className="mtm mbm">
                    <small>{lang[store.selectedLang].OR}</small>
                </div>
                <Link to="/hub">
                    {lang[store.selectedLang].CREATE_JOIN}
                </Link>
            </section>
        </div>
    );
}

