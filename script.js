/* =========================================================
   Ask Dr. Lisa — HCP Portal
   Load sequence:
     1. Logo GIF loader shows for LOADER_MS (10s).
     2. HCP disclaimer gate — user must confirm they are an HCP.
     3. Intro Vimeo video modal with a "Play with sound" overlay
        (click plays WITH audio; auto-sound is blocked by browsers).
   FAQ rows open the same video modal and play on click.
   Closing any video modal clears the iframe so playback STOPS.
   ========================================================= */
(function () {
  'use strict';

  /* -------------------------- CONFIG -------------------------- */
  var LOADER_MS = 5000; // loader duration in ms
  var INTRO_VIMEO_ID = '76979871'; // intro/welcome video id
  var INTRO_TITLE = 'Welcome';
  var AUTOPLAY_INTRO = true; // show intro video after the gate
  /* ------------------------------------------------------------ */

  var loaderEl = document.getElementById('loader');
  var hcpEl = document.getElementById('hcpModal');
  var confirmBtn = document.getElementById('hcpConfirmBtn');
  var modalEl = document.getElementById('videoModal');
  var iframe = document.getElementById('vimeoFrame');
  var labelEl = document.getElementById('videoModalLabel');
  var overlay = document.getElementById('introPlayBtn');

  function buildVimeoUrl(id) {
    var params = [
      'autoplay=1',
      'title=0',
      'byline=0',
      'portrait=0',
      'dnt=1',
    ].join('&');
    return (
      'https://player.vimeo.com/video/' + encodeURIComponent(id) + '?' + params
    );
  }

  function hideOverlay() {
    if (overlay) overlay.hidden = true;
  }

  /* ---------------- Video modal wiring ---------------- */
  if (modalEl && iframe) {
    // FAQ clicks: real user gesture -> audio allowed immediately.
    modalEl.addEventListener('show.bs.modal', function (event) {
      var trigger = event.relatedTarget;
      if (!trigger) return; // programmatic (intro) is handled via overlay
      hideOverlay();
      var videoId = trigger.getAttribute('data-vimeo-id');
      var title = trigger.getAttribute('data-faq-title');
      if (title && labelEl) labelEl.textContent = title;
      if (videoId) iframe.src = buildVimeoUrl(videoId);
    });

    modalEl.addEventListener('hidden.bs.modal', function () {
      iframe.src = '';
      hideOverlay();
      if (labelEl) labelEl.textContent = 'Video';
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        if (!INTRO_VIMEO_ID) return;
        iframe.src = buildVimeoUrl(INTRO_VIMEO_ID);
        hideOverlay();
      });
    }
  }

  function showIntroVideo() {
    if (!AUTOPLAY_INTRO || !INTRO_VIMEO_ID || !modalEl || !overlay) return;
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) return;
    if (labelEl) labelEl.textContent = INTRO_TITLE;
    iframe.src = ''; // wait for the user click
    overlay.hidden = false; // "Play with sound" prompt
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  /* ---------------- HCP gate ---------------- */
  function showHcpGate() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal || !hcpEl) {
      showIntroVideo(); // graceful fallback
      return;
    }
    var gate = bootstrap.Modal.getOrCreateInstance(hcpEl);
    // After the gate is dismissed via confirm, launch the intro video.
    hcpEl.addEventListener('hidden.bs.modal', function onHidden() {
      hcpEl.removeEventListener('hidden.bs.modal', onHidden);
      showIntroVideo();
    });
    gate.show();
  }

  if (confirmBtn && hcpEl) {
    confirmBtn.addEventListener('click', function () {
      bootstrap.Modal.getOrCreateInstance(hcpEl).hide();
    });
  }

  /* ---------------- Loader -> gate ---------------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loaderEl) {
        loaderEl.classList.add('is-hidden');
        setTimeout(showHcpGate, 500); // wait for fade-out
      } else {
        showHcpGate();
      }
    }, LOADER_MS);
  });
})();
