# Ramonas Garten 🌿

<img src="icon-192.png" width="80" height="80" alt="Ramonas Garten">

Private Familien-App für Pflanzensuche, Beete, Anbauplanung, Ernten, Notizen und Gartentermine. [Garten öffnen](https://marcelkometz-web.github.io/garten/) · [Gemeinsame App](https://marcelkometz-web.github.io/abnehmen/zuhause/).

## Bedienung und Kontakt

Die vollständige [Bedienhilfe](read.html) und ihre [Textfassung](read.txt) erklären Anmeldung, Freigaben, Installation, Pflege-/Kalenderfunktionen, optionale KI, Sicherungen und Kontoverwaltung. [Impressum und Datenschutz](impressum.html) sind vor der Anmeldung zugänglich. Der bestätigte Betreiberkontakt gilt für Garten, Rezepte und Ramonas Weg.

## Zugang und Datenschutz

Supabase prüft die persönliche Anmeldung und Familienmitgliedschaft. Eine Registrierung allein gewährt keinen Zugriff auf einen fremden Familiengarten. Rollen und der persönliche Adminbereich werden zusätzlich serverseitig geprüft. Öffentliche Profile und Kalenderabos sind bewusste, widerrufbare Freigaben; ihre Inhalte sind nicht mehr privat. API-Schlüssel liegen verschlüsselt auf dem Server und dürfen nicht in GitHub oder öffentliche Fehlerberichte gelangen. `config.json` enthält nur öffentliche Projektinformationen.

Garten, Rezepte und Abnehmen verwenden im selben Browser eine gemeinsame Anmeldung im lokalen Browserspeicher. Zehn Minuten ohne Bedienung beenden sie; Abmelden gilt gemeinsam. Passwort-Wiederherstellung führt zur anfordernden App zurück. Die privaten Tagebuchrechte bleiben auf die dafür freigeschalteten Konten beschränkt.

## Gemeinsame Oberfläche und Geräte

Unser Zuhause zeigt alle drei Apps in einem Fenster mit fester Navigation. Eingaben bleiben beim Bereichswechsel im Arbeitsspeicher; vor Schließen oder Neuladen speichern. Nur die oberste gemeinsame Startseite `/abnehmen/zuhause/` derselben Origin darf geschützte Bereiche einbetten. Fremde und verschachtelte Frames bleiben gesperrt. Regelmäßige Datenabfragen pausieren in inaktiven Bereichen. Die gemeinsame Startseite stellt außerdem Hilfe, Impressum, Viewport-/Touch-Anpassungen und die Installationsanleitung bereit.

## Entwicklung und Veröffentlichung

Dieser Checkout enthält die ausgelieferten statischen Dateien einschließlich `app.js`, `help.js` und des auf `/garten/` begrenzten Service Workers. Syntaxprüfung: `node --check app.js`. GitHub Pages veröffentlicht `main` aus dem Repository-Hauptverzeichnis. Beim Ändern der ausgelieferten Dateien die Versionskennung aktualisieren und Browser-/Service-Worker-Aktualisierungen prüfen. Supabase-Funktionen und vorhandene Migrationen unter `supabase/` gehören zum bereits gemeinsam verwendeten Gartenprojekt; keine ungeprüften Schema-Pushes aus einem Teilprojekt durchführen.

Private Backups, Tokens, echte Nutzeridentitäten und Gesundheitsdaten gehören nicht in dieses öffentliche Repository. Der JSON-Export ersetzt keine vollständige Datenbank-/Storage-Sicherung. [Plattformprüfung](https://github.com/marcelkometz-web/abnehmen/blob/main/docs/plattformen-und-performance-2026-10-31.md) · [Datenbankprüfung](https://github.com/marcelkometz-web/abnehmen/blob/main/docs/datenbankpruefung-2026-10-31.md).
