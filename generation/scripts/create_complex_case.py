#!/usr/bin/env python3
"""
Create a new complex-case workspace under generation/cases/case-XXX/.

This script scaffolds the source-material structure used to design richer
detective cases before exporting them to the final app/cases/case-XXX.json format.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CASES_DIR = ROOT / "generation" / "cases"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a new complex case folder scaffold."
    )
    parser.add_argument(
        "--case-id",
        help="Case id like case-013. If omitted, the next free id is used.",
    )
    parser.add_argument(
        "--title",
        default="Titol provisional",
        help="Working title for the new case.",
    )
    parser.add_argument(
        "--suspects",
        type=int,
        default=4,
        help="Number of suspect folders to create. Default: 4.",
    )
    return parser.parse_args()


def collect_existing_case_numbers() -> list[int]:
    numbers = set()

    for path in CASES_DIR.glob("case-*"):
        name = path.name
        match = re.fullmatch(r"case-(\d{3})", name)
        if match:
            numbers.add(int(match.group(1)))
            continue

        match = re.fullmatch(r"case-(\d{3})\.json", name)
        if match:
            numbers.add(int(match.group(1)))

    app_cases_dir = ROOT / "app" / "cases"
    for path in app_cases_dir.glob("case-*.json"):
        match = re.fullmatch(r"case-(\d{3})\.json", path.name)
        if match:
            numbers.add(int(match.group(1)))

    return sorted(numbers)


def next_case_id() -> str:
    numbers = collect_existing_case_numbers()
    next_number = 1

    while next_number in numbers:
        next_number += 1

    return f"case-{next_number:03d}"


def normalize_case_id(case_id: str) -> str:
    if re.fullmatch(r"case-\d{3}", case_id):
        return case_id

    if re.fullmatch(r"\d{1,3}", case_id):
        return f"case-{int(case_id):03d}"

    raise ValueError("case id must look like case-013 or 13")


def make_suspect_folder_name(index: int) -> str:
    return f"suspect-{index:02d}"


def suspect_paths(count: int) -> list[str]:
    paths = []
    for index in range(1, count + 1):
        folder = make_suspect_folder_name(index)
        paths.extend(
            [
                f"03-suspects/{folder}/dossier.md",
                f"03-suspects/{folder}/image-prompt.md",
                f"03-suspects/{folder}/connection-to-victim.md",
                f"03-suspects/{folder}/alibi.md",
                f"03-suspects/{folder}/interrogation-statement.md",
                f"03-suspects/{folder}/secrets-and-contradictions.md",
            ]
        )
    return paths


def build_file_map(case_id: str, title: str, suspect_count: int) -> dict[str, str]:
    suspect_lines = []
    suspect_workflow = []

    for index in range(1, suspect_count + 1):
        folder = make_suspect_folder_name(index)
        suspect_lines.append(f"- `{folder}/`")
        suspect_workflow.append(
            f"- Desenvolupa `{folder}/` amb fitxa policial, coartada i declaracio."
        )

    file_map = {
        "README.md": f"""# {case_id.upper()} - {title}

Aquesta carpeta es la base de treball per construir un cas complex abans de convertir-lo al format final `{case_id}.json`.

## Objectiu

- Desenvolupar la veritat interna del cas abans del JSON final.
- Separar cronologia, sospitos, proves i solucio.
- Permetre que una IA treballi per fases amb coherencia.
- Preparar material prou ric per convertir cada sospitos en un mini-expedient jugable al JSON final.

## Estructura

- `00-overview/`
- `01-victim/`
- `02-timeline/`
- `03-suspects/`
- `04-evidence/`
- `05-solution/`
- `06-export/`
- `99-ai-runbook.md`

## Recordatori

No afegeixis aquest cas a `app/cases/cases-index.json` fins que existeixi el JSON final jugable.
""",
        "99-ai-runbook.md": f"""# AI Runbook - {case_id}

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
{chr(10).join(suspect_workflow)}
10. Omple `05-solution/`.
11. Exporta el resultat a `06-export/{case_id}-draft.json`.
12. Nomes quan el cas sigui coherent, converteix-lo a `app/cases/{case_id}.json`.

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
- La foto final de cada sospitos ha d'apuntar a `app/images/suspects/{case_id}/<id-final-del-sospitos>.jpg`; ha de ser un retrat policial frontal de fitxa. Si encara no existeix, la UI mostrara una imatge per defecte.

## Prompt base recomanat

Consulta `generation/prompts/complex-case-workflow.md` i `export/prompts/rich-case-export-prompt.md` abans de redactar res.
""",
        "00-overview/case-concept.md": f"""# Concepte General

## Titol provisional

{title}

## Premissa

Descriu la situacio de partida del cas en 1 o 2 paragrafs.

## To

- A concretar.
- A concretar.
- A concretar.

## Tema central

- A concretar.

## Conflicte principal

- A concretar.

## Veritat central del cas

- Victima:
- Culpable:
- Motiu real:
- Metode:
- Oportunitat:
- Error clau del culpable:
- Secret central:

## Mecanica narrativa del crim

- A concretar.
- A concretar.
- A concretar.

## Funcio dels altres sospitos

- Sospitos 01:
- Sospitos 02:
- Sospitos 03:
- Sospitos 04:
""",
        "00-overview/case-summary.md": f"""# Resum de Treball

## Id de treball

{case_id}

## Titol provisional

{title}

## Victima provisional

- A concretar.

## Escenari

- A concretar.

## Objectiu del jugador

Identificar l'unic culpable demostrant motiu, metode i oportunitat, i descartant els altres sospitos amb proves coherents.

## Nucli dramatic

- A concretar.

## Secret central

- A concretar.

## Direccio actual del cas

- A concretar.
- A concretar.
- A concretar.
""",
        "01-victim/victim-profile.md": """# Perfil de la Victima

## Nom

- A concretar.

## Edat

- A concretar.

## Rol public

- A concretar.

## Imatge publica

- A concretar.

## Cara oculta

- A concretar.
- A concretar.
- A concretar.

## Personalitat real

- A concretar.
- A concretar.
- A concretar.

## Ferides del passat

- A concretar.
- A concretar.

## Que sabia abans de morir

- A concretar.
- A concretar.
- A concretar.

## Per que era perillosa aquella nit

- A concretar.
- A concretar.
""",
        "01-victim/relationships-map.md": """# Relacions de la Victima

Aquest document fixa el vincle emocional i historic entre la victima i els sospitos.

## Sospitos 01

- Relacio publica:
- Relacio privada:
- Deute emocional:
- Motiu per protegir la victima:
- Motiu per odiar la victima:

## Sospitos 02

- Relacio publica:
- Relacio privada:
- Deute emocional:
- Motiu per protegir la victima:
- Motiu per odiar la victima:

## Sospitos 03

- Relacio publica:
- Relacio privada:
- Deute emocional:
- Motiu per protegir la victima:
- Motiu per odiar la victima:

## Sospitos 04

- Relacio publica:
- Relacio privada:
- Deute emocional:
- Motiu per protegir la victima:
- Motiu per odiar la victima:
""",
        "01-victim/final-day.md": """# Ultim Dia de la Victima

## Mati

- Reunions clau:
- Trucades:
- Canvis d'humor:

## Tarda

- Conflictes oberts:
- Decisions importants:
- Documents recuperats o amagats:

## Vespre

- Qui havia de veure la victima:
- Quina discussio es preveia:
- Que havia decidit revelar o cancel.lar:

## Ultima finestra abans de morir

- Hora aproximada:
- Persona citada:
- Objecte o document present a l'escena:
""",
        "02-timeline/master-timeline.md": """# Cronologia Mestra

Sequencia real dels fets del dia del crim.

## 18.00 - 20.00

- 

## 20.00 - 21.00

- 

## 21.00 - 22.00

- 

## 22.00 - 23.00

- 

## Descobriment del cos

- Hora:
- Qui troba la victima:
- Estat de l'escena:
""",
        "02-timeline/murder-window.md": """# Finestra del Crim

## Hora estimada de la mort

- A concretar.

## Ultima persona confirmada amb la victima

- A concretar.

## Temps minim necessari per cometre el crim

- A concretar.

## Elements que limiten els sospitos

- Accessos
- Testimonis
- Registres digitals
- Forense
- Coherencia temporal

## Contradiccions a vigilar

- Qui menteix sobre l'hora.
- Qui menteix sobre la trobada amb la victima.
- Qui amaga un objecte clau.
""",
        "03-suspects/README.md": f"""# Sospitos del Cas

Cada sospitos te una carpeta propia amb els materials base que despres es convertiran en proves o declaracions dins del joc.

Quan el nom del sospitos ja estigui decidit, renombra la carpeta a un format com `suspect-01-nom-cognom/` i actualitza `image-prompt.md` amb un prompt concret, no generic.
El prompt d'imatge ha de ser sempre per a un retrat policial de fitxa: bust frontal, cap i espatlles, mirant directament a camera, fons neutre, sense accio, sense mans visibles, sense objectes i sense escena narrativa.

## Carpetes creades

{chr(10).join(suspect_lines)}

## Fitxers recomanats per sospitos

- `dossier.md`
- `image-prompt.md`
- `connection-to-victim.md`
- `alibi.md`
- `interrogation-statement.md`
- `secrets-and-contradictions.md`
""",
        "04-evidence/evidence-map.md": """# Mapa de Proves

## Linia 1 - Forense

- Que demostra:
- A qui compromet:

## Linia 2 - Temporal

- Que demostra:
- A qui compromet:

## Linia 3 - Documental o digital

- Que demostra:
- A qui compromet:

## Linia 4 - Emocional o relacional

- Que demostra:
- A qui compromet:
""",
        "04-evidence/forensics.md": """# Proves Forenses

- Causa preliminar de la mort:
- Objecte utilitzat o metode:
- Marques corporals:
- Restes a l'escena:
- Element forense que desmenteix una declaracio:
""",
        "04-evidence/witnesses.md": """# Testimonis

## Testimoni 01

- Qui es:
- Que veu:
- Que interpreta malament:

## Testimoni 02

- Qui es:
- Que veu:
- Que interpreta malament:

## Testimoni 03

- Qui es:
- Que veu:
- Que interpreta malament:
""",
        "04-evidence/documents-and-digital.md": """# Proves Documentals i Digitals

- Correus:
- Missatges:
- Registres d'acces:
- Documents alterats:
- Fitxers desapareguts:
""",
        "04-evidence/scene-details.md": """# Detalls de l'Escena

- Disposicio del cos:
- Objectes fora de lloc:
- Elements cremats o manipulats:
- Begudes, menjar o utensilis:
- Indicis falsos deixats a proposit:
""",
        "05-solution/culprit-theory.md": """# Teoria del Culpable

## Culpable

- A decidir.

## Motiu real

- A decidir.

## Metode

- A decidir.

## Oportunitat

- A decidir.

## Error clau del culpable

- A decidir.
""",
        "05-solution/eliminations.md": """# Eliminacions

## Sospitos 01

- Per que sembla culpable:
- Per que no pot ser-ho:

## Sospitos 02

- Per que sembla culpable:
- Per que no pot ser-ho:

## Sospitos 03

- Per que sembla culpable:
- Per que no pot ser-ho:

## Sospitos 04

- Per que sembla culpable:
- Per que no pot ser-ho:
""",
        "05-solution/proof-chain.md": """# Cadena de Proves

Defineix aqui la cadena logica final que el jugador hauria de poder reconstruir.

1. La victima descobreix o decideix revelar alguna cosa.
2. El culpable enten que ho perdra tot si la victima parla.
3. Es produeix la trobada decisiva.
4. El metode del crim connecta amb un recurs al qual no tothom te acces.
5. Una prova objectiva contradiu la coartada.
6. Les altres opcions queden eliminades sense ambiguitat.
""",
        f"06-export/{case_id}-draft.json": """{
  "status": "draft",
  "notes": "Placeholder per a l'export final al format del joc."
}
""",
    }

    for index in range(1, suspect_count + 1):
        folder = make_suspect_folder_name(index)
        label = f"Sospitos {index:02d}"
        file_map[f"03-suspects/{folder}/dossier.md"] = f"""# Fitxa Policial del {label}

## Nom

- A concretar.

## Edat

- A concretar.

## Rol

- A concretar.

## Ruta de la foto final

- `app/images/suspects/{case_id}/<id-final-del-sospitos>.jpg`

## Primera impressio

- A concretar.

## Perfil basic

- A concretar.
- A concretar.

## Historia personal

- Passat rellevant:
- Ferida personal:
- Dependencia o deute:
- Secret que no vol que surti:
"""
        file_map[f"03-suspects/{folder}/image-prompt.md"] = f"""# Prompt d'Imatge

Retrat policial realista del {label.lower()} per a una fitxa d'investigacio. Pla de bust frontal, cap i espatlles, mirant directament a la camera, fons neutre gris o beix, llum suau de despatx policial, composicio centrada. Personalitza'l amb edat aproximada, rol, trets facials, pentinat, roba i expressio. Sense accio, sense mans visibles, sense objectes, sense eines, sense armes, sense documents, sense interiors narratius, sense escena dramatitzada i sense cap activitat del sospitos.

Despres de generar-lo, desa la imatge final a `app/images/suspects/{case_id}/<id-final-del-sospitos>.jpg`.
"""
        file_map[f"03-suspects/{folder}/connection-to-victim.md"] = f"""# Relacio amb la Victima

- Vincle professional:
- Vincle personal:
- Greuge antic:
- Secret compartit:
"""
        file_map[f"03-suspects/{folder}/alibi.md"] = f"""# Document de Coartada del {label}

## Tipus de peça

- Pot ser un formulari de declaracio inicial, una fitxa de presencia, un registre d'acces, una nota de centraleta o qualsevol altre document tangible.

## Contingut minim

- Franja horaria declarada.
- Lloc on diu que era.
- Dades verificables reals: testimonis, trucades, accessos, rebuts, cambres.

## Regla

- No facis resum de narrador ni valoracions externes. Ha de semblar una peça real d'expedient.
"""
        file_map[f"03-suspects/{folder}/interrogation-statement.md"] = f"""# Registre d'Interrogatori del {label}

## To de declaracio

- A concretar.

## Transcripcio

- Ha de ser llarga, amb ritme de conversa real entre interrogador i declarant.
- Ha d'incloure repreguntes, evasives, canvis de to, precisions horaries i contradiccions petites.
- La coartada i els moviments del dia del crim han de sortir aqui de manera natural.
- El catala ha de sonar viu, proper i creible, no excessivament sec ni administratiu.

## Format

- Interrogador: ...
- Declarant: ...
- Interrogador: ...
- Declarant: ...
- Interrogador: ...
- Declarant: ...
"""
        file_map[f"03-suspects/{folder}/secrets-and-contradictions.md"] = f"""# Secrets i Contradiccions del {label}

- Que amaga realment:
- Sobre que menteix:
- Per que sembla culpable:
- Per que podria resultar innocent:
"""

    return file_map


def write_case(case_dir: Path, file_map: dict[str, str]) -> None:
    for relative_path, content in file_map.items():
        path = case_dir / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def main() -> int:
    args = parse_args()

    try:
        case_id = normalize_case_id(args.case_id) if args.case_id else next_case_id()
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    if args.suspects < 2:
        print("Error: create at least 2 suspects.", file=sys.stderr)
        return 1

    case_dir = CASES_DIR / case_id

    if case_dir.exists():
        print(f"Error: {case_dir} already exists.", file=sys.stderr)
        return 1

    file_map = build_file_map(case_id, args.title, args.suspects)
    write_case(case_dir, file_map)

    print(f"Created {case_dir.relative_to(ROOT)}")
    print("Next steps:")
    print(f"  1. Open {case_dir.relative_to(ROOT) / '99-ai-runbook.md'}")
    print("  2. Run the generation workflow prompts phase by phase")
    print(f"  3. Export to app/cases/{case_id}.json only when the case is coherent")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
