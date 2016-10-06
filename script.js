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
                                break;
                            case "V":
                                return "object";
                                break;
                            case "X":
                                game.controls.currentColumn = column;
                                game.controls.currentRow = row;
                                game.controls.currentIndex = game.map.blocks.length;
                                return "you";
                                break;
                            default:
                                return "space";
                        }
                    })(),
                    row: row,
                    column: column
                }

                game.map.blocks.push(block);
            },
            getBlockIndex: function getTopBlock (index, direction) {
                switch (direction) {
                    case 'top':
                        var position = index - game.map.columns - 1;
                        return position;
                    case 'bottom':
                        var position = index + game.map.columns + 1;
                        return position;
                    case 'left':
                        var position = index - 1;
                        return position;
                    case 'right':
                        var position = index + 1;
                        return position;
                }

                return false;
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
            currentColumn: 0,
            currentRow: 0,
            currentIndex: 0,
            init: function init () {
                document.addEventListener('keydown', game.controls.changePosition);
            },
            changePosition: function changePosition (e) {
                switch (e.keyCode) {
                    case 38:
                        console.log('up');
                        var topBlockIndex = game.map.getBlockIndex(game.controls.currentIndex, 'top'),
                            topBlock = game.map.blocks[topBlockIndex];

                        if (topBlock.type != "wall") {
                            var positionBlock = game.map.blocks[game.controls.currentIndex];
                            topBlock.character = "X";
                            positionBlock.character = " ";
                            game.controls.currentRow = topBlock.row;
                            game.controls.currentColumn = topBlock.column;
                            game.controls.currentIndex = topBlockIndex;

                            game.canvas.paint();
                        }

                        break;
                    case 40:
                        console.log('down');

                        var bottomBlockIndex = game.map.getBlockIndex(game.controls.currentIndex, 'bottom'),
                            bottomBlock = game.map.blocks[bottomBlockIndex];

                        if (bottomBlock.type != "wall") {
                            var positionBlock = game.map.blocks[game.controls.currentIndex];
                            bottomBlock.character = "X";
                            positionBlock.character = " ";
                            game.controls.currentRow = bottomBlock.row;
                            game.controls.currentColumn = bottomBlock.column;
                            game.controls.currentIndex = bottomBlockIndex;

                            game.canvas.paint();
                        }

                        break;
                    case 37:
                        console.log('left');

                        var leftBlockIndex = game.map.getBlockIndex(game.controls.currentIndex, 'left'),
                            leftBlock = game.map.blocks[leftBlockIndex];

                        if (leftBlock.type != "wall") {
                            var positionBlock = game.map.blocks[game.controls.currentIndex];
                            leftBlock.character = "X";
                            positionBlock.character = " ";
                            game.controls.currentRow = leftBlock.row;
                            game.controls.currentColumn = leftBlock.column;
                            game.controls.currentIndex = leftBlockIndex;

                            game.canvas.paint();
                        }

                        break;
                    case 39:
                        console.log('right');

                        var rightBlockIndex = game.map.getBlockIndex(game.controls.currentIndex, 'right'),
                            rightBlock = game.map.blocks[rightBlockIndex];

                        if (rightBlock.type != "wall") {
                            var positionBlock = game.map.blocks[game.controls.currentIndex];
                            rightBlock.character = "X";
                            positionBlock.character = " ";
                            game.controls.currentRow = rightBlock.row;
                            game.controls.currentColumn = rightBlock.column;
                            game.controls.currentIndex = rightBlockIndex;

                            game.canvas.paint();
                        }

                        break;
                }
            }
        }
    };

    // Let's roll
    game.init();
})();