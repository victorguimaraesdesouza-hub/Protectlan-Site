(function () {
  "use strict";

  var doc = document;
  var body = doc.body;

  /* Current year --------------------------------------------------------- */
  doc.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* Sticky header -------------------------------------------------------- */
  var header = doc.querySelector("[data-header]");
  if (header) {
    var setStuck = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    setStuck();
    window.addEventListener("scroll", setStuck, { passive: true });
  }

  /* Mobile navigation ---------------------------------------------------- */
  var toggle = doc.querySelector("[data-menu-toggle]");
  var nav = doc.getElementById("nav");
  var main = doc.getElementById("main");
  var footer = doc.querySelector(".site-footer");
  var lastFocused = null;

  if (toggle && nav) {
    var navLinks = nav.querySelectorAll("a");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var isOpen = function () {
      return body.classList.contains("nav-open");
    };

    var openNav = function () {
      lastFocused = doc.activeElement;
      body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.querySelector(".sr-only").textContent = "Fechar menu";
      if (main) main.setAttribute("inert", "");
      if (footer) footer.setAttribute("inert", "");
      window.setTimeout(function () {
        if (navLinks.length) navLinks[0].focus({ preventScroll: true });
      }, reduced ? 0 : 120);
    };

    var closeNav = function (restoreFocus) {
      if (!isOpen()) return;
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".sr-only").textContent = "Abrir menu";
      if (main) main.removeAttribute("inert");
      if (footer) footer.removeAttribute("inert");
      if (restoreFocus && lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeNav(true);
      } else {
        openNav();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav(false);
      });
    });

    doc.addEventListener("keydown", function (event) {
      if (!isOpen()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeNav(true);
        return;
      }
      if (event.key !== "Tab") return;
      var focusable = nav.querySelectorAll("a, button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav(false);
    });

    var mq = window.matchMedia("(min-width: 821px)");
    if (mq.addEventListener) {
      mq.addEventListener("change", function (event) {
        if (event.matches) closeNav(false);
      });
    }
  }

  /* Reveal on scroll ----------------------------------------------------- */
  var revealNodes = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
  if (revealNodes.length) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach(function (node) {
        node.classList.add("is-in");
      });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealNodes.forEach(function (node) {
        revealObserver.observe(node);
      });
    }
  }

  /* Technical diagram ---------------------------------------------------- */
  var diagram = doc.querySelector("[data-diagram]");
  if (diagram) {
    var points = Array.prototype.slice.call(diagram.querySelectorAll("[data-point]"));
    var nodes = Array.prototype.slice.call(diagram.querySelectorAll("[data-node]"));
    var readoutCode = diagram.querySelector("[data-readout-code]");
    var readoutTitle = diagram.querySelector("[data-readout-title]");
    var readoutText = diagram.querySelector("[data-readout-text]");
    var readoutLink = diagram.querySelector("[data-readout-link]");

    var activate = function (id) {
      if (!id) return;
      var source = points.filter(function (button) {
        return button.getAttribute("data-point") === id;
      })[0];
      if (!source) return;

      nodes.forEach(function (node) {
        var on = node.getAttribute("data-node") === id;
        node.classList.toggle("is-active", on);
        node.classList.toggle("is-dim", !on);
      });

      points.forEach(function (button) {
        var on = button.getAttribute("data-point") === id;
        button.classList.toggle("is-active", on);
        if (button.classList.contains("callout")) {
          button.setAttribute("aria-pressed", on ? "true" : "false");
        }
      });

      if (readoutCode) readoutCode.textContent = source.getAttribute("data-code") || "";
      if (readoutTitle) readoutTitle.textContent = source.getAttribute("data-title") || "";
      if (readoutText) readoutText.textContent = source.getAttribute("data-text") || "";
      if (readoutLink) {
        readoutLink.textContent = source.getAttribute("data-link-label") || "Ver ficha";
        readoutLink.setAttribute("href", source.getAttribute("data-href") || "servicos.html");
      }
    };

    points.forEach(function (button) {
      button.addEventListener("click", function () {
        activate(button.getAttribute("data-point"));
      });
      if (button.classList.contains("callout")) {
        button.addEventListener("focus", function () {
          activate(button.getAttribute("data-point"));
        });
      }
    });

    activate("remoto");
  }

  /* Handle images that fail to load -------------------------------------- */
  doc.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      img.hidden = true;
      var fallback = img.parentElement && img.parentElement.querySelector("[data-fallback-target]");
      if (fallback) fallback.hidden = false;
    });
  });
})();
