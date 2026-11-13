/*! live-cards.js v1.0 — small live-status cards (Live Activity style). No dependencies, no WebGL.
 *
 * Card designs, SVG shapes and default sample text adapted from the "activity" widgets of
 * Motionary by HarrisonCN — https://github.com/HarrisonCN/Motionary — MIT License:
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 *   associated documentation files (the "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, subject to the condition that the above copyright notice and this permission
 *   notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED
 *   "AS IS", WITHOUT WARRANTY OF ANY KIND.  (Copyright (c) 2025 HarrisonCN)
 * Rewritten as one standalone file with themes and extra business cards (bars, order, kpi).
 *
 * Use:
 *   <script src="live-cards.js"></script>
 *   const card = LiveCards.mount(el, "flight", { from: "YYZ", to: "YVR", value: 40 });
 *   card.update({ value: 60 });  card.play(); card.pause(); card.reset(); card.destroy();
 *   Or markup: <div data-live="coffee" data-duration="30"></div> then LiveCards.auto();
 *   Theme: class "lc-theme-night" (default, dark video look) or "lc-theme-arabica" (white/brown) on any ancestor.
 *   Drifting wall: LiveCards.wall(container) — children with data-column drift slowly; pauses on hover.
 */
(function (global) {
  "use strict";

  var CSS = [
    // tokens -------------------------------------------------------------
    ".lc{--lc-bg:#030303;--lc-ink:#eeeeee;--lc-muted:#8b8b96;--lc-line:#ffffff14;--lc-btn:#393939;--lc-shadow:0 10px 18px #0002,inset 0 1px 0 #ffffff08;",
    "--lc-a:#7fe2ca;--lc-a2:#afffe8;--lc-track:#143630;--lc-good:#7ee2a8;--lc-warn:#ff9a59;--lc-font:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif}",
    // per-kind accents (night theme = the original video look)
    ".lc[data-kind=flight]{--lc-a:#6fffe7;--lc-a2:#afffe8;--lc-track:#143630}",
    ".lc[data-kind=transit]{--lc-a:#d9ff88;--lc-a2:#a0ef85;--lc-track:#163d26;--lc-muted:#a7c788}",
    ".lc[data-kind=delivery]{--lc-a:#c9a1ff;--lc-a2:#a760dd;--lc-track:#502479}",
    ".lc[data-kind=glucose]{--lc-a:#a095f0;--lc-a2:#ff60d7;--lc-ink:#bfb0fb}",
    ".lc[data-kind=coffee]{--lc-a:#ff9a59;--lc-a2:#ffbf93;--lc-ink:#f09558;--lc-btn:#713418}",
    ".lc[data-kind=vital]{--lc-a:#ed6eae;--lc-ink:#ed6eae}",
    ".lc[data-kind=orbit]{--lc-a:#89d5f7;--lc-a2:#5479ef;--lc-track:#5976ba}",
    ".lc[data-kind=meter]{--lc-a:#78ded5;--lc-track:#143031;--lc-ink:#71c4c6}",
    ".lc[data-kind=race]{--lc-a:#fc667a;--lc-track:#461720;--lc-ink:#ea4c69;--lc-line:#51202b}",
    ".lc[data-kind=workout]{--lc-a:#f9e474;--lc-ink:#eddf74;--lc-btn:#5a501d}",
    ".lc[data-kind=ride]{--lc-a:#91c7ff;--lc-a2:#72a5e8;--lc-track:#18303a}",
    ".lc[data-kind=route]{--lc-a:#6dddbe;--lc-ink:#6dddbe}",
    ".lc[data-kind=bars]{--lc-a:#ffb36b;--lc-a2:#ff7d4d;--lc-track:#3a2a20}",
    ".lc[data-kind=order]{--lc-a:#ffb36b;--lc-a2:#ff7d4d;--lc-track:#3a2a20}",
    ".lc[data-kind=kpi]{--lc-a:#7fe2ca}",
    // arabica theme: one brown family for every kind, white cards
    ".lc-theme-arabica .lc,.lc.lc-theme-arabica{--lc-bg:#fffdfa;--lc-ink:#2b1c12;--lc-muted:#8a7563;--lc-line:rgb(74 44 26/.12);--lc-btn:#f1e8dc;",
    "--lc-a:#5b3620;--lc-a2:#b98d62;--lc-track:#efe4d6;--lc-good:#2f7a52;--lc-warn:#c4652c;--lc-shadow:0 1px 2px rgb(60 35 20/.06),0 6px 20px rgb(60 35 20/.07)}",
    // base -----------------------------------------------------------------
    ".lc{display:block;box-sizing:border-box;position:relative;width:var(--lc-width,240px);max-width:100%;border-radius:26px;background:var(--lc-bg);color:var(--lc-ink);",
    "font:400 12px/1.25 var(--lc-font);font-variant-numeric:tabular-nums;box-shadow:var(--lc-shadow);overflow:hidden;padding:15px 18px}",
    ".lc *{box-sizing:border-box}.lc svg{display:block;width:100%;overflow:visible}",
    ".lc .r{display:flex;align-items:center;justify-content:space-between;gap:6px}.lc .r>span{min-width:0}",
    ".lc .s{font-size:10px}.lc .m{color:var(--lc-muted)}.lc em{font-style:normal;color:var(--lc-a)}",
    ".lc b.big{font-size:22px;font-weight:500;letter-spacing:-.03em}.lc small{font-size:10px}",
    ".lc .k{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--lc-muted)}",
    ".lc .ic{display:inline-block;width:15px;height:15px;vertical-align:middle;flex:none}",
    ".lc button{appearance:none;border:0;display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:32px;min-height:26px;padding:4px 12px;",
    "border-radius:20px;background:var(--lc-btn);color:inherit;font:inherit;cursor:pointer}.lc button:hover{filter:brightness(1.15)}",
    ".lc button:active{transform:scale(.94)}.lc button:focus-visible{outline:2px solid var(--lc-a);outline-offset:3px}.lc button .ic{width:13px;height:13px}",
    // shared track
    ".lc .tr{position:relative;height:8px;border-radius:20px;background:var(--lc-track);flex:1}",
    ".lc .tr>i{position:absolute;inset:0 auto 0 0;border-radius:inherit;background:linear-gradient(90deg,var(--lc-a),var(--lc-a2));transition:width .9s cubic-bezier(.2,.8,.2,1)}",
    // flight
    ".lc .fl{display:flex;align-items:center;gap:8px;margin:3px 0}.lc .fl b{font-size:20px;font-weight:450}",
    ".lc .fl .tr>span{position:absolute;top:-6px;transform:translateX(-50%) rotate(90deg);color:var(--lc-ink);transition:left .9s cubic-bezier(.2,.8,.2,1)}",
    ".lc-theme-night .lc .fl .tr>i,.lc .fl .tr>i{box-shadow:0 0 6px color-mix(in srgb,var(--lc-a) 55%,transparent)}",
    // transit
    ".lc .tn{height:9px}.lc .tn>b{position:absolute;top:1px;width:7px;height:7px;border-radius:50%;background:var(--lc-bg);transform:translateX(-50%);transition:left .9s}",
    ".lc .st{margin-top:7px;color:var(--lc-muted);font-size:10px}.lc .st [aria-current]{color:var(--lc-ink);font-weight:600}",
    // sun
    ".lc .sl{display:grid;grid-template-columns:1.3fr .6fr 1fr;font-size:9px;text-align:center;color:var(--lc-muted)}.lc .sl span:first-child{text-align:left;color:var(--lc-ink)}.lc .sl span:last-child{text-align:right}",
    ".lc .ss{display:grid;grid-template-columns:1.3fr .6fr 1fr;gap:5px;height:29px;margin:6px 0 7px}.lc .ss>div{border-radius:30px;position:relative;overflow:hidden}",
    ".lc .ss .d1{background:linear-gradient(90deg,#58acff,#bad6f2,#e9d3bf)}.lc .ss .d1 i{position:absolute;left:14px;top:8px;width:13px;height:13px;border-radius:50%;background:#fcfff1;box-shadow:0 0 10px #fffff9}",
    ".lc .ss .d2{background:linear-gradient(90deg,#ffcc8c,#ffa6a0)}.lc .ss .d3{background:linear-gradient(90deg,#f18aa0,#7858bc,#2c2e61)}",
    // delivery / order steps
    ".lc .dt{height:20px;margin:10px 0 9px;display:flex;justify-content:space-between;align-items:center;padding:0 6px;color:var(--lc-ink)}",
    ".lc .dt>span{z-index:1;display:flex}.lc .dt .ic{width:13px;height:13px}",
    ".lc .av{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--lc-btn);font-size:10px;font-weight:600}",
    ".lc .dv>span:nth-child(2){margin-inline-end:auto}.lc .acts{display:flex;gap:8px}",
    ".lc .out{display:flex;justify-content:space-between;gap:14px}.lc .out b{display:block;font-size:15px;font-weight:500;margin-top:3px;color:var(--lc-a)}",
    ".lc .out p{font-size:17px;margin:3px 0 0}.lc .map{width:72px;height:72px;flex:none;border-radius:15px;color:var(--lc-a);",
    "background:linear-gradient(90deg,transparent 45%,color-mix(in srgb,var(--lc-a) 12%,transparent) 45% 58%,transparent 58%),linear-gradient(0deg,transparent 44%,color-mix(in srgb,var(--lc-a) 10%,transparent) 44% 57%,transparent 57%),var(--lc-track);background-size:24px 24px}",
    ".lc .map path{fill:none;stroke:currentColor;stroke-width:2}.lc .map rect,.lc .map circle{fill:currentColor}",
    ".lc .os{height:22px;margin:10px 0 6px}.lc .os>.dots{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;padding:0 4px}",
    ".lc .os .dot{width:14px;height:14px;border-radius:50%;background:var(--lc-bg);border:3px solid var(--lc-track);transition:border-color .4s,transform .4s}",
    ".lc .os .dot.on{border-color:var(--lc-a);transform:scale(1.15)}.lc .ol{display:flex;justify-content:space-between;font-size:10px;color:var(--lc-muted)}.lc .ol .on{color:var(--lc-ink);font-weight:600}",
    // charts
    ".lc .bar,.lc .col{transform-box:fill-box;transform-origin:center}",
    ".lc[data-anim] .bar.p{animation:lc-pulse 2.4s ease-in-out infinite alternate;animation-delay:calc(var(--i)*-93ms)}",
    ".lc[data-anim] .col>circle{animation:lc-dot-t 2.4s ease-in-out infinite alternate;animation-delay:calc(var(--i)*-93ms)}",
    ".lc[data-anim] .col>circle:last-of-type{animation-name:lc-dot-b}",
    ".lc .ax{display:flex;justify-content:space-between;color:var(--lc-muted);font-size:9px;margin-top:4px}",
    // coffee
    ".lc .cs{display:flex;justify-content:space-between;padding-right:34px;font-size:9px;color:var(--lc-muted);height:11px}",
    ".lc .cb{height:24px;display:flex;gap:4px;margin-top:3px}.lc .cb i{flex:1;min-width:3px;border-radius:2px;background:linear-gradient(0deg,var(--lc-a),var(--lc-a2));opacity:.25;transition:opacity .2s,background .3s}",
    ".lc .cb i.on{opacity:1}.lc .cb i.ok{opacity:1;background:var(--lc-good)}.lc .cb i.over{opacity:1;background:var(--lc-warn)}",
    ".lc .cf{margin-top:12px;font-size:13px}.lc .cf b{font-size:26px;font-weight:450;line-height:1}.lc .cf button{min-width:32px;min-height:32px;padding:5px;color:var(--lc-a)}",
    // meter
    ".lc .mt{display:flex;align-items:center;gap:8px}.lc .mt>svg{width:28px;height:28px;flex:none;margin-right:auto}.lc .mt b{font-size:24px;font-weight:300}",
    // race
    ".lc .rc{display:flex;align-items:center;gap:8px}.lc .rk{width:100px;height:80px;flex:none;position:relative}.lc .rk>span{position:absolute;bottom:-2px;left:0;font-size:10px}",
    ".lc .lp{flex:1;font-size:10px;text-align:right}.lc .lp>div{margin-bottom:8px}.lc .lp p{display:flex;justify-content:space-between;margin:0;padding:3px 0;border-top:1px solid var(--lc-line)}",
    ".lc .racer{offset-rotate:0deg;transform-box:fill-box}.lc[data-anim] .racer{animation:lc-lap 14s linear infinite}",
    // workout / ride / route / pill
    ".lc .pl{display:flex;justify-content:space-between;align-items:center}.lc .pl button{color:var(--lc-a);padding:4px 20px}.lc .pl button:nth-child(2){background:none}",
    ".lc .rl{height:9px;margin:12px 0 15px}.lc .rl>button{position:absolute;top:-4px;background:#fff;color:#090909;min-width:18px;min-height:17px;padding:2px;transform:translateX(-50%)}",
    ".lc.pill{border-radius:24px;padding:9px 13px;width:auto;display:inline-block}.lc .pi{display:flex;align-items:center;gap:6px;font-size:22px;line-height:1;color:var(--lc-a)}.lc .pi .ic{width:20px;height:20px}",
    ".lc .pi small{font-size:11px}.lc .pi .e{margin-inline-start:auto;font-size:11px;color:var(--lc-muted)}",
    ".lc .pi[data-tone=pink]{color:#ff558d}.lc .pi[data-tone=blue]{color:#99bff3}.lc .pi[data-tone=purple]{color:#bf81ee}.lc .pi[data-tone=lime]{color:#d9ee70}.lc .pi[data-tone=red]{color:#fb5278}",
    // bars (hourly with last-week ghost)
    ".lc .hb{display:flex;align-items:flex-end;gap:3px;height:64px;margin-top:8px}",
    ".lc .hb>span{position:relative;flex:1;height:100%;display:flex;align-items:flex-end}",
    ".lc .hb>span>i{display:block;width:100%;border-radius:3px;background:var(--lc-track);transition:height .6s cubic-bezier(.2,.8,.2,1)}",
    ".lc .hb>span.t>i{background:linear-gradient(0deg,var(--lc-a2),var(--lc-a))}.lc .hb>span.n>i{background:var(--lc-a)}",
    ".lc[data-anim] .hb>span.n>i{animation:lc-blink 1.6s ease-in-out infinite}",
    ".lc .hb>span>u{position:absolute;left:-1px;right:-1px;height:2px;border-radius:2px;background:var(--lc-muted);opacity:.55;text-decoration:none}",
    ".lc .dl{font-weight:600;font-size:11px}.lc .dl.up{color:var(--lc-good)}.lc .dl.down{color:var(--lc-warn)}",
    ".lc .kv{font-size:28px;font-weight:500;letter-spacing:-.03em;margin-top:2px}",
    // wall
    ".lc-wall{display:grid;grid-auto-flow:column;grid-auto-columns:var(--lc-wall-col,240px);justify-content:center;gap:var(--lc-wall-gap,32px);overflow:hidden;padding:24px;height:var(--lc-wall-height,640px);background:var(--lc-wall-bg,#292929)}",
    ".lc-wall .lc{flex:none;width:var(--lc-wall-col,240px)}.lc-wall>[data-column]{display:flex;flex-direction:column;align-items:center;gap:28px;animation:lc-drift var(--lc-wall-speed,40s) linear infinite alternate;animation-play-state:paused}",
    ".lc-wall>[data-column]:nth-child(even){animation-direction:alternate-reverse;margin-top:32px}",
    ".lc-wall[data-anim]>[data-column]{animation-play-state:running}.lc-wall:hover>[data-column],.lc-wall:focus-within>[data-column]{animation-play-state:paused}",
    "@keyframes lc-pulse{0%{transform:scaleY(.65)}100%{transform:scaleY(1)}}",
    "@keyframes lc-dot-t{from{transform:translateY(var(--amp))}to{transform:translateY(0)}}",
    "@keyframes lc-dot-b{from{transform:translateY(calc(var(--amp)*-1))}to{transform:translateY(0)}}",
    "@keyframes lc-lap{to{offset-distance:172%}}@keyframes lc-blink{50%{opacity:.55}}",
    "@keyframes lc-drift{from{transform:translateY(0)}to{transform:translateY(-90px)}}",
    "@media (prefers-reduced-motion:reduce){.lc *,.lc-wall>*{animation:none!important;transition:none!important}}"
  ].join("");

  // helpers ------------------------------------------------------------------
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(v, d, lo, hi) { var n = Number(v); if (!isFinite(n)) n = d; if (lo != null) n = Math.max(lo, n); if (hi != null) n = Math.min(hi, n); return n; }
  function list(v, d) { if (Array.isArray(v)) return v; if (v == null || v === "") return d; return String(v).split(",").map(function (s) { return s.trim(); }).filter(Boolean); }
  function nums(v, d) { var a = list(v, d).map(Number).filter(isFinite); return a.length ? a : d; }
  function clock(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function svg(body, box, cls) { return '<svg class="' + (cls || "") + '" viewBox="' + (box || "0 0 240 80") + '" aria-hidden="true" focusable="false">' + body + "</svg>"; }
  var serial = 0;
  var ICONS = {
    plane: "M3 13l7-2V4l2-2 2 2v7l7 2v2l-7-1v5l3 2v1l-5-1-5 1v-1l3-2v-5l-7 1z",
    heart: "M12 21C8 18 2 14 2 8a5 5 0 0 1 10-2A5 5 0 0 1 22 8c0 6-6 10-10 13z",
    play: "M7 3l15 9-15 9z", pause: "M5 3h5v18H5zM15 3h5v18h-5z", stop: "M5 5h14v14H5z", close: "M5 5l14 14M19 5L5 19",
    target: "M12 1v5m0 12v5M1 12h5m12 0h5M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
    phone: "M6 3l4 5-3 3c1 3 3 5 6 6l3-3 5 4-2 4C9 22 2 15 2 5z", message: "M3 3h18v14H10l-6 5v-5H3z",
    home: "M2 11L12 2l10 9v11h-7v-7H9v7H2z", car: "M3 10l3-6h12l3 6v10h-4v-3H7v3H3zM3 11h18M6 13v2m12-2v2",
    package: "M2 6l10-5 10 5v13l-10 4-10-4zM2 6l10 5 10-5M12 11v12M7 4l10 5",
    bike: "M9 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0M23 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0M5 17l5-9 5 9H5m14 0L14 5h-3M7 5h4",
    train: "M5 2h14v16H5zM8 21l2-3m6 3l-2-3M5 11h14M8 15h1m6 0h1", drop: "M12 2C10 6 4 11 4 16a8 8 0 0 0 16 0c0-5-6-10-8-14z",
    cup: "M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM17 9h2a2.5 2.5 0 0 1 0 5h-2M9 3c-1 1.5 1 2 0 4M13 3c-1 1.5 1 2 0 4",
    printer: "M6 9V3h12v6M6 17H4V9h16v8h-2M7 14h10v7H7z", check: "M4 12l5 5L20 6", arrow: "M4 12h16m-6-6l6 6-6 6"
  };
  var FILLED = { plane: 1, heart: 1, play: 1, pause: 1, stop: 1, home: 1, message: 1 };
  function icon(name) {
    var p = ICONS[name] || ICONS.arrow;
    return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + p + '" fill="' + (FILLED[name] ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function btn(action, label, ic) { return '<button type="button" data-action="' + action + '" aria-label="' + esc(label) + '">' + icon(ic) + "</button>"; }
  function t(d, key, fallback) { return esc(d[key] != null ? d[key] : fallback); }

  // views: each takes the data object and returns HTML -----------------------------------------
  var V = {};
  V.flight = function (d) {
    var p = num(d.value, 68, 0, 100);
    return '<div class="r s"><span>' + t(d, "origin", "San Francisco") + "</span><span>" + t(d, "destination", "Edmonton") + "</span></div>" +
      '<div class="fl"><b>' + t(d, "from", "SFO") + '</b><div class="tr"><i style="width:' + p + '%"></i><span style="left:' + p + '%">' + icon("plane") + "</span></div><b>" + t(d, "to", "YEG") + "</b></div>" +
      '<div class="r s"><span>' + t(d, "departure", "9:59 PM") + "</span><em>" + t(d, "status", "Arrives in 20m") + "</em><span>" + t(d, "arrival", "12:59 AM") + "</span></div>";
  };
  V.transit = function (d) {
    var names = list(d.stations, ["Harajuku", "Shibuya", "Ebisu"]), p = num(d.value, 50, 0, 100);
    var cur = Math.round((names.length - 1) * p / 100);
    return '<div class="tr tn"><i style="width:' + p + '%"></i><b style="left:' + p + '%"></b></div><div class="r st">' +
      names.map(function (s, i) { return "<span" + (i === cur ? ' aria-current="step"' : "") + ">" + esc(s) + "</span>"; }).join("") + "</div>";
  };
  V.sun = function (d) {
    return '<div class="sl"><span>' + t(d, "nowLabel", "Now") + "</span><span>" + t(d, "sunsetLabel", "Sunset") + "</span><span>" + t(d, "duskLabel", "Dusk") + "</span></div>" +
      '<div class="ss"><div class="d1"><i></i></div><div class="d2"></div><div class="d3"></div></div>' +
      '<div class="sl"><span>' + t(d, "now", "5:50 PM") + "</span><span>" + t(d, "sunset", "in 57m") + "</span><span>" + t(d, "dusk", "8:12") + "</span></div>";
  };
  V.delivery = function (d) {
    if (d.stage === "out") {
      return '<div class="out"><div><span class="k">' + t(d, "statusLabel", "Status") + "</span><b>" + t(d, "status", "Out for delivery") +
        '</b><span class="k" style="display:block;margin-top:6px">' + t(d, "etaLabel", "ETA") + "</span><p>" + t(d, "eta", "15–30 min") + "</p></div>" +
        '<div class="map" aria-hidden="true"><svg viewBox="0 0 80 80"><path d="M25 12v20q0 10 10 10h6"/><rect x="20" y="10" width="10" height="13" rx="2"/><circle cx="39" cy="42" r="4"/></svg></div></div>';
    }
    var p = num(d.value, 34, 0, 100), who = String(d.driver != null ? d.driver : "Dave");
    return '<div class="r s"><em>' + t(d, "status", "Picking up order") + "</em><em>" + t(d, "eta", "ETA 5:50") + "</em></div>" +
      '<div class="tr dt"><i style="width:' + p + '%"></i><span>' + icon("package") + "</span><span>" + icon("car") + "</span><span>" + icon("home") + "</span></div>" +
      '<div class="r dv"><span class="av" aria-hidden="true">' + esc(who.charAt(0)) + "</span><span>" + esc(who) + '</span><div class="acts">' +
      btn("call", "Call driver", "phone") + btn("message", "Message driver", "message") + "</div></div>";
  };
  V.glucose = function (d, id) {
    var values = nums(d.values, [8, 12, 10, 18, 12, 18, 12, 14, 11, 14, 32, 28, 22, 47, 36, 54, 34, 20, 14, 8, 8, 16, 10, 18]);
    var max = Math.max.apply(null, values.map(Math.abs).concat(1)), g = "lcg" + id;
    var bars = values.map(function (v, i) {
      var h = Math.max(7, Math.abs(v) / max * 60);
      return '<rect class="bar p" style="--i:' + i + '" x="' + (8 + i * 224 / values.length) + '" y="' + (66 - Math.abs(v) / max * 52) + '" width="4" height="' + h + '" rx="2" fill="url(#' + g + ')"/>';
    }).join("");
    return '<div class="r"><span><b class="big">' + num(d.value, 7.2).toFixed(1) + "</b> <small>" + t(d, "unit", "mmol/L") + '</small></span><span class="m">' + t(d, "trend", "↓ 2.2") + "</span></div>" +
      svg('<defs><linearGradient id="' + g + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="240" y2="0"><stop stop-color="var(--lc-a)"/><stop offset=".4" stop-color="color-mix(in srgb,var(--lc-a) 40%,#fff)"/><stop offset=".6" stop-color="var(--lc-a2)"/><stop offset="1" stop-color="var(--lc-a)"/></linearGradient></defs>' + bars, "0 0 240 82") +
      '<div class="ax"><span>' + t(d, "start", "1PM") + "</span><span>" + t(d, "middle", "2PM") + "</span><span>" + t(d, "end", "NOW") + "</span></div>";
  };
  V.coffee = function (d, id, st) {
    var dur = Math.max(1, num(d.duration, 30)), v = num(d.value, 0, 0, dur), n = num(d.ticks, 27, 6, 60);
    var lo = num(d.targetFrom, NaN), hi = num(d.targetTo, NaN), ranged = isFinite(lo) && isFinite(hi);
    var ticks = "";
    for (var i = 0; i < n; i++) {
      var at = (i + 1) / n * dur, cls = at <= v + 1e-9 ? (ranged ? (v > hi ? "over" : v >= lo ? "ok" : "on") : "on") : "";
      ticks += '<i class="' + cls + '"></i>';
    }
    return '<div class="cs"><span>0</span><span>' + Math.round(dur / 3) + "</span><span>" + Math.round(dur * 2 / 3) + '</span></div><div class="cb">' + ticks + "</div>" +
      '<div class="r cf"><span>' + t(d, "drink", "Espresso") + "</span>" + (st.running ? btn("stop", "Stop timer", "stop") : btn("toggle", "Start timer", "play")) +
      "<b>" + Math.floor(v) + "<small>s</small></b></div>";
  };
  V.vital = function (d) {
    var values = nums(d.values, [6, 9, 7, 14, 20, 34, 38, 18, 11, 30, 35, 25, 39, 37, 19, 14, 8, 10, 7, 14]);
    var max = Math.max.apply(null, values.map(Math.abs).concat(1));
    var cols = values.map(function (v, i) {
      var h = Math.abs(v) / max * 44, x = 10 + i * 220 / (values.length - 1 || 1);
      return '<g class="col" style="--i:' + i + ";--amp:" + (h * 0.175).toFixed(1) + 'px"><path d="M' + x + " " + (27 - h / 2) + "v" + h + '" stroke="currentColor" opacity=".3"/><circle cx="' + x + '" cy="' + (27 - h / 2) + '" r="3.7" fill="currentColor"/><circle cx="' + x + '" cy="' + (27 + h / 2) + '" r="3.7" fill="currentColor"/></g>';
    }).join("");
    return '<div class="r"><span><b class="big">' + num(d.value, 82) + "</b> <small>" + t(d, "unit", "mmHg") + '</small></span><span class="s m">' + t(d, "period", "5 min") + "</span></div>" +
      svg(cols, "0 0 240 55", "") ;
  };
  V.orbit = function (d, id) {
    var p = num(d.value, 76, 0, 100), x = 18 + p * 2.04, y = 89 - 182 * (p / 100) * (1 - p / 100), g = "lco" + id;
    return '<div class="r s"><span>' + t(d, "title", "ISS Flyover") + "</span><em>" + t(d, "eta", "in 15 min") + "</em></div>" +
      svg('<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--lc-a)" stop-opacity=".9"/><stop offset="1" stop-color="var(--lc-a2)" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="M18 89Q120-2 222 89" fill="none" stroke="var(--lc-track)" stroke-width="10" stroke-linecap="round"/><path d="M80 47Q120 24 160 47L120 99z" fill="url(#' + g + ')"/>' +
        '<path d="M84 47Q120 31 156 47" fill="none" stroke="var(--lc-a)" stroke-width="14" stroke-linecap="round"/><circle cx="' + x + '" cy="' + y + '" r="4.5" fill="var(--lc-ink)"/>', "0 0 240 98");
  };
  V.meter = function (d) {
    var v = num(d.value, 81, 0), max = Math.max(1, num(d.max, 120)), p = Math.min(1, v / max);
    return '<div class="mt">' + svg('<circle cx="16" cy="16" r="12" fill="none" stroke="var(--lc-track)" stroke-width="2.5"/><circle cx="16" cy="16" r="12" fill="none" stroke="var(--lc-a)" stroke-width="2.5" stroke-dasharray="' + (p * 75.4).toFixed(1) + ' 75.4" transform="rotate(-90 16 16)" stroke-linecap="round"/>', "0 0 32 32") +
      '<span class="s">' + t(d, "title", "Meter remaining") + "</span><b>" + clock(v) + "</b></div>";
  };
  V.race = function (d) {
    var path = "M28 68C8 50 12 15 36 20S70 46 91 50 123 66 121 91 96 109 77 91 43 80 28 68Z";
    var laps = list(d.laps, ["1:16:36", "1:17:24", "1:18:15"]), p = num(d.value, 72, 0, 100), lap = Math.floor(num(d.lap, 5, 1));
    return '<div class="rc"><div class="rk">' + svg('<path d="' + path + '" fill="none" stroke="var(--lc-track)" stroke-width="8"/><path d="' + path + '" fill="none" stroke="var(--lc-a)" stroke-width="3" pathLength="100" stroke-dasharray="' + p + ' 100"/><circle cx="28" cy="68" r="4" fill="#ffe178"/><circle class="racer" style="offset-path:path(\'' + path + "');offset-distance:" + p + '%" r="4" fill="var(--lc-ink)"/>', "0 0 140 115") +
      "<span>" + t(d, "sector", "Sector 2") + '</span></div><div class="lp"><div>' + t(d, "lapLabel", "Lap") + " " + lap + "</div>" +
      laps.map(function (s, i) { return "<p><span>" + t(d, "lapLabel", "Lap") + " " + Math.max(1, lap - i - 1) + "</span><span>" + esc(s) + "</span></p>"; }).join("") + "</div></div>";
  };
  V.workout = function (d, id, st) {
    var values = nums(d.values, [10, 14, 18, 15, 23, 29, 19, 38, 32, 25, 47, 39, 33, 26, 41, 30, 22, 14, 18, 15, 9, 7, 6, 5, 6, 4]);
    var max = Math.max.apply(null, values.map(Math.abs).concat(1)), step = 220 / values.length;
    var bars = values.map(function (v, i) { var h = Math.max(2, Math.abs(v) / max * 47); return '<rect class="bar p" style="--i:' + i + '" x="' + (10 + i * step) + '" y="' + (56 - h) + '" width="' + Math.max(2, step * 0.5) + '" height="' + h + '" rx="2" fill="currentColor"/>'; }).join("");
    return '<div class="r"><span>' + clock(num(d.value, 1515, 0)) + "</span><span>" + t(d, "distance", "2.0") + " <small>" + t(d, "unit", "mi") + "</small></span></div>" +
      svg(bars, "0 0 240 61") + '<div class="pl">' + btn("reset", "Reset", "close") + btn("toggle", st.running ? "Pause" : "Resume", st.running ? "pause" : "play") + btn("target", "Target", "target") + "</div>";
  };
  V.pill = function (d) {
    var tone = ["mint", "pink", "blue", "purple", "lime", "red"].indexOf(d.tone) >= 0 ? d.tone : "mint";
    return '<div class="pi" data-tone="' + tone + '">' + icon(d.icon || "train") + "<span>" + t(d, "value", "5") + "</span><small>" + t(d, "unit", "min") + '</small><span class="e">' + t(d, "status", "") + "</span></div>";
  };
  V.ride = function (d, id, st) {
    var p = num(d.value, 48, 0, 100), who = String(d.driver != null ? d.driver : "Michael");
    return '<div class="s m">' + t(d, "status", "Drop off in 1 min") + '</div><div class="tr rl"><i style="width:' + p + '%"></i>' +
      '<button type="button" data-action="toggle" aria-label="Pause" style="left:' + p + '%">' + icon(st.running ? "pause" : "play") + "</button></div>" +
      '<div class="r dv"><span class="av" aria-hidden="true">' + esc(who.charAt(0)) + "</span><span>" + esc(who) + "</span>" + btn("call", "Call driver", "phone") + "</div>";
  };
  V.route = function (d) {
    var raw = nums(d.values, [48, 50, 46, 38, 23, 20, 15, 9, 5]), lo = Math.min.apply(null, raw), hi = Math.max.apply(null, raw), span = hi - lo || 1;
    var pts = raw.map(function (v, i) { return (8 + i * 224 / (raw.length - 1 || 1)).toFixed(1) + "," + (58 - (v - lo) / span * 42).toFixed(1); }).join(" ");
    return '<div class="r s"><span>' + t(d, "title", "On the way") + "</span><span>" + t(d, "status", "45m left") + "</span></div>" +
      svg('<polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', "0 0 240 70") +
      '<div class="r"><b class="big">' + t(d, "value", "6.5") + " <small>" + t(d, "unit", "km") + "</small></b>" + btn("details", "Details", "car") + "</div>";
  };
  // business cards ---------------------------------------------------------------------------
  // bars: today's values by slot vs a ghost series (e.g. same weekday last week). `now` = index of the live slot.
  V.bars = function (d) {
    var vals = nums(d.values, [3, 9, 14, 12, 8, 10, 13, 9, 6]), ghost = d.ghost ? nums(d.ghost, []) : [];
    var n = Math.max(vals.length, ghost.length), now = d.now == null ? vals.length - 1 : num(d.now, vals.length - 1);
    var max = Math.max.apply(null, vals.concat(ghost, [1]));
    var cells = "";
    for (var i = 0; i < n; i++) {
      var v = i <= now ? (vals[i] || 0) : 0, g = ghost[i];
      cells += '<span class="' + (i === now ? "n" : i < now ? "t" : "") + '" title="' + esc((d.labels && d.labels[i]) || "") + '"><i style="height:' + Math.max(i <= now ? 3 : 2, v / max * 100).toFixed(1) + '%"></i>' +
        (g != null ? '<u style="bottom:' + (g / max * 100).toFixed(1) + '%"></u>' : "") + "</span>";
    }
    var delta = d.delta == null ? "" : '<span class="dl ' + (d.delta >= 0 ? "up" : "down") + '">' + (d.delta >= 0 ? "↑ " : "↓ ") + Math.abs(Math.round(d.delta * 100)) + "%</span>";
    var axis = list(d.axis, []);
    return '<div class="r"><span class="k">' + t(d, "title", "Orders by hour") + "</span>" + delta + "</div>" +
      '<div class="r" style="align-items:baseline"><b class="kv">' + t(d, "total", vals.slice(0, now + 1).reduce(function (a, b) { return a + b; }, 0)) + '</b><span class="s m">' + t(d, "sub", "so far today") + "</span></div>" +
      '<div class="hb">' + cells + "</div>" + (axis.length ? '<div class="ax">' + axis.map(function (a) { return "<span>" + esc(a) + "</span>"; }).join("") + "</div>" : "") +
      (d.foot ? '<div class="s m" style="margin-top:8px">' + t(d, "foot", "") + "</div>" : "");
  };
  // order: named stages on a thick track (Paid > Printed > Making > Ready)
  V.order = function (d) {
    var steps = list(d.steps, ["Paid", "Printed", "Making", "Ready"]), at = Math.floor(num(d.step, 0, 0, steps.length - 1));
    var w = steps.length > 1 ? 8 + at / (steps.length - 1) * 92 : 100;
    return '<div class="r"><span class="k">' + t(d, "title", "Order #56") + "</span><em class=\"s\">" + esc(steps[at]) + "</em></div>" +
      '<div class="r" style="margin-top:3px"><b class="big" style="font-size:18px">' + t(d, "item", "Iced Spanish Latte") + "</b></div>" +
      '<div class="tr os"><i style="width:' + w + '%"></i><div class="dots">' + steps.map(function (s, i) { return '<b class="dot' + (i <= at ? " on" : "") + '"></b>'; }).join("") + "</div></div>" +
      '<div class="ol">' + steps.map(function (s, i) { return '<span class="' + (i === at ? "on" : "") + '">' + esc(s) + "</span>"; }).join("") + "</div>" +
      (d.foot ? '<div class="r s m" style="margin-top:8px"><span>' + t(d, "foot", "") + "</span><span>" + t(d, "detail", "") + "</span></div>" : "");
  };
  // kpi: label, big number, delta, smooth sparkline
  V.kpi = function (d, id) {
    var vals = nums(d.values, [4, 6, 5, 8, 7, 9, 12, 11, 14]), lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), span = hi - lo || 1, g = "lck" + id;
    var pts = vals.map(function (v, i) { return [8 + i * 224 / (vals.length - 1 || 1), 50 - (v - lo) / span * 40]; });
    var line = "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L");
    var delta = d.delta == null ? "" : '<span class="dl ' + (d.delta >= 0 ? "up" : "down") + '">' + (d.delta >= 0 ? "↑ " : "↓ ") + Math.abs(Math.round(d.delta * 100)) + "%</span>";
    return '<div class="r"><span class="k">' + t(d, "title", "Net sales") + "</span>" + delta + "</div>" +
      '<div class="kv">' + t(d, "value", "$4,820") + "</div>" +
      svg('<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--lc-a)" stop-opacity=".3"/><stop offset="1" stop-color="var(--lc-a)" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="' + line + "L232 58L8 58Z" + '" fill="url(#' + g + ')"/><path d="' + line + '" fill="none" stroke="var(--lc-a)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<circle cx="' + pts[pts.length - 1][0] + '" cy="' + pts[pts.length - 1][1] + '" r="3.5" fill="var(--lc-a)"/>', "0 0 240 60") +
      (d.foot ? '<div class="s m">' + t(d, "foot", "") + "</div>" : "");
  };

  // clocks: which kinds tick, and which way
  var CLOCK = { coffee: "up", workout: "up", meter: "down" };
  var DEFAULT_VALUE = { coffee: 0, workout: 1515, meter: 81 };

  // style + lifecycle ------------------------------------------------------------------------
  function injectStyle() {
    if (document.getElementById("live-cards-style")) return;
    var s = document.createElement("style"); s.id = "live-cards-style"; s.textContent = CSS; document.head.appendChild(s);
  }
  var reduced = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  function mount(el, kind, data) {
    injectStyle();
    if (!V[kind]) throw new Error("live-cards: unknown kind " + kind);
    if (el._lc) el._lc.destroy();
    var id = ++serial, d = Object.assign({}, data || {}), st = { running: !!d.running, visible: true, timer: null, last: 0 };
    if (d.value == null && kind in DEFAULT_VALUE) d.value = DEFAULT_VALUE[kind];
    var initial = d.value;
    el.classList.add("lc"); if (kind === "pill") el.classList.add("pill");
    el.dataset.kind = kind; el.setAttribute("role", "group");
    if (d.label) el.setAttribute("aria-label", d.label);
    function emit(type, detail) { el.dispatchEvent(new CustomEvent("live:" + type, { detail: detail, bubbles: true })); }
    function paint() {
      el.innerHTML = V[kind](d, id, st);
      var anim = st.visible && !document.hidden && !reduced.matches && d.animated !== false;
      el.toggleAttribute("data-anim", anim);
      var tick = CLOCK[kind] && st.running && anim !== null && st.visible && !document.hidden;
      if (tick && !st.timer) {
        st.last = performance.now();
        st.timer = setInterval(function () {
          var gone = Math.floor((performance.now() - st.last) / 1000); if (gone < 1) return;
          st.last += gone * 1000;
          var max = kind === "coffee" ? Math.max(1, num(d.duration, 30)) : Infinity;
          d.value = Math.min(max, Math.max(0, num(d.value, 0) + (CLOCK[kind] === "down" ? -gone : gone)));
          emit("tick", { value: d.value });
          if (CLOCK[kind] === "down" ? d.value === 0 : d.value >= max) { st.running = false; stop(); emit("complete", { value: d.value }); }
          paint();
        }, 250);
      } else if (!tick) stop();
    }
    function stop() { if (st.timer) clearInterval(st.timer); st.timer = null; }
    function onClick(e) {
      var b = e.target.closest && e.target.closest("button[data-action]"); if (!b || !el.contains(b)) return;
      var a = b.dataset.action;
      if (a === "toggle") { st.running = !st.running; if (st.running && kind === "coffee" && num(d.value, 0) >= num(d.duration, 30)) d.value = 0; }
      else if (a === "stop") st.running = false;
      else if (a === "reset") { st.running = false; d.value = initial; }
      if (kind === "coffee" && a === "toggle" && st.running) d.value = 0;
      emit("action", { action: a, value: d.value, running: st.running });
      paint();
    }
    el.addEventListener("click", onClick);
    var io = typeof IntersectionObserver === "function" ? new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; paint(); }) : null;
    if (io) io.observe(el);
    document.addEventListener("visibilitychange", paint);
    paint();
    var api = {
      el: el,
      get value() { return d.value; },
      update: function (patch) { Object.assign(d, patch || {}); paint(); return api; },
      play: function () { st.running = true; paint(); return api; },
      pause: function () { st.running = false; paint(); return api; },
      reset: function () { st.running = false; d.value = initial; paint(); return api; },
      destroy: function () { stop(); if (io) io.disconnect(); el.removeEventListener("click", onClick); document.removeEventListener("visibilitychange", paint); el._lc = null; }
    };
    el._lc = api;
    return api;
  }

  // data-live="kind" data-foo="bar" -> mount(el, kind, {foo: "bar"}); lists stay strings ("a,b,c")
  function auto(root) {
    var found = (root || document).querySelectorAll("[data-live]");
    return Array.prototype.map.call(found, function (el) {
      var d = {}; Object.keys(el.dataset).forEach(function (k) { if (k !== "live" && k !== "kind") d[k] = el.dataset[k]; });
      if (d.running != null) d.running = d.running !== "false";
      return mount(el, el.dataset.live, d);
    });
  }

  function wall(el, opts) {
    injectStyle();
    el.classList.add("lc-wall");
    if (opts && opts.speed) el.style.setProperty("--lc-wall-speed", opts.speed + "s");
    var vis = true;
    function sync() { el.toggleAttribute("data-anim", vis && !document.hidden && !reduced.matches); }
    if (typeof IntersectionObserver === "function") new IntersectionObserver(function (es) { vis = es[0].isIntersecting; sync(); }).observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
  }

  global.LiveCards = { mount: mount, auto: auto, wall: wall, kinds: Object.keys(V), icon: icon, version: "1.0" };
})(typeof window !== "undefined" ? window : this);
