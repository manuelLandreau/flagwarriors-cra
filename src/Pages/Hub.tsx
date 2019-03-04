import * as React from 'react';
import {lang} from '../config/lang';
import {store} from '../config/store';
import {Link} from 'react-router-dom';
import Layout from './Layout';

export default function Hub() {

    const [showModal, setShowModal] = React.useState(false);

    function toggleModal() {
        setShowModal(!showModal);
    }

    function join() {
        toggleModal();
    }

    function create() {
        toggleModal();
    }

    return (
        <Layout>
            <section className="txtcenter pas">
                <form className="nes-field">
                    <label htmlFor="name_field">{lang[store.selectedLang].FIND}</label>
                    <input type="text" id="name_field" className="nes-input"/>
                    <div className="fl mtm">
                        <a onClick={join} className="nes-btn is-warning">{lang[store.selectedLang].JOIN}</a>
                        <small className="mlm">{lang[store.selectedLang].OR}</small>
                    </div>
                    <div className="fr mtm">
                        <a onClick={create} className="nes-btn is-primary">{lang[store.selectedLang].CREATE}</a>
                    </div>
                    <div className="clear"/>
                </form>
            </section>

            <section>
                {showModal ?
                    <dialog className="nes-dialog" id="dialog-default">
                        <form method="dialog">
                            <p className="title">...</p>
                            <p>Feature in progress</p>
                            <menu className="dialog-menu">
                                <button className="nes-btn is-primary" onClick={() => toggleModal()}>ok</button>
                            </menu>
                        </form>
                    </dialog> : ''}
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

        </Layout>
    );
}

