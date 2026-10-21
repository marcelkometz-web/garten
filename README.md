# newgarten

Ramonas Garten: gemeinsame Pflanzen, Beete und Notizen mit eigener Anmeldung je Familienmitglied.

Web-App: https://marcelkometz-web.github.io/newgarten/

Dieses Repository enthält die fertigen statischen Programmdateien für GitHub Pages. Der Veröffentlichungszweig ist `main`, das Verzeichnis ist `/`.

## Supabase einrichten

Die Datenbankregeln und die Funktion `garden-ai` liegen im bestätigten Supabase-Projekt `wwybkswpyoyowciumxda`. Der öffentliche Publishable-Key in `config.json` darf im Browser stehen. Er gewährt keinen Zugriff auf private Gartendaten; dafür sind Anmeldung und Familienmitgliedschaft erforderlich.

In [Auth → URL Configuration](https://supabase.com/dashboard/project/wwybkswpyoyowciumxda/auth/url-configuration) die Site URL und Redirect URL auf `https://marcelkometz-web.github.io/newgarten/` setzen. E-Mail-Bestätigung aktivieren und eine Mindestpasswortlänge von 12 Zeichen konfigurieren.

Für die optionale KI in [Edge Function Secrets](https://supabase.com/dashboard/project/wwybkswpyoyowciumxda/functions/secrets) konfigurieren:

- `APP_ORIGIN`: `https://marcelkometz-web.github.io` (ohne Pfad und ohne abschließenden Slash).
- `GEMINI_API_KEY`: dein Google-Gemini-Schlüssel, ausschließlich als Server-Secret.
- `GEMINI_MODEL`: eine in deinem Konto verfügbare Modell-ID; Standard `gemini-2.5-flash`.

Der Gemini-Schlüssel ist nicht in diesem Repository enthalten. Diese Auth-/Secret-Einstellungen müssen vor dem jeweiligen Betrieb im Supabase-Dashboard geprüft werden.

## Familie anlegen

Eine Person registriert sich, bestätigt ihre E-Mail und legt den gemeinsamen Garten an. Weitere Personen registrieren und bestätigen ihr Konto, legen aber keinen eigenen Garten an. Die Familienverwaltung fügt sie anschließend über „Familie & Konto“ hinzu.

Alle Familienmitglieder dürfen gemeinsame Gartendaten bearbeiten und löschen. Die Datenbank begrenzt alle Zugriffe auf die aktuelle Familie. Änderungen werden beim Speichern auf Versionskonflikte geprüft. Der Service Worker speichert nur öffentliche Programmdateien.

## Hosting und Wartung

GitHub Pages unterstützt keine eigenen HTTP-Sicherheitsheader. Die Content Security Policy steht deshalb zusätzlich im HTML. `_headers` wird von GitHub Pages nicht ausgewertet; `security-headers.json` ist Metadaten für den optionalen Node-Hostingserver. Für einen Host mit eigener Header-Konfiguration ist `_headers` vorbereitet.

`newgarten` ist für den Pfad `/newgarten/` gebaut. Bei Änderung des Repository-Namens müssen die App-Dateien mit dem passenden Basispfad neu erstellt werden.

Die vollständigen bearbeitbaren Projektdateien und die getesteten SQL-Migrationen wurden separat als `newgarten-projekt.zip` bereitgestellt. Der Build wurde mit 20 automatisierten Prüfungen und Browserprüfungen auf Desktop/Handy kontrolliert; die Familienrechte wurden zusätzlich direkt in Supabase getestet. Ein vollständiger Produktivtest mit einem echten Familienkonto und eingerichtetem Gemini-Schlüssel steht noch aus.
