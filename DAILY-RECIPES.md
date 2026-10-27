# Tägliche Rezeptideen

Die Startseite zeigt angemeldeten, freigegebenen Garten-Mitgliedern zwei täglich wechselnde Ideen aus eurer Rezeptsammlung. `daily-recipes.js` benutzt den bereits vorhandenen Supabase-Client; es gibt keine zusätzliche Anmeldung, Schlüsselkopie oder weitere Auth-Instanz.

Die neue, ausschließlich lesende Funktion `recipes-daily` prüft Konto, aktuelle Sitzung und Familienmitgliedschaft und liefert für das gewählte Datum nur die beiden Rezeptvorschläge. Beim Abmelden oder Verlassen der Übersicht wird der Baustein geleert. Es werden keine Rezeptdaten im lokalen Speicher abgelegt. Links enthalten ausschließlich eine Rezept-ID, keine Tokens. Die Rezept-App öffnet das Rezept nach ihrer eigenen Anmeldung.

Quellen des kleinen Bundles: `src/garden-daily.mjs`, `src/daily-recipes.mjs` und `src/domain.mjs` im Repository `abnehmen`. Der einzige Eingriff in das vorhandene Garten-Bundle ist der Aufruf des Zusatzbausteins nach einer Darstellung. Die neuen Dateien sind im Service-Worker ausschließlich als öffentliche Programmdateien enthalten. API-Antworten und Rezeptinhalte werden nicht offline gespeichert.
