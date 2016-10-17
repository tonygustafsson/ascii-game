"use strict";

var map = {
    currentMap: "0-0",
    blocks: [],
    blockSize: null,
    rows: 0,
    columns: 0,
    createBlock: function createBlock (character, index) {
        var row = Math.floor(index / map.columns),
            column = Math.floor(index % map.columns);

        var block = {
            character: character,
            type: (function () {
                switch (character) {
                    case "#":
                        return "wall";
                    case "V":
                        return "bush";
                    case "B":
                        return "box";
                    case "X":
                        controls.position.index = map.blocks.length;
                        controls.position.row = row;
                        controls.position.column = column;

                        return "you";
                    case "R":
                        return "right";
                    case "L":
                        return "left";
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

        map.blocks.push(block);
    },
    getBlock: function getBlock (direction) {
        var blockIndex = 0;

        switch (direction) {
            case 'up':
                blockIndex = (controls.position.index - map.columns);
                break;
            case 'down':
                blockIndex = (controls.position.index + map.columns);
                break;
            case 'left':
                blockIndex = controls.position.index - 1;
                break;
            case 'right':
                blockIndex = controls.position.index + 1;
                break;
        }

        return map.blocks[blockIndex];
    },
    get: function getMap () {
        var request = new XMLHttpRequest();
        request.open('GET', 'rooms/' + map.currentMap + '.map', true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var response = this.response;

                var loading = document.getElementById('loading');
                if (loading !== null) {
                    document.getElementById('article').removeChild(loading);
                }

                var rows = response.split("\n"),
                    index = 0;

                map.columns = rows[0].length;
                map.rows = rows.length;

                map.blocks = [];

                for (var i = 0; i < rows.length; i++) {
                    var columns = rows[i].split("");

                    for (var j = 0; j < columns.length; j++) {
                        map.createBlock(columns[j], index);
                        index++;
                    }
                }

                mapCanvas.init();
                charactersCanvas.init();
                images.init();
            }
            else {
                document.getElementById('loading').innerHTML = 'Could not access map.';
            }
        };

        request.onerror = function() {
            document.getElementById('loading').innerHTML = 'Could not access map.';
        };

        request.send();
    },
    changeMap: function changeMap (direction) {
        var mapPosition = map.currentMap.split("-"),
            mapX = mapPosition[0],
            mapY = mapPosition[1];

        if (direction == "left") {
            mapX--;
        }
        else if (direction == "right") {
            mapX++;
        }

        if (mapX > 1 || mapY > 0) {
            // Map does not exist!
            return false;
        }

        var mapId = mapX + "-" + mapY;
        map.currentMap = mapId;
        map.get();
    }
};