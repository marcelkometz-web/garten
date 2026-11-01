# 🌱 200 zusätzliche Obst- und Gemüsesorten

Der geprüfte Datensatz enthält **100 Obstsorten und 100 Gemüsesorten**, verteilt auf 54 bestehende bzw. passende Sortengruppen. Enthalten sind unter anderem Äpfel, Birnen, Pflaumen, Kirschen, Feigen, Weintrauben, Beeren- und Schalenobst sowie Tomaten, kulinarische Chilis und Paprika, Bohnen, Kohlarten, Wurzelgemüse und Salate. Es werden keine Zierpflanzen als Gemüse ausgegeben.

## 📚 Was geprüft wurde

Quelle ist die öffentlich erreichbare **Royal Horticultural Society**: [RHS Recommended: Award of Garden Merit – Fruit, vegetables and herbs](https://www.rhs.org.uk/plants/pdfs/agm-lists/agm-fruit-and-vegetables), abgerufen am 1. November 2026. Der PDF-Fingerabdruck und für jeden Eintrag Seite und genaue Schreibweise sind im JSON hinterlegt. Die 200 Sortenbezeichnungen wurden mit dem tatsächlich heruntergeladenen PDF-Text abgeglichen.

Die Quelle belegt Sortennamen und ihre gärtnerische Zuordnung. Die RHS-Auszeichnung gilt für geeignete Bedingungen; sie ist **keine Standortgarantie für einen bestimmten Garten**. Pflanzabstände, Aussaat- und Erntetermine, Winterhärte, Erträge und Gesundheitswirkungen wurden deshalb nicht ausgedacht. Nicht geprüfte Kulturfelder und Kalender bleiben leer. Die Herkunft und dieser Prüfstand werden in jeder Sortenkarte genannt.

## 🔎 Doppelte Sorten vermeiden

Der Ausgangskatalog wurde ausschließlich nach Sortenmetadaten gelesen: 638 Katalogeinträge. Keine persönlichen Notizen, Bilder, Kontodaten oder Familienkennungen sind Teil dieses Datensatzes. Der Abgleich berücksichtigt Groß-/Kleinschreibung, Leerzeichen und Satzzeichen, deutsche Umlaute, F1-Zusätze sowie bekannte Schreib- und Namensvarianten. Beispiele: Hinnonmäki Röd/Rot, Kelvedon Wonder/Wonder von Kelvedon, Wallone/Wallonne und Pan di Zucchero/Zuckerhut.

Gleiche Sortennamen verschiedener Kulturarten werden getrennt behandelt. Beispielsweise sind eine Erdbeere und eine Himbeere mit dem Namen „Polka“ unterschiedliche Pflanzen. Gemeinsam geführte alte Beerengruppen werden beim Vergleich passend zusammengeführt.

## 🛠️ Sicher importieren

Die tatsächliche Tabelle `rg_plants` verlangt eine Familie; ein globaler Eintrag mit leerer Familie ist nicht möglich. Das erzeugte SQL ermittelt deshalb die einzige bereits vorhandene Katalogfamilie aus dem bestehenden Katalog. Gibt es mehrere oder keine, bricht es unverändert ab. Es enthält keine fest eingetragenen Konto- oder Familien-IDs und legt keine Familien oder Kopien pro Familie an.

Der Import fügt ausschließlich neue Katalogeinträge hinzu. Er überschreibt und löscht nichts, verändert keine Freigaben und prüft auch unmittelbar vor dem Einfügen nochmals auf vorhandene Namen und Synonyme. Ein Transaktionsschloss schützt wiederholte parallele Ausführungen dieses Imports. `source='seed'` entspricht der bestehenden Tabellenregel; URL, Einzelnachweis und Importkennung werden zusätzlich in `legacy_data` aufbewahrt. Ein erneuter Import fügt keine weiteren gleichen Einträge hinzu.

Prüfung und SQL-Erzeugung:

```sh
node --test tests/catalog-expansion.test.mjs
node scripts/import-catalog-expansion.mjs
node scripts/import-catalog-expansion.mjs --verify-source /tmp/rhs-agm-fruit-veg-raw.txt
node scripts/import-catalog-expansion.mjs --write scripts/import-catalog-expansion.sql
```

Das Skript hat keinen Datenbankzugang und führt das erzeugte SQL nicht selbst aus. Der Produktionsimport erfolgt separat nach Durchsicht. Die abschließende SQL-Ausgabe enthält ausschließlich die Zahl der Obst-/Gemüsekatalogeinträge mit dieser Importkennung. Ob eine erneute Ausführung null zusätzliche Einträge erzeugt, lässt sich durch die unveränderte Gesamtzahl vor und nach der Wiederholung kontrollieren.
