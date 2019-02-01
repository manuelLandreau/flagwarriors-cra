export function walkAnimation(caracter, path0x, path1x, path0y, path1y) {
    if (path0x / 32 * 32 > path1x / 32 * 32 && path0y / 16 * 16 > path1y / 16 * 16) {
        caracter.animations.play('west', 10, false);
    } else if (path0x / 32 * 32 > path1x / 32 * 32 && path0y / 16 * 16 < path1y / 16 * 16) {
        caracter.animations.play('north', 10, false);
    } else if (path0x / 32 * 32 < path1x / 32 * 32 && path0y / 16 * 16 < path1y / 16 * 16) {
        caracter.animations.play('north', 10, false);
    } else if (path0x / 32 * 32 < path1x / 32 * 32 && path0y / 16 * 16 > path1y / 16 * 16) {
        caracter.animations.play('east', 10, false);
    } else if (path0x / 32 * 32 === path1x / 32 * 32 && path0y / 16 * 16 > path1y / 16 * 16) {
        caracter.animations.play('north', 10, false);
    } else if (path0x / 32 * 32 === path1x / 32 * 32 && path0y / 16 * 16 < path1y / 16 * 16) {
        caracter.animations.play('south', 10, false);
    } else if (path0x / 32 * 32 > path1x / 32 * 32 && path0y / 16 * 16 === path1y / 16 * 16) {
        caracter.animations.play('east', 10, false);
    } else if (path0x / 32 * 32 < path1x / 32 * 32 && path0y / 16 * 16 === path1y / 16 * 16) {
        caracter.animations.play('west', 10, false);
    }
}

export function fightAnimation(caracter, ennemy) {
    if (caracter.x > ennemy.x && caracter.y > ennemy.y) {
        caracter.animations.play('eattack', 10, false);
    } else if (caracter.x > ennemy.x && caracter.y < ennemy.y) {
        caracter.animations.play('sattack', 10, false);
    } else if (caracter.x < ennemy.x && caracter.y < ennemy.y) {
        caracter.animations.play('sattack', 10, false);
    } else if (caracter.x < ennemy.x && caracter.y > ennemy.y) {
        caracter.animations.play('wattack', 10, false);
    } else if (caracter.x === ennemy.x && caracter.y > ennemy.y) {
        caracter.animations.play('sattack', 10, false);
    } else if (caracter.x === ennemy.x && caracter.y < ennemy.y) {
        caracter.animations.play('nattack', 10, false);
    } else if (caracter.x > ennemy.x && caracter.y === ennemy.y) {
        caracter.animations.play('wattack', 10, false);
    } else if (caracter.x < ennemy.x && caracter.y === ennemy.y) {
        caracter.animations.play('eattack', 10, false);
    }
}

export function swordSound(sword1, sword2, pare) {
    const rd = Math.random();
    switch (Math.round(rd * 10)) {
        case 1:
        case 2:
        case 3:
            sword1.play();
            break;
        case 4:
        case 5:
        case 6:
            sword2.play();
            break;
        case 7:
        case 8:
        case 9:
            pare.play();
            break;
    }
}