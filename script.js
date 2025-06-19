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
  // YouTube state constants for readability
  const UNSTARTED = -1,
        ENDED     =  0,
        PLAYING   =  1,
        PAUSED    =  2,
        BUFFERING =  3;

  // Current clip metadata & clock
  const clip      = playlist[current];
  const now       = player.getCurrentTime().toFixed(2);

  console.log(
    `[YT] state=${ev.data}  time=${now}s  clipEnd=${clip.end}s  clipIndex=${current}`
  );

  /* -- auto-advance ---------------------------------------------------- */
  if (ev.data === ENDED) {                // whole video finished
    next();
    return;
  }

  if (ev.data === PAUSED) {               // paused – is it because we hit endSeconds?
    if (Math.abs(now - clip.end) < 0.6) { // within ±0.6 s of declared stop
      next();
    }
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
