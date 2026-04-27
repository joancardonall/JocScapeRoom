# Case 013 - El banquet de les cendres

Aquesta carpeta es la base de treball per construir un cas molt mes profund abans de convertir-lo al format final `case-013.json`.

## Objectiu d'aquesta estructura

- Separar el desenvolupament narratiu per blocs.
- Donar espai a transfons, relacions, coartades i contradiccions.
- Preparar materials reutilitzables per al JSON final.
- Fer mes facil revisar la coherencia del cas abans d'exportar-lo.

## Estructura

- `00-overview/`
  - Visio general del cas, tema, to i conflicte central.
- `01-victim/`
  - Perfil de la victima, secrets, relacions i ultima jornada.
- `02-timeline/`
  - Cronologia completa i finestra real del crim.
- `03-suspects/`
  - Un subdirectori per cada sospitos amb cara, passat, coartada i veu propia.
- `04-evidence/`
  - Proves forenses, digitals, testimonials i objectuals.
- `05-solution/`
  - Culpable, motiu, metode, cadena de proves i eliminacions.
- `06-export/`
  - Espai reservat per preparar l'adaptacio al format final del joc.

## Flux recomanat

1. Definir el nucli del cas a `00-overview`.
2. Tancar la victima i els vincles personals a `01-victim`.
3. Construir la cronologia real a `02-timeline`.
4. Desenvolupar els sospitos a `03-suspects`.
5. Crear proves que connectin amb la cronologia i les contradiccions.
6. Tancar una unica solucio viable a `05-solution`.
7. Quan el cas estigui madur, convertir-lo a JSON dins `06-export/`.
