# AI Runbook - case-019

Aquest fitxer explica a una IA com ha de treballar aquest cas sense improvisar directament el JSON final.

## Ordre obligatori

1. Omple `00-overview/case-concept.md`.
2. Omple `00-overview/case-summary.md`.
3. Omple `01-victim/victim-profile.md`.
4. Omple `01-victim/relationships-map.md`.
5. Omple `01-victim/final-day.md`.
6. Omple `02-timeline/master-timeline.md`.
7. Omple `02-timeline/murder-window.md`.
8. Omple `04-evidence/`.
- Desenvolupa `suspect-01-livia-conti/` amb fitxa policial, coartada i declaracio.
- Desenvolupa `suspect-02-matteo-ricci/` amb fitxa policial, coartada i declaracio.
- Desenvolupa `suspect-03-sofia-bellandi/` amb fitxa policial, coartada i declaracio.
- Desenvolupa `suspect-04-enzo-vitale/` amb fitxa policial, coartada i declaracio.
10. Omple `05-solution/`.
11. Exporta el resultat a `06-export/case-019-draft.json`.
12. Nomes quan el cas sigui coherent, converteix-lo a `app/cases/case-019.json`.

## Disciplina de noms

- Tan bon punt cada sospitos tingui nom definit, renombra la carpeta de `suspect-01/` a un format tipus `suspect-01-nom-cognom/`.
- No deixis cap `image-prompt.md` amb textos provisionals del tipus "ambient i trets a concretar".
- Cada `image-prompt.md` ha de demanar un retrat policial de fitxa: bust frontal, cap i espatlles, mirant a camera, fons neutre, sense accio, sense mans visibles, sense objectes i sense escena narrativa.
- Mantingues el prefix numeric (`suspect-01-`, `suspect-02-`) per no perdre l'ordre de treball.

## Regles

- Tot en catala.
- Una sola solucio viable.
- Min 3 linies independents de prova.
- No dependre de coneixement extern.
- Les declaracions han de quadrar amb la cronologia real.
- Els sospitos han de semblar plausibles, pero nomes un pot resistir totes les comprovacions.
- En l'export final, els sospitos s'han de convertir en carpetes-dossier amb 4 documents interns visibles: fitxa policial, relacio amb la victima, declaracio inicial i interrogatori.
- No afegeixis mes documents visibles per donar mes context; fes mes extensos els documents existents.
- Llargada recomanada al JSON final: informes i proves de 4 a 6 paragrafs, relacions i coartades de 3 a 5 paragrafs, fitxes policials amb `profile[]` i `personalHistory[]` de 3 a 5 paragrafs cadascun, i interrogatoris de 8 a 12 intercanvis de pregunta/resposta.
- La foto final de cada sospitos ha d'apuntar a `app/images/suspects/case-019/<id-final-del-sospitos>.png`; ha de ser un retrat policial frontal de fitxa. Si encara no existeix, la UI mostrara una imatge per defecte.

## Prompt base recomanat

Consulta `generation/prompts/complex-case-workflow.md` i `export/prompts/rich-case-export-prompt.md` abans de redactar res.
