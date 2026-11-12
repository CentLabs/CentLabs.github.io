/* ==========================================================================
   NEXUS — additive behaviour layer.
   Loaded after the recovered vendor scripts. Never replaces original handlers:
   search.js, xenon-custom.js and the inline smooth-scroll handlers stay active.
   ========================================================================== */
(function () {
  "use strict";

  var THEME_KEY = "nexus-theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-nexus-theme") || "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-nexus-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080d1a" : "#f4f6fb");
    document.querySelectorAll("[data-nx-theme-toggle]").forEach(function (btn) {
      btn.textContent = theme === "dark" ? "\u2600" : "\u25D0";
      btn.setAttribute("aria-label", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
      btn.setAttribute("title", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
    });
  }

  function initTheme() {
    document.querySelectorAll("[data-nx-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
    applyTheme(currentTheme());
  }

  function jumpTo(hash) {
    var id = decodeURIComponent(hash.replace(/^#/, ""));
    var target = document.getElementById(id);
    if (!target) return false;
    var box = target.tagName === "I" ? target.closest("h4") || target : target;
    if (box.scrollIntoView) box.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo(0, box.offsetTop - 24);
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* file:// */ }
    return true;
  }

  function initJumpLinks() {
    document.addEventListener("click", function (ev) {
      var link = ev.target.closest ? ev.target.closest("a.nx-jump") : null;
      if (!link) return;
      var hash = link.getAttribute("href") || "";
      if (hash.charAt(0) !== "#") return;
      if (jumpTo(hash)) ev.preventDefault();
    });
    document.querySelectorAll(".nx-chips a").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".nx-chips a").forEach(function (c) { c.classList.remove("nx-active"); });
        chip.classList.add("nx-active");
      });
    });
  }

  /* Original sidebar drawer button (mobile) — reuse the vendor handler. */
  function initMobileMenu() {
    var btn = document.getElementById("nx-menu-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (window.jQuery) {
        window.jQuery(function ($) {
          $('[data-toggle="mobile-menu"]').first().trigger("click");
        });
      }
      var menu = document.getElementById("main-menu");
      if (menu) menu.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function normalise(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function initFilter() {
    var input = document.getElementById("nx-filter-input");
    var clear = document.getElementById("nx-filter-clear");
    var status = document.getElementById("nx-filter-status");
    if (!input) return;

    var heads = Array.prototype.slice.call(document.querySelectorAll(".main-content > h4.text-gray"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".main-content .xe-widget.xe-conversations"));
    var total = cards.length;

    var statLinks = document.getElementById("nx-count");
    var statCats = document.getElementById("nx-cats");
    if (statLinks) statLinks.textContent = total;
    if (statCats) statCats.textContent = heads.length;

    /* Group each heading with the sibling rows that belong to it. */
    var sections = heads.map(function (head) {
      var nodes = [];
      var node = head.nextElementSibling;
      while (node && !(node.tagName === "H4" && node.classList.contains("text-gray"))) {
        nodes.push(node);
        node = node.nextElementSibling;
      }
      return { head: head, nodes: nodes };
    });

    var index = cards.map(function (card) {
      var wrapper = card.closest('[class*="col-"]') || card;
      var anchor = card.querySelector(".xe-user-name");
      var desc = card.querySelector(".overflowClip_2");
      var text = normalise(
        (anchor ? anchor.textContent : "") + " " +
        (desc ? desc.textContent : "") + " " +
        (card.getAttribute("data-original-title") || "") + " " +
        (card.getAttribute("onclick") || "")
      );
      return { card: card, wrapper: wrapper, text: text };
    });

    var empty = document.createElement("div");
    empty.className = "nx-empty";
    empty.textContent = "没有匹配的资源，试试其他关键词，或点击「清除」。";
    empty.style.display = "none";
    var firstHead = heads[0];
    if (firstHead && firstHead.parentNode) firstHead.parentNode.insertBefore(empty, firstHead);

    function run(query) {
      var q = normalise(query);
      var shown = 0;
      index.forEach(function (item) {
        var match = !q || item.text.indexOf(q) !== -1;
        item.wrapper.classList.toggle("nx-hidden", !match);
        if (match) shown++;
      });
      sections.forEach(function (sec) {
        var visible = sec.nodes.some(function (n) {
          if (n.tagName === "DIV" && n.classList.contains("row")) {
            return Array.prototype.slice.call(n.children).some(function (c) {
              return !c.classList.contains("nx-hidden");
            });
          }
          return !n.classList.contains("nx-hidden");
        });
        sec.head.classList.toggle("nx-hidden", !visible);
        sec.nodes.forEach(function (n) {
          if (n.classList && n.classList.contains("nx-empty")) return;
          n.classList.toggle("nx-hidden", !visible);
        });
      });
      empty.style.display = q && shown === 0 ? "block" : "none";
      if (status) status.textContent = q ? "匹配 " + shown + " / " + total + " 个资源" : "显示全部 " + total + " 个资源";
      if (clear) clear.classList.toggle("nx-visible", !!q);
    }

    input.addEventListener("input", function () { run(input.value); });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { input.value = ""; run(""); input.blur(); }
    });
    if (clear) clear.addEventListener("click", function () {
      input.value = ""; run(""); input.focus();
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      ev.preventDefault();
      input.focus();
    });
  }

  function ready() {
    document.documentElement.classList.add("nx-ready");
    initTheme();
    initJumpLinks();
    initMobileMenu();
    initFilter();
    if (window.location.hash) {
      /* Defer so layout settles before scrolling. */
      window.setTimeout(function () { jumpTo(window.location.hash); }, 120);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
