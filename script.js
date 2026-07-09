/* =========================================================
   Ask Dr. Lisa — HCP Portal
   Vimeo modal handling:
   - On page load: auto-open the modal showing a "Play with sound"
     overlay. Clicking it plays the intro Vimeo video WITH audio
     (allowed because the click is a user gesture).
   - On FAQ click: build the embed URL from the clicked button's
     data-vimeo-id and load it into the iframe with autoplay + sound.
   - On close: clear the iframe src so the video STOPS and no
     audio keeps playing in the background.
   ========================================================= */
(function () {
  "use strict";

  /* ---- CONFIG: change this to your intro/welcome video ID ---- */
  var INTRO_VIMEO_ID = "76979871"; // <-- edit me
  var INTRO_TITLE = "Welcome";
  var AUTOPLAY_INTRO = true;       // set false to disable auto-open on load
  /* ------------------------------------------------------------ */

  var modalEl = document.getElementById("videoModal");
  var iframe = document.getElementById("vimeoFrame");
  var labelEl = document.getElementById("videoModalLabel");
  var overlay = document.getElementById("introPlayBtn");

  if (!modalEl || !iframe) return;

  // Build a Vimeo player URL (unmuted autoplay by default).
  function buildVimeoUrl(id) {
    var params = [
      "autoplay=1",
      "title=0",
      "byline=0",
      "portrait=0",
      "dnt=1" // do-not-track
    ].join("&");
    return "https://player.vimeo.com/video/" + encodeURIComponent(id) + "?" + params;
  }

  function hideOverlay() {
    if (overlay) overlay.hidden = true;
  }

  // FAQ clicks: a real user gesture, so audio is allowed immediately.
  modalEl.addEventListener("show.bs.modal", function (event) {
    var trigger = event.relatedTarget;
    if (!trigger) return; // programmatic show (intro) is handled separately

    hideOverlay();
    var videoId = trigger.getAttribute("data-vimeo-id");
    var title = trigger.getAttribute("data-faq-title");

    if (title && labelEl) labelEl.textContent = title;
    if (videoId) iframe.src = buildVimeoUrl(videoId);
  });

  // Stop playback and reset when the modal closes.
  modalEl.addEventListener("hidden.bs.modal", function () {
    iframe.src = "";
    hideOverlay();
    if (labelEl) labelEl.textContent = "Video";
  });

  // Overlay click = user gesture -> intro plays WITH sound.
  if (overlay) {
    overlay.addEventListener("click", function () {
      if (!INTRO_VIMEO_ID) return;
      iframe.src = buildVimeoUrl(INTRO_VIMEO_ID);
      hideOverlay();
    });
  }

  // --------- Auto-open the intro modal once on page load ---------
  window.addEventListener("DOMContentLoaded", function () {
    if (!AUTOPLAY_INTRO || !INTRO_VIMEO_ID || !overlay) return;
    if (typeof bootstrap === "undefined" || !bootstrap.Modal) return;

    if (labelEl) labelEl.textContent = INTRO_TITLE;
    iframe.src = "";        // don't load until the user clicks
    overlay.hidden = false; // show the "Play with sound" prompt

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });
})();
