"use strict";

var images = {
    init: function init () {
        images.numberOfImages = 0;
        images.loadedImages = 0;

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
        images.loadedImages++;

        if (images.loadedImages >= images.numberOfImages) {
            // Done loading all images
            mapCanvas.paint();
            charactersCanvas.paintCharacter();
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
        { name: 'ground', 'src': 'img/grounds/ground1.jpg' },
        { name: 'wall', 'src': 'img/walls/wall2.jpg' },
        { name: 'bush', 'src': 'img/objects/bush.gif' },
        { name: 'box', 'src': 'img/objects/box.gif' },
        { name: 'characterSprite', 'src': 'img/characters/character1-sprite.png' }
    ],
    numberOfImages: 0,
    loadedImages: 0
};