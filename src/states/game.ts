import {State} from '../interfaces/state';
import {Map} from '../entities/Map';
import {Ally} from '../entities/Ally';
import {Group} from 'phaser';
import {Tower} from '../entities/Tower';
import {lang} from '../config/lang';
import {store} from '../config/store';
import {readyAction, socket} from '../utils/socketHandler';
import {emitter} from '../utils/EventEmitter';

// i for warriors, j for towers
let i = 1, j = 1;

/**
 * Main game state.
 */
export class GameState extends State {

    warriorButton;
    warriorDrag;
    towerDrag;
    towerButton;

    constructor() {
        super();
        this.warriorButton = null;
        this.warriorDrag = null;
        this.towerButton = null;
        this.towerDrag = null;
    }

    create() {
        this.add.image(0, 0, 'background');

        // Tile map
        store.tileGroup = this.add.group();
        store.map = new Map(this.game, store.tileGroup);
        store.map.spawnTiles();

        // Sword sounds
        store.sword1 = this.game.add.audio('sword1');
        store.sword2 = this.game.add.audio('sword2');
        store.pare = this.game.add.audio('pare');

        // Groups
        store.all = this.add.group();
        store.arrows = this.add.group();
        store.arrows.createMultiple(90, 'arrow');

        store.ourFlag = this.add.sprite(240, 776, 'flags');
        store.ourFlag.scale.setTo(2);
        store.ourFlag.anchor.setTo(0.5, 0.5);
        store.ourFlag.animations.add('float', [4, 5, 6, 7]);
        store.ourFlag.animations.play('float', 5, true);
        store.all.add(store.ourFlag);

        store.theirFlag = this.add.sprite(240, 24, 'flags');
        store.theirFlag.scale.setTo(2);
        store.theirFlag.anchor.setTo(0.5, 0.5);
        store.theirFlag.animations.add('float', [9, 10, 11, 12]);
        store.theirFlag.animations.play('float', 5, true);
        store.all.add(store.theirFlag);

        store.explosions = this.add.group();
        store.explosions.createMultiple(90, 'kaboom');
        store.explosions.forEach(function (kaboom) {
            kaboom.anchor.x = 0.4;
            kaboom.anchor.y = 0.4;
            kaboom.animations.add('kaboom');
        });

        // Buttons
        this.warriorButton = this.add.image(-16, 772, 'warrior');
        this.warriorButton.scale.setTo(2);

        this.towerButton = this.add.image(48, 772, 'tower');

        store.wallButton = this.add.button(96, 772, 'walle', this.wallAction);

        // Drag buttons
        this.warriorDrag = this.add.image(16, 804, 'warrior');
        this.warriorDrag.anchor.setTo(0.5, 0.5);
        this.warriorDrag.scale.setTo(2);
        this.warriorDrag.inputEnabled = true;
        this.warriorDrag.input.enableDrag();
        this.warriorDrag.events.onDragStart.add(GameState.spriteDragStart);
        this.warriorDrag.events.onDragUpdate.add(GameState.onDragSprite);
        this.warriorDrag.events.onDragStop.add(this.addWarrior, this);

        this.towerDrag = this.add.image(72, 812, 'tower');
        this.towerDrag.anchor.setTo(0.5, 0.5);
        this.towerDrag.inputEnabled = true;
        this.towerDrag.input.enableDrag();
        this.towerDrag.events.onDragStart.add(GameState.spriteDragStart);
        this.towerDrag.events.onDragUpdate.add(GameState.onDragSprite);
        this.towerDrag.events.onDragStop.add(this.addTower, this);

        // Undo button handleler
        emitter.subscribe('event:undo', () => {
            this.undo()
        });
    }

    addWarrior(pointer) {
        if (pointer.y > 384) {
            store['caracter' + i] = new Ally(
                this.game,
                ((pointer.x / 32) | 0) * 32 + 16,
                ((pointer.y / 32) | 0) * 32 + 16,
                '' + i);
            store['caracter' + i].selected = true;
            store.all.sort('y', Group.SORT_ASCENDING);
            store.undo.push({type: 'caracter', name: i});
            i++;
            if (i === 6) {
                this.warriorDrag.kill();
                this.warriorButton.kill();
                GameState.readyCheck();
            }
        }

        this.warriorDrag.x = 16;
        this.warriorDrag.y = 804;
        this.warriorDrag.tint = '0xFFFFFF';

        store.tileGroup.forEach(tile => tile.alpha = 0);

        if (store.undo.length === 1) {
            emitter.emit('event:is_undo_disabled', false);
        }
    }

    addTower(pointer) {
        if (pointer.y > 384) {
            store['tower' + j] = new Tower(
                this.game,
                Math.round(pointer.x / 32) * 32,
                Math.round(pointer.y / 32) * 32,
                '' + j, store.ennemies);
            store.allies.push(store['tower' + j]);
            store.all.sort('x', Group.SORT_ASCENDING);
            store.all.sort('y', Group.SORT_ASCENDING);
            store.map.setObstacle(Math.round(pointer.x / 32) * 32, Math.round(pointer.y / 32) * 32);
            store.undo.push({type: 'tower', name: j});
            j++;

            if (j === 3) {
                GameState.readyCheck();
                this.towerDrag.kill();
                this.towerButton.kill();
            }
        }

        this.towerDrag.x = 72;
        this.towerDrag.y = 812;
        this.towerDrag.tint = '0xFFFFFF';

        store.tileGroup.forEach(tile => tile.alpha = 0);

        if (store.undo.length === 1) {
            emitter.emit('event:is_undo_disabled', false);
        }
    }

    wallAction(_, __, val = null) {
        if (val !== null) {
            store.wallSwitch = val;
        } else {
            store.wallSwitch = !store.wallSwitch;
        }

        if (store.wallSwitch) {
            store.tileGroup.forEach(tile => tile.alpha = 0.3);
            store.wallButton.tint = '0x00FF00';
            this.game.input.addMoveCallback(store.map.buildWall, this);
        } else {
            store.tileGroup.forEach(tile => tile.alpha = 0);
            store.wallButton.tint = '0xFFFFFF';
        }
    }

    undo() {
        if (store.undo.length > 0) {
            const obj = store.undo.pop();
            switch (obj.type) {
                case 'tower':
                    store['tower' + obj.name].destroy();
                    delete store['tower' + obj.name];
                    if (!this.towerDrag.alive) {
                        this.towerDrag.revive();
                    }
                    if (!this.towerButton.alive) {
                        this.towerButton.revive();
                    }
                    j--;
                    break;
                case 'walle':
                    store['walle' + obj.name].destroy();
                    delete store['walle' + obj.name];
                    store.wallsArray = store.wallsArray.filter(wall => wall.name !== obj.name);
                    if (!store.wallButton.alive) {
                        store.wallButton.revive();
                    }
                    this.wallAction(null, null, true);
                    store.wallGroup.createMultiple(1, 'walle');
                    store.wallCount--;
                    break;
                case 'caracter':
                    store['caracter' + obj.name].destroy();
                    delete store['caracter' + obj.name];
                    if (!this.warriorDrag.alive) {
                        this.warriorDrag.revive();
                    }
                    if (!this.warriorButton.alive) {
                        this.warriorButton.revive();
                    }
                    i--;
                    break;
            }
        }
        if (store.undo.length < 1) {
            emitter.emit('event:is_undo_disabled', true);
        }
    }

    update() {
        this.physics.arcade.collide(store.arrows, store.all);

        if (store.caracter1) {
            store.caracter1.getFlag();
        }
        if (store.caracter2) {
            store.caracter2.getFlag();
        }
        if (store.caracter3) {
            store.caracter3.getFlag();
        }
        if (store.caracter4) {
            store.caracter4.getFlag();
        }
        if (store.caracter5) {
            store.caracter5.getFlag();
        }

        if (this.physics.arcade.distanceToXY(store.theirFlag, 240, 774) < 16) {
            socket.emit('we_have_a_winner', {gameId: store.gameId});
            const winner = this.add.text(this.game.world.centerX, this.game.world.centerY, lang[store.selectedLang].WIN, {
                fill: '#000000',
                font: 'bold 16px Press Start 2P'
            });
            winner.anchor.setTo(0.5);
            this.game.paused = true;
        }
    }

    static onDragSprite(sprite) {
        if (sprite.y < 384 || sprite.y > 750) {
            sprite.tint = 0xFF7F50;
        } else {
            sprite.tint = 0xFFFFFF;
        }
    }

    // Caracter selection handler
    static spriteDragStart() {
        store.tileGroup.forEach(tile => tile.alpha = 0.3);
        store.allies.forEach(caracter => caracter.selected = false);
    }

    static readyCheck() {
        if (store.wallCount > 13 && i > 5 && j > 2) {
            emitter.emit('event:ready');
        }
    }
}
