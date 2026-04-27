# Regal Helena - Joc de Detectius (Web)

## Què és aquest projecte

Aquest projecte és un joc web de detectius de tipus *case-file detective game*.

L'usuari veu una escena fixa d'un despatx de detectiu i pot clicar objectes per obrir expedients, informes, testimonis i proves. L'objectiu és llegir el material del cas, reconstruir els fets i revelar la solució oficial.

## Estructura ordenada del projecte

El projecte queda dividit en 3 blocs:

### 1. `generation/`

Bloc de creació dels casos font.

- `generation/cases/`
  - Casos font en markdown abans de l'export final.
- `generation/prompts/`
  - Prompts per construir els casos de forma seqüencial i coherent.
- `generation/scripts/`
  - Script per crear l'esquelet d'un cas nou.
- `generation/README.md`
  - Guia curta del flux de generació.

### 2. `export/`

Bloc de traducció del cas font al JSON final jugable.

- `export/prompts/case-generation-master-prompt.md`
  - Esquema i restriccions del JSON final.
- `export/prompts/rich-case-export-prompt.md`
  - Prompt d'export al format ric amb expedients de sospitós.
- `export/prompts/case-selfcheck-prompt.md`
  - Prompt de revisió i coherència del JSON final.

### 3. `app/`

Bloc d'execució de la web a partir dels JSON finals.

- `app/index.html`
  - Entrada de la web.
- `app/app.js`
  - Lògica principal React.
- `app/scene-layout.json`
  - Geometria de l'escena i mapatge hotspot -> nodeId.
- `app/images/`
  - Fons i icones.
- `app/cases/`
  - Casos finals jugables i `cases-index.json`.

## Arquitectura (resum)

Hi ha 2 peces de dades principals:

1. `app/scene-layout.json`
- Defineix la imatge de fons.
- Defineix hotspots.
- Defineix `hotspotActions`.
- Pot definir diversos estils visuals a `styles[]`, cadascun amb el seu propi `sceneImage`, `hotspots` i `hotspotActions`.
- No forma part de la història del cas.

2. `app/cases/case-XXX.json`
- Conté la informació narrativa i lògica del cas.
- Conté `fileSystem.nodes` amb carpetes, documents i proves.
- Conté la solució final (`solution`).

En els casos nous, els sospitosos s'han de representar com carpetes-expedient amb documents interns, no com un únic node pla.

## Com executar localment

Des de l'arrel del projecte:

```bash
python3 -m http.server 8080
```

Obre:

```text
http://localhost:8080/app/
```

Important: no obrir `app/index.html` directament. Cal servidor local perque la web fa `fetch`.

## Com funciona `app/app.js`

1. Carrega `app/scene-layout.json` i `app/cases/cases-index.json`.
2. Carrega el cas seleccionat.
3. Dibuixa la imatge de fons.
4. Permet escollir l'estil visual de l'escena si `scene-layout.json` en defineix mes d'un.
5. Dibuixa hotspots invisibles segons l'estil actiu.
6. En clicar un hotspot, obre el node associat.
7. Si el node és carpeta, mostra fills.
8. Si el node és document o sospitós, mostra contingut textual.
9. En els dossiers de sospitós nous, la UI mostra una fitxa policial amb foto i recorre a un retrat per defecte si la imatge encara no existeix.
10. El botó de solució i la tecla `Esc` mostren o amaguen la resolució final.

## Estils visuals de l'escena

Per afegir una nova imatge de fons sense perdre l'anterior, afegeix una entrada nova a `app/scene-layout.json` dins de `styles[]`:

```json
{
  "id": "nom-de-lestil",
  "name": "Nom visible al selector",
  "sceneImage": "./images/el-meu-fons.png",
  "hotspotActions": {
    "monitor": "computer-emails-doc",
    "file": "main-folder"
  },
  "hotspots": [
    {
      "id": "monitor",
      "label": "Ordinador",
      "x": 1,
      "y": 2,
      "w": 34,
      "h": 33
    }
  ]
}
```

Les coordenades dels hotspots son percentatges de la pantalla. Cada `id` de `hotspots[]` ha de tenir el seu objectiu equivalent dins de `hotspotActions`.

## Esquema mínim d'un cas final

- Metadades:
  - `id`, `title`, `summary`, `objective`

- Estructura:
  - `fileSystem.rootId`
  - `fileSystem.nodes`

- Tipus de node suportats:
  - `folder`
  - `document`
  - `suspect` per compatibilitat antiga

- Estàndard recomanat per casos nous:
  - `suspects-folder` conté una carpeta per sospitós
  - cada carpeta de sospitós conté `dossier-doc`, `connection-doc`, `alibi-doc` i `interrogation-doc`
  - `dossier-doc` uneix perfil bàsic + història personal i pot apuntar a `./images/suspects/case-XXX/<id-final-del-sospitos>.jpg`

- Solució:
  - `solution.culprit`
  - `solution.motive`
  - `solution.method`
  - `solution.keyProof`
  - `solution.eliminations[]`

## Flux recomanat de treball

### Generació del cas font

```bash
python3 generation/scripts/create_complex_case.py --title "Titol provisional"
```

Això crea `generation/cases/case-0XX/` amb l'estructura de treball del cas.

Després, fes servir:

- `generation/prompts/complex-case-workflow.md`
- `generation/prompts/chatbot-superprompt-case-creation.md`

### Export al JSON final

Quan el cas font ja és coherent, fes servir:

- `export/prompts/rich-case-export-prompt.md`
- `export/prompts/case-generation-master-prompt.md`
- `export/prompts/case-selfcheck-prompt.md`

El resultat final ha d'acabar a:

```text
app/cases/case-0XX.json
```

I cal afegir-lo a:

```text
app/cases/cases-index.json
```

## Regles importants de disseny

1. Els hotspots no van dins del cas.
2. El cas només és contingut.
3. Una sola solució viable.
4. Cronologia coherent.
5. Eliminació explícita dels no culpables.
6. Tot el text final de cara a l'usuari en català.

## Context per continuar en un altre xat

Si vols reprendre el projecte en un altre xat, comparteix:

1. Que l'app viu a `app/`
2. Que els casos finals viuen a `app/cases/`
3. Que els casos font viuen a `generation/cases/`
4. Que els prompts de generació viuen a `generation/prompts/`
5. Que els prompts d'export i QA viuen a `export/prompts/`
6. Que `app/app.js` és intencionalment beginner-friendly
