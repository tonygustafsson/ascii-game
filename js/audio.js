"use strict";

var audio = {
    element:  document.getElementById('audio'),
    init: function init () {
        audio.element.addEventListener('canplay', audio.play);
        audio.element.addEventListener('ended', audio.next);

        audio.element.src = audio.tracks[0];
        audio.element.load();
    },
    play: function play () {
        audio.element.volume = 0.5;
        audio.element.play();
    },
    next: function nextTrack () {
        var nextAudioIndex = ++audio.currentTrack;

        if (nextAudioIndex > audio.tracks.length - 1) {
            nextAudioIndex = 0;
            audio.currentTrack = 0;
        }

        audio.element.src = audio.tracks[nextAudioIndex];
        audio.element.load();
    },
    currentTrack: 0,
    tracks: [
        'mp3/audio1.mp3',
        'mp3/audio2.mp3',
        'mp3/audio3.mp3'        
    ]
};