# Qualitätssicherung

Stand: 23. November 2026.

## Automatisierte Prüfungen

- Syntaxprüfung von App, Datenmodulen, Core und Designvorschau mit Node.
- 60 eindeutige Aufgaben, sechs Themen, sieben Formate und 24 offene Aufgaben mit Kriterien.
- Richtige und falsche Antworten einschließlich Mehrfachzuordnung und Lückentext-Normalisierung.
- Keine automatische Bewertung offener Texte.
- Je 300 zufällige Klausuren pro Anforderungsniveau: zwölf Aufgaben, alle Themen, sechs offene Fragen, geforderte AFB.
- Fortschritt aus tatsächlichen Bewertungen; Start bei null.
- Wiederholungsplanung der Karteikarten.
- Gegenläufige Modellreaktionen im Leitzinslabor.

## Browserprüfung

- Dashboard bei Desktopbreite und schmaler Smartphonebreite visuell kontrolliert; keine horizontale Seitenüberbreite auf Smartphone.
- Dark und Light Mode kontrolliert, mobile Navigation geöffnet und geschlossen.
- Richtige Multiple-Choice-Antwort gespeichert und Fortschritt dynamisch aktualisiert.
- Begriffspaare interaktiv verbunden und korrekt mit drei Punkten bewertet.
- Klausurantwort nach Neuladen erhalten; Timer läuft anhand der absoluten Endzeit weiter.
- Manuelle Abgabe öffnet erst danach Lösungen und Kriterien. Vollständige Selbstbewertung zeigt den Gesamtprozentwert.
- Einminütiger Testdurchlauf nach echter Wartezeit automatisch abgegeben.
- Karte umgedreht und als gewusst gespeichert; nach Neuladen aus der fälligen Auswahl entfernt.
- Leitzinsregler per Tastatur auf den Höchstwert gestellt; Kredit-/Sparzinsen steigen, Nachfrage- und Inflationsdruckindizes fallen.
- Alle drei Designvorschauen visuell kontrolliert; Vorschaukarte umgedreht und Alternativstil auf die App angewendet.
- Glossarsuche nach Mindestreserve zeigt passenden Begriff und Rechenweg.
- Handlungsprodukte gespeichert und nach Neuladen wieder verfügbar.

Browserbedienung erfolgte über die verfügbaren Chrome-/In-App-Browserwerkzeuge; die tatsächlichen CSS-Seitenbreiten betrugen unter anderem 1295 px und 351 px. Die responsive Darstellung wurde anhand von Screenshots und DOM-Maßen überprüft. Das ist keine vollständige Prüfung jedes Endgeräts und Screenreaders.

## Grenzen

- Offene Antworten und frei formulierte Szenariobegründungen benötigen Selbstbewertung.
- Das Labor ist didaktisch, keine empirische Prognose.
- Speicherung ist browserlokal. Gerätesynchronisierung erfolgt bei Bedarf über JSON-Export und -Import.
- Keine verbindliche Aussage über eine konkrete Klausurnote oder Aufgabenverteilung der Schule.

## Retro-/ASCII-Vorschau

- Fenster per Titelleiste gezogen; neue Position im DOM und in den Desktop-Einstellungen bestätigt.
- Minimieren und Wiederherstellen erhält den eingestellten Modellzins.
- Maximieren und Schließen der Lernprogramme getestet.
- Pastell- und Terminal-Modus einschließlich eingebettetem Lerninhalt geprüft.
- Modellzins per Tastatur auf 6 % gesetzt; Richtung und Modellwerte reagieren.
- Vollständige Module im eingebetteten Lernfenster geladen.
- Schmale Darstellung verwendet gestapelte Fenster und eine kompakte Taskleiste.
