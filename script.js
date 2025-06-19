/* Connoroo YouTube controller — resilient v4 --------------------------- */
let player;
let playlist   = window.playlist || [];
let current    = 0;
let started    = false;
let watchdogID = null;

/* YT boot --------------------------------------------------------------- */
function onYouTubeIframeAPIReady() {
  if (!document.getElementById("player") || !playlist.length) return;
  cueClip(current);                 // cue but don’t autoplay until Start
}

/* Cue or load a clip ---------------------------------------------------- */
function cueClip(index, autoplay = true) {
  const clip = playlist[index];
  if (!clip) return;

  // Set up watchdog before (re)loading
  clearInterval(watchdogID);
  watchdogID = setInterval(() => checkEndGuard(clip.end), 250);

  const opts = {
    videoId:      clip.id,
    startSeconds: clip.start,
    endSeconds:   clip.end,
  };

  if (player) {
    player.loadVideoById(opts);     // will auto-play unless we pause below
    if (!autoplay) player.pauseVideo();
  } else {
    player = new YT.Player("player", {
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady:   () => { if (!started) player.pauseVideo(); },
        onStateChange: handleState,
        onError:  e => console.error("YT error", e.data, "clip", index),
      },
    });
  }
}

/* Manual guard for “locked” videos ------------------------------------- */
function checkEndGuard(end) {
  if (!player || player.getPlayerState() !== YT.PlayerState.PLAYING) return;
  if (player.getCurrentTime() >= end - 0.3) next();
}

/* Normal state handler (fast path) ------------------------------------- */
function handleState(ev) {
  if (ev.data === YT.PlayerState.ENDED) next();
}

/* Controls ------------------------------------------------------------- */
function start()   { if (!started) { started = true; cueClip(current); } }
function reset()   { player?.stopVideo(); current = 0; started = false; }
function next()    { current = (current + 1) % playlist.length; cueClip(current); }
function prev()    { current = (current - 1 + playlist.length) % playlist.length; cueClip(current); }
function pause()   { player?.pauseVideo(); }
function resume()  { player?.playVideo();  }
function full()    { document.getElementById("player")?.requestFullscreen?.(); }

