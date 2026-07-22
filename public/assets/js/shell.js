/* Renders shared app shell (sidebar + topbar) for dashboard pages.
   Usage:
     <div id="shell" data-role="student" data-active="dashboard" data-title="Dashboard"></div>
     <main class="page">…page content…</main>
   Then include this script.
*/

(function () {
  var shell = document.getElementById("shell");
  if (!shell) return;

  var role = shell.dataset.role || "student"; // "student" | "teacher"
  var active = shell.dataset.active || "";
  var title = shell.dataset.title || "";

  var studentNav = [
    { section: "Workspace" },
    { key: "dashboard",  label: "Dashboard",       href: "student-dashboard.html",  icon: "grid" },
    { key: "upload",     label: "Upload Answer",   href: "upload.html",             icon: "upload" },
    { key: "processing", label: "AI Processing",   href: "processing.html",         icon: "sparkles" },
    { key: "result",     label: "Evaluation",      href: "evaluation-result.html",  icon: "check" },
    { key: "feedback",   label: "AI Feedback",     href: "feedback.html",           icon: "message" },
    { key: "analytics",  label: "Analytics",       href: "analytics.html",          icon: "chart" },
    { section: "Account" },
    { key: "profile",    label: "Profile",         href: "profile.html",            icon: "user" },
    { key: "settings",   label: "Settings",        href: "settings.html",           icon: "cog" },
  ];

  var teacherNav = [
    { section: "Faculty workspace" },
    { key: "dashboard", label: "Dashboard",       href: "teacher-dashboard.html", icon: "grid" },
    { key: "upload",    label: "Upload / Rubric", href: "teacher-upload.html",    icon: "upload" },
    { key: "review",    label: "Review Queue",    href: "teacher-review.html",    icon: "check" },
    { key: "analytics", label: "Class Analytics", href: "teacher-analytics.html", icon: "chart" },
    { section: "Account" },
    { key: "profile",   label: "Profile",         href: "profile.html",           icon: "user" },
    { key: "settings",  label: "Settings",        href: "settings.html",          icon: "cog" },
  ];

  var items = role === "teacher" ? teacherNav : studentNav;

  var icons = {
    grid:    '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    upload:  '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>',
    sparkles:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>',
    check:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 6L9 17l-5-5"/></svg>',
    message: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H8l-5 4V6a2 2 0 012-2h14a2 2 0 012 2v9z"/></svg>',
    chart:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M10 20V4M16 20v-6M22 20H2"/></svg>',
    user:    '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
    cog:     '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>',
    menu:    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    search:  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bell:    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 20a2 2 0 004 0"/></svg>',
  };

  var navHtml = items.map(function (it) {
    if (it.section) return '<div class="nav-section-title">' + it.section + '</div>';
    var cls = "nav-item" + (it.key === active ? " active" : "");
    return '<a class="' + cls + '" href="' + it.href + '">' + (icons[it.icon] || "") + '<span>' + it.label + '</span></a>';
  }).join("");

  var roleBadge = role === "teacher"
    ? '<span class="badge badge-brand">Faculty</span>'
    : '<span class="badge badge-brand">Student</span>';

  var brandSub = role === "teacher" ? "Faculty Workspace" : "Student Workspace";
  var initials = role === "teacher" ? "FT" : "SA";

  shell.outerHTML =
    '<aside class="sidebar' + (role === "teacher" ? " theme-teacher" : "") + '">' +
    '  <div class="brand">' +
    '    <div class="brand-mark">T</div>' +
    '    <div>' +
    '      <div class="brand-name">TwinEval AI</div>' +
    '      <div class="brand-sub">' + brandSub + '</div>' +
    '    </div>' +
    '  </div>' +
    '  <nav class="nav">' + navHtml + '</nav>' +
    '  <div style="margin-top:auto" class="card" role="note">' +
    '    <div class="row gap-2"><div class="brand-mark" style="width:32px;height:32px;font-size:13px">AI</div>' +
    '      <div><div style="font-size:13px;font-weight:600">Evaluation Engine</div><div class="text-sm text-muted">All systems operational</div></div>' +
    '    </div>' +
    '  </div>' +
    '</aside>' +
    '<div class="main">' +
    '  <header class="topbar">' +
    '    <div class="row gap-2">' +
    '      <button class="btn btn-sm btn-ghost" onclick="toggleSidebar()" aria-label="Menu" style="height:38px;padding:0 10px">' + icons.menu + '</button>' +
    '      <span class="topbar-title">' + title + '</span>' +
    '      ' + roleBadge +
    '    </div>' +
    '    <div class="search">' + icons.search + '<input placeholder="Search evaluations, students, rubrics…" /></div>' +
    '    <div class="row gap-2">' +
    '      <button class="btn btn-sm btn-ghost" aria-label="Notifications" style="height:38px;padding:0 10px">' + icons.bell + '</button>' +
    '      <a href="landing.html" class="btn btn-sm btn-ghost" title="Sign out">Sign out</a>' +
    '      <div class="avatar" title="Account">' + initials + '</div>' +
    '    </div>' +
    '  </header>' +
    '  <div id="page-slot"></div>' +
    '</div>';

  // Move the existing <main class="page"> into the shell
  var page = document.querySelector("main.page");
  var slot = document.getElementById("page-slot");
  if (page && slot) slot.replaceWith(page);

  document.body.classList.add("app");
})();
