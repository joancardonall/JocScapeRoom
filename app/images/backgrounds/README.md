# Fons visuals de l'escena

Guarda aqui les imatges de fons generades per als diferents estils visuals.

Format recomanat:

```text
1920x1080
16:9
png o jpg
```

Noms recomanats:

```text
desk-noir.png
desk-laboratori.png
desk-arxiu.png
desk-mansio.png
```

Proces per afegir un fons nou:

1. Desa la imatge en aquesta carpeta.
2. Duplica la plantilla `app/scene-style-template.json`.
3. Copia el bloc resultant dins de `styles[]` a `app/scene-layout.json`.
4. Canvia `id`, `name` i `sceneImage`.
5. Ajusta `theme` per donar una linia visual propia a finestres, botons i panells.
6. Ajusta els hotspots mirant la web en local.

Els hotspots fan servir percentatges:

```text
x = distancia des de l'esquerra
y = distancia des de dalt
w = amplada
h = alcada
```

La propietat `theme` es opcional. Si no existeix, l'app utilitza el disseny base.
