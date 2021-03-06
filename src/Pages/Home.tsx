import * as React from 'react';
import {Link} from 'react-router-dom';
import {store} from '../config/store';
import {lang} from '../config/lang';
import Layout from './Layout';
import removeOldCanvas from '../utils/removeOldCanvas';

export default function Home({history}) {

    // Hacky
    removeOldCanvas();

    function go() {
        store.createJoin = false;
        history.push('/game');
    }

    return (
        <Layout>
            <section className="txtcenter">
                <a onClick={go} className="nes-btn is-warning">
                    {lang[store.selectedLang].PLAY_RANDOM}
                </a>
                <div className="mtm mbm">
                    <small>{lang[store.selectedLang].OR}</small>
                </div>
                <Link to="/hub">
                    {lang[store.selectedLang].CREATE_JOIN}
                </Link>
            </section>
            <footer className="icon-list p-absolute" style={{bottom: 20, width: '100%'}}>
                <a href="https://github.com/manuellandreau/flagwarriors-cra" className="txtcenter" target="blank">
                    <i className="nes-icon github is-large"/>
                </a>
                <div className="clear"/>
            </footer>
        </Layout>
    );
}

