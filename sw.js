const CACHE_NAME = 'bss-remake-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './GLSLShaders.js',
    './MathHelper.js',
    './dialogue.js',
    './mapMesh.js',
    './playerGear.js',
    './textures.js',
    './thumbnail.js',
    './icon-image.png',
    './src/database.js',
    './src/game.js',
    './src/main.js',
    './src/icons.js',
    './src/audio.js',
    './resources/gl-matrix-min.js',
    './resources/cannon.min.js',
    './resources/canvg.min.js',
    './audio/music_bombToken.js',
    './audio/music_popStar.js',
    './audio/music_infernoToken.js',
    './audio/music_babyLove.js',
    './audio/music_rageToken.js',
    './audio/music_surpriseParty.js',
    './audio/music_scorchingStar.js',
    './audio/music_focusToken.js',
    './audio/music_flameFuelToken.js',
    './audio/music_markToken.js',
    './audio/music_haste.js',
    './audio/music_inspireToken.js',
    './audio/music_gummyStar.js',
    './audio/music_inflateBalloons.js',
    './audio/music_boostToken.js',
    './audio/music_frog.js',
    './audio/music_melodyToken.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
