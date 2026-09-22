
const TARGET = "Carlos";
const state = { week: "all", onlyCarlos: false };

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

function findDay(schedule, date){
  for(const week of schedule){
    const day = week.days.find(d => d.date === date);
    if(day) return day;
  }
  return null;
}

function replaceName(day, sectorKey, from, to, tradeId, note){
  if(!day || !day.sectors[sectorKey]) return false;
  const cell = day.sectors[sectorKey];
  const idx = cell.names.indexOf(from);
  if(idx === -1) return false;
  cell.names[idx] = to;
  cell.tradeIds.push({id:tradeId, note});
  return true;
}

function applyTrades(base){
  const schedule = deepClone(base);
  for(const t of TRADES){
    const cededDay = findDay(schedule, t.ceded);
    replaceName(
      cededDay, t.sector, t.requester, t.substitute, t.id,
      `${t.requester} → ${t.substitute}`
    );

    const compDay = findDay(schedule, t.compensation);
    if(compDay){
      replaceName(
        compDay, t.sector, t.substitute, t.requester, t.id,
        `recomposição: ${t.substitute} → ${t.requester}`
      );
    }
  }
  return schedule;
}

const SCHEDULE = applyTrades(BASE_SCHEDULE);

function hasCarlosInSector(sector){
  return sector.names.includes(TARGET);
}

function hasCarlos(day){
  return Object.values(day.sectors).some(hasCarlosInSector);
}

function brDate(iso){
  const [y,m,d] = iso.split("-");
  return `${d}/${m}`;
}

function parseDate(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y,m-1,d);
}

function sectorHours(key){
  return key === "eixoNoite" ? 6 : 12;
}

function myAssignments(){
  const out = [];
  for(const week of SCHEDULE){
    for(const day of week.days){
      for(const [key, sector] of Object.entries(day.sectors)){
        if(sector.names.includes(TARGET)){
          out.push({week:week.week, date:day.date, sectorKey:key, sector});
        }
      }
    }
  }
  return out;
}

function renderSummary(){
  const list = myAssignments();
  const total = list.reduce((s,x)=>s+sectorHours(x.sectorKey),0);
  const nights = list.filter(x=>x.sectorKey==="eixoNoite").length;
  const uti = list.filter(x=>x.sectorKey==="utiHul").length;
  const dayHours = list.filter(x=>x.sectorKey!=="eixoNoite").reduce((s,x)=>s+12,0);
  const carlosDays = new Set(list.map(x=>x.date)).size;
  const doubleDays = [...new Set(list.map(x=>x.date))].filter(d=>list.filter(x=>x.date===d).length>1).length;

  const items = [
    ["Carga Carlos", `${total}h`],
    ["Diurnas", `${dayHours}h`],
    ["Noturnos", `${nights}`],
    ["UTI HUL", `${uti}`],
    ["Dias escalados", `${carlosDays}`],
    ["Dias com 2 turnos", `${doubleDays}`],
  ];
  document.getElementById("summary").innerHTML = items.map(([k,v]) =>
    `<div class="stat"><small>${k}</small><strong>${v}</strong></div>`
  ).join("");
}

function renderTabs(){
  const tabs = document.getElementById("weekTabs");
  tabs.innerHTML =
    `<button class="week-tab ${state.week==="all"?"active":""}" data-week="all">Todas</button>` +
    SCHEDULE.map(w =>
      `<button class="week-tab ${String(state.week)===String(w.week)?"active":""}" data-week="${w.week}">Semana ${w.week}</button>`
    ).join("");

  tabs.querySelectorAll(".week-tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.week = btn.dataset.week;
      render();
    });
  });
}

function renderName(name){
  return `<span class="name ${name===TARGET?"carlos":""}">${name}</span>`;
}

function renderSector(key, sector){
  const mine = hasCarlosInSector(sector);
  const trades = sector.tradeIds || [];
  return `
    <div class="sector ${mine?"carlos-sector":""}">
      <div class="sector-head">
        <span class="sector-title">${sector.label}</span>
        <span class="sector-time">${sector.time}</span>
      </div>
      <div class="names">${sector.names.map(renderName).join("")}</div>
      ${trades.length ? `<div class="trade-mark">troca ${trades.map(t=>"#"+t.id).join(", ")}</div>` : ""}
    </div>`;
}

function renderDay(day){
  const mine = hasCarlos(day);
  if(state.onlyCarlos && !mine) return "";
  return `
    <article class="day-card ${mine?"carlos-day":""}" data-date="${day.date}">
      <div class="day-top">
        <div class="day-title">
          <strong>${day.weekday}</strong>
          <span>${brDate(day.date)}</span>
        </div>
        ${mine?`<span class="me-badge">Carlos</span>`:""}
      </div>
      <div class="sectors-grid">
        ${Object.entries(day.sectors).map(([key,sector])=>renderSector(key,sector)).join("")}
      </div>
    </article>`;
}

function render(){
  renderTabs();
  renderSummary();

  const root = document.getElementById("scheduleRoot");
  const weeks = SCHEDULE.filter(w => state.week==="all" || String(w.week)===String(state.week));

  root.innerHTML = weeks.map(w => {
    const daysHtml = w.days.map(renderDay).join("");
    if(!daysHtml.trim()) return "";
    const myCount = w.days.filter(hasCarlos).length;
    return `
      <section class="week-card" data-week="${w.week}">
        <div class="week-head">
          <h2>Semana ${w.week} • ${w.period}</h2>
          <small>${myCount} dia${myCount!==1?"s":""} com Carlos</small>
        </div>
        ${daysHtml}
      </section>`;
  }).join("");

  document.getElementById("btnAll").classList.toggle("active", !state.onlyCarlos);
  document.getElementById("btnCarlos").classList.toggle("active", state.onlyCarlos);
}

function renderTrades(){
  const sectorName = {
    eixoDia:"Eixo Diurno", eixoNoite:"Eixo Noturno", porta:"Porta HUL",
    utiHul:"UTI HUL", utiConceicao:"UTI Conceição"
  };
  document.getElementById("tradePanel").innerHTML = `
    <table class="trade-table">
      <thead><tr>
        <th>ID</th><th>Solicitante</th><th>Substituto</th><th>Setor</th>
        <th>Plantão cedido</th><th>CH</th><th>Recomposição</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${TRADES.map(t=>`
          <tr>
            <td>${t.id}</td><td>${t.requester}</td><td>${t.substitute}</td>
            <td>${sectorName[t.sector]}</td><td>${brDate(t.ceded)}</td>
            <td>${t.hours}</td><td>${brDate(t.compensation)}</td>
            <td class="trade-status">${findDay(SCHEDULE,t.compensation)?"aplicada":"recomposição fora do período"}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function currentWeek(){
  const now = new Date();
  const found = SCHEDULE.find(w => {
    const first = parseDate(w.days[0].date);
    const last = parseDate(w.days[w.days.length-1].date);
    last.setHours(23,59,59,999);
    return now >= first && now <= last;
  });
  return found?.week ?? "all";
}

document.getElementById("btnAll").addEventListener("click", ()=>{
  state.onlyCarlos = false; render();
});
document.getElementById("btnCarlos").addEventListener("click", ()=>{
  state.onlyCarlos = true; render();
});
document.getElementById("btnPrint").addEventListener("click", ()=>window.print());
document.getElementById("btnCurrent").addEventListener("click", ()=>{
  state.week = currentWeek();
  render();
  window.scrollTo({top:document.querySelector(".toolbar").offsetTop-10,behavior:"smooth"});
});
document.getElementById("tradeToggle").addEventListener("click", ()=>{
  const p = document.getElementById("tradePanel");
  p.classList.toggle("hidden");
  document.getElementById("tradeArrow").textContent = p.classList.contains("hidden") ? "＋" : "−";
});

renderTrades();
render();

if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  navigator.serviceWorker.register("./sw.js").catch(()=>{});
}
