# Geldpolitik · weiter.

Interaktives Lernstudio für Lerngebiet 7, Klasse 13 am Beruflichen Gymnasium Wirtschaft.

- Website: https://schafermax809-arch.github.io/vwl-geldpolitik/
- Drei Designs: https://schafermax809-arch.github.io/vwl-geldpolitik/designs.html
- Hauptplattform: https://schafermax809-arch.github.io/lernzettel/

## Retro-/ASCII-Desktop als Startseite

Unter [retro.html](https://schafermax809-arch.github.io/vwl-geldpolitik/retro.html) ist der vollständig bedienbare „VWL OS“-Desktop ebenfalls erreichbar: Pastell-Desktop, Terminal-Modus, Pixel-Symbole, verschiebbare und minimierbare Fenster, Taskleiste und ein animiertes ASCII-Zinslabor. Die Lernprogramme öffnen sich über `workbench.html` mit einem eigenen Retro-Stil. Die reguläre Startseite `index.html` öffnet jetzt VWL OS. Die frühere Oberfläche bleibt unter `classic.html` verfügbar. Kapitel-, Aufgaben- und Ergebnislinks öffnen über `lib/os-routes.js` direkt das passende Programmfenster.

Es wird ein einziges Lernprogramm-Fenster wiederverwendet, sodass Klausuren, Aufgaben und Karten innerhalb derselben App-Instanz laufen. Lernstände werden unter dem vorhandenen Schlüssel gespeichert. Desktop-Thema und Fensterpositionen verwenden separat `vwl-os-preferences-v1`. Auf schmalen Bildschirmen werden Fenster untereinander angeordnet. Maximierte Programme füllen die gesamte sichtbare Seite; Desktop, andere Fenster und Taskleiste werden ausgeblendet. Über „Vollbild verlassen“ oder Escape (auch aus dem Lernprogramm heraus) kehrt man ohne Neuladen zum Desktop zurück.

## Enthalten

Sechs ausführliche Lernmodule, 60 kuratierte Aufgaben in sieben Formaten (darunter 24 offene Fragen), 37 Karteikarten mit Wiederholungsplanung, vier interaktive Simulationen, Glossar und vier Rechenwege, Mindmap und Forderungskatalog, Dark/Light Mode sowie drei vollständig anwendbare Gestaltungen.

Der Klausursimulator mischt zwölf Aufgaben aus allen sechs Themen, davon sechs offene. Anforderungsniveau und Zeitlimit sind einstellbar. Keine Lösungen während des Durchlaufs. Antworten und Ablaufzeit überstehen Neuladen. Nach Abgabe werden geschlossene Aufgaben automatisch ausgewertet. Offene Antworten werden ausdrücklich durch die lernende Person anhand von Musterlösungen und Kriterien bewertet. Erst nach vollständiger Selbstbewertung erscheint ein Gesamtprozentwert; keine automatische Textbenotung und keine offizielle Schulnote.

## Start & Architektur

Keine Installation oder Build-Schritte erforderlich. Node.js 20 oder neuer:

```sh
node tools/serve.mjs
```

Anschließend `http://127.0.0.1:4173` öffnen. Ein HTTP-Server ist für ES-Module notwendig; `file://` ist nicht unterstützt. Auf GitHub Pages wird das Repository-Hauptverzeichnis aus `main` veröffentlicht. `.nojekyll` verhindert eine unbeabsichtigte Jekyll-Verarbeitung. Alle lokalen Assets werden relativ aufgelöst und funktionieren auch unter `/vwl-geldpolitik/`.

```text
index.html         Anwendungshülle
app.js             Ansichten, Interaktionen, Speicherung
styles.css         responsive Tokens und drei Gestaltungsvarianten
data/content.js    Lernmodule, Begriffe, Formeln, Quellen, Szenarien
data/questions.js  Aufgaben, Lösungen, Erklärungen, Bewertungskriterien
lib/core.js        Bewertung, Klausurauswahl, Fortschritt, Kartenplanung
designs.html/js    eigenständig aufrufbarer interaktiver Designvergleich
assets/fonts/      selbst gehostete OFL-Schriften
tests/             Node-Tests für Lern- und Bewertungslogik
```

## Fortschritt und Datenschutz

`localStorage` unter `weiter-geldpolitik-v1`, ohne Konto oder Tracking. Pro Thema 50 % für die eigene Lesemarkierung und 50 % für vollständig gelöste Aufgaben. Es zählt die letzte Bewertung; offene Fragen fließen durch Selbsteinschätzung ein. Der Gesamtwert ist der Mittelwert der Themen. Der Lernkompass zeigt erst nach mindestens drei Aufgaben pro Thema eine Einschätzung.

JSON-Sicherung und bestätigter Import stehen unter „Material & Quellen“ bereit. Die Druckansicht der Handlungsprodukte kann über den Browser als PDF gespeichert werden. Daten werden nicht automatisch zwischen Geräten synchronisiert. Bei blockiertem oder vollem Browserspeicher erscheint ein Hinweis.

Karteikarten: „Nicht gewusst“ nach 5 Minuten; „Unsicher“ nach einem Tag; „Gewusst“ nach 1, 3, 7, 14 und 30 Tagen. Schwierige und alle Karten können jederzeit separat wiederholt werden.

## Material und fachliche Einordnung

Die bereitgestellte `VWL 9.pdf` ist die einzige fachliche Grundlage. Die Checkliste strukturiert die sechs Module. PDF-Seiten 2–13 enthalten das Vorwissen, 14–50 das Geldpolitikmaterial und S. 68 eine Instrumentenübersicht. Die private PDF und das Foto werden nicht öffentlich gespeichert. Module und alle 60 eigenständig formulierten Aufgaben enthalten Seitenverweise. Eine Inhaltsübersicht mit Zuordnung und entfernten Erweiterungen steht in `CONTENT-SCOPE.md`.

Externe Fachergänzungen wurden am 26. November 2026 entfernt. Die Anwendung beschreibt bei zeitabhängigen oder widersprüchlichen Angaben ausdrücklich die Darstellung der PDF: Preisziel um 2 %, einwöchige Hauptrefinanzierung in den Arbeitsblättern gegenüber der älteren 14-Tage-Box. Die widersprüchliche Laufzeit wird nicht geprüft. Die Mindestreserve wird als vereinfachtes Arbeitsblattmodell behandelt. Das Zinslabor zeigt ausschließlich Wirkungsrichtungen aus der PDF mit frei gewählten Übungswerten, keine zusätzlichen Wirtschaftsformeln oder prognostizierten Kennzahlen.

Geänderte Aufgaben erhalten neue IDs und Karten IDs nach ihrem Begriff, damit frühere Bewertungen nicht anderen Inhalten zugeordnet werden. Nicht mehr passende Antworten, Karten und Klausuren bleiben als `previousContent` im exportierbaren lokalen Lernstand erhalten. Unveränderte Aufgabenbewertungen, Notizen, Lesemarkierungen und Gestaltungseinstellungen bleiben nutzbar.

## Integration mit weiter.

Im Repository `lernzettel` ergänzt `sites.js` einen eigenständigen Eintrag „VWL – Geldpolitik“; `library.js` führt sechs direkte Kapitellinks. Die ursprüngliche VWL-Seite bleibt erhalten. `index.html` aktualisiert Zähler und Cache-Versionen. Die neue Anwendung speichert besuchte Kapitel unter `weiter-resume-v1:vwl-geldpolitik`, entsprechend dem vorhandenen Bibliotheksprotokoll. Beide Seiten teilen auf `schafermax809-arch.github.io` denselben Browser-Ursprung. Der Rücklink ist stets in der Navigation erreichbar.

## Prüfung

```sh
node --test tests/*.test.mjs
```

Die Tests prüfen Aufgabenabdeckung, die Bewertung geschlossener Formate, den Verzicht auf automatische offene Bewertung, Klausurmischung und Anforderungsbereiche, Fortschrittsberechnung, Kartenfälligkeiten und Modellrichtungen. Browserprüfungen sind in `QA.md` dokumentiert.

## Gestaltung

Empfehlung: **Financial Dashboard**, weil Datenhierarchie, Fortschritt und Labor zur Geldpolitik passen. Syne und Instrument Sans greifen die Typografie der Hauptplattform auf. Interactive Learning Studio und Minimal Editorial Learning bleiben unter `designs.html` erhalten und sind auf die vollständige Anwendung anwendbar. Schriftlizenzen liegen bei den Assets.
