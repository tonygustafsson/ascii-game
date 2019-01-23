'use strict';

var swordCanvas = {
    context: document.getElementById('sword-canvas').getContext('2d'),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    init: function initCanvas() {
        /* Initialize the canvas, set the width and height */
        swordCanvas.width = map.columns * map.blockSize - map.blockSize;
        swordCanvas.height = map.rows * map.blockSize;

        swordCanvas.context.canvas.width = swordCanvas.width;
        swordCanvas.context.canvas.height = swordCanvas.height;

        if (swordCanvas.swordTimer === null) {
            swordCanvas.swordListener();
        }
    },
    swordTimer: null,
    swordListener: function swordListener() {
        if (!controls.spaceKeyActive) {
            // Clear sword canvas
            swordCanvas.context.clearRect(0, 0, swordCanvas.width, swordCanvas.height);

            requestAnimationFrame(swordCanvas.swordListener);
            return;
        }

        // Clear sword canvas
        swordCanvas.context.clearRect(0, 0, swordCanvas.width, swordCanvas.height);

        images.swordSprite.pixelMovementIndex++;

        if (images.swordSprite.pixelMovementIndex >= images.swordSprite.pixelMovementBeforeChange) {
            // Change sword sprite
            images.swordSprite.column = images.swordSprite.column < images.swordSprite.totalColumns ? images.swordSprite.column + 1 : 0;
            images.swordSprite.pixelMovementIndex = 0;
        }

        swordCanvas.paintSword();

        swordCanvas.swordTimer = requestAnimationFrame(swordCanvas.swordListener);
    },
    paintSword: function paintSword() {
        var characterOffsetX = 0,
            characterOffsetY = 0;

        if (controls.position.lastDirection == 'left') {
            characterOffsetX = 4;
            characterOffsetY = 4;
            images.swordSprite.row = 1;
        } else if (controls.position.lastDirection == 'right') {
            images.swordSprite.row = 2;
            characterOffsetX = 35;
            characterOffsetY = 6;
        } else if (controls.position.lastDirection == 'up') {
            images.swordSprite.row = 3;
        } else if (controls.position.lastDirection == 'down') {
            images.swordSprite.row = 0;
            characterOffsetX = 4;
            characterOffsetY = 10;
        }

        // Clear sword canvas
        var swordPosX = Math.floor(images.swordSprite.column * images.swordSprite.spriteWidth),
            swordPosY = Math.floor(images.swordSprite.row * images.swordSprite.spriteHeight);

        // Paint sword
        swordCanvas.context.drawImage(
            images.handlers.swordSprite,
            swordPosX,
            swordPosY,
            images.swordSprite.spriteWidth,
            images.swordSprite.spriteHeight,
            controls.position.x - Math.floor(map.blockSize) + characterOffsetX, // Position fix
            controls.position.y - Math.floor(map.blockSize / 1.5) + characterOffsetY, // Position fix
            map.blockSize,
            map.blockSize
        );
    }
};
