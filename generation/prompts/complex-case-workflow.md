# Workflow Complet Per Crear Casos Complexos

Aquest fitxer defineix el proces real per generar casos complexos amb IA sense que la persona usuaria hagi d'inventar la historia manualment.

## Problema del workflow actual

El prompt actual de generacio crea directament el `case-XXX.json`.

Aixo provoca errors frequents:

- la IA improvisa la veritat del cas mentre escriu les proves,
- la cronologia es contradiu,
- hi ha sospitos amb massa pes o massa poc,
- el culpable no queda prou unic,
- i el cas sembla un conjunt de textos en lloc d'un expedient dissenyat.

## Principi base

No s'ha de generar el JSON final directament.

Primer s'ha de generar la "veritat interna" del cas per fases.
Despres s'ha de fer el material narratiu.
Al final s'ha d'exportar al JSON del joc.

## Pipeline Recomanat

### Fase 1. Crear l'esquelet del cas

Objectiu:
- crear la carpeta `generation/cases/case-0XX/`
- crear tots els fitxers base

Entrades minimes:
- numero de cas
- idioma
- to general desitjat

Sortida:
- estructura de carpetes completa

### Fase 2. Definir la veritat central

Objectiu:
- decidir els fets reals abans de redactar cap prova

La IA ha de tancar obligatoriament:
- victima
- culpable
- motiu real
- metode del crim
- oportunitat
- error clau del culpable
- secret historic o personal que soste el cas
- red herrings principals

Fitxers a omplir:
- `00-overview/case-concept.md`
- `00-overview/case-summary.md`
- `01-victim/victim-profile.md`

Regla:
- no es pot passar a la fase 3 si encara hi ha mes d'una solucio plausible.

### Fase 3. Construir la xarxa emocional

Objectiu:
- donar coherencia dramatica als sospitos

Per cada sospitos, la IA ha de crear:
- relacio publica amb la victima
- relacio privada amb la victima
- deute emocional
- motiu per protegir-la
- motiu per odiar-la
- secret propi
- contradiccio principal

Fitxers a omplir:
- `01-victim/relationships-map.md`
- `03-suspects/*/dossier.md`
- `03-suspects/*/connection-to-victim.md`

Regla:
- tots els sospitos han de semblar potencialment perillosos,
- pero nomes un pot sostenir motiu + metode + oportunitat + contradiccio final.
- quan el nom d'un sospitos ja estigui fixat, la seva carpeta s'ha de renombrar a un format tipus `suspect-01-nom-cognom/`

### Fase 4. Construir la cronologia real

Objectiu:
- fixar els moviments del dia del crim

La IA ha de crear:
- cronologia completa per franges
- finestra real de mort
- ultima persona confirmada amb la victima
- temps minim necessari per cometre el crim
- punts que descarten cada sospitos

Fitxers a omplir:
- `01-victim/final-day.md`
- `02-timeline/master-timeline.md`
- `02-timeline/murder-window.md`

Regla:
- qualsevol declaracio posterior ha de quadrar amb aquesta cronologia.

### Fase 5. Crear les proves

Objectiu:
- generar com a minim 3 linies independents de prova

Linies recomanades:
- forense
- temporal
- documental o digital
- relacional o emocional

Fitxers a omplir:
- `04-evidence/evidence-map.md`
- `04-evidence/forensics.md`
- `04-evidence/witnesses.md`
- `04-evidence/documents-and-digital.md`
- `04-evidence/scene-details.md`

Regla:
- cada prova ha d'apuntar a alguna cosa concreta,
- no es poden posar detalls "estetics" que no tinguin funcio narrativa o deductiva.

### Fase 6. Baixar la veritat als sospitos

Objectiu:
- escriure els sospitos com a persones, no com a fitxes planes

Per cada sospitos:
- perfil
- prompt de cara
- transfons
- document tangible de coartada o presencia
- declaracio a l'interrogador en format de registre policial
- secrets i contradiccions

Fitxers a omplir:
- tot `03-suspects/`

Regla:
- la seva veu ha de sonar unica,
- la coartada ha de ser verificable,
- la mentida ha de tenir una rao psicologica.
- `alibi.md` ha de semblar un document real d'expedient: declaracio inicial, registre, full de presencia o equivalent. No pot ser una sintesi del narrador.
- `interrogation-statement.md` ha d'incloure la coartada declarada i els moviments del dia del crim amb preguntes i respostes, com si fos un registre real d'interrogatori, i ha de ser llarg, amb conversa creible i repreguntes.
- A les proves del JSON final no hi han d'apareixer frases de comentarista omniscient: nomes la peça o el que hi consta.
- el material del sospitos ha de ser prou ric per convertir-se despres en un mini-expedient jugable.

### Fase 7. Tancar la solucio

Objectiu:
- provar que el cas te una sola sortida valida

Fitxers a omplir:
- `05-solution/culprit-theory.md`
- `05-solution/eliminations.md`
- `05-solution/proof-chain.md`

La IA ha de demostrar:
- per que el culpable ho fa
- per que podia fer-ho
- per que la seva coartada cau
- per que els altres no poden ser culpables

### Fase 8. Exportar al format del joc

Objectiu:
- convertir el material font en `case-0XX.json`

Regles:
- mantenir els node ids requerits
- sintetitzar el material font sense aprimar-lo massa: els documents finals han de ser llegibles com a peces completes, no com a apunts breus
- preservar la logica, el context i els detalls deductius encara que el text s'adapti al format JSON
- els sospitos nous no s'han d'exportar com un sol node `type: suspect`
- cada sospitos s'ha d'exportar com una carpeta-dossier amb documents interns
- minim per sospitos al JSON final:
  - fitxa policial unificada
  - relacio amb la victima
  - document tangible de coartada o presencia
  - interrogatori amb la coartada declarada i els moviments
- llargada recomanada dels documents visibles al jugador:
  - informes principals i proves: 4 a 6 paragrafs substancials
  - documents de relacio i coartada: 3 a 5 paragrafs amb detalls concrets
  - fitxes policials: `profile[]` amb 3 a 5 paragrafs i `personalHistory[]` amb 3 a 5 paragrafs
  - interrogatoris: 8 a 12 intercanvis de pregunta/resposta, amb repreguntes, silencis, evasives i contradiccions
- no augmentis el nombre de fitxers visibles per compensar falta de context: amplia el contingut dels documents que ja existeixen

Fitxers a crear:
- `06-export/case-0XX-draft.json`
- despres `app/cases/case-0XX.json`

### Fase 9. Self-check automatic

Objectiu:
- revisar el cas abans de considerar-lo jugable

Checks obligatoris:
- una sola solucio viable
- cronologia coherent
- motiu, metode i oportunitat clars
- eliminacions explicites
- sense dependencia de coneixement extern
- tots els nodes requerits existeixen

## Automatitzacio real recomanada

La forma mes fiable no es "un prompt enorme", sino una cadena de prompts.

Pipeline ideal:

1. `scaffold`
   Crea la carpeta del cas i els fitxers buits.

2. `story-core`
   Omple overview + victima + veritat central.

3. `relationship-builder`
   Omple relacions i transfons dels sospitos.

4. `timeline-builder`
   Tanca el dia del crim i la finestra de mort.

5. `evidence-builder`
   Genera proves coherents amb la cronologia.
   Quan generis proves digitals o correus, escriu-los com artefactes recuperats: capcaleres, remitent, destinatari, hora i cos del missatge. No hi posis conclusions de narrador.

6. `suspect-writer`
   Escriu coartades, declaracions i contradiccions.

7. `solution-checker`
   Tanca culpable, cadena de proves i eliminacions.

8. `json-exporter`
   Converteix el cas font al format final amb expedients rics per sospitos.

9. `qa-reviewer`
   Executa l'autocheck final.

## Prompt Mestre De Workflow

Copia aquest prompt a una IA quan vulguis que faci el proces complet per si sola.

```text
Actua com un sistema de produccio de casos detectivescos complexos per al projecte Regal Helena.

No generis directament el JSON final del joc.
Treballa en fases i crea primer la veritat interna del cas.

Has de seguir exactament aquest ordre:

1. Definir el nucli del cas:
- victima
- culpable
- motiu real
- metode
- oportunitat
- error clau del culpable
- secret central del cas

2. Desenvolupar la victima:
- perfil public
- cara oculta
- ferides del passat
- que sap abans de morir
- per que es perillosa la nit del crim

3. Desenvolupar els sospitos:
- relacio publica amb la victima
- relacio privada amb la victima
- deute emocional
- motiu per protegir-la
- motiu per odiar-la
- secret propi
- contradiccio principal
- coartada
- declaracio a l'interrogador
- prompt de generacio d'imatge del rostre
- historia personal integrada dins la fitxa policial
- relacio amb la victima en format narratiu

4. Construir la cronologia real:
- moviments del dia
- trobades clau
- finestra exacta del crim
- ultima persona confirmada amb la victima
- descoberta del cos

5. Crear les proves:
- forense
- testimonial
- documental o digital
- prova relacional
- detalls de l'escena

6. Tancar la solucio:
- cadena logica final
- eliminacio raonada de tots els no culpables
- unicitat absoluta del culpable

7. Nomes al final exportar el cas al format final del joc.

En l'export final del joc, cada sospitos ha de quedar representat com un mini-expedient dins `suspects-folder`, no com un unic node pla. Cada expedient ha de contenir com a minim:
- fitxa policial unificada
- relacio amb la victima
- coartada i moviments
- interrogatori

Regles obligatories:
- tot en catala
- una sola solucio viable
- no dependre de coneixement extern
- cada sospitos ha de semblar plausible
- nomes un sospitos ha de resistir totes les comprovacions
- la cronologia no es pot contradir
- totes les proves han de tenir funcio deductiva

Abans d'exportar el JSON final, comprova internament:
- que hi ha almenys 3 linies independents de prova
- que el metode, motiu i oportunitat del culpable son clars
- que les coartades dels altres aguanten o queden descartades explicitament
- que no hi ha cap altre culpable possible

Si detectes una contradiccio, reescriu la fase necessaria abans de continuar.
```

## Prompt Curt Per Cada Fase

Si prefereixes automatitzar-ho amb diverses crides, fes servir prompts especialitzats.

### Prompt 1. Story Core

```text
Crea la veritat central d'un nou cas de detectius complex per Regal Helena.
No escriguis encara el JSON final.
Omple nomes:
- concepte general
- resum del cas
- perfil de la victima

Tanca obligatoriament:
- victima
- culpable
- motiu
- metode
- oportunitat
- error clau
- secret central

Tot en catala.
```

### Prompt 2. Timeline Builder

```text
A partir del nucli del cas ja definit, escriu la cronologia real del dia del crim.
No improvisis nous pilars de la historia.
Has d'omplir:
- ultim dia de la victima
- cronologia mestra
- finestra del crim

La cronologia ha de fer possible nomes un culpable.
Tot en catala.
```

### Prompt 3. Suspect Builder

```text
A partir de la veritat central i la cronologia, desenvolupa els 4 sospitos del cas.
Per cada sospitos escriu:
- fitxa policial unificada
- prompt d'imatge
- relacio amb la victima
- coartada
- document tangible de coartada o presencia
- declaracio a l'interrogador en format policial amb preguntes i respostes
- secrets i contradiccions

La fitxa policial i la relacio amb la victima han d'estar escrites amb prou profunditat per convertir-se despres en documents llegibles dins l'expedient final del sospitos.
La coartada no s'ha d'explicar amb veu de narrador: ha d'apareixer sobretot dins la declaracio policial i, si hi ha una altra peça, ha de ser un document tangible del cas.
- el prompt d'imatge s'ha d'escriure ja personalitzat; no s'accepten frases de plantilla com "ambient i trets a concretar quan la identitat estigui definida"
- el prompt d'imatge ha de demanar sempre un retrat policial de fitxa: pla de bust frontal, cap i espatlles, mirant directament a camera, fons neutre, llum suau de despatx policial i composicio centrada
- el prompt d'imatge ha de prohibir explicitament accio, mans visibles, objectes, eines, armes, documents, interiors narratius, escenes dramatitzades i qualsevol activitat del sospitos

No canviis el culpable ja definit.
Tot en catala.
```

### Prompt 4. Evidence Builder

```text
A partir del cas ja definit, crea les proves del cas.
Genera com a minim:
- una prova forense
- una prova temporal
- una prova documental o digital
- una prova relacional

Les proves han de reforcar una sola solucio.
Tot en catala.
```

### Prompt 5. Exporter

```text
Converteix el cas desenvolupat en carpetes i fitxers al format final `case-XXX.json`.
Respecta els node ids requerits pel joc.
Resumeix el material font sense perdre la logica.
Representa cada sospitos com una carpeta-dossier amb documents interns, no com un unic node `suspect`.
La fitxa principal del sospitos ha d'unir perfil basic, historia personal i foto.
Tot en catala i retorna nomes JSON valid.
```

## Regla Final

La IA no ha de "ser creativa a cada pas".
Ha de ser creativa nomes al principi i disciplinada a partir d'aleshores.
