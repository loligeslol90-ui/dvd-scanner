/* Bonuslife: Laufband, Ankaufsliste, Ablauf-Pfad */
(function () {
  "use strict";

  var ICONS = { "Filme": "film", "Musik": "musik", "Games": "games", "Comics": "comics", "Vinyl": "vinyl", "Sammlerstücke": "sammler" };
  var demo = /[?&]demo\b/.test(location.search);

  window.addEventListener("load", function () { document.body.classList.add("ist-geladen"); });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Live-Angebote (Format siehe daten/README.md) ---------- */
  function ladeAngebote(quelle) {
    var url = demo ? "daten/angebote.beispiel.json" : quelle;
    if (!url) return Promise.resolve([]);
    return fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (d) { return Array.isArray(d) ? d : (d && d.angebote) || []; })
      .catch(function () { return []; });
  }

  function preis(a) {
    if (typeof a.preis !== "number") return "";
    return a.preis.toLocaleString("de-DE", { style: "currency", currency: a.waehrung || "EUR" });
  }

  /* ---------- Laufband ---------- */
  var band = document.querySelector("[data-laufband]");
  if (band) {
    var spur = band.querySelector(".laufband-spur");
    var liste = band.querySelector(".laufband-liste");
    var inhalt = el("div", "laufband-inhalt");
    spur.insertBefore(inhalt, liste);
    inhalt.appendChild(liste);

    var aufbauen = function () {
      var alt = inhalt.querySelector("[data-kopie]");
      if (alt) alt.remove();
      var kopie = liste.cloneNode(true);
      kopie.setAttribute("data-kopie", "");
      kopie.setAttribute("aria-hidden", "true");
      kopie.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; });
      inhalt.appendChild(kopie);
      /* gleiche Geschwindigkeit, egal wie viele Einträge: etwa 60 px pro Sekunde */
      band.style.setProperty("--laufband-dauer", Math.max(20, liste.scrollWidth / 60) + "s");
    };

    ladeAngebote(band.dataset.quelle).then(function (angebote) {
      var slogan = liste.querySelector(".laufband-slogan");
      angebote.slice(0, 12).forEach(function (a) {
        if (!a.titel) return;
        var li = el("li");
        var img = el("img"); img.src = "assets/img/px/" + (ICONS[a.kategorie] || "disc") + "-creme.svg"; img.alt = ""; img.width = 14; img.height = 12;
        var ziel = a.url ? el("a") : el("span");
        if (a.url) { ziel.href = a.url; ziel.rel = "noopener"; }
        ziel.appendChild(el("b", null, demo ? "Beispiel: " : "Im Shop: "));
        ziel.appendChild(document.createTextNode(a.titel + (preis(a) ? ", " + preis(a) : "")));
        li.appendChild(img); li.appendChild(ziel);
        liste.insertBefore(li, slogan);
      });
      aufbauen();
    });

    var knopf = band.querySelector(".laufband-pause");
    var playIcon = '<svg viewBox="0 0 4 5" width="10" height="12" aria-hidden="true" shape-rendering="crispEdges"><rect width="1.4" height="5"/><rect x="1.4" y=".8" width="1.3" height="3.4"/><rect x="2.7" y="1.6" width="1.3" height="1.8"/></svg>';
    var pauseIcon = knopf.innerHTML;
    knopf.addEventListener("click", function () {
      var an = band.classList.toggle("angehalten");
      knopf.setAttribute("aria-pressed", String(an));
      knopf.setAttribute("aria-label", an ? "Laufband starten" : "Laufband anhalten");
      knopf.innerHTML = an ? playIcon : pauseIcon;
    });
  }

  /* ---------- Ankaufsliste ---------- */
  var form = document.querySelector("[data-ankauf]");
  if (form) {
    var SPEICHER = "bonuslife-ankaufsliste";
    var stuecke = [];
    try { stuecke = JSON.parse(localStorage.getItem(SPEICHER)) || []; } catch (e) { stuecke = []; }

    var eingabe = form.elements.stueck;
    var ul = form.querySelector("[data-liste]");
    var zahl = form.querySelector("[data-zahl]");
    var senden = form.querySelector("[data-senden]");
    var fehlerStueck = form.querySelector("[data-fehler-stueck]");
    var fehlerSenden = form.querySelector("[data-fehler-senden]");
    var danke = form.querySelector("[data-danke]");

    var speichern = function () { try { localStorage.setItem(SPEICHER, JSON.stringify(stuecke)); } catch (e) { /* ohne Speicher geht es auch */ } };

    var zeichnen = function () {
      ul.textContent = "";
      stuecke.forEach(function (s, i) {
        var li = el("li");
        var img = el("img"); img.src = "assets/img/px/" + (ICONS[s.kategorie] || "disc") + "-creme.svg"; img.alt = "";
        var text = el("span");
        text.appendChild(el("b", null, s.stueck));
        text.appendChild(el("small", null, s.kategorie + " · " + s.zustand));
        var weg = el("button", null, "Entfernen");
        weg.type = "button";
        weg.setAttribute("aria-label", s.stueck + " entfernen");
        weg.addEventListener("click", function () { stuecke.splice(i, 1); speichern(); zeichnen(); eingabe.focus(); });
        li.appendChild(img); li.appendChild(text); li.appendChild(weg);
        ul.appendChild(li);
      });
      if (stuecke.length) {
        zahl.innerHTML = "";
        zahl.appendChild(el("b", null, String(stuecke.length)));
        zahl.appendChild(document.createTextNode(stuecke.length === 1 ? " Stück auf deiner Liste" : " Stücke auf deiner Liste"));
      } else {
        zahl.textContent = "Noch nichts auf deiner Liste. Fang mit dem ersten Stück an.";
      }
      senden.hidden = !stuecke.length;
    };

    var hinzufuegen = function () {
      var wert = eingabe.value.trim();
      if (!wert) {
        fehlerStueck.hidden = false;
        eingabe.setAttribute("aria-invalid", "true");
        eingabe.focus();
        return;
      }
      fehlerStueck.hidden = true;
      eingabe.removeAttribute("aria-invalid");
      stuecke.push({ stueck: wert, kategorie: form.elements.kategorie.value, zustand: form.elements.zustand.value });
      speichern();
      zeichnen();
      danke.hidden = true;
      eingabe.value = "";
      eingabe.focus();
    };

    form.querySelector("[data-hinzu]").addEventListener("click", hinzufuegen);
    eingabe.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); hinzufuegen(); }
    });

    /* DVD-Rücken wählen die Kategorie vor */
    document.querySelectorAll("[data-kategorie]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        form.elements.kategorie.value = a.dataset.kategorie;
        document.querySelectorAll("[data-kategorie]").forEach(function (x) { x.classList.toggle("gewaehlt", x === a); });
        form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        eingabe.focus({ preventScroll: true });
      });
    });

    var fehler = function (text) { fehlerSenden.textContent = text; fehlerSenden.hidden = false; };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      fehlerSenden.hidden = true;
      var mail = form.elements.email;
      if (!mail.value.trim() || !mail.checkValidity()) {
        mail.setAttribute("aria-invalid", "true"); mail.focus();
        return fehler("Bitte gib eine gültige E-Mail-Adresse an, damit wir dir ein Angebot schicken können.");
      }
      mail.removeAttribute("aria-invalid");
      if (!form.elements.einwilligung.checked) {
        form.elements.einwilligung.focus();
        return fehler("Bitte bestätige kurz die Einwilligung zum Datenschutz.");
      }
      if (form.elements.website.value) return; /* Bot */

      var daten = {
        email: mail.value.trim(),
        nachricht: form.elements.nachricht.value.trim(),
        stuecke: stuecke,
        einwilligung: true,
        gesendet: new Date().toISOString()
      };
      var fertig = function () {
        stuecke = []; speichern(); zeichnen();
        form.elements.nachricht.value = "";
        danke.hidden = false; danke.focus();
      };

      var endpoint = form.dataset.endpoint;
      var adresse = form.dataset.mail;
      if (endpoint) {
        var knopf = form.querySelector(".btn-senden");
        knopf.disabled = true; knopf.textContent = "Wird gesendet …";
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(daten) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); fertig(); })
          .catch(function () { fehler("Das hat leider nicht geklappt. Versuch es bitte gleich noch einmal."); })
          .then(function () { knopf.disabled = false; knopf.textContent = "Liste senden"; });
      } else if (adresse) {
        var zeilen = stuecke.map(function (s, i) { return (i + 1) + ". " + s.stueck + " (" + s.kategorie + ", " + s.zustand + ")"; });
        var text = "Hallo Bonuslife,\n\ndiese Stücke möchte ich verkaufen:\n\n" + zeilen.join("\n") + (daten.nachricht ? "\n\n" + daten.nachricht : "") + "\n\nAntwort bitte an: " + daten.email;
        location.href = "mailto:" + adresse + "?subject=" + encodeURIComponent("Ankaufsliste (" + stuecke.length + " Stücke)") + "&body=" + encodeURIComponent(text);
        fertig();
      } else {
        fehler("Der Versand ist noch nicht eingerichtet. Deine Liste bleibt in diesem Browser gespeichert.");
      }
    });

    zeichnen();
  }

  /* ---------- Ablauf-Pfad füllt sich beim Scrollen ---------- */
  var pfad = document.querySelector("[data-pfad]");
  if (pfad && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var laufend = false;
    var messen = function () {
      laufend = false;
      var r = pfad.getBoundingClientRect(), h = window.innerHeight;
      var anteil = (h * 0.8 - r.top) / (r.height + h * 0.3);
      pfad.style.setProperty("--fuellung", Math.min(1, Math.max(0, anteil)).toFixed(3));
    };
    window.addEventListener("scroll", function () { if (!laufend) { laufend = true; requestAnimationFrame(messen); } }, { passive: true });
    messen();
  }
})();
