# Prompt D'Export Final Al Format JSON Ric

Aquest prompt serveix per convertir un cas font desenvolupat en carpetes i fitxers markdown al format final `case-XXX.json` del joc, seguint l'estandard nou de sospitos com a mini-expedients.

## Quan fer-lo servir

Fes-lo servir nomes quan:

- el cas font ja esta complet
- la cronologia ja es coherent
- les proves ja apunten a una sola solucio viable
- els sospitos ja tenen prou profunditat narrativa

## Instruccions d'us

En un xat amb Codex o amb un chatbot que pugui treballar sobre el projecte:

1. demana-li que llegeixi:
   - `export/prompts/case-generation-master-prompt.md`
   - `export/prompts/case-selfcheck-prompt.md`
   - la carpeta completa del cas font, per exemple `generation/cases/case-015/`
2. enganxa el prompt d'aquest fitxer
3. indica quin cas ha d'exportar

## Prompt

```text
Actua com a exportador final de casos per al projecte Regal Helena.

Treballes sobre un cas font ja desenvolupat en carpetes i fitxers markdown.
La teva feina es convertir-lo a un `case-XXX.json` final, coherent, jugable i compatible amb la UI.

Abans de fer res, llegeix i aplica:

- `export/prompts/case-generation-master-prompt.md`
- `export/prompts/case-selfcheck-prompt.md`

I llegeix tambe tota la carpeta del cas font que se t'indiqui.

## Objectiu

Generar un JSON final del joc que:

- mantingui una sola solucio viable
- preservi motiu, metode i oportunitat
- mantingui la cronologia coherent
- conservi la riquesa narrativa dels sospitos
- representi els sospitos com expedients rics, no com nodes plans

## Regles d'export

- Retorna nomes JSON valid.
- Tot el text visible per a l'usuari ha de ser en catala.
- El catala ha de sonar natural i llegible, no excessivament sec ni encarcarat.
- No copiïs literalment tot el cas font: resumeix-lo amb intel.ligencia.
- No perdis cap prova clau ni cap contradiccio important.
- La sintesi cronologica ha d'explicar clarament per que nomes hi ha un culpable viable.
- Els textos dels sospitos poden ser mes curts que al cas font, pero han de conservar personalitat, passat i conflicte.

## Estandard obligatori per sospitos

El JSON final ha de seguir aquest model:

- `suspects-folder` es una carpeta
- dins `suspects-folder` hi ha 4 carpetes de sospitos
- cada carpeta de sospitos te:
  - `dossier-doc`
  - `connection-doc`
  - `alibi-doc`
  - `interrogation-doc`

Important:

- `dossier-doc` ha de ser una fitxa policial completa amb nom del sospitos, foto i dues capes de text: `profile[]` per al perfil basic i `personalHistory[]` per a la historia personal.
- El camp `photo` ha d'apuntar a `./images/suspects/case-XXX/<suspect-base-id>.jpg`. Si la imatge encara no existeix, la UI mostrara un retrat per defecte.
- `alibi-doc` no ha de ser un resum de narrador. Ha de semblar una peça tangible del cas: declaracio inicial, full de presencia, registre, nota de servei, etc.
- La coartada declarada i els moviments del sospitos s'han de veure principalment a `interrogation-doc`, escrit com un registre policial llarg amb preguntes i respostes.
- A la resta de documents finals evita frases de comentarista extern que interpretin la prova per al jugador. Mostra el document i deixa que la deduccio surti de la lectura.

No exportis els sospitos com un unic node `type: suspect`, tret que l'usuari t'ho demani explicitament per compatibilitat antiga.

## Criteris de qualitat

Abans de donar el JSON per tancat, comprova internament:

- hi ha exactament una sola solucio viable?
- la cronologia sintetica quadra amb testimonis, forense i proves digitals?
- els no culpables queden eliminats explicitament?
- els sospitos semblen persones reals i no simples etiquetes?
- cada expedient de sospitos aporta una capa diferent de lectura?
- els node ids necessaris existeixen i tenen coherencia interna?

Si detectes qualsevol contradiccio, resol-la abans de retornar el JSON.
```

## Missatge curt per llançar l'export

```text
Llegeix `export/prompts/case-generation-master-prompt.md` i `export/prompts/case-selfcheck-prompt.md`.
Despres llegeix tota la carpeta `generation/cases/case-015/`.
Exporta aquest cas al format final `app/cases/case-015.json` seguint l'estandard nou de sospitos com expedients rics.
Retorna nomes JSON valid.
```
