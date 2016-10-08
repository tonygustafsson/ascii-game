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
        canvas: {
            context: document.getElementById('game-canvas').getContext("2d"),
            width: Math.floor(window.innerWidth * 0.95),
            height: Math.floor(window.innerHeight * 0.8),
            init: function initCanvas() {
                /* Initialize the canvas, set the width and height */
                var canvas = this;

                game.canvas.context.canvas.width  = canvas.width;
                game.canvas.context.canvas.height = canvas.height;

                game.map.blockSize = Math.floor(game.canvas.width / game.map.columns);

                game.controls.position.x = Math.floor(game.controls.position.column * game.map.blockSize);
                game.controls.position.y = Math.floor(game.controls.position.row * (game.map.blockSize * 1.5));

                game.canvas.context.translate(0, game.map.blockSize);
                document.getElementsByTagName('h1')[0].style.fontSize = game.map.blockSize + "px";

                game.canvas.context.font = game.map.blockSize + "px monospace";
                game.canvas.context.fillStyle = "limegreen";
            },
            move: function move (direction) {
                var speed = 10;

                if (direction == 'up') {
                        var destinationPosY = game.controls.position.y - game.map.blockSize,
                            expression = function () {
                                return game.controls.position.y > destinationPosY;
                            },
                            doAfter = function () {
                                game.controls.position.y--;
                            };
                }
                else if (direction == 'down') {
                        var destinationPosY = game.controls.position.y + game.map.blockSize,
                            expression = function () {
                                return game.controls.position.y < destinationPosY;
                            },
                            doAfter = function () {
                                game.controls.position.y++;
                            };
                }
                else if (direction == 'left') {
                        var destinationPosX = game.controls.position.x - game.map.blockSize,
                            expression = function () {
                                return game.controls.position.x > destinationPosX;
                            },
                            doAfter = function () {
                                game.controls.position.x--;
                            };
                }
                else if (direction == 'right') {
                        var destinationPosX = game.controls.position.x + game.map.blockSize,
                            expression = function () {
                                return game.controls.position.x < destinationPosX;
                            },
                            doAfter = function () {
                                game.controls.position.x++;
                            };
                }

                while (expression()) {
                    doAfter();

                    setTimeout(function (x, y) {
                        return function () {
                            game.canvas.context.clearRect(x, y - game.map.blockSize, game.map.blockSize, game.map.blockSize);
                            game.canvas.context.fillText("X", x, y);
                        };
                    }(game.controls.position.x, game.controls.position.y), speed);
                    
                    speed += 10;
                }

                setTimeout(function () {
                    game.canvas.paint();
                }, speed);
            },
            paint: function paint() {
                var canvas = this;

                // Clear all cells so we won't have to paint out dead cells (performance hog)
                canvas.context.clearRect(0, 0 - game.map.blockSize, canvas.width, canvas.height);

                for (var i = 0; i < game.map.blocks.length; i++) {
                    var block = game.map.blocks[i],
                        posX = Math.floor(block.column() * game.map.blockSize),
                        posY = Math.floor(block.row() * (game.map.blockSize * 1.5));

                    game.canvas.context.fillText(block.character, posX, posY);
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
                        return row
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

                        for (var i = 0; i < rows.length; i++) {
                            var columns = rows[i].split("");

                            for (var j = 0; j < columns.length; j++) {
                                game.map.createBlock(columns[j], index);
                                index++;
                            }
                        }

                        game.canvas.init();
                        game.canvas.paint();
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
        controls: {
            init: function init () {
                document.addEventListener('keydown', game.controls.keyboardListener);
            },
            position: {
                index: 0,
                row: 0,
                column: 0,
                x: 0,
                y: 0
            },
            changePosition: function changePosition (direction) {
                var controls = this;
                var directionBlock = game.map.getBlock(direction);

                if (directionBlock.type != "wall") {
                    directionBlock.character = "X";

                    var currentBlock = game.map.blocks[controls.position.index];
                    currentBlock.character = " ";

                   controls.position.index = directionBlock.index;
                   controls.position.row = directionBlock.row();
                   controls.position.column = directionBlock.column();      

                  // game.canvas.move(direction);       
                }
            },
            keyboardListener: function keyboardListener (e) {
                var controls = game.controls;

                switch (e.keyCode) {
                    case 38:
                        game.controls.changePosition('up');
                        game.canvas.paint();
                        break;
                    case 40:
                        game.controls.changePosition('down');
                        game.canvas.paint();
                        break;
                    case 37:
                        game.controls.changePosition('left');
                        game.canvas.paint();
                        break;
                    case 39:
                        game.controls.changePosition('right');
                        game.canvas.paint();
                        break;
                }
            }
        }
    };

    // Let's roll
    game.init();
})();