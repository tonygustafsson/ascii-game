"use strict";

var dialogCanvas = {
    element: document.getElementById('dialog-canvas'),
    context: document.getElementById('dialog-canvas').getContext("2d"),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    fontSize: 24,
    topOffset: 0,
    leftOffset: 0,
    visible: false,
    init: function initCanvas () {
        /* Initialize the canvas, set the width and height */
        dialogCanvas.element.style.left = Math.floor(mapCanvas.width / 6) + "px";
        dialogCanvas.element.style.top = Math.floor(mapCanvas.height / 6) + "px";
        dialogCanvas.width = Math.floor(mapCanvas.width / 1.5);
        dialogCanvas.height = Math.floor(mapCanvas.height / 1.5);

        dialogCanvas.fontSize = Math.floor(mapCanvas.width * 0.01);
        dialogCanvas.topOffset = Math.floor(dialogCanvas.height * 0.25);
        dialogCanvas.leftOffset = Math.floor(dialogCanvas.width * 0.15);

        dialogCanvas.context.canvas.width = dialogCanvas.width;
        dialogCanvas.context.canvas.height = dialogCanvas.height;

        dialogCanvas.element.addEventListener('click', dialogCanvas.toggle);

        dialogCanvas.paint();
    },
    paint: function paint () {
        setTimeout(function () {
            dialogCanvas.toggle();
        }, 25);

        // Background image
        dialogCanvas.context.drawImage(images.handlers.dialogFrame, 0, 0, dialogCanvas.width, dialogCanvas.height);

        // Title
        dialogCanvas.context.font = Math.floor(dialogCanvas.fontSize * 1.5) + "px Palatino Linotype";
        dialogCanvas.context.fillStyle = "#000";
        dialogCanvas.context.fillText("Welcome!", dialogCanvas.leftOffset, dialogCanvas.topOffset);

        dialogCanvas.topOffset += dialogCanvas.fontSize * 2;

        // Paragraph
        var paragraph = "This game is an experiment where you will guide this little Character through adventures and obsticles. You play by using the keyboard arrows. Up. Down. Left. Right.";
        dialogCanvas.context.font = dialogCanvas.fontSize + "px Palatino Linotype";
        dialogCanvas.context.fillStyle = "#000";
        dialogCanvas.wrapText(paragraph, dialogCanvas.leftOffset, dialogCanvas.topOffset, Math.floor(dialogCanvas.width / 1.4), dialogCanvas.fontSize * 1.25);

        // Close button
        var buttonWidth = Math.floor(dialogCanvas.width / 6),
            buttonHeight = buttonWidth / 3,
            buttonX = Math.floor((dialogCanvas.width / 2) - (buttonWidth / 2)),
            buttonY = dialogCanvas.height - (buttonHeight * 2.5);

        dialogCanvas.context.drawImage(images.handlers.button, buttonX, buttonY, buttonWidth, buttonHeight);
        dialogCanvas.context.textAlign = "center";
        dialogCanvas.context.fillText("CLOSE", buttonX + (buttonWidth * 0.5), buttonY + (buttonHeight * 0.5));
    },
    wrapText: function wrapText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ',
                metrics = dialogCanvas.context.measureText(testLine),
                testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                dialogCanvas.context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }

        }

        dialogCanvas.context.fillText(line, x, y);
    },
    toggle: function toggle () {
        dialogCanvas.visible = !dialogCanvas.visible;

        if (dialogCanvas.visible) {
            dialogCanvas.element.classList.add('visible');
            controls.disableKeyPress = true;
        }
        else {
            dialogCanvas.element.classList.remove('visible');
            controls.disableKeyPress = false;
        }
    }
};