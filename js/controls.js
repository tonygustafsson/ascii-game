"use strict";

var controls = {
    init: function init () {
        document.addEventListener('touchstart', controls.touchStartListener);
        document.addEventListener('touchend', controls.touchEndListener);
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
                controls.upActive = true;
                break;
            case 40:
                e.preventDefault();
                controls.downActive = true;
                break;
            case 37:
                e.preventDefault();
                controls.leftActive = true;
                break;
            case 39:
                e.preventDefault();
                controls.rightActive = true;
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
                controls.upActive = false;
                break;
            case 40:
                e.preventDefault();
                controls.downActive = false;
                break;
            case 37:
                e.preventDefault();
                controls.leftActive = false;
                break;
            case 39:
                e.preventDefault();
                controls.rightActive = false;
                break;
            case 32:
                e.preventDefault();
                controls.spaceKeyActive = false;
                break;
        }
    },
    touchStartListener: function touchStartListener (e) {
        var touchPosX = e.targetTouches[0].pageX,
            touchPosY = e.targetTouches[0].pageY,
            leftAreaLimit = mapCanvas.position.left + 50,
            rightAreaLimit = mapCanvas.position.right - 50,
            upAreaLimit = mapCanvas.position.top + 50,
            downAreaLimit = mapCanvas.position.bottom - 50;

        if (touchPosX < leftAreaLimit && touchPosY > upAreaLimit && touchPosY < downAreaLimit) {
            controls.leftActive = true;
        }
        else if (touchPosX > rightAreaLimit && touchPosY > upAreaLimit && touchPosY < downAreaLimit) {
            controls.rightActive = true;
        }
        else if (touchPosY < upAreaLimit) {
            controls.upActive = true;
        }
        else if (touchPosY > downAreaLimit) {
            controls.downActive = true;
        }
    },
    touchEndListener: function touchEndListener (e) {
        controls.leftActive = false;
        controls.rightActive = false;
        controls.upActive = false;
        controls.downActive = false;
    }
};