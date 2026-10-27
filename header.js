/* header.js
   Hides the navbar while scrolling and brings it back when scrolling stops,
   when the cursor moves near the top of the window, or on keyboard focus. */
(function () {
  var nav = document.querySelector('.navbar');
  if (!nav) return;

  var STOP_DELAY = 150;  // ms after scrolling stops before the header returns
  var HOT_ZONE   = 90;   // px from the top of the window where the cursor reveals it
  var TOP_OFFSET = 5;    // header always shows when the page is this close to the top

  var lastY = window.scrollY;
  var timer = null;
  var cursorInZone = false;

  function show() { nav.classList.remove('nav-hidden'); }
  function hide() { nav.classList.add('nav-hidden'); }

  // Keep scroll-padding in sync with the real header height
  function setNavHeight() {
    document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
  }
  setNavHeight();
  window.addEventListener('load', setNavHeight);
  window.addEventListener('resize', setNavHeight);

  // Scrolling: hide, then show again shortly after it stops
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    lastY = y;
    clearTimeout(timer);

    if (y <= TOP_OFFSET || cursorInZone) {
      show();
      return;
    }
    hide();
    timer = setTimeout(show, STOP_DELAY);
  }, { passive: true });

  // Cursor wiggle near the top reveals the header, even mid-scroll
  document.addEventListener('mousemove', function (e) {
    // Ignore the fake mouse events browsers fire when content scrolls under a still cursor
    if (e.movementX === 0 && e.movementY === 0) return;
    cursorInZone = e.clientY <= HOT_ZONE;
    if (cursorInZone) show();
  });

  document.documentElement.addEventListener('mouseleave', function () {
    cursorInZone = false;
  });

  // Keyboard users tabbing into the nav should always see it
  nav.addEventListener('focusin', show);
})();
