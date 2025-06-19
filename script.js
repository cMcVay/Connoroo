/* Connoroo YouTube controller — v2  */
let player;
let playlist = window.playlist || [];
let currentIndex = 0;

/* YT API callback -------------------------------------------------------- */
function onYouTubeIframeAPIReady() {
  if (!document.getElementById("player") || !playlist.length) return;
  loadVideo(currentIndex, /*autoplay=*/false);
}

/* Core loader ------------------------------------------------------------ */
function loadVideo(i, autoplay = true) {
  if (!playlist.length) return;
  const v = playlist[i];
  const opts = {
    videoId: v.id,
    startSeconds: v.start,
    endSeconds: v.end,
  };

  if (player) {
    player.loadVideoById(opts);
    if (autoplay) player.playVideo();
  } else {
    player = new YT.Player("player", {
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: (e) => { e.target.loadVideoById(opts); if (autoplay) e.target.playVideo(); },
        onStateChange: handleState,
        onError: (e) => console.error("YouTube error", e.data, "for index", currentIndex),
      },
    });
  }
}

/* Auto-advance when a clip finishes ------------------------------------- */
function handleState(ev) {
  if (ev.data === YT.PlayerState.ENDED) nextVideo();
}

/* UI-exposed controls ---------------------------------------------------- */
function startPlaylist()   { currentIndex = 0; loadVideo(currentIndex);       }
function resetPlaylist()   { if (player) player.stopVideo(); currentIndex = 0;}
function nextVideo()       { currentIndex = (currentIndex + 1) % playlist.length; loadVideo(currentIndex); }
function prevVideo()       { currentIndex = (currentIndex - 1 + playlist.length) % playlist.length; loadVideo(currentIndex); }
function pauseVideo()      { if (player) player.pauseVideo(); }
function resumeVideo()     { if (player) player.playVideo();  }   // NEW
function expandFullscreen(){ document.getElementById("player")?.requestFullscreen?.(); }
