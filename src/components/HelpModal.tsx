import * as React from 'react';
import help from '../assets/img/help.png';

export default function HelpModal({isOpen, toggle}) {
    return (
        <section className="p-absolute" style={{top: '-105vh'}}>
            {isOpen ?
                <dialog className="nes-dialog" id="dialog-default" style={{width: 'calc(0.6 * 93vh)'}}>
                    <div className="mbm">
                        <h2 className="title">Help</h2>
                        <p>- Place (Drag & drop) the warriors (1) on the map !</p>
                        <p>- Place (Drag & drop) the towers (2) strategically to defend your warriors and your flag (base) !</p>
                        <p>- Push the wall button (3) and "draw" the wall, the enemy musn't get your flag !</p>
                        <p>- Every 5 warriors, 2 towers, and the wall have to be placed.</p>
                        <p>- Then press ready and try to get the enemy flag (by passing by) and bring it to your base !</p>
                    </div>
                    <div style={{marginBottom: -15}}>(1)(2)(3)</div>
                    <img src={help} alt="Warriors Towers Walls"/>
                    <menu className="dialog-menu">
                        <button className="nes-btn is-primary fr" onClick={() => toggle()}>Ok</button>
                    </menu>
                </dialog> : ''}
        </section>
    )
}
