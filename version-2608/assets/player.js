(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector("[data-play]");
      var stream = box.getAttribute("data-stream");
      var initialized = false;
      var hlsInstance = null;

      if (!video || !button || !stream) {
        return;
      }

      function bindStream() {
        if (initialized) {
          return;
        }
        initialized = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function playVideo() {
        bindStream();
        button.classList.add("is-hidden");
        video.setAttribute("controls", "controls");
        var playback = video.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      }

      button.addEventListener("click", playVideo);
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("ended", function () {
        button.classList.remove("is-hidden");
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
