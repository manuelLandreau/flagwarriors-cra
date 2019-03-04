import {game} from '../Pages/GamePage';
import * as io from 'socket.io-client';
import {lang} from '../config/lang';
import {Group} from 'phaser';
import {store} from '../config/store';
import {Ennemy} from '../entities/Ennemy';
import {Tower} from '../entities/Tower';

// export const socket = io('https://flagwarriors.herokuapp.com');
export const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : 'https://fl-server.herokuapp.com');

let ennemyData;

export function readyAction(readyButton) {
    store.readySwitch = true;
    store.tileGroup.removeAll();
    readyButton.destroy();
    store.undoButton.destroy();
    socket.emit('ready', {
            warriors: [
                {x: store.caracter1.x, y: store.caracter1.y, name: '1'},
                {x: store.caracter2.x, y: store.caracter2.y, name: '2'},
                {x: store.caracter3.x, y: store.caracter3.y, name: '3'},
                {x: store.caracter4.x, y: store.caracter4.y, name: '4'},
                {x: store.caracter5.x, y: store.caracter5.y, name: '5'}
            ],
            towers: [
                {x: store.tower1.x, y: store.tower1.y, name: '1'},
                {x: store.tower2.x, y: store.tower2.y, name: '2'}
            ],
            walls: store.wallsArray,
            gameId: store.gameId
        }
    );

    if (ennemyData) {
        startGame();
    } else {
        store.waitText1 = game.add.text(game.world.centerX, game.world.centerY - 32, lang[store.selectedLang].WAITING_READY, {
            fill: '#000000',
            font: 'bold 32px Almendra'
        });
        store.waitText1.anchor.setTo(0.5);
    }
}

socket.on('ready', data => {
    ennemyData = data;
    if (store.readySwitch) {
        startGame();
    }
});

function startGame() {
    addEnnemies(ennemyData);

    if (store.waitText1) {
        store.waitText1.destroy();
    }

    store.gameOn = true;
}

export function addEnnemies(data) {
    store.undoButton.destroy();
    store.readyButton.destroy();
    data.warriors.forEach(function (warrior) {
        store['ennemy' + warrior.name] = new Ennemy(game, 480 - warrior.x, 800 - warrior.y, warrior.name);
        store.ennemies.push(store['ennemy' + warrior.name]);
        store.all.add(store['ennemy' + warrior.name]);
    });

    data.towers.forEach(function (tower) {
        store['ennemyTower' + tower.name] = new Tower(game, 480 - tower.x, 800 - tower.y, tower.name, store.allies);
        // ennemies.push(window['ennemyTower' + tower.name]); // Later
        store.all.add(store['ennemyTower' + tower.name]);
        store.map.setObstacle(store['ennemyTower' + tower.name].x, store['ennemyTower' + tower.name].y);
    });

    data.walls.forEach(function (wall) {
        store['wallen' + wall.name] = game.add.sprite(480 - wall.x, 800 - wall.y, 'walle');
        game.physics.arcade.enable(store['wallen' + wall.name]);
        store['wallen' + wall.name].anchor.setTo(0.5, 0.5);
        // ennemies.push(window['wallen' + tower.name]); // Later
        store.all.add(store['wallen' + wall.name]);
        store.all.sort('x', Group.SORT_ASCENDING);
        store.all.sort('y', Group.SORT_ASCENDING);
        store['wallen' + wall.name].body.immovable = true;
        store.map.setObstacle(480 - wall.x, 800 - wall.y);
    });

    socket.on('is_moving', d => {
        store['ennemy' + d.name].newPosX = Math.abs(480 - d.nextx);
        store['ennemy' + d.name].newPosY = Math.abs(800 - d.nexty);
    });

    socket.on('set_obstacle', d => store.map.caracterObstacle(16 - d.y, 54 - d.x, d.value));

    socket.on('attack', d => store['caracter' + d.name].giveDamage(d.damage));

    socket.on('got_flag', d => {
        store.ourFlag.x = store['ennemy' + d.name].x;
        store.ourFlag.y = store['ennemy' + d.name].y - 24;
    });

    socket.on('death', d => store['ennemy' + d.name].kill());

    socket.on('we_have_a_winner', () => {
        const looser = game.add.text(game.world.centerX, game.world.centerY, lang[store.selectedLang].LOOSE, {
            fill: '#000000',
            font: 'bold 32px Almendra'
        });
        looser.anchor.setTo(0.5);
        // if (store.logged) {
        //     const body = {
        //         token: window.localStorage.getItem('jtw'),
        //         victory: false,
        //         defeat: true
        //     };
        // $.ajax({
        //     url: '/update_ratio',
        //     type: 'PUT',
        //     data: body,
        //     success: function (data) {
        //         // store.user_infos = data.infos;
        //     },
        //     error: function (err) {
        //     }
        // });
        // }
        game.paused = true;

    });

    socket.on('we_have_a_looser', () => {
        const winner = game.add.text(game.world.centerX, game.world.centerY, lang[store.selectedLang].WIN, {
            fill: '#000000',
            font: 'bold 32px Almendra'
        });
        winner.anchor.setTo(0.5);
        // if (store.logged) {
        //     const body = {
        //         token: window.localStorage.getItem('jtw'),
        //         victory: false,
        //         defeat: true
        //     };
        // $.ajax({
        //     url: '/update_ratio',
        //     type: 'PUT',
        //     data: body,
        //     success: function (data) {
        //         // user_infos = data.infos;
        //     },
        //     error: function (err) {
        //     }
        // });
        // }
        game.paused = true;
    });
}
