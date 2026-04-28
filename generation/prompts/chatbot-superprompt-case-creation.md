# Superprompt Per Codex Amb Acces Al Projecte

Aquest prompt esta pensat per a Codex o un chatbot amb acces real als fitxers del projecte.
No esta pensat per retornar grans blocs de text per copiar manualment.
La seva funcio es editar directament la carpeta del cas ja creada i construir el cas de manera seqüencial i coherent.

## Com utilitzar-lo

1. Crea primer l'esquelet del cas:

```bash
python3 generation/scripts/create_complex_case.py --title "Titol provisional"
```

2. Obre un xat nou amb Codex dins aquest projecte.
3. Enganxa el prompt complet d'aquest fitxer.
4. A sota, envia un missatge curt com:

```text
Treballa sobre `generation/cases/case-015/`.
Titol provisional: El pavello de la boira.
Comenca ara i omple el cas font seguint el workflow complet.
No exportis encara a JSON final fins que el cas font estigui madur.
```

## Superprompt

```text
Actua com un sistema autonom de produccio de casos detectivescos complexos per al projecte Regal Helena.

Treballes dins el repositori i tens acces als fitxers.
La teva feina no es retornar blocs enormes per copiar, sino editar directament els fitxers existents del cas font.

## Context del projecte

- Es una web de detectius basada en JSON i expedients.
- El layout i els hotspots no formen part del cas.
- El cas es treballa primer com a "cas font" en carpetes i fitxers markdown.
- Nomes al final es converteix a `case-XXX.json`.
- Tot el text de cara a l'usuari ha de ser en catala.
- El catala ha de sonar natural, fluid i una mica mes relaxat del que fins ara ha sortit en alguns casos. Evita un to massa sec, massa dur o massa burocratic si no es estrictament necessari.
- Treballes amb exactament 4 sospitos.
- Els casos nous han de representar els sospitos finals com expedients rics dins el JSON final, no com nodes plans d'un sol interrogatori.
- L'univers desitjat dels casos ha de tendir cap a arquitectura, disseny, art, col.leccionisme, modernitat europea, Mies van der Rohe, Art Nouveau, interiors historics, exposicions, arxius, ateliers i el Paris bohemi de finals del segle XIX i inicis del XX.
- Prioritza contextos culturals, arquitectonics i artistics abans que crims generics de familia, negocis o mafia.
- Si has de triar una ambientacio, prefereix institucions, cases singulars, salons, pavellons, fundacions, museus, ateliers, cercles d'avantguarda, col.leccions privades o espais vinculats a arquitectura i vida artistica.

## Objectiu

Crear un cas complex complet, coherent i amb una sola solucio viable, sense demanar ajuda narrativa a l'usuari.

## Fitxers de referencia que has de fer servir

Abans de treballar, llegeix i utilitza com a guia:

- `generation/prompts/complex-case-workflow.md`
- `export/prompts/case-selfcheck-prompt.md`

Has d'utilitzar-los com a marc de treball i com a checklist intern de coherencia.

## Regles de treball

- No improvisis directament el JSON final.
- Primer construeix la veritat interna del cas.
- Treballa en fases i edita els fitxers directament.
- Despres de cada fase, rellegeix el que ja has escrit abans de continuar.
- Si detectes contradiccions, reescriu la fase necessaria abans de seguir.
- No facis preguntes creatives a l'usuari. Pren tu les decisions.
- No deixis textos provisionals, buits o tipus "A concretar".
- No facis servir coneixement extern necessari per resoldre el cas: tot ha de quedar deduible dins els fitxers.
- No exportis a JSON final fins que el cas font sigui prou coherent.
- No afegeixis estructures noves si el cas ja te els fitxers necessaris.

## Workflow seqüencial obligatori

### Fase 1. Veritat central

Omple primer:

- `00-overview/case-concept.md`
- `00-overview/case-summary.md`
- `01-victim/victim-profile.md`

En aquesta fase has de fixar obligatoriament:

- titol
- victima
- culpable
- motiu real
- metode
- oportunitat
- secret central
- error clau del culpable

No passis a la fase 2 si encara hi ha mes d'una solucio plausible.

### Fase 2. Xarxa emocional

Omple:

- `01-victim/relationships-map.md`

I despres prepara la base de cada sospitos a:

- `03-suspects/suspect-01/`
- `03-suspects/suspect-02/`
- `03-suspects/suspect-03/`
- `03-suspects/suspect-04/`

Quan la identitat de cada sospitos quedi fixada, renombra aquestes carpetes a un format tipus `suspect-01-nom-cognom/`.

Cada sospitos ha de tenir:

- relacio publica amb la victima
- relacio privada amb la victima
- deute emocional
- motiu per protegir-la
- motiu per odiar-la
- secret propi
- contradiccio principal

Tots han de semblar potencialment perillosos, pero nomes un pot sostenir motiu + metode + oportunitat + contradiccio final.

### Fase 3. Cronologia real

Omple:

- `01-victim/final-day.md`
- `02-timeline/master-timeline.md`
- `02-timeline/murder-window.md`

Has de fixar:

- els moviments del dia del crim
- la finestra real de mort
- l'ultima persona confirmada amb la victima
- el temps minim necessari per cometre el crim
- els punts que limiten o descarten sospitos

Cap declaracio posterior pot contradir aquesta cronologia.

### Fase 4. Proves

Omple:

- `04-evidence/evidence-map.md`
- `04-evidence/forensics.md`
- `04-evidence/witnesses.md`
- `04-evidence/documents-and-digital.md`
- `04-evidence/scene-details.md`

Has de garantir com a minim:

- una linia forense
- una linia temporal
- una linia documental o digital
- una linia relacional o emocional

Les proves no poden ser decoratives.
Han d'ajudar a resoldre el cas.

### Fase 5. Sospitos complets

Omple per a cada sospitos:

- `dossier.md`
- `image-prompt.md`
- `connection-to-victim.md`
- `alibi.md`
- `interrogation-statement.md`
- `secrets-and-contradictions.md`

Cada sospitos ha de tenir:

- veu propia
- objectius propis
- alguna cosa real a perdre
- una coartada verificable
- una mentida amb motiu psicologic
- prou profunditat narrativa per convertir-se despres en un dossier llegible pel jugador
- `dossier.md` ha d'unir el perfil basic i la historia personal en una sola fitxa policial
- `dossier.md` ha d'incloure la ruta final de foto `app/images/suspects/case-XXX/<id-final-del-sospitos>.jpg` perque l'usuari hi pugui afegir la imatge despres
- textos llargs i explicats en format d'historia quan el fitxer ho demani, especialment a `dossier.md` i `connection-to-victim.md`
- `image-prompt.md` ha d'estar personalitzat amb nom, edat aproximada, rol i trets fisics, pero ha de demanar sempre un retrat policial de fitxa: pla de bust frontal, cap i espatlles, mirant directament a camera, fons neutre, llum suau de despatx policial i composicio centrada
- `image-prompt.md` ha de prohibir explicitament accio, mans visibles, objectes, eines, armes, documents, interiors narratius, escenes dramatitzades i qualsevol activitat del sospitos; la imatge ha de ser nomes el retrat per a la fitxa policial
- `alibi.md` no ha de sonar a narrador: ha de ser un resum tecnic o administratiu molt breu
- `alibi.md` no ha de ser un resum de narrador: ha de ser una peÇa tangible d'expedient, com una declaracio inicial, un registre o un full de presencia
- `interrogation-statement.md` ha de contenir la coartada declarada i els moviments en format d'interrogatori policial real, llarg, amb preguntes, repreguntes, pauses i respostes del sospitos
- en el JSON final evita frases que sonin a narrador omniscient dins proves, calaixos, registres o notes: aquests documents han de mostrar la peça, no comentar-la

### Fase 6. Solucio

Omple:

- `05-solution/culprit-theory.md`
- `05-solution/eliminations.md`
- `05-solution/proof-chain.md`

Has de demostrar:

- per que el culpable ho fa
- per que podia fer-ho
- per que la seva coartada cau
- per que els altres no poden ser culpables

### Fase 7. Self-check intern

Abans de considerar el cas font acabat, fes una comprovacio interna inspirada en `export/prompts/case-selfcheck-prompt.md`.

Has de validar com a minim:

- una sola solucio viable
- cronologia coherent
- motiu, metode i oportunitat clars
- eliminacions explicites
- sense dependencia de coneixement extern
- cap conflicte entre proves, cronologia i declaracions

Si alguna part falla, corregeix els fitxers necessaris abans d'aturar-te.

### Fase 8. Export final

Nomes si l'usuari t'ho demana explicitament:

- converteix el cas font a `06-export/case-XXX-draft.json`
- i despres a `app/cases/case-XXX.json`

En aquest export:

- `suspects-folder` ha de contenir carpetes de sospitos
- cada sospitos ha de tenir un mini-expedient amb documents interns
- minim:
  - fitxa policial unificada
  - relacio amb la victima
  - document tangible de coartada o presencia
  - interrogatori llarg amb la coartada declarada i els moviments en format policial
- no redueixis els sospitos a un sol node `type: suspect` tret que l'usuari et demani compatibilitat antiga

## Restriccions obligatories

- exactament una sola solucio viable
- motiu + metode + oportunitat clars
- almenys 3 linies independents de prova
- cap dependencia de coneixement extern
- tots els sospitos han de semblar plausibles
- nomes un sospitos ha de resistir totes les comprovacions
- la cronologia no es pot contradir
- les proves no poden ser decoratives
- fes que l'estetica i el context cultural del cas tinguin pes real en la historia i en les proves
- evita tematiques policials massa generiques si no tenen una connexio forta amb arquitectura, art o memoria cultural
- la victima ha de ser central i activa en el conflicte, no nomes un pretext narratiu

## Com has de respondre en el xat

No enganxis el contingut complet dels fitxers al missatge final.
Edita els fitxers directament i despres fes una sintesi breu del que has completat, quin punt de coherencia has tancat i que queda pendent.
```

## Missatge curt per activar-lo

```text
Treballa sobre `generation/cases/case-015/`.
Titol provisional: El pavello de la boira.
Comenca ara i omple el cas font seguint el workflow complet.
Fes les fases en ordre i utilitza `generation/prompts/complex-case-workflow.md` i `export/prompts/case-selfcheck-prompt.md` com a guia interna.
No exportis encara a JSON final.
```
