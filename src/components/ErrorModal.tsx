import * as React from 'react';

export default function ErrorModal({isOpen, toggle, title, text}) {
    return (
        <section className={isOpen ? 'p-absolute' : 'is-hidden'}
                 style={{top: 0,  width: 'calc(0.6 * 93vh)', left: 'calc(50% - (0.6 * 93vh / 2)'}}>
            <dialog className="nes-dialog" id="dialog-default">
                <div className="mbm">
                    <h2 className="title">{title}</h2>
                    <p>{text}</p>
                </div>
                <menu className="dialog-menu">
                    <button className="nes-btn is-primary fr" onClick={() => toggle()}>Ok</button>
                </menu>
            </dialog>
        </section>
    )
}
