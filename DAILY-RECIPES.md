# Tägliche Rezeptideen

Die Startseite zeigt angemeldeten, freigegebenen Garten-Mitgliedern zwei täglich wechselnde Ideen aus eurer Rezeptsammlung. `daily-recipes.js` benutzt den bereits vorhandenen Supabase-Client; es gibt keine zusätzliche Anmeldung, Schlüsselkopie oder weitere Auth-Instanz.

Die neue, ausschließlich lesende Funktion `recipes-daily` prüft Konto, aktuelle Sitzung und Familienmitgliedschaft und liefert für das gewählte Datum nur die beiden Rezeptvorschläge. Beim Abmelden oder Verlassen der Übersicht wird der Baustein geleert. Es werden keine Rezeptdaten im lokalen Speicher abgelegt. Links enthalten ausschließlich eine Rezept-ID, keine Tokens. Die Rezept-App übernimmt die gemeinsame Browser-Anmeldung und öffnet das Rezept in einem neuen Tab; der aktuelle Garten bleibt geöffnet.

Quellen des kleinen Bundles: `src/garden-daily.mjs`, `src/daily-recipes.mjs` und `src/domain.mjs` im Repository `abnehmen`. Der einzige Eingriff in das vorhandene Garten-Bundle ist der Aufruf des Zusatzbausteins nach einer Darstellung. Die neuen Dateien sind im Service-Worker ausschließlich als öffentliche Programmdateien enthalten. API-Antworten und Rezeptinhalte werden nicht offline gespeichert.

Die Anmeldung wird durch `shared-auth.js` mit Rezepte und Abnehmen geteilt. Nur Sitzungsdaten, die gemeinsame Bedienungszeit und der Wiederherstellungszustand werden dafür im lokalen Speicher verwaltet. Nach zehn Minuten ohne Bedienung aller drei Apps oder bei einer Abmeldung endet die gemeinsame Anmeldung. Zugriff auf Abnehmen erfordert weiterhin dessen eigene administrative Freigabe. Quelle des Moduls: `src/shared-auth.mjs` im Repository Abnehmen.
