# AI Runbook - case-016

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
- Desenvolupa `suspect-01-clara-nogues/` amb perfil, transfons, coartada i declaracio.
- Desenvolupa `suspect-02-damia-riera/` amb perfil, transfons, coartada i declaracio.
- Desenvolupa `suspect-03-lucie-moreau/` amb perfil, transfons, coartada i declaracio.
- Desenvolupa `suspect-04-nil-font/` amb perfil, transfons, coartada i declaracio.
10. Omple `05-solution/`.
11. Exporta el resultat a `06-export/case-016-draft.json`.
12. Nomes quan el cas sigui coherent, converteix-lo a `app/cases/case-016.json`.

## Regles

- Tot en catala.
- Una sola solucio viable.
- Min 3 linies independents de prova.
- No dependre de coneixement extern.
- Les declaracions han de quadrar amb la cronologia real.
- Els sospitos han de semblar plausibles, pero nomes un pot resistir totes les comprovacions.
- En l'export final, els sospitos s'han de convertir en carpetes-dossier amb documents interns, no en nodes plans d'un sol interrogatori.

## Prompt base recomanat

Consulta `generation/prompts/complex-case-workflow.md` i `export/prompts/rich-case-export-prompt.md` abans de redactar res.
