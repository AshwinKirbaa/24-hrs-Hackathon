/* Lightweight particle field + connecting neural lines.
   Used on the landing page. Vanilla canvas — no dependencies. */

(function () {
  var canvas = document.getElementById("particles");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var W = 0, H = 0;

  function resize() {
    W = canvas.clientWidth = canvas.parentElement.clientWidth;
    H = canvas.clientHeight = canvas.parentElement.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function init() {
    var count = Math.floor((W * H) / 16000);
    count = Math.max(40, Math.min(120, count));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    // lines
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          var alpha = 1 - d2 / (130 * 130);
          ctx.strokeStyle = "rgba(120, 170, 255," + (alpha * 0.18).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // dots
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.fillStyle = "rgba(180, 210, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  window.addEventListener("resize", function () { resize(); init(); });
  resize(); init(); step();
})();
