"use strict";

var controls = {
    init: function init () {
        document.addEventListener('keydown', controls.keyboardDownListener);
        document.addEventListener('keyup', controls.keyboardUpListener);
    },
    position: {
        index: null,
        row: null,
        column: null,
        x: 0,
        y: 0,
        lastDirection: 'left'
    },
    disableKeyPress: false,
    upKeyActive: false,
    downKeyActive: false,
    leftKeyActive: false,
    rightKeyActive: false,
    spaceKeyActive: false,
    keyboardDownListener: function keyboardDownListener (e) {
        if (controls.disableKeyPress) {
            return;
        }

        switch (e.keyCode) {
            case 38:
                e.preventDefault();
                controls.upKeyActive = true;
                break;
            case 40:
                e.preventDefault();
                controls.downKeyActive = true;
                break;
            case 37:
                e.preventDefault();
                controls.leftKeyActive = true;
                break;
            case 39:
                e.preventDefault();
                controls.rightKeyActive = true;
                break;
            case 32:
                e.preventDefault();
                controls.spaceKeyActive = true;
                break;
        }
    },
    keyboardUpListener: function keyboardUpListener (e) {
        switch (e.keyCode) {
            case 38:
                e.preventDefault();
                controls.upKeyActive = false;
                break;
            case 40:
                e.preventDefault();
                controls.downKeyActive = false;
                break;
            case 37:
                e.preventDefault();
                controls.leftKeyActive = false;
                break;
            case 39:
                e.preventDefault();
                controls.rightKeyActive = false;
                break;
            case 32:
                e.preventDefault();
                controls.spaceKeyActive = false;
                break;
        }
    }
};