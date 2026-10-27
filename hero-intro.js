/* ===== Hero intro: image -> video -> image -> video ... (index.html only) ===== */
(function () {
  var hero  = document.querySelector('.hero');
  var video = hero && hero.querySelector('.back-video');
  var image = hero && hero.querySelector('.back-image');
  if (!video || !image) return; // other pages: do nothing

  // People who prefer reduced motion just keep the still image
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var IMAGE_TIME = 5000;           // ms the image stays up before each fade to video
  var imageShownAt = Date.now();
  var waitingForVideo = true;

  function restartZoom() {
    image.style.animation = 'none';
    void image.offsetWidth;        // forces the browser to reset the animation
    image.style.animation = '';
  }

  function fadeToVideo() {
    var wait = Math.max(0, IMAGE_TIME - (Date.now() - imageShownAt));
    setTimeout(function () { hero.classList.add('video-ready'); }, wait);
  }

  // Video actually started playing -> fade to it (after the image has had its time)
  video.addEventListener('playing', function () {
    if (!waitingForVideo) return;  // ignore "playing" events after a buffering pause
    waitingForVideo = false;
    fadeToVideo();
  });
  if (!video.paused && video.readyState >= 3) {
    waitingForVideo = false;
    fadeToVideo();
  }

  // Video finished -> fade back to the image, then replay the video
  video.addEventListener('ended', function () {
    restartZoom();
    imageShownAt = Date.now();
    hero.classList.remove('video-ready');

    setTimeout(function () {
      waitingForVideo = true;
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* if blocked, the image just stays */ });
    }, IMAGE_TIME);
  });
})();