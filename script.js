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

                    if (block.type == "wall") {
                        game.mapCanvas.context.fillStyle = wallPattern;
                        game.mapCanvas.context.fillRect(posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                    else if (block.type == "object") {
                        game.mapCanvas.context.drawImage(game.images.handlers.object, posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                }
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
            move: function move (destinationPosX, destinationPosY) {
                game.controls.pauseKeyboardListener = true;
                var moveRate = 4;

                if (game.controls.position.x == destinationPosX && game.controls.position.y == destinationPosY) {
                    game.controls.pauseKeyboardListener = false;
                    return;
                }
                else if (game.controls.position.x > destinationPosX) {
                    // Left
                    game.controls.position.x -= moveRate;
                    game.controls.position.x = (game.controls.position.x - destinationPosX < moveRate) ? destinationPosX : game.controls.position.x;
                }
                else if (game.controls.position.x < destinationPosX) {
                    // Right
                    game.controls.position.x += moveRate;
                    game.controls.position.x = (destinationPosX - game.controls.position.x < moveRate) ? destinationPosX : game.controls.position.x;
                }
                else if (game.controls.position.y > destinationPosY) {
                    // Up
                    game.controls.position.y -= moveRate;
                    game.controls.position.y = (game.controls.position.y - destinationPosY < moveRate) ? destinationPosY : game.controls.position.y;
                }
                else if (game.controls.position.y < destinationPosY) {
                    // Down
                    game.controls.position.y += moveRate;
                    game.controls.position.y = (destinationPosY - game.controls.position.y < moveRate) ? destinationPosY : game.controls.position.y;
                }

                game.charactersCanvas.paintCharacter(game.controls.position.x, game.controls.position.y);

                requestAnimationFrame(function () {
                    game.charactersCanvas.move(destinationPosX, destinationPosY);
                });
            },
            paintCharacter: function moveCharacter (x, y) {
                console.log('Repainting character at ' + x + ' x ' + y);

                // Set default if not used for animation
                x = (typeof x === "undefined") ? game.controls.position.x : x;
                y = (typeof y === "undefined") ? game.controls.position.y : y;

                // Clear character canvas
                game.charactersCanvas.context.clearRect(0, 0, game.charactersCanvas.width, game.charactersCanvas.height);

                // Paint character
                var characterImage = (game.controls.position.lastDirection == "right") ? game.images.handlers.characterRight : game.images.handlers.character;
                game.charactersCanvas.context.drawImage(characterImage, x, y, game.map.blockSize, game.map.blockSize);
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
                }
            },
            handlers: [],
            sources: [
                { name: 'ground', 'src': 'img/grounds/ground1.jpg' },
                { name: 'wall', 'src': 'img/walls/wall1.jpg' },
                { name: 'object', 'src': 'img/objects/object1.gif' },
                { name: 'character', 'src': 'img/characters/character1.png' },
                { name: 'characterRight', 'src': 'img/characters/character1-right.png' }
            ],
            numberOfImages: 0,
            loadedImages: 0
        },
        controls: {
            init: function init () {
                document.addEventListener('keydown', game.controls.keyboardListener);
            },
            position: {
                index: 0,
                row: 0,
                column: 0,
                x: 0,
                y: 0,
                lastDirection: 'left'
            },
            changePosition: function changePosition (direction) {
                var controls = this;
                var directionBlock = game.map.getBlock(direction);

                if (directionBlock.type == "wall" || directionBlock.type == "object") {
                    // Do not walk through objects
                    return;
                }

                if (direction == "left" || direction == "right") {
                    controls.position.lastDirection = direction;
                }

                controls.position.index = directionBlock.index;
                controls.position.row = directionBlock.row();
                controls.position.column = directionBlock.column();

                var destinationPosX = game.controls.position.x,
                    destinationPosY = game.controls.position.y;

                switch (direction) {
                    case "left":
                        destinationPosX = Math.floor(game.controls.position.x - game.map.blockSize);
                        break;
                    case "right":
                        destinationPosX = Math.floor(game.controls.position.x + game.map.blockSize);
                        break;
                    case "up":
                        destinationPosY = Math.floor(game.controls.position.y - game.map.blockSize);
                        break;
                    case "down":
                        destinationPosY = Math.floor(game.controls.position.y + game.map.blockSize);
                        break;
                }

                // Animation
                game.charactersCanvas.move(destinationPosX, destinationPosY);
            },
            pauseKeyboardListener: false,
            keyboardListener: function keyboardListener (e) {
                var controls = game.controls;

                // Avoid simulatinous movements
                if (game.controls.pauseKeyboardListener) return;

                switch (e.keyCode) {
                    case 38:
                        game.controls.changePosition('up');
                        break;
                    case 40:
                        game.controls.changePosition('down');
                        break;
                    case 37:
                        game.controls.changePosition('left');
                        break;
                    case 39:
                        game.controls.changePosition('right');
                        break;
                }
            }
        }
    };

    // Let's roll
    game.init();
})();