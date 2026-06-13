(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("img[data-cover]").forEach(function (image) {
      image.addEventListener("error", function () {
        image.style.display = "none";
      });
    });

    document.querySelectorAll("form[action='search.html']").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "search.html";
        }
      });
    });

    setupHero();
    setupFiltering();
  });

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }

    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFiltering() {
    var panels = document.querySelectorAll("[data-filter-panel]");
    panels.forEach(function (panel) {
      var container = panel.parentElement;
      var input = panel.querySelector("[data-page-search]");
      var list = container ? container.querySelector("[data-card-list]") : null;
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];
      var chips = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
      var activeFilter = "全部";

      if (!cards.length) {
        return;
      }

      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query && input) {
        input.value = query;
      }

      function textFor(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.textContent
        ].join(" ").toLowerCase();
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var filter = activeFilter.toLowerCase();
        cards.forEach(function (card) {
          var haystack = textFor(card);
          var byKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var byFilter = activeFilter === "全部" || haystack.indexOf(filter) !== -1;
          card.classList.toggle("is-hidden-card", !(byKeyword && byFilter));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeFilter = chip.getAttribute("data-filter") || "全部";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          apply();
        });
      });

      if (chips.length) {
        chips[0].classList.add("is-active");
      }

      apply();
    });
  }
})();
