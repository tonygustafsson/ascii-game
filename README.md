# Dungeons of Darrak

## What?

This is a demo game using HTML5 canvas.
The maps is created by ASCII files which is kind of cool.

## When?

I don't know if this game ever will be released.

## Where?

Works on desktops for now... works "sort of" on mobiles.

## Tech stuff

The game is using multiple "layers" of canvas elements stacking on top
of each other. Using this technique we don't have to rerender all elements all
the time. When moving the character for example, we don't have to update the background.

### audio.js

Starts audio track - using three MP3s at the moment - looping forever.

### charactersCanvas.js

Controls the character canvas. At the moment this only means main the game character.
Also checks where the character can go.

### controls.js

Make the character move when pressing keyboard, touching the edges with a phone or using SPACE
to use the sword.

### dialogCanvas.js

Controls the dialogs - the the moment it just for the start guide.

### images.js

Preloads the images and waits with the rest of the game until all images are loaded.

### init.js

Initalizes the game. Duh.

### map.js

Reads ASCII files and creates map blocks of them, keeps track of which blocks can be walked
through and not.

### mapCanvas.js

Paints the map, all blocks, all textures.

### swordCanvas.js

A separate canvas layer for the sword... kind of a temporary solution I think.

## TODO

-   Audio playback should get triggered by a click so that mobile users can get "autoplay".
-   On mobiles the sword is not in the right position from the character.
-   On some mobile phones the game doesn't quit fit the window.
-   Remember state between visits with IndexedDB or something.
-   More maps.
-   Enemies and the ability to kill them.
-   Talk to characters, get more dialogs.

## Screenshot

![Dungeons of Darrak](dungeons-of-darrak.png 'Dungeons of Darrak')

## Demo

[Try it out](http://www.tonyg.se/projects/game/)
