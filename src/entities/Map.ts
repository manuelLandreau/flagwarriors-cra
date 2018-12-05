import {Group} from 'phaser';
import {store} from '../config/store';
import {GameState} from '../states/game';

/**
 * Map
 */
export class Map {

    game;
    group;
    grid = [];

    constructor(game, group) {
        this.game = game;
        this.group = group;

        store.wallGroup = game.add.group();
        store.wallGroup.createMultiple(14, 'walle');
        store.wallGroup.forEach(wall => {
            wall.anchor.setTo(0.33, 0.5);
        });

        for (let i = 0; i < 54; i++) {
            const t = [];
            for (let j = 0; j < 16; j++) {
                t.push(0);
            }
            this.grid.push(t);
        }
    }

    spawnTiles() {
        for (let xt = 0; xt < 16 * 32; xt += 32) {
            for (let yt = 400; yt < 54 * 16; yt += 16) {
                const tile = this.game.add.image(xt, yt, 'grid', 0, this.group);
                tile.anchor.setTo(0.5);
                tile.alpha = 0;
                tile.inputEnabled = true;
                tile.walled = false;
            }
        }
    }

    setObstacle(tileX, tileY) {
        this.grid[tileY / 16][tileX / 32] = 1;
    }

    caracterObstacle(tileY, tileX, nb) {
        this.grid[tileX][tileY] = nb;
    }

    buildWall() {
        store.tileGroup.forEach(tile => tile.events.onInputOver.add((tile) => {
            if (store.wallSwitch && store.wallCount > 13) {
                store.wallButton.kill();
                GameState.readyCheck(this.game);
                store.wallSwitch = false;
                store.tileGroup.forEach(tile => tile.alpha = 0);
            }
            if (store.wallCount < 14 && this.game.input.activePointer.isDown && store.wallSwitch == true) {
                if (tile.walled == false && tile.y > 384 && tile.y < 752) {
                    store['walle' + store.wallCount] = store.wallGroup.getFirstExists(false);
                    store['walle' + store.wallCount].name = store.wallCount;
                    store['walle' + store.wallCount].reset(tile.x, tile.y);
                    store.wallGroup.remove(store['walle' + store.wallCount]);
                    store.all.add(store['walle' + store.wallCount]);
                    store.all.sort('x', Group.SORT_ASCENDING);
                    store.all.sort('y', Group.SORT_ASCENDING);
                    store.undo.push({type: 'walle', name: store.wallCount});
                    // allies.push(store['walle' + store.wallCount]); // Later
                    store.wallCount++;
                    tile.walled = true;
                    store.map.setObstacle(tile.x, tile.y);
                    store.wallsArray.push({x: tile.x, y: tile.y, name: store.wallCount});
                }
            }
        }));
    }
}