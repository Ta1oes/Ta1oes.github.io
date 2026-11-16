/* Austin Yao · studio site. Projects, live screens, filters, detail dialog. No build step. */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---- projects ---------------------------------------------------------------------- */
  // screens: list of [kind, data, loop] — loop(card, tick) drives the demo animation.
  var DRINKS = ["Iced Spanish Latte", "Cortado", "Kyoto Cold Brew", "Flat White", "Matcha Latte"];
  var PROJECTS = [
    {
      id: "kitchen-bridge", wide: true, cat: "coffee", glow: "rgb(111 255 231/.16)",
      eyebrow: "Coffee systems · 2026", title: "Kitchen Bridge",
      blurb: "A payment at the till prints the drink sticker in the kitchen. Square POS sends a webhook to a hub on my NAS, and each store's printer pulls its own orders.",
      stack: ["Python", "Flask", "Docker", "Square webhooks", "ZPL", "PyInstaller"],
      details: [
        "Multi-store edition: one hub, one small Windows app per store that long-polls the hub and prints to a Zebra printer over TCP 9100.",
        "Owner console for printers, stores and menus, plus a Raspberry Pi hybrid build that can also capture Epson receipt traffic.",
        "Grew out of a single-store Flask + ngrok version written in July 2026."
      ],
      screens: [
        ["flight", { from: "SQ", to: "ZPL", origin: "Square POS", destination: "Zebra printer", departure: "webhook", arrival: "sticker", status: "printing", value: 10 },
          function (c, t) { var v = (t * 9) % 110; c.update({ value: Math.min(v, 100), status: v >= 100 ? "printed" : "printing" }); }],
        ["order", { title: "Order #56", item: DRINKS[0], step: 0, steps: "Paid,Printed,Making,Ready", foot: "Store 2 · bar printer", detail: "0:42" },
          function (c, t) { var s = t % 5; c.update({ step: Math.min(s, 3), item: DRINKS[Math.floor(t / 5) % DRINKS.length], title: "Order #" + (56 + Math.floor(t / 5)) }); }]
      ]
    },
    {
      id: "report", cat: "coffee", glow: "rgb(255 154 89/.18)",
      eyebrow: "% ARABICA · consulting · 2026", title: "Store Report",
      blurb: "One reporting dashboard for % ARABICA: sales and operations data from 10 locations, about 68,000 transactions a month, refreshed hourly, with forecasts that guide inventory and purchasing.",
      stack: ["SQLite", "Python", "Forecasting", "Square API"],
      details: [
        "Pipelines consolidate 400K+ transactions and six months of history into one source, updated hourly.", "Daily sales, peak hours, product performance and seasonal promotions against historical benchmarks.",
        "Forecasts of daily inventory and seasonal demand guide purchasing budgets and prep before the rush.",
        "The card on this page runs on sample numbers, not store data."
      ],
      screens: [
        ["bars", { title: "Cups by hour", sub: "sample day", values: "4,9,16,22,18,12,14,19,15,9,6,3", ghost: "5,8,13,20,19,14,12,16,14,10,6,4", now: 3, axis: "8a,11a,2p,5p", delta: 0.08 },
          function (c, t) { c.update({ now: 3 + (t % 9) }); }]
      ]
    },
    {
      id: "neighbourhood", wide: true, cat: "coffee", glow: "rgb(255 154 89/.2)",
      eyebrow: "Coffee systems · 2026", title: "Neighbourhood Coffee window",
      blurb: "Online ordering for a one-person coffee window. The Nest Hub announces each order, the kitchen accepts it, and only then is the card charged.",
      stack: ["TypeScript", "Vite", "Node", "Square Web Payments", "Home Assistant", "Cloudflare Tunnel"],
      details: [
        "Payment is authorised at checkout and captured only when the order is accepted, so a declined order never charges the customer.",
        "Orders are pushed into Home Assistant, which speaks them on a Nest Hub in the kitchen.",
        "Self-hosted on a NAS behind a Cloudflare Tunnel, with a giveaway mode for events."
      ],
      screens: [
        ["order", { title: "Window order", item: "Oat Cortado", step: 0, steps: "Ordered,Announced,Accepted,Charged", foot: "Nest Hub · kitchen", detail: "pickup 5 min" },
          function (c, t) { c.update({ step: Math.floor(t / 2) % 4 }); }],
        ["coffee", { drink: "Espresso · double", duration: 32, targetFrom: 25, targetTo: 30, ticks: 32, running: true }, null]
      ]
    },
    {
      id: "living-building", cat: "home", glow: "rgb(127 226 202/.16)", link: "smart-home.html", linkLabel: "Open the Living Building",
      eyebrow: "LensCasters Consulting · client demo", title: "Living Building",
      blurb: "The demo I show LensCasters clients: a two-storey Home Assistant digital twin where heating follows the room you are in, used to plan budgets and energy savings.",
      stack: ["Home Assistant", "NAS", "Matter", "Kasa", "Heat pump zoning"],
      details: [
        "Six room sensors, two control displays and one local home system.",
        "Scenes for arriving, dinner, focus and bed time; hold-to-unlock and hold-to-feed safety actions.",
        "The interactive walkthrough explains envelope, windows, HRV, zoned heat pump and solar layer by layer."
      ],
      screens: [
        ["kpi", { title: "Living room", value: "22.8°C", values: "21.6,21.9,22.3,22.6,22.8,22.7,22.5,22.6,22.8", foot: "Target 22.5° · presence on" },
          function (c, t) {
            var rooms = [["Living room", "22.8"], ["Home office", "22.8"], ["Kitchen", "23.2"], ["Primary bedroom", "22.4"], ["Dining", "22.7"], ["Bathroom", "23.0"]];
            var r = rooms[Math.floor(t / 3) % rooms.length]; if (t % 3) return;
            c.update({ title: r[0], value: r[1] + "°C" });
          }]
      ]
    },
    {
      id: "prefab", wide: true, cat: "research", glow: "rgb(217 255 136/.12)", link: "#reports", linkLabel: "Read the PreFab reports",
      eyebrow: "Market research · 2026", title: "Ontario prefab ADU study",
      blurb: "Is a factory-built backyard suite a business in Ontario? 5.5 GB of public data from StatCan, CMHC and Toronto Open Data, a 3.6 GB SQLite base, and seven reports.",
      stack: ["Python", "SQLite", "StatCan", "CMHC", "O. Reg 299/19", "Financial model"],
      details: [
        "Reproducible scripts pull and clean the raw government data into one database.",
        "Outputs: an HTML dashboard, a pitch deck, feasibility and financial model, a 56 m² cost breakdown, an ADU preference survey, product options, the 2027–2030 forecast and an export comparison.",
        "Includes a post-mortem of the Assembly and R-Hauz bankruptcies to learn what sank earlier prefab builders."
      ],
      screens: [
        ["transit", { stations: "StatCan,CMHC,SQLite,Model,Report", value: 0 },
          function (c, t) { c.update({ value: (t * 6) % 106 > 100 ? 100 : (t * 6) % 106 }); }],
        ["order", { title: "Pipeline", item: "5.5 GB → 7 reports", step: 0, steps: "Pull,Clean,Model,Write", foot: "Reproducible scripts", detail: "Python" },
          function (c, t) { c.update({ step: Math.floor(t / 2) % 4 }); }]
      ]
    },
    {
      id: "gold", cat: "research", glow: "rgb(255 200 120/.14)", link: "#reports", linkLabel: "Read the summary report",
      eyebrow: "Remote sensing · 2026", title: "Placer gold target screening",
      blurb: "Ranking placer gold ground for large mechanised mining in Zeravshan (Tajikistan), Asosa (Ethiopia) and Guyana with elevation models, satellite data and licence records.",
      stack: ["SRTM", "FABDEM", "ICESat-2", "ASTER", "Aeromagnetics", "EITI data"],
      details: [
        "A four-factor model grades each target A to C on terrain, drainage, geology and access.",
        "Licence and EITI data screen out ground that is already held.",
        "Delivered as an offline summary site and a 14.9 MB report."
      ],
      screens: [
        ["orbit", { title: "ICESat-2 pass", eta: "3 regions", value: 0 },
          function (c, t) { c.update({ value: (t * 7) % 100 }); }]
      ]
    },
    {
      id: "kindle-micro", cat: "tools", glow: "rgb(201 161 255/.16)", link: "https://github.com/Ta1oes/kindle-micro", linkLabel: "View on GitHub",
      eyebrow: "Open source · 2026", title: "Kindle Micro",
      blurb: "Turns a spare Kindle, iPhone or iPad into a status and approval panel for Codex Desktop on the local network.",
      stack: ["Electron", "TypeScript", "Vite", "KOReader plugin", "MIT"],
      details: [
        "Shows running tasks, token use and usage windows, with Approve and Reject buttons.",
        "A KOReader plugin makes the e-ink Kindle a first-class client.",
        "Bilingual Chinese and English."
      ],
      screens: [
        ["order", { title: "Codex task", item: "Approve file edit?", step: 0, steps: "Queued,Running,Approve,Done", foot: "Kindle · LAN", detail: "e-ink" },
          function (c, t) { c.update({ step: t % 4 }); }]
      ]
    },
    {
      id: "epson", wide: true, cat: "tools", glow: "rgb(111 255 231/.12)", link: "https://github.com/Ta1oes/epson-receipt-extractor", linkLabel: "View on GitHub",
      eyebrow: "Open source · 2026", title: "Epson receipt extractor",
      blurb: "Reads receipts straight off the wire. It captures authorised Square-to-Epson print traffic, rebuilds the raster image and runs OCR on it.",
      stack: ["Python", "TCP reassembly", "ESC/POS", "Tesseract", "GitHub Actions"],
      details: [
        "Reassembles TCP streams on port 9100 and decodes ESC/POS GS 8 L raster commands back into an image.",
        "Tested, with CI on GitHub Actions; MIT licence."
      ],
      screens: [
        ["order", { title: "Receipt", item: "ESC/POS → text", step: 0, steps: "Capture,Rebuild,Raster,OCR", foot: "TCP 9100", detail: "Tesseract" },
          function (c, t) { c.update({ step: t % 4 }); }],
        ["pill", { icon: "printer", value: "9100", unit: "tcp", status: "capturing", tone: "blue" }, null]
      ]
    }
  ];
  var CATS = [["all", "All"], ["coffee", "Coffee systems"], ["research", "Research"], ["tools", "Open source"], ["home", "Home"]];

  /* ---- live screens ------------------------------------------------------------------ */
  var loops = [];
  function mountScreen(host, screens) {
    screens.forEach(function (s) {
      var el = document.createElement("div");
      host.appendChild(el);
      var card = LiveCards.mount(el, s[0], Object.assign({ label: s[0] + " demo" }, s[1]));
      if (s[2]) loops.push({ el: el, card: card, fn: s[2] });
    });
  }
  // one shared clock; each loop only runs while its card is on screen
  var tick = 0;
  var vis = new WeakMap();
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { vis.set(e.target, e.isIntersecting); }); });
  function watch() { loops.forEach(function (l) { if (!l.watched) { io.observe(l.el); l.watched = true; } }); }
  if (!reduced) setInterval(function () {
    if (document.hidden) return;
    tick++;
    loops.forEach(function (l) {
      if (!vis.get(l.el) || !l.el.isConnected) return;
      var bar = l.el.querySelector(".tr>i"); if (bar) l.el.style.setProperty("--prev-w", bar.style.width);
      l.fn(l.card, tick);
    });
  }, 1400);
  // espresso timer: pull another shot a moment after each one finishes
  document.addEventListener("live:complete", function (e) {
    var c = e.target._lc; if (c && e.target.dataset.kind === "coffee") setTimeout(function () { c.reset(); c.play(); }, 2400);
  });

  /* ---- project tiles ----------------------------------------------------------------- */
  var grid = document.getElementById("grid");
  PROJECTS.forEach(function (p, i) {
    var a = document.createElement("article");
    a.className = "tile" + (p.wide ? " wide" : "");
    a.dataset.cat = p.cat; a.tabIndex = 0; a.style.setProperty("--i", i);
    a.setAttribute("aria-label", p.title + ", open details");
    a.innerHTML = '<div class="screen" style="--glow:' + p.glow + '"><span class="tag">demo</span></div>' +
      '<div class="copy"><span class="eyebrow">' + p.eyebrow + "</span><h3>" + p.title + "</h3><p>" + p.blurb + "</p>" +
      '<div class="stack">' + p.stack.slice(0, 4).map(function (s) { return "<span>" + s + "</span>"; }).join("") + "</div>" +
      '<span class="more">Details ' + ARROW + "</span></div>";
    grid.appendChild(a);
    mountScreen(a.querySelector(".screen"), p.screens);
    a.addEventListener("click", function (e) { if (!e.target.closest("button")) openDetail(p); });
    a.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(p); } });
    a.addEventListener("pointermove", function (e) {
      var r = a.getBoundingClientRect();
      a.style.setProperty("--mx", (e.clientX - r.left) + "px"); a.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // filter chips
  var chips = document.getElementById("chips");
  CATS.forEach(function (c) {
    var n = c[0] === "all" ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cat === c[0]; }).length;
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.dataset.cat = c[0];
    b.setAttribute("aria-pressed", c[0] === "all" ? "true" : "false");
    b.innerHTML = c[1] + '<span class="n">' + n + "</span>";
    chips.appendChild(b);
  });
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    var cat = b.dataset.cat;
    function apply() {
      chips.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      grid.querySelectorAll(".tile").forEach(function (t) { t.hidden = !(cat === "all" || t.dataset.cat === cat); });
    }
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  });

  /* ---- detail dialog ----------------------------------------------------------------- */
  var dlg = document.getElementById("detail");
  function openDetail(p) {
    dlg.innerHTML = '<button class="close" type="button" aria-label="Close">×</button>' +
      '<div class="screen" style="--glow:' + p.glow + '"><span class="tag">demo</span></div>' +
      '<div class="body"><span class="eyebrow">' + p.eyebrow + "</span><h2 style=\"font-size:34px\">" + p.title + "</h2><p>" + p.blurb + "</p>" +
      "<ul>" + p.details.map(function (d) { return "<li>" + d + "</li>"; }).join("") + "</ul>" +
      '<div class="stack">' + p.stack.map(function (s) { return "<span>" + s + "</span>"; }).join("") + "</div>" +
      (p.link ? '<div class="links"><a class="btn primary" href="' + p.link + '"' + (/^https?:/.test(p.link) ? ' target="_blank" rel="noopener"' : "") + ">" + p.linkLabel + " " + ARROW + "</a></div>" : "") +
      "</div>";
    mountScreen(dlg.querySelector(".screen"), p.screens); watch();
    dlg.showModal();
  }
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.closest(".close") || e.target.closest('a[href^="#"]')) dlg.close();
  });
  dlg.addEventListener("close", function () {
    dlg.querySelectorAll(".lc").forEach(function (el) { if (el._lc) el._lc.destroy(); });
    loops = loops.filter(function (l) { return l.el.isConnected && !dlg.contains(l.el); });
  });

  /* ---- hero wall --------------------------------------------------------------------- */
  var wall = document.getElementById("wall");
  if (wall) {
    var cols = [
      [["order", { title: "Order #61", item: "Cortado", step: 1, steps: "Paid,Printed,Making,Ready", foot: "Kitchen Bridge", detail: "Store 1" }, function (c, t) { c.update({ step: t % 4 }); }],
       ["kpi", { title: "Home office", value: "22.8°C", values: "21.9,22.1,22.4,22.6,22.8,22.8,22.7,22.8", foot: "Living Building" }, null],
       ["pill", { icon: "printer", value: "9100", unit: "tcp", status: "Zebra online", tone: "mint" }, null]],
      [["coffee", { drink: "Espresso", duration: 32, targetFrom: 25, targetTo: 30, ticks: 30, running: true }, null],
       ["bars", { title: "Cups by hour", sub: "sample day", values: "4,9,16,22,18,12,14,19,15", ghost: "5,8,13,20,19,14,12,16,14", now: 5, delta: 0.08 }, function (c, t) { c.update({ now: 2 + (t % 7) }); }],
       ["transit", { stations: "StatCan,CMHC,Model,Report", value: 30 }, function (c, t) { c.update({ value: (t * 8) % 100 }); }]],
      [["flight", { from: "SQ", to: "ZPL", origin: "Square POS", destination: "Printer", departure: "webhook", arrival: "sticker", status: "printing", value: 40 }, function (c, t) { c.update({ value: (t * 11) % 100 }); }],
       ["orbit", { title: "ICESat-2 pass", eta: "Guyana", value: 50 }, function (c, t) { c.update({ value: (t * 7) % 100 }); }],
       ["order", { title: "Codex task", item: "Approve file edit?", step: 2, steps: "Queued,Running,Approve,Done", foot: "Kindle Micro", detail: "LAN" }, function (c, t) { c.update({ step: (t + 2) % 4 }); }]]
    ];
    cols.forEach(function (col) {
      var c = document.createElement("div"); c.dataset.column = "";
      wall.appendChild(c); mountScreen(c, col);
    });
    LiveCards.wall(wall, { speed: 36 });
  }
  watch();

  /* ---- copy email -------------------------------------------------------------------- */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.dataset.copy, done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
      try { navigator.clipboard.writeText(txt).then(done, function () {}); } catch (e) {}
    });
  });
})();
