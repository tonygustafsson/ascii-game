"use strict";

var dialogCanvas = {
    element: document.getElementById('dialog-canvas'),
    context: document.getElementById('dialog-canvas').getContext("2d"),
    width: Math.floor(window.innerWidth * 0.95),
    height: Math.floor(window.innerHeight * 0.8),
    visible: false,
    init: function initCanvas () {
        /* Initialize the canvas, set the width and height */
        dialogCanvas.element.style.left = Math.floor(mapCanvas.width / 4) + "px";
        dialogCanvas.element.style.top = Math.floor(mapCanvas.height / 4) + "px";
        dialogCanvas.width = Math.floor(mapCanvas.width / 2);
        dialogCanvas.height = Math.floor(mapCanvas.height / 2);

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
        dialogCanvas.context.font = "36px Palatino Linotype";
        dialogCanvas.context.fillStyle = "#000";
        dialogCanvas.context.fillText("Welcome!", 150, 125);

        // Paragraph
        var paragraph = "This game is an experiment where you will guide this little Character through adventures and obsticles. You play by using the keyboard arrows. Up. Down. Left. Right.";
        dialogCanvas.context.font = "24px Palatino Linotype";
        dialogCanvas.context.fillStyle = "#000";
        dialogCanvas.wrapText(paragraph, 150, 200, Math.floor(dialogCanvas.width - 300), 30);
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
            dialogCanvas.element.style.opacity = 1;
        }
        else {
            dialogCanvas.element.style.opacity = 0;
        }
    }
};