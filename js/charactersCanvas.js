'use strict';

var charactersCanvas = {
    context: document.getElementById('characters-canvas').getContext('2d'),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    init: function initCanvas() {
        /* Initialize the canvas, set the width and height */
        var canvas = this;

        canvas.width = map.columns * map.blockSize - map.blockSize;
        canvas.height = map.rows * map.blockSize;

        canvas.context.canvas.width = canvas.width;
        canvas.context.canvas.height = canvas.height;

        var newPosition = charactersCanvas.getNewPosition();
        controls.position.x = newPosition.x;
        controls.position.y = newPosition.y;

        if (charactersCanvas.moveTimer === null) {
            charactersCanvas.moveListener();
        }
    },
    moveTimer: null,
    moveListener: function moveListener() {
        var originalPositionX = controls.position.x,
            originalPositionY = controls.position.y,
            speed = mapCanvas.width / 600;

        if (!controls.rightActive && !controls.leftActive && !controls.upActive && !controls.downActive) {
            requestAnimationFrame(charactersCanvas.moveListener);
            return;
        }

        if (controls.rightActive) {
            controls.position.x += speed;
            images.characterSprite.row = 2;
            controls.position.lastDirection = 'right';
        }
        if (controls.downActive) {
            controls.position.y += speed;
            images.characterSprite.row = 0;
            controls.position.lastDirection = 'down';
        }
        if (controls.leftActive) {
            controls.position.x -= speed;
            images.characterSprite.row = 1;
            controls.position.lastDirection = 'left';
        }
        if (controls.upActive) {
            controls.position.y -= speed;
            images.characterSprite.row = 3;
            controls.position.lastDirection = 'up';
        }

        images.characterSprite.pixelMovementIndex++;

        if (images.characterSprite.pixelMovementIndex >= images.characterSprite.pixelMovementBeforeChange) {
            // Change character sprite
            images.characterSprite.column = images.characterSprite.column < images.characterSprite.totalColumns ? images.characterSprite.column + 1 : 0;
            images.characterSprite.pixelMovementIndex = 0;
        }

        var directionBlock = mapCanvas.getBlockFromPixel(controls.position.x, controls.position.y);

        if (directionBlock.type == 'right') {
            if (!map.changeMap('right')) {
                controls.position.x = originalPositionX;
                controls.position.y = originalPositionY;
            }
        } else if (directionBlock.type == 'left') {
            if (!map.changeMap('left')) {
                controls.position.x = originalPositionX;
                controls.position.y = originalPositionY;
            }
        } else if (directionBlock.type == 'up') {
            if (!map.changeMap('up')) {
                controls.position.x = originalPositionX;
                controls.position.y = originalPositionY;
            }
        } else if (directionBlock.type == 'down') {
            if (!map.changeMap('down')) {
                controls.position.x = originalPositionX;
                controls.position.y = originalPositionY;
            }
        } else if (directionBlock.type == 'wall' || directionBlock.type == 'bush' || directionBlock.type == 'box' || directionBlock.type == 'water') {
            // Avoid walls and stuff
            controls.position.x = originalPositionX;
            controls.position.y = originalPositionY;
        }

        charactersCanvas.paintCharacter();

        charactersCanvas.moveTimer = requestAnimationFrame(charactersCanvas.moveListener);
    },
    paintCharacter: function paintCharacter() {
        var characterPosX = Math.floor(images.characterSprite.column * images.characterSprite.spriteWidth),
            characterPosY = Math.floor(images.characterSprite.row * images.characterSprite.spriteHeight);

        // Clear character canvas
        charactersCanvas.context.clearRect(0, 0, charactersCanvas.width, charactersCanvas.height);

        // Paint character
        charactersCanvas.context.drawImage(
            images.handlers.characterSprite,
            characterPosX,
            characterPosY,
            images.characterSprite.spriteWidth,
            images.characterSprite.spriteHeight,
            controls.position.x - Math.floor(map.blockSize / 2), // Position fix
            controls.position.y - Math.floor(map.blockSize / 1.5), // Position fix
            map.blockSize,
            map.blockSize
        );
    },
    getNewPosition: function getNewPosition() {
        var x = 0,
            y = 0;

        switch (controls.position.lastDirection) {
            case 'right':
                x = Math.floor(map.directionBlocks.left.column * map.blockSize) + map.blockSize;
                y = Math.floor(map.directionBlocks.left.row * map.blockSize);

                return { x: x, y: y };
            case 'left':
                x = Math.floor(map.directionBlocks.right.column * map.blockSize) - map.blockSize;
                y = Math.floor(map.directionBlocks.right.row * map.blockSize);

                return { x: x, y: y };
            case 'up':
                x = Math.floor(map.directionBlocks.down.column * map.blockSize);
                y = Math.floor(map.directionBlocks.down.row * map.blockSize) - map.blockSize;

                return { x: x, y: y };
            case 'down':
                x = Math.floor(map.directionBlocks.up.column * map.blockSize);
                y = Math.floor(map.directionBlocks.up.row * map.blockSize) + map.blockSize;

                return { x: x, y: y };
        }
    }
};
