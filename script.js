/* -------- ASCII Game ----------
    Created by Tony Gustafsson
*/

(function asciiGame() {
    "use strict";

    var game = {
        init: function init () {
            game.map.get();
            game.controls.init();
        },
        mapCanvas: {
            context: document.getElementById('map-canvas').getContext("2d"),
            width: Math.floor(window.innerWidth * 0.95),
            height: Math.floor(window.innerHeight * 0.8),
            init: function initCanvas() {
                /* Initialize the canvas, set the width and height */
                var canvas = this;

                game.map.blockSize = Math.floor(canvas.width / game.map.columns);

                canvas.width = (game.map.columns * game.map.blockSize) - game.map.blockSize;
                canvas.height = game.map.rows * game.map.blockSize;

                document.getElementById('canvas-container').style.width = canvas.width + "px";
                document.getElementById('canvas-container').style.height = canvas.height + "px";

                canvas.context.canvas.width  = canvas.width;
                canvas.context.canvas.height = canvas.height;
            },
            paint: function paint () {
                console.log('Repainting map.');
                game.mapCanvas.context.clearRect(0, 0, game.mapCanvas.width, game.mapCanvas.height);

                var groundPattern = game.mapCanvas.context.createPattern(game.images.handlers.ground, 'repeat');
                game.mapCanvas.context.rect(0, 0, game.mapCanvas.width, game.mapCanvas.height);
                game.mapCanvas.context.fillStyle = groundPattern;
                game.mapCanvas.context.fill();

                game.mapCanvas.paintBlocks();
            },
            paintBlocks: function paintBlocks() {
                var canvas = this;

                var wallPattern = game.mapCanvas.context.createPattern(game.images.handlers.wall, 'repeat');

                for (var i = 0; i < game.map.blocks.length; i++) {
                    var block = game.map.blocks[i],
                        posX = Math.floor(block.column() * game.map.blockSize),
                        posY = Math.floor(block.row() * game.map.blockSize);

                   /* game.mapCanvas.context.strokeWidth = "2px";
                    game.mapCanvas.context.strokeStyle = "green";
                    game.mapCanvas.context.strokeRect(posX, posY, game.map.blockSize, game.map.blockSize); */

                    if (block.type == "wall") {
                        game.mapCanvas.context.fillStyle = wallPattern;
                        game.mapCanvas.context.fillRect(posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                    else if (block.type == "object") {
                        game.mapCanvas.context.drawImage(game.images.handlers.object, posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                }
            },
            pixelIsAccessable: function pixelIsAccessable (x, y) {
                var column = Math.floor(x / game.map.blockSize),
                    row = Math.floor(y / game.map.blockSize),
                    index = (row * game.map.columns) + column;

                if (game.controls.downKeyActive) {
                    index += game.map.columns;
                }
                if (game.controls.rightKeyActive) {
                    index += 1;
                }

                var block = game.map.blocks[index];

                /*
                var posX = Math.floor(block.column() * game.map.blockSize),
                    posY = Math.floor(block.row() * game.map.blockSize);

                game.mapCanvas.context.fillStyle = "red";
                game.mapCanvas.context.fillRect(posX, posY, game.map.blockSize, game.map.blockSize); */

                return block.type != "wall" && block.type != "object";
            }
        },
        charactersCanvas: {
            context: document.getElementById('characters-canvas').getContext("2d"),
            width: Math.floor(window.innerWidth * 0.95),
            height: Math.floor(window.innerHeight * 0.8),
            init: function initCanvas() {
                /* Initialize the canvas, set the width and height */
                var canvas = this;

                canvas.width = (game.map.columns * game.map.blockSize) - game.map.blockSize;
                canvas.height = game.map.rows * game.map.blockSize;

                canvas.context.canvas.width  = canvas.width;
                canvas.context.canvas.height = canvas.height;

                game.controls.position.x = Math.floor(game.controls.position.column * game.map.blockSize);
                game.controls.position.y = Math.floor(game.controls.position.row * game.map.blockSize);

                game.images.init();
            },
            moveListener: function moveListener () {
                var originalPositionX = game.controls.position.x,
                    originalPositionY = game.controls.position.y,
                    speed = 3;

                if (!game.controls.rightKeyActive && !game.controls.leftKeyActive && !game.controls.upKeyActive && !game.controls.downKeyActive) {
                    requestAnimationFrame(game.charactersCanvas.moveListener);
                    return;
                }

                if (game.controls.rightKeyActive) {
                    game.controls.position.x += speed;
                    game.images.characterSprite.row = 2;
                    game.controls.position.lastDirection = 'right';
                }
                if (game.controls.downKeyActive) {
                    game.controls.position.y += speed;
                    game.images.characterSprite.row = 0;
                }
                if (game.controls.leftKeyActive) {
                    game.controls.position.x -= speed;
                    game.images.characterSprite.row = 1;
                    game.controls.position.lastDirection = 'left';
                }
                if (game.controls.upKeyActive) {
                    game.controls.position.y -= speed;
                    game.images.characterSprite.row = 3;
                }

                game.images.characterSprite.pixelMovementIndex++;

                if (game.images.characterSprite.pixelMovementIndex >= game.images.characterSprite.pixelMovementBeforeChange) {
                    // Change character sprite
                    game.images.characterSprite.column = (game.images.characterSprite.column < game.images.characterSprite.totalColumns) ? game.images.characterSprite.column + 1 : 0;
                    game.images.characterSprite.pixelMovementIndex = 0;
                }

                if (!game.mapCanvas.pixelIsAccessable(game.controls.position.x, game.controls.position.y)) {
                    // Avoid walls and stuff
                    game.controls.position.x = originalPositionX;
                    game.controls.position.y = originalPositionY;
                }

                console.log('Redrawing character');

                game.charactersCanvas.paintCharacter();

                requestAnimationFrame(game.charactersCanvas.moveListener);
            },
            paintCharacter: function paintCharacter () {
                // Clear character canvas
                var characterPosX = Math.floor(game.images.characterSprite.column * game.images.characterSprite.spriteWidth),
                    characterPosY = Math.floor(game.images.characterSprite.row * game.images.characterSprite.spriteHeight);

                game.charactersCanvas.context.clearRect(0, 0, game.charactersCanvas.width, game.charactersCanvas.height);

                // Paint character
                game.charactersCanvas.context.drawImage(
                    game.images.handlers.characterSprite,
                    characterPosX,
                    characterPosY,
                    game.images.characterSprite.spriteWidth,
                    game.images.characterSprite.spriteHeight,
                    game.controls.position.x,
                    game.controls.position.y,
                    game.map.blockSize,
                    game.map.blockSize
                );
            }
        },
        map: {
            blocks: [],
            blockSize: null,
            rows: 0,
            columns: 0,
            createBlock: function createBlock (character, index) {
                var row = Math.floor(index / game.map.columns),
                    column = Math.floor(index % game.map.columns);

                var block = {
                    character: character,
                    type: (function () {
                        switch (character) {
                            case "#":
                                return "wall";
                            case "V":
                                return "object";
                            case "X":
                                game.controls.position.index = game.map.blocks.length;
                                game.controls.position.row = row;
                                game.controls.position.column = column;

                                return "you";
                            default:
                                return "space";
                        }
                    })(),
                    row: function getRow () {
                        // Get current row index
                        return row;
                    },
                    column: function getColumn () {
                        // Get current column index on it's own row with modulus
                        return column;
                    },
                    index: index
                };

                game.map.blocks.push(block);
            },
            getBlock: function getBlock (direction) {
                var blockIndex = 0;

                switch (direction) {
                    case 'up':
                        blockIndex = (game.controls.position.index - game.map.columns);
                        break;
                    case 'down':
                        blockIndex = (game.controls.position.index + game.map.columns);
                        break;
                    case 'left':
                        blockIndex = game.controls.position.index - 1;
                        break;
                    case 'right':
                        blockIndex = game.controls.position.index + 1;
                        break;
                }

                return game.map.blocks[blockIndex];
            },
            get: function getMap () {
                var request = new XMLHttpRequest();
                request.open('GET', 'room.map', true);

                request.onload = function() {
                    if (this.status >= 200 && this.status < 400) {
                        // Success!
                        var response = this.response;

                        document.getElementById('loading').remove();

                        var rows = response.split("\n"),
                            index = 0;

                        game.map.columns = rows[0].length;
                        game.map.rows = rows.length;

                        for (var i = 0; i < rows.length; i++) {
                            var columns = rows[i].split("");

                            for (var j = 0; j < columns.length; j++) {
                                game.map.createBlock(columns[j], index);
                                index++;
                            }
                        }

                        game.mapCanvas.init();
                        game.charactersCanvas.init();
                    }
                    else {
                        document.getElementById('loading').innerHTML = 'Could not access map.';
                    }
                };

                request.onerror = function() {
                    document.getElementById('loading').innerHTML = 'Could not access map.';
                };

                request.send();
            }
        },
        images: {
            init: function init () {
                for (var i = 0; i < this.sources.length; i++) {
                    this.numberOfImages++;

                    var src = this.sources[i].src,
                        name = this.sources[i].name;

                    this.handlers[name] = new Image();
                    this.handlers[name].onload = this.onLoad;
                    this.handlers[name].src = src;
                }
            },
            onLoad: function onImageLoad () {
                game.images.loadedImages++;

                if (game.images.loadedImages >= game.images.numberOfImages) {
                    // Done loading all images
                    game.mapCanvas.paint();
                    game.charactersCanvas.paintCharacter();
                    game.charactersCanvas.moveListener();
                }
            },
            characterSprite: {
                row: 1,
                column: 0,
                totalColumns: 2,
                pixelMovementIndex: 0, // highter is slower
                pixelMovementBeforeChange: 10, // highter is slower
                spriteWidth: 24,
                spriteHeight: 24,
                imageWidth: 72,
                imageHeight: 92
            },
            handlers: [],
            sources: [
                { name: 'ground', 'src': 'img/grounds/ground1.jpg' },
                { name: 'wall', 'src': 'img/walls/wall1.jpg' },
                { name: 'object', 'src': 'img/objects/object1.gif' },
                { name: 'characterSprite', 'src': 'img/characters/character1-sprite.png' }
            ],
            numberOfImages: 0,
            loadedImages: 0
        },
        controls: {
            init: function init () {
                document.addEventListener('keydown', game.controls.keyboardDownListener);
                document.addEventListener('keyup', game.controls.keyboardUpListener);
            },
            position: {
                x: 0,
                y: 0,
                lastDirection: 'left'
            },
            upKeyActive: false,
            downKeyActive: false,
            leftKeyActive: false,
            rightKeyActive: false,
            keyboardDownListener: function keyboardDownListener (e) {
                var controls = game.controls;

                switch (e.keyCode) {
                    case 38:
                        game.controls.upKeyActive = true;
                        break;
                    case 40:
                        game.controls.downKeyActive = true;
                        break;
                    case 37:
                        game.controls.leftKeyActive = true;
                        break;
                    case 39:
                        game.controls.rightKeyActive = true;
                        break;
                }
            },
            keyboardUpListener: function keyboardUpListener (e) {
                var controls = game.controls;

                switch (e.keyCode) {
                    case 38:
                        game.controls.upKeyActive = false;
                        break;
                    case 40:
                        game.controls.downKeyActive = false;
                        break;
                    case 37:
                        game.controls.leftKeyActive = false;
                        break;
                    case 39:
                        game.controls.rightKeyActive = false;
                        break;
                }
            }
        }
    };

    // Let's roll
    game.init();
})();