"use strict";

var map = {
    currentMap: "0-0",
    blocks: [],
    blockSize: null,
    rows: 0,
    columns: 0,
    directionBlocks: {
        up: {
            row: null,
            column: null
        },
        down: {
            row: null,
            column: null
        },
        left: {
            row: null,
            column: null
        },
        right: {
            row: null,
            column: null
        }
    },
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
                    case "W":
                        return "water";
                    case "X":
                        if (controls.position.index === null) {
                            // Set initial position
                            controls.position.index = map.blocks.length;
                            controls.position.row = row;
                            controls.position.column = column;
                        }

                        return "you";
                    case "R":
                        map.directionBlocks.right.row = row;
                        map.directionBlocks.right.column = column;
                        return "right";
                    case "L":
                        map.directionBlocks.left.row = row;
                        map.directionBlocks.left.column = column;
                        return "left";
                    case "U":
                        map.directionBlocks.up.row = row;
                        map.directionBlocks.up.column = column;
                        return "up";
                    case "D":
                        map.directionBlocks.down.row = row;
                        map.directionBlocks.down.column = column;
                        return "down";
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

                // Get map settings from first line
                map.setMapSettings(rows[0]);
                rows.shift();

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
                swordCanvas.init();
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
    setMapSettings: function setMapSettings (settings) {
        var settingsPairs = settings.split(";");

        for (var i = 0; i < settingsPairs.length; i++) {
            var thisSetting = settingsPairs[i].split(':');

            for (var j = 0; j < thisSetting.length; j++) {
                for (var k = 0; k < images.sources.length; k++) {
                    if (images.sources[k].name == thisSetting[0]) {
                        images.sources[k].src = thisSetting[1];
                    }
                }
            }
        }
    },
    lastDirection: null,
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
        else if (direction == "up") {
            mapY--;
        }
        else if (direction == "down") {
            mapY++;
        }

        if (mapX > 1 || mapY > 1 || mapX < 0 || mapY < 0) {
            // Map does not exist!
            return false;
        }

        map.lastDirection = direction;

        var mapId = mapX + "-" + mapY;
        map.currentMap = mapId;
        controls.disableKeyPress = true;
        map.get();
    }
};