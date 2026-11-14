/* "How I work": six steps of setting up budget tracking for a team.
   Each step: information I gather, how I process it, the action, the deliverable, my role,
   where I have done it before, and a sample of the deliverable (fictional data). */
(function () {
  "use strict";
  var root = document.getElementById("method");
  if (!root) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function table(head, rows, cls) {
    return '<div class="sheet-scroll"><table class="sheet ' + (cls || "") + '"><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) {
        var flag = r.flag ? ' class="flag-' + r.flag + '"' : "";
        return "<tr" + flag + ">" + r.cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function dd(v) { return '<span class="dd">' + esc(v) + "</span>"; }
  function pill(v, tone) { return '<span class="st ' + (tone || "") + '">' + esc(v) + "</span>"; }

  /* ---- samples (fictional data) ------------------------------------------------------ */
  var SAMPLES = {
    discovery:
      '<div class="flow">' +
        '<div class="node">Invoice arrives<small>shared inbox</small></div>' +
        '<div class="node warn">Typed into team spreadsheet<small>each team has its own columns</small></div>' +
        '<div class="node warn">Coded from memory<small>no written rules</small></div>' +
        '<div class="node warn">Approved by email reply<small>no record in the sheet</small></div>' +
        '<div class="node">Paid and posted by Finance<small>GL actuals</small></div>' +
        '<div class="node warn">Forecast rebuilt by hand<small>month-end, every month</small></div>' +
      "</div>" +
      '<div class="findings"><b>What the interviews found</b><ol>' +
        "<li>Same vendor coded to three different GL accounts in one quarter.</li>" +
        "<li>Committed spend (POs not yet invoiced) is invisible until the invoice lands.</li>" +
        "<li>Forecast changes are not written down, so nobody can say why a number moved.</li>" +
      "</ol></div>",
    design:
      '<div class="cap">Coding guide · excerpt</div>' +
      table(["Spend", "Team", "Funding", "Initiative", "GL", "Rule"], [
        { cells: ["Event venue deposit", dd("Events"), dd("Base"), dd("Spring launch"), "6120", "Book when the PO is raised, not when invoiced"] },
        { cells: ["Paid social campaign", dd("Digital"), dd("Project fund"), dd("Brand refresh"), "6210", "Split by month of the flight dates"] },
        { cells: ["Translation services", dd("Content"), dd("Base"), dd("Ongoing"), "6340", "Cross-charge needs the other owner's OK"] }
      ]) +
      '<div class="cap" style="margin-top:14px">Approval model · RACI</div>' +
      table(["Step", "Coordinator", "Team owner", "Director", "Finance"], [
        { cells: ["Log and code", "<b>R</b>", "C", "", ""] },
        { cells: ["Approve charge to team", "", "<b>A</b>", "I", ""] },
        { cells: ["Approve cross-charge", "R", "<b>A</b> (both)", "I", ""] },
        { cells: ["Monthly forecast", "R", "C", "<b>A</b>", "I"] }
      ], "raci"),
    build:
      '<div class="cap">Capture log · one row per transaction</div>' +
      table(["Date", "Vendor", "Amount", "Team", "Funding", "Initiative", "GL", "PO", "Approver", "Status"], [
        { cells: ["Jan 06", "Northline Print", '<span class="num">$4,280.00</span>', dd("Events"), dd("Base"), dd("Spring launch"), dd("6120"), "PO-1182", "M. Chen", pill("Approved", "ok")] },
        { cells: ["Jan 08", "Bright Social", '<span class="num">$12,500.00</span>', dd("Digital"), dd("Project fund"), dd("Brand refresh"), dd("6210"), "PO-1190", "R. Patel", pill("Approved", "ok")] },
        { flag: "warn", cells: ["Jan 09", "Lingua Co.", '<span class="num">$1,960.00</span>', dd("Content"), dd("Base"), dd("Ongoing"), dd("6340"), "—", "", pill("Needs approver", "warn")] },
        { flag: "bad", cells: ["Jan 10", "Stagecraft Ltd", '<span class="num">$8,750.00</span>', dd("Events"), dd("Project fund"), dd("Ongoing"), dd("6120"), "PO-1201", "M. Chen", pill("GL not allowed for this fund", "bad")] }
      ], "log") +
      '<div class="cap" style="margin-top:14px">Forecast change log</div>' +
      table(["Item", "From", "To", "Amount", "Why", "Approved by"], [
        { cells: ["Spring launch venue", "Feb", "Apr", '<span class="num">$18,000</span>', "Event date moved", "Events owner"] },
        { cells: ["Brand refresh agency", "Mar", "Mar", '<span class="num">−$6,000</span>', "Scope cut, real saving", "Director"] }
      ]),
    dashboard:
      '<div class="pbi"><nav class="pages"><b>Pages</b><span class="on">Overview</span><span>By team</span><span>Initiatives</span><span>Forecast moves</span><span>Transactions</span></nav><div class="pbi-main">' +
      '<div class="slicers"><span class="sl">Period <b>Q1 ▸ Feb ▸ Wk 6</b></span><span class="sl">Team <b>All</b></span><span class="sl">Funding <b>All</b></span><span class="sl">Initiative <b>All</b></span><span class="sync">Filters synced across pages</span></div>' +
      '<div class="kpis">' +
        '<div><span>Budget</span><b class="num">$1.20M</b></div>' +
        '<div><span>Actual</span><b class="num">$318K</b></div>' +
        '<div><span>Committed</span><b class="num">$142K</b></div>' +
        '<div><span>Forecast</span><b class="num">$1.16M</b></div>' +
        '<div class="good"><span>Remaining</span><b class="num">$40K</b></div>' +
      "</div>" +
      '<div class="cap" style="margin-top:14px">By team · spend vs time elapsed (Q1 = 25%)</div>' +
      '<div class="teams">' +
        [["Events", 31, 12, 25], ["Digital", 18, 9, 25], ["Content", 22, 2, 25], ["Community", 14, 6, 25]].map(function (t) {
          var over = t[1] + t[2] > 40;
          return '<div class="team"><span>' + t[0] + '</span><div class="tb"><i class="a" style="width:' + t[1] + '%"></i><i class="c" style="width:' + t[2] + '%"></i><u style="left:' + t[3] + '%"></u></div><b class="num' + (over ? " hot" : "") + '">' + (t[1] + t[2]) + "%</b></div>";
        }).join("") +
      "</div>" +
      '<div class="legend"><span><i class="a"></i>Actual</span><span><i class="c"></i>Committed</span><span><i class="t"></i>Time elapsed</span></div>' +
      '<div class="tieout">' + pill("Ties out", "ok") + " Dashboard total vs Finance GL actuals, checked every month-end · " + pill("Refreshed 7:00 AM", "") + "</div></div></div>",
    run:
      '<div class="cycle" id="cycle"></div>' +
      '<div class="cap" style="margin-top:14px">Owner report · one page, every two weeks</div>' +
      '<div class="memo"><b>Events · period 4</b>' +
        "<p><span class=\"num\">$41.2K</span> spent and committed of <span class=\"num\">$96K</span> (43%), 25% of the year gone. Ahead because the spring venue was booked early, not overspent.</p>" +
        "<p><b>Needs you:</b> 2 invoices waiting for your approval (<span class=\"num\">$3,140</span>).</p>" +
      "</div>" +
      '<div class="cap" style="margin-top:14px">Issue log</div>' +
      table(["#", "Issue", "Owner", "Status"], [
        { cells: ["07", "Vendor invoices arrive without PO numbers", "Coordinator", pill("Template sent to vendors", "ok")] },
        { cells: ["08", "Two teams share one initiative code", "Director", pill("Decision due Feb 14", "warn")] }
      ]),
    handover:
      '<div class="cap">Handover readiness</div>' +
      '<ul class="ready">' +
        '<li class="done">Process guide: every step with screenshots</li>' +
        '<li class="done">One-page coding cheat sheet for each team</li>' +
        '<li class="done">Training session for owners and the coordinator</li>' +
        '<li class="done">Coordinator shadows one full cycle</li>' +
        '<li class="now">Coordinator runs a cycle alone; I only review</li>' +
        "<li>Close-out report: what was built, what is left, what to improve</li>" +
      "</ul>" +
      '<div class="handbar"><i style="width:72%"></i></div><div class="cap" style="text-align:right">4 of 6 done</div>'
  };

  /* ---- steps --------------------------------------------------------------------------- */
  var STEPS = [
    {
      key: "discovery", n: "01", name: "Discovery", when: "Weeks 1–2",
      role: "I listen first. Before changing anything I learn how money really moves today and where it breaks.",
      gather: ["How each team tracks spend today: spreadsheets, emails, who keeps what", "Finance's calendar: month-end close, forecast deadlines, what format they need", "Three months of real invoices and POs", "What leadership wants to see and how often"],
      process: ["Interview the people who track budgets and the directors; send notes within a few days so nothing is misremembered", "Trace a sample of invoices end to end to see where coding and approvals happen", "Mark every hand-off, re-typing step and place a number can go wrong"],
      action: "Agree on the problems worth fixing first, ranked by how much they hurt reporting.",
      output: "Interview notes and a current-state process map with the pain points marked.",
      proof: [["CIBC Mellon", "I traced a 1–2 hour manual payment process step by step before automating it."], ["Prefab ADU study", "Started from 5.5 GB of raw public data and mapped what each source can and cannot answer."]],
      links: [["Prefab study", "#reports"]]
    },
    {
      key: "design", n: "02", name: "Design", when: "Weeks 2–3",
      role: "I write the rules down so coding stops depending on someone's memory.",
      gather: ["The chart of accounts, cost centres and funding streams", "Each team's initiatives for the year", "Who is accountable for each team's budget", "The reporting dates from discovery"],
      process: ["Build a coding guide: for each kind of spend, which team, funding stream, initiative and GL, with worked examples", "Set one owner per team; cross-charges need the other owner's written OK", "Draw the target process: intake, approval, monthly forecast, budget transfers", "Design what each audience gets and when, lined up with Finance's close"],
      action: "Walk owners and the director through it, then get sign-off before anything is built.",
      output: "Coding guide, approval model (who does what), process maps and the reporting design.",
      proof: [["CIBC Mellon", "Mapped every recurring payment to the right account code before building the tool, with exception rules for odd items."], ["Kitchen Bridge", "Designed which store, printer and menu each order belongs to before writing code."]],
      links: [["Kitchen Bridge", "#work"]]
    },
    {
      key: "build", n: "03", name: "Build", when: "Weeks 3–5",
      role: "I make the right way the easy way: one log, dropdowns instead of free text, checks that catch errors as they are typed.",
      gather: ["The signed-off coding guide and approval model", "Last month's actual invoices to test with", "The import format of Finance's planning system"],
      process: ["Build the capture log: one row per transaction, every code a dropdown, built-in validation, approver and date required", "Build the monthly forecast template with a change log: what moved, from when to when, why, who approved", "Build the biweekly report template that reads straight from the log", "Dry-run a full cycle on last month's real data and fix what breaks"],
      action: "Go live at the start of the budget year with a log that is clean from day one.",
      output: "Capture log, forecast template and change log, report template, dry-run results.",
      proof: [["CIBC Mellon", "VBA tools that capture each payment once, map it to the account code and flag exceptions. Used across 30+ funds, 1–2 h cut to 10–20 min."], ["Store Report", "Sales captured once into SQLite, then every report reads from that one source."]],
      links: [["Store Report", "#work"]]
    },
    {
      key: "dashboard", n: "04", name: "Dashboard", when: "In stages",
      role: "I report only from the log, so the dashboard and Finance's numbers tie out.",
      gather: ["The capture log and forecast", "Budget by team and initiative", "GL actuals from Finance for the tie-out"],
      process: ["Model the data as a star schema: one fact table of transactions, lookup tables for team, funding stream, initiative and GL, so a new code shows up without a redesign", "Stage one, leadership view: budget, actual, committed, forecast, variance and remaining for each team", "Stage two, team pages: each initiative's status and spend against time elapsed, with week, month and quarter drill-down and filters that stay in sync across pages", "Save a forecast snapshot each month so the report can show what moved", "Refresh on a schedule from the shared log, and reconcile totals to Finance's actuals every month-end"],
      action: "Publish it where owners already work, and retire the side spreadsheets.",
      output: "A multi-page Power BI budget dashboard that refreshes itself and matches Finance's numbers.",
      proof: [["HAZY Coffee", "Power BI dashboard joining Square sales with Google Ads spend."], ["CIBC Mellon", "Daily cash and position reconciliations: making two sources agree is my day job."]],
      links: [["Store Report", "#work"]]
    },
    {
      key: "run", n: "05", name: "Run it live", when: "Jan – Apr",
      role: "I run the process hands-on until it is routine, and fix the process rather than the symptoms.",
      gather: ["New invoices, POs and approvals every week", "Owners' updates on timing and scope", "Finance's month-end actuals"],
      process: ["Check the log for missing codes or approvals and chase them", "Every two weeks: a one-page report for each owner and a short summary for leadership", "Every month: update the forecast, log every change with its reason, submit to Finance", "Keep an issue log; change the template when the same error happens twice"],
      action: "Separate timing shifts from real savings or overspend, so leadership acts on the right thing.",
      output: "Biweekly owner reports, monthly forecasts with a change log, and a closed-out issue log.",
      proof: [["CIBC Mellon", "Month-end fee accrual true-ups and journal entries on a fixed close calendar."], ["% Arabica", "Sales variance checks behind the bar, by hour, against last week."]],
      links: []
    },
    {
      key: "handover", n: "06", name: "Train & hand over", when: "Final month",
      role: "I measure success by the team running a full cycle without me.",
      gather: ["Questions and mistakes collected while running it", "Who will own the process afterwards"],
      process: ["Write the process guide and a one-page cheat sheet for each team", "Train owners and the coordinator; have the coordinator shadow, then lead, a full cycle", "Write the close-out: what was built, what is left, what to improve next"],
      action: "Hand over when the coordinator runs a cycle alone and the numbers still tie out.",
      output: "Process and user guides, training sessions, and a close-out report.",
      proof: [["CIBC Mellon", "Train new joiners on the tools I built; my workbooks passed team review before release."], ["Kindle Micro", "Bilingual docs so others can install and use it without me."]],
      links: [["Kindle Micro", "#work"]]
    }
  ];

  /* ---- render ------------------------------------------------------------------------- */
  var rail = root.querySelector(".rail"), panel = root.querySelector(".panel");
  rail.innerHTML = STEPS.map(function (s, i) {
    return '<button type="button" role="tab" id="m-tab-' + s.key + '" aria-controls="m-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' +
      '<span class="n">' + s.n + '</span><span class="nm">' + s.name + '</span><span class="w">' + s.when + "</span><i></i></button>";
  }).join("");

  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  var cycleCard = null;
  function show(i) {
    var s = STEPS[i];
    rail.querySelectorAll("[role=tab]").forEach(function (b, j) { b.setAttribute("aria-selected", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    rail.style.setProperty("--at", i);
    panel.setAttribute("aria-labelledby", "m-tab-" + s.key);
    if (cycleCard) { cycleCard.destroy(); cycleCard = null; }
    panel.innerHTML =
      '<div class="role"><span class="eyebrow">My role · step ' + s.n + "</span><p>" + s.role + "</p></div>" +
      '<div class="pipe">' +
        '<div class="stage-col"><h4><b>1</b>Information I gather</h4>' + list(s.gather) + "</div>" +
        '<div class="stage-col"><h4><b>2</b>How I process it</h4>' + list(s.process) + "</div>" +
        '<div class="stage-col act"><h4><b>3</b>Action</h4><p>' + s.action + '</p><h4 style="margin-top:16px"><b>4</b>Deliverable</h4><p class="out">' + s.output + "</p></div>" +
      "</div>" +
      '<div class="sample"><div class="sample-head"><span class="eyebrow">Sample deliverable</span><span class="fict">Fictional data</span></div>' + SAMPLES[s.key] + "</div>" +
      '<div class="proof"><span class="eyebrow">Where I have done this</span><div class="proof-grid">' +
        s.proof.map(function (p) { return "<div><b>" + p[0] + "</b><p>" + p[1] + "</p></div>"; }).join("") +
      "</div></div>";
    panel.classList.remove("in"); void panel.offsetWidth; panel.classList.add("in");
    var cyc = panel.querySelector("#cycle");
    if (cyc && window.LiveCards) {
      cycleCard = LiveCards.mount(cyc, "order", { title: "Biweekly cycle", item: "Period 4 · Events", step: 0, steps: "Pull,Check,Chase,Publish", foot: "Every second Friday", detail: "≈ 3 h" });
      var t = 0, reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        var timer = setInterval(function () {
          if (!cycleCard || !cyc.isConnected) { clearInterval(timer); return; }
          if (document.hidden) return;
          var bar = cyc.querySelector(".tr>i"); if (bar) cyc.style.setProperty("--prev-w", bar.style.width);
          cycleCard.update({ step: ++t % 4 });
        }, 1500);
      }
    }
  }
  rail.addEventListener("click", function (e) { var b = e.target.closest("[role=tab]"); if (b) show(+b.dataset.i); });
  rail.addEventListener("keydown", function (e) {
    var cur = +(document.activeElement.dataset.i || 0), nx = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nx = (cur + 1) % STEPS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") nx = (cur + STEPS.length - 1) % STEPS.length;
    if (nx != null) { e.preventDefault(); show(nx); rail.querySelector('[data-i="' + nx + '"]').focus(); }
  });
  show(0);
})();
