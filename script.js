
/*  Generic YouTube IFrame API controller.
    Each BAND page should set a global `window.playlist` like:
    window.playlist = [
        {id: 'VIDEO_ID', start: 0, end: 30},
        ...
    ];
*/
let player;
let playlist = window.playlist || [];
let currentIndex = 0;

// YouTube API callback
function onYouTubeIframeAPIReady() {
    const playerEl = document.getElementById('player');
    if (!playerEl || !playlist.length) return;
    loadVideo(currentIndex);
}

function loadVideo(i) {
    if (!playlist.length) return;
    const v = playlist[i];
    if (player) {
        player.loadVideoById({videoId: v.id, startSeconds: v.start, endSeconds: v.end});
    } else {
        player = new YT.Player('player', {
            videoId: v.id,
            playerVars: {start: v.start, end: v.end, rel: 0},
        });
    }
}

function startPlaylist() {
    currentIndex = 0;
    loadVideo(currentIndex);
}

function resetPlaylist() {
    if (player) player.stopVideo();
    currentIndex = 0;
}

function nextVideo() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadVideo(currentIndex);
}

function prevVideo() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadVideo(currentIndex);
}

function pauseVideo() {
    if (player) player.pauseVideo();
}

function expandFullscreen() {
    const iframe = document.getElementById('player');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    }
}

// Exit fullscreen on ESC handled by browser
