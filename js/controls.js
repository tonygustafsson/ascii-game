"use strict";

var controls = {
    init: function init () {
        document.addEventListener('keydown', controls.keyboardDownListener);
        document.addEventListener('keyup', controls.keyboardUpListener);
    },
    position: {
        x: 0,
        y: 0,
        lastDirection: 'left'
    },
    upKeyActive: false,
    downKeyActive: false,
    leftKeyActive: false,
    rightKeyActive: false,
    keyboardDownListener: function keyboardDownListener (e) {
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
        }
    }
};