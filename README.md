# Ramonas Garten

Private Familien-Web-App: https://marcelkometz-web.github.io/newgarten/

Diese Dateien sind die veröffentlichte Oberfläche für GitHub Pages.

- Kompakte Startseite mit gebündelter Suche, KI-Aktionen und aufklappbarem Wetter
- Gartensprüche: alle 5 Minuten, mindestens 4 Stunden ohne Wiederholung auf diesem Gerät
- Kulturgruppen mit Sortenauswahl, Suche und regionaler Anbauplanung
- Beete mit Fotos, Maßen, Gartenjahren, Mehrfachbelegung und Positionsauswahl
- Bearbeitbarer 2D-Lageplan mit optionalem Video-/Fotoentwurf über die gewählte Garten-KI
- Gemeinsame Notizen, Teilen/WhatsApp und Drucken/PDF direkt in jeder Sorte
- Aufklappbares KI-Fragefeld mit Sortenkontext
- Gemeinsame Gartentermine für Aussaat, Pflege und Einkäufe mit privatem Apple-/Google-Kalenderabo
- Eigene KI-Auswahl je Mitglied, gemeinsame verschlüsselte Anbieterzugänge
- Automatische Programmupdates, zusätzlicher Knopf „App aktualisieren“
- Sichtbares Schließen-X beim Scrollen und jährliche Frostvorsorge als Tag/Monat
- Bedienhilfe im saisonalen App-Design mit read.txt-Download
- JSON-Sicherung mit Vorschau zur ergänzenden Wiederherstellung
- Wetter am freigegebenen Gerätestandort, Duisburg als Ausweichort
- Uhrzeit, vier Jahreszeiten und schwebende Aktualisierung

Bedienhilfe: [Lesbare Hilfe](read.html) · [read.txt](read.txt) · [Impressum](impressum.html)

Die Familienverwaltung hinterlegt unter „Zwei Zugänge. Freie Wahl.“ gemeinsame Schlüssel
für OpenAI und/oder Gemini mit „Schlüssel speichern & prüfen“. Jedes Mitglied wählt
seinen Anbieter anschließend selbst unter „Meine KI“ und „KI-Auswahl speichern“.
Die Wahl gilt für das eigene Konto auf allen Geräten. Der Familienstandard ist nur
eine Vorgabe für Personen ohne eigene Wahl. Modelle bleiben pro Gerät/Anbieter gewählt.
API-Nutzung wird separat abgerechnet; das Familienlimit beträgt gemeinsam 20 Anfragen
pro Stunde. GPT-6 Astra ist für wichtige Fragen mit Kosten-/Tokenhinweis wählbar.
Standard bleibt GPT-5.4 mini. Private Schlüssel gehören nicht in dieses Repository.

Gartentermine werden im Familiengarten gespeichert. „Kalenderabo einrichten“ erstellt
einen privaten, widerrufbaren Link pro Mitglied. In Apple Kalender abonnieren oder in
Google Kalender über „Weitere Kalender → Per URL“ eintragen und auf Android einblenden.
Apple/Google bestimmen den Abrufrhythmus. Das Abo ist einseitig; Termine in der App
bearbeiten. Jeder mit dem Link kann die gewählten Termindaten lesen: privat aufbewahren.
Apple-Zugangsdaten werden nicht benötigt. Alternativ einzelne .ics-Dateien importieren;
solche Datei-Importe werden nicht automatisch aktualisiert. Der reale Import und
Erinnerungen auf physischen Apple-/Android-Geräten wurden noch nicht geprüft.

Einmal neu laden, um die neue Updatefunktion erstmals zu erhalten. Danach unter
„Familie & Konto → App aktualisieren“ nach neuen Funktionen suchen; offene Formulare
und Dialoge in allen App-Tabs werden geschützt. Der schwebende Aktualisieren-Knopf
lädt Gartendaten und Wetter. Datum: TT.MM.JJJJ / HH:MM:SS mit kleinen Sekunden.

Videoentwürfe sind ungeprüfte räumliche Schätzungen; Maße selbst kontrollieren.

Supabase-Publishable-Key und Projektadresse sind öffentliche Konfiguration.
Private Gartendaten erfordern Anmeldung und passende Familienrechte.
Server-, OpenAI- und Gemini-Schlüssel gehören nicht in dieses Repository.

GitHub Pages veröffentlicht aus dem Hauptverzeichnis des Branches main.
