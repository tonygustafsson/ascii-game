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

                game.controls.position.x = Math.floor(game.controls.position.column * game.map.blockSize);
                game.controls.position.y = Math.floor(game.controls.position.row * game.map.blockSize);
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
            move: function move (direction) {
                var speed = 3,
                    destinationPosY = game.controls.position.y,
                    destinationPosX = game.controls.position.x,
                    expression = null,
                    doAfter = null;

                if (direction == 'up') {
                    destinationPosY = game.controls.position.y - game.map.blockSize;
                    expression = function () {
                        return game.controls.position.y > destinationPosY;
                    };
                    doAfter = function () {
                        game.controls.position.y--;
                    };
                }
                else if (direction == 'down') {
                    destinationPosY = game.controls.position.y + game.map.blockSize;
                    expression = function () {
                        return game.controls.position.y < destinationPosY;
                    };
                    doAfter = function () {
                        game.controls.position.y++;
                    };
                }
                else if (direction == 'left') {
                    destinationPosX = game.controls.position.x - game.map.blockSize;
                    expression = function () {
                        return game.controls.position.x > destinationPosX;
                    };
                    doAfter = function () {
                        game.controls.position.x--;
                    };
                }
                else if (direction == 'right') {
                    destinationPosX = game.controls.position.x + game.map.blockSize;
                    expression = function () {
                        return game.controls.position.x < destinationPosX;
                    };
                    doAfter = function () {
                        game.controls.position.x++;
                    };
                }

                while (expression()) {
                    doAfter();

                    setTimeout(function (x, y) {
                        return function () {
                            game.charactersCanvas.context.drawImage(game.charactersCanvas.groundImage, x, y, game.map.blockSize, game.map.blockSize);
                            game.charactersCanvas.context.drawImage(game.charactersCanvas.characterImage, x, y, game.map.blockSize, game.map.blockSize);
                        };
                    }(game.controls.position.x, game.controls.position.y), speed);

                    speed += 3;
                }

                setTimeout(function () {
                    game.charactersCanvas.paint();
                }, speed);
            },
            characterImage: new Image(),
            characterRightImage: new Image(),
            paint: function paint() {
                var canvas = this;

                console.log('Repainting characters.');
                game.charactersCanvas.context.clearRect(0, 0, game.charactersCanvas.width, game.charactersCanvas.height);

                for (var i = 0; i < game.map.blocks.length; i++) {
                    var block = game.map.blocks[i],
                        posX = Math.floor(block.column() * game.map.blockSize),
                        posY = Math.floor(block.row() * game.map.blockSize);

                    if (block.type == "you") {
                        if (game.controls.position.lastDirection == "right") {
                            game.charactersCanvas.context.drawImage(game.images.handlers.characterRight, posX, posY, game.map.blockSize, game.map.blockSize);
                        }
                        else {
                            game.charactersCanvas.context.drawImage(game.images.handlers.character, posX, posY, game.map.blockSize, game.map.blockSize);
                        }
                    }
                }
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
                for (var name in this.sources) {
                    if (!this.sources.hasOwnProperty(name)) return;

                    this.numberOfImages++;

                    var src = this.sources[name];

                    this.handlers[name] = new Image();

                    this.handlers[name].onload = function() {
                        game.images.loadedImages++;

                        if (game.images.loadedImages >= game.images.numberOfImages) {
                            // Done loading all images
                            game.mapCanvas.paint();
                            game.charactersCanvas.paint();
                        }
                    };
                    this.handlers[name].src = src;
                }
            },
            handlers: [],
            sources: {
                ground: 'img/grounds/ground1.jpg',
                wall: 'img/walls/wall1.jpg',
                object: 'img/objects/object1.gif',
                character: 'img/characters/character1.png',
                characterRight: 'img/characters/character1-right.png'
            },
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

                directionBlock.character = "X";
                directionBlock.type = "you";

                var currentBlock = game.map.blocks[controls.position.index];
                currentBlock.character = " ";
                currentBlock.type = "space";

                if (direction == "left" || direction == "right") {
                    controls.position.lastDirection = direction;
                }

                controls.position.index = directionBlock.index;
                controls.position.row = directionBlock.row();
                controls.position.column = directionBlock.column();

                //game.mapCanvas.move(direction);
            },
            keyboardListener: function keyboardListener (e) {
                var controls = game.controls;

                switch (e.keyCode) {
                    case 38:
                        game.controls.changePosition('up');
                        game.charactersCanvas.paint();
                        break;
                    case 40:
                        game.controls.changePosition('down');
                        game.charactersCanvas.paint();
                        break;
                    case 37:
                        game.controls.changePosition('left');
                        game.charactersCanvas.paint();
                        break;
                    case 39:
                        game.controls.changePosition('right');
                        game.charactersCanvas.paint();
                        break;
                }
            }
        }
    };

    // Let's roll
    game.init();
})();