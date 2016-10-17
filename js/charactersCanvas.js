"use strict";

var charactersCanvas = {
    context: document.getElementById('characters-canvas').getContext("2d"),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    init: function initCanvas() {
        /* Initialize the canvas, set the width and height */
        var canvas = this;

        canvas.width = (map.columns * map.blockSize) - map.blockSize;
        canvas.height = map.rows * map.blockSize;

        canvas.context.canvas.width  = canvas.width;
        canvas.context.canvas.height = canvas.height;

        controls.position.x = Math.floor(controls.position.column * map.blockSize);
        controls.position.y = Math.floor(controls.position.row * map.blockSize);

        if (charactersCanvas.moveTimer == null) {
            charactersCanvas.moveListener();
        }
    },
    moveTimer: null,
    moveListener: function moveListener () {
        var originalPositionX = controls.position.x,
            originalPositionY = controls.position.y,
            speed = 3;

        if (!controls.rightKeyActive && !controls.leftKeyActive && !controls.upKeyActive && !controls.downKeyActive) {
            requestAnimationFrame(charactersCanvas.moveListener);
            return;
        }

        if (controls.rightKeyActive) {
            controls.position.x += speed;
            images.characterSprite.row = 2;
            controls.position.lastDirection = 'right';
        }
        if (controls.downKeyActive) {
            controls.position.y += speed;
            images.characterSprite.row = 0;
        }
        if (controls.leftKeyActive) {
            controls.position.x -= speed;
            images.characterSprite.row = 1;
            controls.position.lastDirection = 'left';
        }
        if (controls.upKeyActive) {
            controls.position.y -= speed;
            images.characterSprite.row = 3;
        }

        images.characterSprite.pixelMovementIndex++;

        if (images.characterSprite.pixelMovementIndex >= images.characterSprite.pixelMovementBeforeChange) {
            // Change character sprite
            images.characterSprite.column = (images.characterSprite.column < images.characterSprite.totalColumns) ? images.characterSprite.column + 1 : 0;
            images.characterSprite.pixelMovementIndex = 0;
        }

        var directionBlock = mapCanvas.getBlockFromPixel(controls.position.x, controls.position.y);

        if (directionBlock.type == "right") {
            map.changeMap("right");
        }
        else if (directionBlock.type == "left") {
            map.changeMap("left");
        }
        else if (directionBlock.type == "wall" || directionBlock.type == "bush" || directionBlock.type == "box") {
            // Avoid walls and stuff
            controls.position.x = originalPositionX;
            controls.position.y = originalPositionY;
        }

        charactersCanvas.paintCharacter();

        charactersCanvas.moveTimer = requestAnimationFrame(charactersCanvas.moveListener);
    },
    paintCharacter: function paintCharacter () {
        // Clear character canvas
        var characterPosX = Math.floor(images.characterSprite.column * images.characterSprite.spriteWidth),
            characterPosY = Math.floor(images.characterSprite.row * images.characterSprite.spriteHeight);

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
    }
};