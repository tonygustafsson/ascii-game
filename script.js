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
            blockSize: null,
            init: function initCanvas() {
                /* Initialize the canvas, set the width and height */

                var canvas = this;

                game.canvas.context.canvas.width  = canvas.width;
                game.canvas.context.canvas.height = canvas.height;

                game.canvas.blockSize = Math.floor(game.canvas.width / game.map.columns);
                document.getElementsByTagName('h1')[0].style.fontSize = game.canvas.blockSize + "px";

                game.canvas.context.font = game.canvas.blockSize + "px monospace";
                game.canvas.context.fillStyle = "limegreen";
            },
            paint: function paint() {
                /* Will paint each generation to the canvas */

                var canvas = this;

                // Clear all cells so we won't have to paint out dead cells (performance hog)
                canvas.context.clearRect(0, 0, canvas.width, canvas.height);

                for (var i = 0; i < game.map.blocks.length; i++) {
                    var block = game.map.blocks[i];
                    game.canvas.context.fillText(block.character, block.column * game.canvas.blockSize, block.row * (game.canvas.blockSize * 1.5) + game.canvas.blockSize);
                }
            }
        },
        map: {
            blocks: [],
            rows: 0,
            columns: 0,
            createBlock: function createBlock (character, row, column) {
                var block = {
                    character: character,
                    type: (function () {
                        switch (character) {
                            case "#":
                                return "wall";
                            case "V":
                                return "object";
                            case "X":
                                game.controls.currentIndex = game.map.blocks.length;
                                return "you";
                            default:
                                return "space";
                        }
                    })(),
                    row: row,
                    column: column,
                    index: (game.map.columns * row) + column
                }

                game.map.blocks.push(block);
            },
            getBlock: function getBlock (direction) {
                var blockIndex = 0;

                switch (direction) {
                    case 'up':
                        blockIndex = (game.controls.currentIndex - game.map.columns) - 1;
                        break;
                    case 'down':
                        blockIndex = (game.controls.currentIndex + game.map.columns) + 1;
                        break;
                    case 'left':
                        blockIndex = game.controls.currentIndex - 1;
                        break;
                    case 'right':
                        blockIndex = game.controls.currentIndex + 1;
                        break;
                }

                return game.map.blocks[blockIndex];
            },
            get: function get () {
                var request = new XMLHttpRequest();
                request.open('GET', 'room.map', true);

                request.onload = function() {
                    if (this.status >= 200 && this.status < 400) {
                        // Success!
                        var response = this.response;

                        document.getElementById('loading').remove();

                        var rows = response.split("\n");
                        game.map.rows = rows.length;

                        for (var i = 0; i < rows.length; i++) {
                            var columns = rows[i].split("");
                            game.map.columns = columns.length;

                            for (var j = 0; j < columns.length; j++) {
                                game.map.createBlock(columns[j], i, j);
                            }
                        }

                        game.canvas.init();
                        game.canvas.paint();
                    }
                    else {
                        alert('Could not access map');
                    }
                };

                request.onerror = function() {
                    alert('Could not access map');
                };

                request.send();
            }
        },
        controls: {
            currentIndex: 0,
            init: function init () {
                document.addEventListener('keydown', game.controls.keyboardListener);
            },
            changePosition(direction) {
                var directionBlock = game.map.getBlock(direction);

                if (directionBlock.type != "wall") {
                    directionBlock.character = "X";

                    var currentBlock = game.map.blocks[game.controls.currentIndex];
                    currentBlock.character = " ";

                    game.controls.currentIndex = directionBlock.index;
                }
            },
            keyboardListener: function keyboardListener (e) {
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