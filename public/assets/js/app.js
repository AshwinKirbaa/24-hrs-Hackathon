/* =============================================================
   TwinEval AI — shared frontend interactions
   - Button ripple
   - Sidebar toggle
   - Simple auth-flow overlay (loading messages)
   - Nav navigation helpers
   ============================================================= */

(function () {
  "use strict";

  // ---- Ripple effect on .btn ----
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn");
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var d = Math.max(rect.width, rect.height);
    var ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = d + "px";
    ripple.style.left = e.clientX - rect.left - d / 2 + "px";
    ripple.style.top = e.clientY - rect.top - d / 2 + "px";
    btn.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 620);
  });

  // ---- Sidebar toggle (mobile) ----
  window.toggleSidebar = function () {
    var s = document.querySelector(".sidebar");
    if (s) s.classList.toggle("open");
  };

  // ---- Auth loading overlay ----
  window.TwinEval = window.TwinEval || {};
  window.TwinEval.runAuthFlow = function (steps, redirectTo) {
    var overlay = document.createElement("div");
    overlay.className = "auth-overlay";
    overlay.innerHTML =
      '<div class="auth-overlay-card">' +
      '  <div class="auth-orb"><span></span><span></span><span></span></div>' +
      '  <div class="auth-step" id="authStep">' + (steps[0] || "Loading...") + '</div>' +
      '  <div class="auth-progress"><span id="authBar" style="width:5%"></span></div>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("show"); });

    var i = 0;
    var stepEl = overlay.querySelector("#authStep");
    var bar = overlay.querySelector("#authBar");
    var per = 100 / steps.length;

    function next() {
      i++;
      if (i >= steps.length) {
        bar.style.width = "100%";
        setTimeout(function () { window.location.href = redirectTo; }, 500);
        return;
      }
      stepEl.style.opacity = "0";
      setTimeout(function () {
        stepEl.textContent = steps[i];
        stepEl.style.opacity = "1";
        bar.style.width = ((i + 1) * per).toFixed(0) + "%";
        setTimeout(next, 900);
      }, 220);
    }
    bar.style.width = per.toFixed(0) + "%";
    setTimeout(next, 900);
  };

  // ---- Signup success flash ----
  window.TwinEval.showSuccess = function (message, redirectTo) {
    var el = document.createElement("div");
    el.className = "success-overlay";
    el.innerHTML =
      '<div class="success-card">' +
      '  <div class="success-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27 l8 8 l16 -18"/></svg></div>' +
      '  <div class="success-title">' + message + '</div>' +
      '  <div class="success-sub">Redirecting to sign in…</div>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () { window.location.href = redirectTo; }, 2000);
  };

  // ---- Reveal on scroll (subtle) ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("anim-fadeup");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
})();
