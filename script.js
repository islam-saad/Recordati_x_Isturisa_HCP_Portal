/* =========================================================
   Ask Dr. Lisa — HCP Portal
   Vimeo modal handling:
   - On open: build the embed URL from the clicked button's
     data-vimeo-id and load it into the iframe with autoplay.
   - On close: clear the iframe src so the video STOPS and no
     audio keeps playing in the background.
   ========================================================= */
(function () {
  "use strict";

  var modalEl = document.getElementById("videoModal");
  var iframe = document.getElementById("vimeoFrame");
  var labelEl = document.getElementById("videoModalLabel");

  if (!modalEl || !iframe) return;

  // Build a Vimeo player URL with sensible params.
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

  // Bootstrap fires this just before the modal is shown.
  modalEl.addEventListener("show.bs.modal", function (event) {
    var trigger = event.relatedTarget;
    if (!trigger) return;

    var videoId = trigger.getAttribute("data-vimeo-id");
    var title = trigger.getAttribute("data-faq-title");

    if (title && labelEl) {
      labelEl.textContent = title;
    }
    if (videoId) {
      iframe.src = buildVimeoUrl(videoId);
    }
  });

  // Stop playback and release the iframe when the modal closes.
  modalEl.addEventListener("hidden.bs.modal", function () {
    iframe.src = "";
    if (labelEl) labelEl.textContent = "Video";
  });
})();
