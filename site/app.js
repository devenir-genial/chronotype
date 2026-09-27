(() => {
  const $ = (sel) => document.querySelector(sel);
  const screens = { home: $("#screen-home"), quiz: $("#screen-quiz"), result: $("#screen-result") };
  const TYPES = ["lion", "ours", "loup", "dauphin"]; // ordre fixe : la couleur suit le chronotype

  let answers = {};
  let history = [];
  let order3 = []; // ordre d'affichage (mélangé) des réponses de la partie 3

  // ---------- Logique du questionnaire ----------

  const count = (prefix, n, val) => {
    let c = 0;
    for (let i = 0; i < n; i++) if (answers[`${prefix}-${i}`] === val) c++;
    return c;
  };
  const part1True = () => count("p1", PART1.length, true);
  const isDolphinByPart1 = () => part1True() >= 7;
  const part2Score = () => PART2.reduce((s, _, i) => s + (answers[`p2-${i}`] || 0), 0);

  const typeFromScore = (s) => (s <= 32 ? "lion" : s <= 47 ? "ours" : "loup");
  const isBorderline = (s) => (s >= 31 && s <= 34) || (s >= 46 && s <= 49);

  // Type après la partie 2 et, le cas échéant, le départage énergie matin/soir
  function mainType() {
    const s = part2Score();
    const base = typeFromScore(s);
    if (!isBorderline(s) || answers["e-0"] == null || answers["e-1"] == null) return base;
    const diff = answers["e-0"] - answers["e-1"];
    // À la frontière, le livre recommande l'Ours par défaut ; le mini-test peut trancher pour le voisin.
    if (s <= 40) return diff >= 2 ? "lion" : "ours";
    return diff <= -2 ? "loup" : "ours";
  }

  const needsDolphinCheck = () => { const t = part1True(); return t >= 5 && t < 7; };

  function finalType() {
    if (isDolphinByPart1()) return "dauphin";
    const t = mainType();
    if (needsDolphinCheck() && answers["d-0"] != null) {
      const check = DOLPHIN_CHECK[t];
      const hits = [0, 1, 2].filter((i) => answers[`d-${i}`] === check.dolphinIf).length;
      if (hits >= 2) return "dauphin";
    }
    return t;
  }

  // Parcours : P1 → (Dauphin ? P3) : P2 → [affinage] → [vérification Dauphin] → P3
  function nextStep(id) {
    if (id == null) return "p1-0";
    const [kind, iStr] = id.split("-");
    const i = +iStr;
    const afterPart2 = () => (needsDolphinCheck() ? "d-0" : "p3-0");
    if (kind === "p1") {
      if (i < PART1.length - 1) return `p1-${i + 1}`;
      return isDolphinByPart1() ? "p3-0" : "p2-0";
    }
    if (kind === "p2") {
      if (i < PART2.length - 1) return `p2-${i + 1}`;
      return isBorderline(part2Score()) ? "e-0" : afterPart2();
    }
    if (kind === "e") return i === 0 ? "e-1" : afterPart2();
    if (kind === "d") return i < 2 ? `d-${i + 1}` : "p3-0";
    if (kind === "p3") return i < PART3.length - 1 ? `p3-${i + 1}` : null;
    return null;
  }

  // Nombre total de questions prévu avec les réponses actuelles
  function plannedTotal() {
    let n = 0;
    for (let id = nextStep(null); id && n < 100; id = nextStep(id)) n++;
    return n;
  }

  const partKey = (id) => id.split("-")[0];
  const partSize = { p1: PART1.length, p2: PART2.length, p3: PART3.length, e: ENERGY.length, d: 3 };

  function describe(id) {
    const kind = partKey(id);
    const i = +id.split("-")[1];
    const tf = [{ label: "Vrai", value: true }, { label: "Faux", value: false }];
    const base = { kind, part: QUIZ_PARTS[kind].title, num: i + 1, total: partSize[kind], intro: i === 0 ? QUIZ_PARTS[kind].intro : "" };
    if (kind === "p1") return { ...base, ...PART1[i], options: tf, compact: true };
    if (kind === "p2") return { ...base, ...PART2[i], options: PART2[i].a.map((label, k) => ({ label, value: k + 1 })) };
    if (kind === "e") return { ...base, ...ENERGY[i], options: [1, 2, 3, 4, 5].map((v) => ({ label: String(v), value: v })), scale: true };
    if (kind === "d") return { ...base, ...DOLPHIN_CHECK[mainType()].items[i], options: tf, compact: true };
    const q = PART3[i];
    return { ...base, ...q, options: order3[i].map((k) => ({ label: q.a[k][0], value: k })) };
  }

  // ---------- Analyse fine : répartition entre les 4 chronotypes ----------

  function affinity() {
    const empty = () => ({ lion: 0, ours: 0, loup: 0, dauphin: 0 });
    const overall = empty();
    const byTheme = {};
    const add = (theme, type) => {
      overall[type]++;
      (byTheme[theme] = byTheme[theme] || empty())[type]++;
    };
    PART1.forEach((q, i) => { if (answers[`p1-${i}`] === true) add(q.theme, "dauphin"); });
    PART2.forEach((q, i) => { const v = answers[`p2-${i}`]; if (v) add(q.theme, ["lion", "ours", "loup"][v - 1]); });
    PART3.forEach((q, i) => { const v = answers[`p3-${i}`]; if (v != null) add(q.theme, q.a[v][1]); });

    const pct = (pts) => {
      const total = TYPES.reduce((s, t) => s + pts[t], 0) || 1;
      const out = {};
      TYPES.forEach((t) => (out[t] = { pts: pts[t], pct: Math.round((pts[t] / total) * 100) }));
      return out;
    };
    const dims = DIMENSIONS.map((d) => {
      const pts = empty();
      d.themes.forEach((th) => { if (byTheme[th]) TYPES.forEach((t) => (pts[t] += byTheme[th][t])); });
      return { name: d.name, data: pct(pts) };
    });
    return { overall: pct(overall), dims };
  }

  const ranked = (data) => [...TYPES].sort((a, b) => data[b].pct - data[a].pct);

  // ---------- Affichage ----------

  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderStep(id) {
    const d = describe(id);
    $("#part-label").textContent = d.part;
    $("#count-label").textContent = `${d.num} / ${d.total}`;
    const total = plannedTotal();
    $("#bar").style.width = `${Math.round((history.length / total) * 100)}%`;
    $("#bar").parentElement.title = `Question ${history.length + 1} sur ${total}`;
    $("#part-intro").textContent = d.intro;
    $("#part-intro").hidden = !d.intro;
    $("#theme").textContent = d.theme || "";
    $("#question-text").textContent = d.q;
    $("#hint").textContent = d.hint || "";
    $("#hint").hidden = !d.hint;

    const box = $("#options");
    box.className = "options" + (d.compact ? " compact" : "") + (d.scale ? " scale" : "");
    box.innerHTML = "";
    d.options.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option" + (answers[id] === opt.value ? " selected" : "");
      b.textContent = opt.label;
      b.addEventListener("click", () => choose(id, opt.value, b));
      box.appendChild(b);
    });
    if (d.scale) {
      const legend = document.createElement("div");
      legend.className = "scale-legend";
      legend.innerHTML = "<span>Très faible</span><span>Très élevée</span>";
      box.appendChild(legend);
    }
    $("#back").style.visibility = history.length ? "visible" : "hidden";

    const card = $("#question-card");
    card.classList.remove("enter");
    void card.offsetWidth;
    card.classList.add("enter");
  }

  function choose(id, value, btn) {
    answers[id] = value;
    [...$("#options").children].forEach((c) => c.classList.remove("selected"));
    btn.classList.add("selected");
    setTimeout(() => {
      const next = nextStep(id);
      history.push(id);
      if (next) renderStep(next);
      else finish();
    }, 220);
  }

  function back() {
    if (history.length) renderStep(history.pop());
  }

  function finish() {
    const type = finalType();
    const summary = {
      part1: part1True(),
      score: isDolphinByPart1() ? null : part2Score(),
      refined: answers["e-0"] != null,
      dolphinChecked: answers["d-0"] != null,
      analysis: affinity()
    };
    const date = Date.now();
    // Le résultat complet (score + analyse) est conservé sur l'appareil pour pouvoir le revoir
    try { localStorage.setItem("chronotype-result", JSON.stringify({ type, date, summary })); } catch (e) {}
    renderResult(type, summary, date);
    updateLastLink();
    try { window.history.replaceState(null, "", "#resultat"); } catch (e) {}
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const list = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

  function scoreText(type, s) {
    if (s.score == null) {
      return `Tu as répondu « Vrai » à ${s.part1} affirmations sur 10 dans la première partie (seuil : 7). C'est la signature du Dauphin.`;
    }
    let t = `Score de la partie 2 : <strong>${s.score} points</strong> (Lion : 19–32 · Ours : 33–47 · Loup : 48–61).`;
    if (s.refined) t += " Ton score étant à la frontière de deux profils, le test d'énergie matin/soir a permis de trancher.";
    if (s.dolphinChecked) t += type === "dauphin"
      ? " La vérification complémentaire confirme un profil Dauphin."
      : " La vérification complémentaire a écarté le profil Dauphin.";
    return t;
  }

  // Graphiques : barres horizontales (répartition globale) et barres empilées (par domaine)
  function analysisHtml(type, a) {
    const o = a.overall;
    const order = ranked(o);
    const second = order.find((t) => t !== type);
    const top = order[0];
    const P = PROFILES;

    let reading = `Ton chronotype dominant est <strong>${esc(P[type].name)}</strong>. `;
    if (top !== type) {
      reading += `Dans l'analyse fine, c'est pourtant le profil <strong>${esc(P[top].name)}</strong> qui ressort le plus (${o[top].pct} %) : tu es probablement un <strong>profil hybride</strong>. Lis les deux descriptions et garde celle qui te correspond environ 80 % du temps.`;
    } else if (o[second].pct >= 25) {
      reading += `Ta tendance secondaire est marquée : <strong>${esc(P[second].name)}</strong> (${o[second].pct} %). Certains traits de ce profil te parleront aussi.`;
    } else if (o[second].pct === 0) {
      reading += "Ton profil est très net : aucune autre tendance ne ressort de tes réponses.";
    } else {
      reading += `Ton profil est net : ta tendance secondaire (${esc(P[second].name)}, ${o[second].pct} %) reste discrète.`;
    }

    const bars = TYPES.map((t) => `
      <div class="hbar-row" data-tip="${esc(P[t].name)} : ${o[t].pct} % (${o[t].pts} réponse${o[t].pts > 1 ? "s" : ""})">
        <span class="hbar-label">${P[t].emoji} ${esc(P[t].name)}</span>
        <span class="hbar-track"><span class="hbar-fill" style="width:${o[t].pct}%;background:${P[t].color}"></span></span>
        <span class="hbar-value">${o[t].pct} %</span>
      </div>`).join("");

    const legend = TYPES.map((t) => `<span class="legend-item"><i style="background:${P[t].color}"></i>${esc(P[t].name)}</span>`).join("");

    const stacks = a.dims.map((d) => {
      const lead = ranked(d.data)[0];
      const segs = TYPES.filter((t) => d.data[t].pct > 0).map((t) =>
        `<span class="seg" style="flex:${d.data[t].pct};background:${P[t].color}" data-tip="${esc(d.name)} · ${esc(P[t].name)} : ${d.data[t].pct} %"></span>`).join("");
      return `
        <div class="stack-row">
          <div class="stack-head"><span>${esc(d.name)}</span><span class="stack-lead">${P[lead].emoji} ${esc(P[lead].name)} ${d.data[lead].pct} %</span></div>
          <div class="stack">${segs}</div>
        </div>`;
    }).join("");

    const table = `
      <table>
        <thead><tr><th>Domaine</th>${TYPES.map((t) => `<th>${esc(P[t].name)}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><th>Ensemble</th>${TYPES.map((t) => `<td>${o[t].pct} %</td>`).join("")}</tr>
          ${a.dims.map((d) => `<tr><th>${esc(d.name)}</th>${TYPES.map((t) => `<td>${d.data[t].pct} %</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>`;

    return `
      <section class="block analysis">
        <h2>Ton profil détaillé</h2>
        <p>${reading}</p>
        <h3>Répartition entre les 4 chronotypes</h3>
        <div class="hbars">${bars}</div>
        <h3>Nuances par domaine</h3>
        <div class="legend">${legend}</div>
        <div class="stacks">${stacks}</div>
        <details class="data-table"><summary>Voir les données sous forme de tableau</summary>${table}</details>
        <p class="muted">Calcul : chaque réponse des trois parties est rattachée au chronotype qu'elle évoque. Le chronotype dominant reste celui de la méthode du Dr Breus (parties 1 et 2) ; la répartition en affine la lecture.</p>
      </section>`;
  }

  function renderResult(type, summary, date) {
    const p = PROFILES[type];
    document.documentElement.style.setProperty("--type", p.color);
    const others = TYPES.filter((k) => k !== type);
    $("#restart").textContent = summary ? "Refaire le test" : "Faire le test";

    const today = new Date(date || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    $("#result").innerHTML = `
      <div class="print-header">
        <a href="https://devenirgenial.com"><img src="logo.png" alt="Devenir Génial" width="200" height="35"></a>
        <span class="print-meta">
          ${summary ? "Test réalisé le" : "Édité le"} ${today}<br>
          <a href="https://chronotype.devenirgenial.com">chronotype.devenirgenial.com</a>
        </span>
      </div>
      <div class="result-hero">
        <div class="result-emoji">${p.emoji}</div>
        <p class="eyebrow">${summary ? "Ton chronotype" : "Profil chronotype"}</p>
        <h1>${summary ? "Tu es " + esc(p.article) : esc(p.the)}</h1>
        <p class="lead">${esc(p.tagline)}</p>
        <p class="share-pop">${esc(p.share)}</p>
        ${summary ? "" : `<p><button class="btn primary" data-start>Faire le test pour connaître mon chronotype</button></p>`}
      </div>

      ${summary ? `<div class="note score">${scoreText(type, summary)}</div>` : ""}
      ${summary ? analysisHtml(type, summary.analysis) : ""}

      <section class="block">
        <h2>Pourquoi « ${esc(p.name)} » ?</h2>
        <p>${esc(p.why)}</p>
      </section>

      <section class="block grid2">
        <div class="box"><h3>Traits de caractère</h3><div class="chips">${p.traits.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
        <div class="box"><h3>Comportements typiques</h3>${list(p.behaviors)}</div>
      </section>

      <section class="block">
        <h2>Rythme veille / sommeil</h2>
        <div class="kv">${p.rhythm.map(([k, v]) => `<div class="kv-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}</div>
        <div class="clock">
          <div><span class="big">${esc(p.waketime)}</span><span>Lever idéal</span></div>
          <div><span class="big">${esc(p.bedtime)}</span><span>Coucher idéal</span></div>
        </div>
      </section>

      <section class="block">
        <h2>Portrait</h2>
        ${p.portrait.map((x) => `<p>${esc(x)}</p>`).join("")}
      </section>

      <section class="block grid3">
        <div class="box"><h3>💼 Travail</h3><p>${esc(p.work)}</p></div>
        <div class="box"><h3>❤️ Relations</h3><p>${esc(p.relations)}</p></div>
        <div class="box"><h3>🌿 Santé</h3><p>${esc(p.health)}</p></div>
      </section>

      <section class="block grid2">
        <div class="box good"><h3>Atouts</h3>${list(p.strengths)}</div>
        <div class="box warn"><h3>Points de vigilance</h3>${list(p.watch)}</div>
      </section>

      <section class="block">
        <h2>La journée idéale ${type === "ours" ? "de l'Ours" : "du " + esc(p.name)}</h2>
        <p class="muted">Le programme optimal pour cette horloge biologique. Il n'est pas toujours compatible avec tes contraintes : chaque pas qui t'en rapproche compte.</p>
        <ol class="timeline">
          ${p.day.map(([h, t]) => `<li><span class="time">${esc(h)}</span><span class="what">${esc(t)}</span></li>`).join("")}
        </ol>
      </section>

      <section class="block">
        <h2>À faire maintenant</h2>
        <ol class="tips">${p.tips.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
      </section>

      <div class="note">
        <strong>Bon à savoir :</strong> ton chronotype est génétique, tu ne peux pas en changer. Il évolue en revanche avec l'âge : les enfants sont souvent des Lions, les adolescents des Loups, les adultes des Ours, et les seniors des Lions ou des Dauphins. Entre 21 et 65 ans environ, il reste stable. Un doute ? Demande à un proche lequel des profils te ressemble le plus : on se voit rarement tel qu'on est.
      </div>

      <div class="print-footer">
        <p><strong>Refaire le test ou le partager :</strong> <a href="https://chronotype.devenirgenial.com">chronotype.devenirgenial.com</a></p>
        <p><strong>Aller plus loin avec Devenir Génial :</strong> <a href="https://devenirgenial.com">devenirgenial.com</a></p>
      </div>

      <section class="block others">
        <h2>Découvrir les autres chronotypes</h2>
        <div class="animals">${others.map(animalCard).join("")}</div>
      </section>
    `;
    show("result");
  }

  function animalCard(k) {
    const p = PROFILES[k];
    return `<a class="animal" href="#${k}" style="--c:${p.color}"><span class="emoji">${p.emoji}</span><strong>${esc(p.name)}</strong><small>${esc(p.share)}</small></a>`;
  }

  // Info-bulle au survol des graphiques
  const tip = $("#tooltip");
  document.addEventListener("mousemove", (e) => {
    const el = e.target.closest("[data-tip]");
    if (!el) { tip.hidden = true; return; }
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
    tip.style.transform = `translate(${x}px, ${e.clientY + 16}px)`;
  });

  // ---------- Événements ----------

  function shuffle(n) {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function start() {
    answers = {};
    history = [];
    order3 = PART3.map((q) => shuffle(q.a.length));
    try { window.history.replaceState(null, "", window.location.pathname); } catch (e) {}
    show("quiz");
    renderStep(nextStep(null));
  }

  $("#start").addEventListener("click", start);
  $("#start-2").addEventListener("click", start);
  $("#restart").addEventListener("click", start);
  $("#result").addEventListener("click", (e) => { if (e.target.closest("[data-start]")) start(); });
  $("#back").addEventListener("click", back);
  $("#print").addEventListener("click", () => window.print());
  $("#share").addEventListener("click", async () => {
    const url = window.location.origin + window.location.pathname;
    const data = { title: "Quel est ton chronotype ?", text: "Lion, Ours, Loup ou Dauphin ? Découvre ton chronotype :", url };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(url);
        $("#share").textContent = "Lien copié !";
        setTimeout(() => ($("#share").textContent = "Partager le test"), 2000);
      }
    } catch (e) {}
  });

  // Page d'accueil : animaux cliquables et déroulement du test
  $("#home-animals").innerHTML = TYPES.map(animalCard).join("");
  $("#home-steps").innerHTML = ["p1", "p2", "p3", "e", "d"].map((k) => {
    const [label, ...rest] = QUIZ_PARTS[k].title.split(" · ");
    return `<li><strong>${esc(label)} · ${esc(rest.join(" · "))}</strong><span>${esc(QUIZ_PARTS[k].home)}</span></li>`;
  }).join("");

  // Liens vers un profil (#lion, #ours, #loup, #dauphin) ; sans ancre, retour à l'accueil
  // Anciens liens en anglais (#bear, #wolf, #dolphin) redirigés vers les noms français
  const LEGACY = { bear: "ours", wolf: "loup", dolphin: "dauphin" };

  // Dernier résultat enregistré sur l'appareil (anciens enregistrements sans analyse ignorés)
  function loadLast() {
    try {
      const last = JSON.parse(localStorage.getItem("chronotype-result") || "null");
      if (!last) return null;
      if (LEGACY[last.type]) last.type = LEGACY[last.type];
      return PROFILES[last.type] ? last : null;
    } catch (e) { return null; }
  }

  function route() {
    const t = window.location.hash.slice(1);
    if (LEGACY[t]) { window.location.replace(`#${LEGACY[t]}`); return; }
    if (t === "resultat") {
      const last = loadLast();
      if (last && last.summary) renderResult(last.type, last.summary, last.date);
      else if (last) window.location.replace(`#${last.type}`);
      else { window.history.replaceState(null, "", window.location.pathname); show("home"); }
      return;
    }
    if (PROFILES[t]) renderResult(t, null);
    else if (!t && screens.result.classList.contains("active")) show("home");
  }
  window.addEventListener("hashchange", route);

  $("#year").textContent = new Date().getFullYear();

  // Rappel du dernier résultat
  function updateLastLink() {
    const last = loadLast();
    if (!last) return;
    const when = last.date ? ` du ${new Date(last.date).toLocaleDateString("fr-FR")}` : "";
    $("#last-result").innerHTML = `<a class="btn link" href="${last.summary ? "#resultat" : "#" + last.type}">Revoir mon dernier résultat${when} : ${esc(PROFILES[last.type].name)} ${PROFILES[last.type].emoji}</a>`;
  }
  updateLastLink();

  route();
})();
