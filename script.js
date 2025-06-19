/* Connoroo YouTube controller */
let player;
let playlist = window.playlist || [];
let currentIndex = 0;

/* Called automatically by the IFrame API */
function onYouTubeIframeAPIReady() {
  if (!document.getElementById("player")) {
    console.warn("YT API ready but #player element missing.");
    return;
  }
  if (!playlist.length) {
    console.warn("YT API ready but playlist is empty.");
    return;
  }
  loadVideo(currentIndex, /*autoplay=*/false);
}

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
        onReady: (e) => {
          e.target.loadVideoById(opts);
          if (autoplay) e.target.playVideo();
        },
        onError: (e) =>
          console.error("YouTube error", e.data, "for index", currentIndex),
      },
    });
  }
}

/* ----- exposed controls ----- */
function startPlaylist()   { currentIndex = 0; loadVideo(currentIndex); }
function resetPlaylist()   { if (player) player.stopVideo(); currentIndex = 0; }
function nextVideo()       { currentIndex = (currentIndex + 1) % playlist.length; loadVideo(currentIndex); }
function prevVideo()       { currentIndex = (currentIndex - 1 + playlist.length) % playlist.length; loadVideo(currentIndex); }
function pauseVideo()      { if (player) player.pauseVideo(); }
function expandFullscreen(){ const i = document.getElementById("player"); i?.requestFullscreen?.(); }
