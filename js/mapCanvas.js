"use strict";

var mapCanvas = {
    context: document.getElementById('map-canvas').getContext("2d"),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    init: function initCanvas() {
        /* Initialize the canvas, set the width and height */
        mapCanvas.width = Math.floor(window.innerWidth * 0.95);
        mapCanvas.height = Math.floor(window.innerHeight * 0.8);

        map.blockSize = Math.floor(mapCanvas.width / map.columns);

        mapCanvas.width = (map.columns - 1) * map.blockSize;
        mapCanvas.height = map.rows * map.blockSize;

        document.getElementById('canvas-container').style.width = mapCanvas.width + "px";
        document.getElementById('canvas-container').style.height = mapCanvas.height + "px";

        if (mapCanvas.context.canvas.width !== mapCanvas.width) {
            mapCanvas.context.canvas.width  = mapCanvas.width;
        }
        if (mapCanvas.context.canvas.height !== mapCanvas.height) {
            mapCanvas.context.canvas.height = mapCanvas.height;
        }
    },
    paint: function paint(firstPaint) {
        var context = mapCanvas.context;

        if (map.lastDirection !== null) {
            // Repaint outside of canvas
            var canvas = document.createElement('canvas'),
                leftPosition = 0,
                topPosition = 0;

            if (map.lastDirection == "left") leftPosition = (0 - mapCanvas.width) + "px";
            else if (map.lastDirection == "right") leftPosition = mapCanvas.width + "px";
            else if (map.lastDirection == "up") topPosition = (0 - mapCanvas.height) + "px";
            else if (map.lastDirection == "down") topPosition = mapCanvas.height + "px";

            canvas.width = mapCanvas.width;
            canvas.height = mapCanvas.height;
            canvas.style.left = leftPosition;
            canvas.style.top = topPosition;
            canvas.classList.add("canvas");

            setTimeout(function () {
                // Slide the new canvas in with CSS transition
                canvas.style.left = "0";
                canvas.style.top = "0";
                canvas.id = "map-canvas";
            }, 100);

            canvas.addEventListener('transitionend', mapCanvas.removeOldCanvas);

            document.getElementById('canvas-container').appendChild(canvas);

            context = canvas.getContext("2d");
        }

        // Ground
        var groundPattern = context.createPattern(images.handlers.ground, 'repeat');
        context.rect(0, 0, mapCanvas.width, mapCanvas.height);
        context.fillStyle = groundPattern;
        context.fill();

        var wallPattern = context.createPattern(images.handlers.wall, 'repeat');

        for (var i = 0; i < map.blocks.length; i++) {
            var block = map.blocks[i],
                posX = Math.floor(block.column() * map.blockSize),
                posY = Math.floor(block.row() * map.blockSize);

            if (block.type == "wall") {
                context.fillStyle = wallPattern;
                context.fillRect(posX, posY, map.blockSize, map.blockSize);
            }
            else if (block.type == "bush") {
                context.drawImage(images.handlers.bush, posX, posY, map.blockSize, map.blockSize);
            }
            else if (block.type == "water") {
                context.drawImage(images.handlers.water, posX, posY, map.blockSize, map.blockSize);
            }
            else if (block.type == "box") {
                context.drawImage(images.handlers.box, posX, posY, map.blockSize, map.blockSize);
            }
        }
    },
    removeOldCanvas: function removeOldCanvas (e) {
        var property = e.propertyName;

        if (property == "left" || property == "top") {
            // Remove old canvas after slidein, replace with new one
            var oldCanvas = document.getElementById('map-canvas');
            document.getElementById('canvas-container').removeChild(oldCanvas);
        }
    },
    getBlockFromPixel: function getBlockFromPixel (x, y) {
        var column = Math.floor(x / map.blockSize),
            row = Math.floor(y / map.blockSize),
            index = (row * map.columns) + column;

        var block = map.blocks[index];

        return block;
    }
};