"use strict";

var images = {
    init: function init () {
        for (var i = 0; i < this.sources.length; i++) {
            this.numberOfImages++;

            var src = this.sources[i].src,
                name = this.sources[i].name;

            this.handlers[name] = new Image();
            this.handlers[name].onload = this.onLoad;
            this.handlers[name].src = 'img/' + src + '.png';
        }
    },
    onLoad: function onImageLoad () {
        images.loadedImages++;

        if (images.loadedImages >= images.numberOfImages) {
            // Done loading all images
            mapCanvas.paint();
            charactersCanvas.paintCharacter();
            dialogCanvas.init();
        }
    },
    characterSprite: {
        row: 1,
        column: 0,
        totalColumns: 2,
        pixelMovementIndex: 0, // highter is slower
        pixelMovementBeforeChange: 10, // highter is slower
        spriteWidth: 48,
        spriteHeight: 48,
        imageWidth: 144,
        imageHeight: 192
    },
    handlers: [],
    sources: [
        { name: 'ground', 'src': 'ground1' },
        { name: 'water', 'src': 'water' },
        { name: 'wall', 'src': 'wall2' },
        { name: 'bush', 'src': 'bush' },
        { name: 'box', 'src': 'box' },
        { name: 'dialogFrame', 'src': 'dialog-frame' },
        { name: 'characterSprite', 'src': 'character1-sprite' }
    ],
    numberOfImages: 0,
    loadedImages: 0
};