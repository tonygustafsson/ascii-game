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

        mapCanvas.context.canvas.width  = mapCanvas.width;
        mapCanvas.context.canvas.height = mapCanvas.height;
    },
    paint: function paint () {
        mapCanvas.context.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

        var groundPattern = mapCanvas.context.createPattern(images.handlers.ground, 'repeat');
        mapCanvas.context.rect(0, 0, mapCanvas.width, mapCanvas.height);
        mapCanvas.context.fillStyle = groundPattern;
        mapCanvas.context.fill();

        mapCanvas.paintBlocks();
    },
    paintBlocks: function paintBlocks() {
        var wallPattern = mapCanvas.context.createPattern(images.handlers.wall, 'repeat');

        for (var i = 0; i < map.blocks.length; i++) {
            var block = map.blocks[i],
                posX = Math.floor(block.column() * map.blockSize),
                posY = Math.floor(block.row() * map.blockSize);

            if (block.type == "wall") {
                mapCanvas.context.fillStyle = wallPattern;
                mapCanvas.context.fillRect(posX, posY, map.blockSize, map.blockSize);
            }
            else if (block.type == "bush") {
                mapCanvas.context.drawImage(images.handlers.bush, posX, posY, map.blockSize, map.blockSize);
            }
            else if (block.type == "box") {
                mapCanvas.context.drawImage(images.handlers.box, posX, posY, map.blockSize, map.blockSize);
            }
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