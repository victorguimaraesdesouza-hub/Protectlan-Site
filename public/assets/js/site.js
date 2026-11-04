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

  var motionOK = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* Headline words ------------------------------------------------------- */
  if (motionOK) {
    doc.querySelectorAll("h1").forEach(function (h1) {
      var i = 0;
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var parts = child.textContent.split(/(\s+)/);
            var frag = doc.createDocumentFragment();
            parts.forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(doc.createTextNode(part));
              } else {
                var span = doc.createElement("span");
                span.className = "w";
                span.style.setProperty("--i", i++);
                span.textContent = part;
                frag.appendChild(span);
              }
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && child.tagName !== "BR") {
            walk(child);
          }
        });
      };
      h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
      walk(h1);
      Array.prototype.forEach.call(h1.querySelectorAll(".w"), function (w) {
        w.setAttribute("aria-hidden", "true");
      });
      h1.classList.add("h1-anim");
    });
  }

  /* Staggered groups ----------------------------------------------------- */
  var staggerSelector = ".index-list, .solution-grid, .steps, .values, .faq, .client-channels, .plan-split, .product-wall";
  doc.querySelectorAll(staggerSelector).forEach(function (group) {
    if (!group.hasAttribute("data-reveal")) return;
    group.classList.add("reveal-stagger");
    Array.prototype.forEach.call(group.children, function (child, index) {
      child.style.setProperty("--i", Math.min(index, 10));
    });
  });

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
            var target = entry.target;
            target.classList.add("is-in");
            revealObserver.unobserve(target);
            if (target.classList.contains("reveal-stagger")) {
              setTimeout(function () { target.classList.remove("reveal-stagger"); }, 1800);
            }
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
    var links = Array.prototype.slice.call(diagram.querySelectorAll("[data-link]"));
    var progress = diagram.querySelector(".plate-progress");
    var order = ["remoto", "servidores", "backup", "seguranca", "cabeamento"];
    var current = null;
    var TOUR_MS = 4800;
    var tourTimer = null;
    var tourStopped = false;
    var hovering = false;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      var readout = diagram.querySelector(".plate-readout");
      if (readout && current !== id) {
        readout.classList.remove("is-fresh");
        void readout.offsetWidth;
        readout.classList.add("is-fresh");
      }
      current = id;

      links.forEach(function (el) {
        var key = el.getAttribute("data-link");
        el.classList.toggle("is-hot", id === "servidores" || key === id);
      });

      if (readoutCode) readoutCode.textContent = source.getAttribute("data-code") || "";
      if (readoutTitle) readoutTitle.textContent = source.getAttribute("data-title") || "";
      if (readoutText) readoutText.textContent = source.getAttribute("data-text") || "";
      if (readoutLink) {
        readoutLink.textContent = source.getAttribute("data-link-label") || "Ver ficha";
        readoutLink.setAttribute("href", source.getAttribute("data-href") || "servicos.html");
      }
    };

    var restartProgress = function () {
      if (!progress) return;
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      if (!tourStopped) progress.classList.add("is-running");
    };

    var scheduleNext = function () {
      clearTimeout(tourTimer);
      if (tourStopped || reduceMotion) return;
      restartProgress();
      tourTimer = setTimeout(function tick() {
        if (hovering) {
          tourTimer = setTimeout(tick, 400);
          return;
        }
        var next = order[(order.indexOf(current) + 1) % order.length];
        activate(next);
        scheduleNext();
      }, TOUR_MS);
    };

    var stopTour = function () {
      tourStopped = true;
      clearTimeout(tourTimer);
      if (progress) progress.classList.remove("is-running");
    };

    if (progress) progress.style.setProperty("--tour-ms", TOUR_MS + "ms");

    diagram.addEventListener("mouseenter", function () { hovering = true; });
    diagram.addEventListener("mouseleave", function () { hovering = false; });

    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        stopTour();
        activate(node.getAttribute("data-node"));
      });
    });

    points.forEach(function (button) {
      button.addEventListener("click", function () {
        stopTour();
        activate(button.getAttribute("data-point"));
      });
      if (button.classList.contains("callout")) {
        button.addEventListener("focus", function () {
          stopTour();
          activate(button.getAttribute("data-point"));
        });
      }
    });

    activate("remoto");

    if (!reduceMotion && "IntersectionObserver" in window) {
      var tourObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!tourStopped && !tourTimer) scheduleNext();
          } else {
            clearTimeout(tourTimer);
            tourTimer = null;
            if (progress) progress.classList.remove("is-running");
          }
        });
      }, { threshold: 0.35 });
      tourObserver.observe(diagram);
    }
  }

  /* Scroll progress ------------------------------------------------------ */
  if (header && motionOK) {
    var bar = doc.createElement("span");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    header.appendChild(bar);
    var ticking = false;
    var updateBar = function () {
      ticking = false;
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateBar); }
    }, { passive: true });
    window.addEventListener("resize", updateBar);
    updateBar();
  }

  /* Count-up figures ----------------------------------------------------- */
  var countNodes = Array.prototype.slice.call(doc.querySelectorAll("dd, b, strong")).filter(function (el) {
    return !el.children.length && /^\d{1,3}\s?(h|horas)$/.test(el.textContent.trim());
  });
  if (motionOK && countNodes.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target;
        var match = el.textContent.trim().match(/^(\d+)(\s?.*)$/);
        var target = parseInt(match[1], 10);
        var suffix = match[2];
        var start = null;
        var duration = 1100;
        var step = function (now) {
          if (start === null) start = now;
          var t = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) window.requestAnimationFrame(step);
        };
        el.textContent = "0" + suffix;
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    countNodes.forEach(function (el) {
      el.setAttribute("aria-label", el.textContent.trim());
      countObserver.observe(el);
    });
  }

  /* Protocol number shuffles before settling ----------------------------- */
  var stubDigits = doc.querySelector(".stub-code span");
  if (motionOK && stubDigits && "IntersectionObserver" in window) {
    var finalDigits = stubDigits.textContent;
    var stubObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      stubObserver.disconnect();
      var frames = 0;
      var timer = setInterval(function () {
        frames++;
        if (frames > 16) {
          clearInterval(timer);
          stubDigits.textContent = finalDigits;
          return;
        }
        stubDigits.textContent = finalDigits.split("").map(function (d, idx) {
          return frames > 6 + idx * 3 ? d : String(Math.floor(Math.random() * 10));
        }).join("");
      }, 55);
    }, { threshold: 0.6 });
    stubObserver.observe(stubDigits);
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
