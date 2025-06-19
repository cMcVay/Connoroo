/* Connoroo YouTube controller — v3  */
let player;
let playlist  = window.playlist || [];
let current   = 0;
let started   = false;          // blocks autoplay until user clicks Start

/* YT API bootstrap ------------------------------------------------------ */
function onYouTubeIframeAPIReady() {
  if (!document.getElementById("player") || !playlist.length) return;
  loadClip(current, /*autoplay=*/false);   // waits for Start button
}

/* Core loader ----------------------------------------------------------- */
function loadClip(index, autoplay = true) {
  const clip = playlist[index];
  if (!clip) return;

  const opts = {
    videoId:      clip.id,
    startSeconds: clip.start,
    endSeconds:   clip.end,
  };

  if (player) {
    player.loadVideoById(opts);             // auto-plays by default
    if (!autoplay) player.pauseVideo();     // honour initial “click to start”
  } else {
    player = new YT.Player("player", {
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady:   e => { loadClip(index, autoplay); },
        onStateChange: handleState,
        onError:  e => console.error("YouTube error", e.data, "for clip", index),
      },
    });
  }
}

/* Detect clip end (ENDED **or** PAUSED-at-end) -------------------------- */
function handleState(ev) {
  const END   = YT.PlayerState.ENDED;
  const PAUSE = YT.PlayerState.PAUSED;

  if (ev.data === END)      { next(); return; }

  if (ev.data === PAUSE) {
    // Some browsers emit PAUSED at endSeconds instead of ENDED
    const clip = playlist[current];
    const t    = player.getCurrentTime();
    if (Math.abs(t - clip.end) < 0.5) next();
  }
}

/* Transport controls ---------------------------------------------------- */
function start()   { if (!started) { started = true; loadClip(current); } }
function reset()   { current = 0; started = false; player.stopVideo(); }
function next()    { current = (current + 1) % playlist.length; loadClip(current); }
function prev()    { current = (current - 1 + playlist.length) % playlist.length; loadClip(current); }
function pause()   { player?.pauseVideo(); }
function resume()  { player?.playVideo(); }
function full()    { document.getElementById("player")?.requestFullscreen?.(); }
