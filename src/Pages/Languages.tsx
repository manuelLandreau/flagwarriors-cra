import * as React from 'react';
import {store} from '../config/store';
import {Link, Redirect} from 'react-router-dom';
import {lang} from '../config/lang';

export default function Languages(props) {

    let selectedLang = store.selectedLang;

    function submitLang() {
        store.selectedLang = selectedLang;
        props.history.push('/')
    }

    return (
        <div>
            <section className="txtcenter mtl">
                <label onClick={() => selectedLang = 'en'}>
                    <input type="radio" className="nes-radio" name="language" defaultChecked={selectedLang === 'en'}
                    />
                    <span>English</span>
                </label>
                <br/>
                <label onClick={() => selectedLang = 'fr'}>
                    <input type="radio" className="nes-radio" name="language" defaultChecked={selectedLang === 'fr'}
                    />
                    <span>Français</span>
                </label>
                <br/>
                <label onClick={() => selectedLang = 'es'}>
                    <input type="radio" className="nes-radio" name="language" defaultChecked={selectedLang === 'es'}
                    />
                    <span>español</span>
                </label>
            </section>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '1rem'
            }}>
                <div className="fl">
                   <Link to="/" className="nes-btn">{lang[store.selectedLang].RETURN}</Link>
                </div>
                <div className="fr">
                   <a onClick={submitLang} className="nes-btn is-success">{lang[store.selectedLang].VALID}</a>
                </div>
                <div className="clear"/>
            </div>
        </div>
    );
}

