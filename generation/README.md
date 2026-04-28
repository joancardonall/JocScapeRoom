# Generation

## `create_complex_case.py`

Crea l'estructura base d'un cas complex dins `generation/cases/case-XXX/`.

Exemple:

```bash
python3 generation/scripts/create_complex_case.py --title "La cambra del fum"
```

Amb id explicit:

```bash
python3 generation/scripts/create_complex_case.py --case-id case-014 --title "La cambra del fum"
```

Opcions:

- `--case-id`
  - usa un id concret; si no s'indica, el script calcula el seguent disponible.
- `--title`
  - titol provisional del cas.
- `--suspects`
  - nombre de sospitos a crear; per defecte `4`.

El script no afegeix el cas a `app/cases/cases-index.json` ni genera el JSON final jugable. Primer crea el "cas font" amb carpetes, plantilles i `99-ai-runbook.md`.
Aquest cas font esta pensat per acabar exportant sospitos com expedients rics dins del JSON final.

## Flux recomanat

Per aquest projecte, el flux recomanat ara mateix es:

1. Crear l'esquelet amb `create_complex_case.py`
2. Fer servir el superprompt de `generation/prompts/chatbot-superprompt-case-creation.md` dins un chatbot
3. Omplir els fitxers del cas font de manera coherent
4. Fer l'export final a JSON quan el cas estigui madur
5. En l'export, representar cada sospitos com una carpeta-dossier amb 4 documents interns visibles
6. Desar les fotos finals dels sospitos a `app/images/suspects/case-XXX/<id-final-del-sospitos>.jpg`; han de ser retrats policials de fitxa, no escenes d'accio ni plans amb objectes. Si encara no hi son, la UI mostrara un retrat per defecte
