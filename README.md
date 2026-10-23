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
- Einstellungen als Kategorie-Fenster, getrennt für Nutzer, Admins und Superadmin
- Freiwillige private Profile mit Foto und Wohnort; öffentliche Profile nur nach ausdrücklicher Freigabe
- Persönlicher Superadminbereich mit eigenem Zusatzpasswort, Kontoliste und Rollenvergabe
- Kleiner Installationslink für Apple, Android, Windows und Mac
- Kompaktere Katalogabrufe; vollständige Importoriginale bleiben im Sicherungsexport
- JSON-Sicherung mit Vorschau zur ergänzenden Wiederherstellung
- Wetter am freigegebenen Gerätestandort, Duisburg als Ausweichort
- Uhrzeit, vier Jahreszeiten und schwebende Aktualisierung

Bedienhilfe: [Lesbare Hilfe](read.html) · [read.txt](read.txt) · [Impressum](impressum.html)

Ernannte Admins hinterlegen unter „Familie & Konto → KI-Zugänge“ gemeinsame Schlüssel
für OpenAI und/oder Gemini mit „Schlüssel speichern & prüfen“. Jedes Mitglied wählt
seinen Anbieter anschließend selbst unter „Meine KI“ und „KI-Auswahl speichern“.
Die Wahl gilt für das eigene Konto auf allen Geräten. Der Familienstandard ist nur
eine Vorgabe für Personen ohne eigene Wahl. Modelle bleiben pro Gerät/Anbieter gewählt.
API-Nutzung wird separat abgerechnet; das Familienlimit beträgt gemeinsam 20 Anfragen
pro Stunde und 100 je 24 Stunden; der Superadmin kann diese Anfragegrenzen ändern. GPT-6 Astra ist für wichtige Fragen mit Kosten-/Tokenhinweis wählbar.
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
„Familie & Konto → App & Gerät → App aktualisieren“ nach neuen Funktionen suchen; offene Formulare
und Dialoge in allen App-Tabs werden geschützt. Der schwebende Aktualisieren-Knopf
lädt Gartendaten und Wetter. Datum: TT.MM.JJJJ / HH:MM:SS mit kleinen Sekunden.

Videoentwürfe sind ungeprüfte räumliche Schätzungen; Maße selbst kontrollieren.

Supabase-Publishable-Key und Projektadresse sind öffentliche Konfiguration.
Private Gartendaten erfordern Anmeldung und passende Familienrechte.
Server-, OpenAI- und Gemini-Schlüssel gehören nicht in dieses Repository.

GitHub Pages veröffentlicht aus dem Hauptverzeichnis des Branches main.

Unter „Familie & Konto“ öffnen Kacheln ein Fenster mit sichtbarem Schließen-X.
Für alle: Profil, Meine KI, Design, Wetter, Kalender, App & Gerät, Konto & Daten.
Für ernannte Admins zusätzlich: Garten & Beete, Mitglieder, KI-Zugänge, Sicherungen.
Der persönliche Superadminbereich bleibt ausschließlich dem Betreiberkonto vorbehalten.
Beim ersten Öffnen ein eigenes Zusatzpasswort mit mindestens 12 Zeichen zweimal eingeben.
Weitere Gartenadmins erhalten keinen Zugang zu diesem persönlichen Bereich.

Profile sind zunächst privat. Eine Veröffentlichung gibt nur Anzeigename, gewähltes
Foto und separat freigegebenen Wohnort aus. E-Mail, Konto-ID und Gartendaten bleiben
ausgeschlossen. Auf privat stellen widerruft künftige Profil- und Fotoabrufe; zuvor
von anderen gespeicherte Kopien lassen sich nicht zurückholen. Profilfotos sind
komprimierte JPEGs in privaten Buckets, veröffentlichte Abrufe werden separat geprüft.
Das private Familienforum, persönliche Aufgaben und das gemeinsame Erntetagebuch stehen unter Gartenleben. Zusätzliche APK-/IPA-Dateien bleiben auf später verschoben.


Neu am 23. Oktober: Aufgaben mit Anbauvorschlägen und privater Kalenderdatei,
Familienforum mit Antworten und Moderation, Erntetagebuch mit komprimierten Fotos
und getrennte Gartenleben-Sicherungen. Sortendetails bündeln Aussaat, Pflege,
Nachbarn, Notizen und Fotos in aufklappbaren Abschnitten. Eigene Kontolöschung
verlangt das aktuelle Passwort, die genaue Bestätigung und gegebenenfalls eine
Gartenübergabe. Das Superadmin-Zusatzpasswort lässt sich nach frischer Bestätigung
per Betreiber-E-Mail zurücksetzen. Im entsperrten persönlichen Adminbereich können
neue Nutzer per E-Mail-Link eingeladen werden; sie wählen ihr eigenes Passwort
und erhalten normale Mitgliedsrechte. Kein temporäres Passwort per E-Mail.
Supabase-Standardversand begrenzt Empfänger auf das Projektteam. Für externe
Empfänger ist eigener SMTP-Zugang erforderlich. Kein kostenpflichtiges Upgrade
wurde aktiviert. Versandübergabe ist keine Zustellgarantie.


Der persönliche Adminbereich enthält jetzt Konten, Funktionen, KI-Limits,
Sicherheit, Protokoll und System. App-Konten lassen sich sperren/entsperren,
öffentliche Profile, Familienforum und KI zentral pausieren, Modelle einzeln
freigeben und Stunden-/24-Stunden-Anfragegrenzen je Familie festlegen.
Die Prüfungen greifen serverseitig. Das Protokoll speichert Verwaltungsaktionen,
keine Geheimnisse oder privaten Inhalte. Systemstatus zeigt den Programmstand
und begrenzte technische Metadaten. Anfragezähler sind kein Euro-/Tokenbudget.
Private Aufgaben und unveröffentlichte Profile bleiben auch vor dem Superadmin
verborgen. Kontolöschungen gesperrter Nutzer unterstützt der Betreiber.


Die Ergänzung vom 23. Oktober enthält 150 neue Gemüse-, Kräuter- und Beerensorten
sowie 25 weitere Gartenpraxis-Vorlagen: 638 Einträge in 60 Kultur-/Themengruppen,
darunter 40 Praxisvorlagen. Keine neuen Bäume oder Blumen. „Schattige Plätze“
filtert geeignete bestehende Sorten, ohne sie zu duplizieren. Lichte Schattenplätze
und trockener Vollschatten werden unterschieden; Wurzeln vorhandener Bäume schützen.
Sortendetails enthalten zunächst geschlossene Bereiche für Lebensdauer und Schnitt
sowie Standortwechsel und Fruchtfolge. Eigene Pflegeangaben bleiben erhalten.
Gartenpraxis lässt sich in eine persönliche Aufgabe übernehmen. Kulturwissen ist
allgemeine Orientierung zur Pflanzenart; Anbieterangaben und Beetgeschichte prüfen.
