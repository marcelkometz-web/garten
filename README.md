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

## Übernommener Katalog

Der bereitgestellte Katalogexport wurde in den privaten Familiengarten übernommen: 53 Kulturgruppen mit 363 Sorten und Pflegeeinträgen. Jede Sorte ist einzeln bearbeitbar und einem Beet zuordenbar. „Garten-Praxis“ enthält Kompost, Jauchen und andere Pflegethemen.

Beschreibungen, Aussaatmonate, Abstände und Pflegehinweise sind übernommen. Zusätzlich enthält jeder importierte Eintrag seine ursprünglichen Kultur- und Sortenangaben in `legacy_data`, die auch im privaten Datenexport enthalten sind. Der Katalog und sein Import-SQL liegen nicht in diesem öffentlichen Repository. Favoriten, Beetzuweisungen und Notizen aus der alten Datenbank waren im Katalogexport nicht enthalten.

## Detailansicht der Pflanzen

Die Detailansicht enthält eine Sortenauswahl, Anbaudaten und farbige Kästen für Gießen, Boden, Dünger und Tipps. Gute und schlechte Nachbarn erscheinen in eigenen grünen und roten Kästen.

Notizen sind je Sorte mit der Familie geteilt und werden automatisch gespeichert. Versionskonflikte werden erkannt; vor dem Ersetzen kann der gespeicherte Text verglichen werden. Fehlgeschlagene Entwürfe bleiben bis zum Abmelden im Arbeitsspeicher erhalten. Die Beetknöpfe sind mit den tatsächlichen Beetzuweisungen verbunden. Beim Teilen werden keine Gartennotizen mitgegeben.

## Hosting und Wartung

GitHub Pages unterstützt keine eigenen HTTP-Sicherheitsheader. Die Content Security Policy steht deshalb zusätzlich im HTML. `_headers` wird von GitHub Pages nicht ausgewertet; `security-headers.json` ist Metadaten für den optionalen Node-Hostingserver. Für einen Host mit eigener Header-Konfiguration ist `_headers` vorbereitet.

`newgarten` ist für den Pfad `/newgarten/` gebaut. Bei Änderung des Repository-Namens müssen die App-Dateien mit dem passenden Basispfad neu erstellt werden.

Die vollständigen bearbeitbaren Projektdateien und die getesteten SQL-Migrationen wurden separat als `newgarten-projekt.zip` bereitgestellt. Der Build wurde mit 30 automatisierten Prüfungen und Browserprüfungen auf Desktop/Handy kontrolliert; die Familienrechte wurden zusätzlich direkt in Supabase getestet. Ein vollständiger Produktivtest mit einem echten Familienkonto und eingerichtetem Gemini-Schlüssel steht noch aus.

Die Beetauswahl führt über Kategorie → Kultur → Sorte. Es werden nur die zur gewählten Kategorie passenden Kulturen und deren Sorten angezeigt. Alle Auswahlen stehen alphabetisch; auch die Beetnamen sind natürlich sortiert (Beet 2 vor Beet 10). Beim Aufruf aus einer Pflanze bleiben Kategorie, Kultur und Sorte vorausgewählt. Ein Kategorienwechsel setzt die Kultur- und Sortenauswahl zurück.

Die drei Zahlenkacheln der Übersicht öffnen direkt Pflanzen, Beete und Notizen. Die Pflanzenkachel zeigt den vollständigen Bestand; auch Kacheln mit Zähler 0 bleiben bedienbar. Die Navigation ist per Touch und Tastatur geprüft.
