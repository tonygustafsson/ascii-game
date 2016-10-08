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

                game.map.blockSize = Math.floor(game.canvas.width / game.map.columns);

                canvas.width = (game.map.columns * game.map.blockSize) - game.map.blockSize;
                canvas.height = game.map.rows * game.map.blockSize;

                game.canvas.context.canvas.width  = canvas.width;
                game.canvas.context.canvas.height = canvas.height;

                game.controls.position.x = Math.floor(game.controls.position.column * game.map.blockSize);
                game.controls.position.y = Math.floor(game.controls.position.row * game.map.blockSize);
              
                canvas.groundImage.src = 'img/grounds/ground1.jpg';
                canvas.groundImage.onload = canvas.paint;

                canvas.characterImage.src = 'img/characters/character1.png';
                canvas.characterImage.onload = canvas.paint;
                canvas.characterRightImage.src = 'img/characters/character1-right.png';
                canvas.characterRightImage.onload = canvas.paint;

                canvas.wallImage.src = 'img/walls/wall1.jpg';
                canvas.wallImage.onload = canvas.paint;

                canvas.objectImage.src = 'img/objects/object1.gif';
                canvas.objectImage.onload = canvas.paint;

                game.canvas.context.font = game.map.blockSize + "px monospace";
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
                            game.canvas.context.drawImage(game.canvas.groundImage, x, y, game.map.blockSize, game.map.blockSize);
                            game.canvas.context.drawImage(game.canvas.characterImage, x, y, game.map.blockSize, game.map.blockSize);
                        };
                    }(game.controls.position.x, game.controls.position.y), speed);
                    
                    speed += 3;
                }

                setTimeout(function () {
                    game.canvas.paint();
                }, speed);
            },
            groundImage: new Image(),
            characterImage: new Image(),
            characterRightImage: new Image(),
            wallImage: new Image(),
            objectImage: new Image(),
            paint: function paint () {
                game.canvas.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

                var groundPattern = game.canvas.context.createPattern(game.canvas.groundImage, 'repeat');
                game.canvas.context.rect(0, 0, game.canvas.width, game.canvas.height);
                game.canvas.context.fillStyle = groundPattern;
                game.canvas.context.fill();

                game.canvas.paintBlocks();
            },
            paintBlocks: function paintBlocks() {
                var canvas = this;

                var wallPattern = game.canvas.context.createPattern(game.canvas.wallImage, 'repeat');

                for (var i = 0; i < game.map.blocks.length; i++) {
                    var block = game.map.blocks[i],
                        posX = Math.floor(block.column() * game.map.blockSize),
                        posY = Math.floor(block.row() * game.map.blockSize);

                    if (block.type == "wall") {
                        game.canvas.context.fillStyle = wallPattern;
                        game.canvas.context.fillRect(posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                    else if (block.type == "object") {
                        game.canvas.context.drawImage(game.canvas.objectImage, posX, posY, game.map.blockSize, game.map.blockSize);
                    }
                    else if (block.type == "you") {
                        if (game.controls.position.lastDirection == "right") {
                            game.canvas.context.drawImage(game.canvas.characterRightImage, posX, posY, game.map.blockSize, game.map.blockSize);
                        }
                        else {
                            game.canvas.context.drawImage(game.canvas.characterImage, posX, posY, game.map.blockSize, game.map.blockSize);
                        }
                    }
                    else {
                        game.canvas.context.fillStyle = "limegreen";
                        game.canvas.context.fillText(block.character, posX, posY);
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

                        game.canvas.init();
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

                //game.canvas.move(direction);       
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