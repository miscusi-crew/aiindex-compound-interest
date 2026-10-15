"use strict";
const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (s) => { const n = Number(String(s).replace(/[\s,]/g, "")); return Number.isFinite(n) && n >= 0 ? n : 0; };

const $ = (id) => document.getElementById(id);
function run() {
  const start = num($("start").value), add = num($("monthly").value), r = num($("rate").value) / 100 / 12, years = Math.min(100, Math.round(num($("years").value)));
  let bal = start, paid = start;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { bal = bal * (1 + r) + add; paid += add; }
    rows.push({ y, paid, bal });
  }
  const last = rows.at(-1) ?? { paid: start, bal: start };
  $("final").textContent = money.format(last.bal);
  $("paidin").textContent = money.format(last.paid);
  $("growth").textContent = money.format(last.bal - last.paid);
  const max = Math.max(1, ...rows.map((x) => x.bal));
  $("chart").innerHTML = rows.map((x) => `<div title="Year ${x.y}: ${money.format(x.bal)}"><span class="c-in" style="height:${(x.paid / max) * 12}rem"></span><span class="c-gr" style="height:${(Math.max(0, x.bal - x.paid) / max) * 12}rem"></span></div>`).join("");
  $("rows").innerHTML = rows.map((x) => `<tr><td>${x.y}</td><td>${money.format(x.paid)}</td><td>${money.format(x.bal - x.paid)}</td><td>${money.format(x.bal)}</td></tr>`).join("");
}
$("form").addEventListener("input", run);
$("form").addEventListener("submit", (e) => e.preventDefault());
run();
