You are a senior narrative designer for detective case-file games.
Generate EXACTLY ONE complete case JSON for a web detective game.
Return ONLY valid JSON. No markdown. No explanations.

LANGUAGE RULES
- Write all player-facing text in Catalan.
- Tone: professional investigation dossier with readable storytelling.
- Prefer natural, fluent Catalan over stiff bureaucratic phrasing.
- Avoid melodrama and avoid robotic bullet spam.

GOAL
- The case MUST have exactly one valid culprit.
- The player must solve using means + motive + opportunity.
- Include some misleading clues, but keep the case fair.
- Suspects must be represented as rich dossier folders, not as single flat suspect nodes.

STRICT OUTPUT SCHEMA
{
  "id": "case-XXX",
  "title": "...",
  "summary": "...",
  "objective": "...",
  "fileSystem": {
    "rootId": "main-folder",
    "nodes": {
      "main-folder": {"id":"main-folder","type":"folder","title":"...","description":"...","children":["police-report-folder","witnesses-folder","suspects-folder","extra-evidence-folder"]},
      "police-report-folder": {"id":"police-report-folder","type":"folder","title":"...","description":"...","children":["intro-report-doc","scene-arrival-doc"]},
      "witnesses-folder": {"id":"witnesses-folder","type":"folder","title":"...","description":"...","children":["witness-porter-doc","witness-taxi-doc","witness-dock-doc"]},
      "suspects-folder": {"id":"suspects-folder","type":"folder","title":"...","description":"...","children":["suspect-claudia-folder","suspect-pau-folder","suspect-mireia-folder","suspect-lluc-folder"]},
      "extra-evidence-folder": {"id":"extra-evidence-folder","type":"folder","title":"...","description":"...","children":["forensic-report-doc","computer-emails-doc","drawer-notes-doc","harbor-shift-doc","timeline-synthesis-doc"]},

      "intro-report-doc": {"id":"intro-report-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "scene-arrival-doc": {"id":"scene-arrival-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "witness-porter-doc": {"id":"witness-porter-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "witness-taxi-doc": {"id":"witness-taxi-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "witness-dock-doc": {"id":"witness-dock-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},

      "suspect-claudia-folder": {"id":"suspect-claudia-folder","type":"folder","category":"suspect","title":"...","description":"...","children":["suspect-claudia-dossier-doc","suspect-claudia-connection-doc","suspect-claudia-alibi-doc","suspect-claudia-interrogation-doc"]},
      "suspect-pau-folder": {"id":"suspect-pau-folder","type":"folder","category":"suspect","title":"...","description":"...","children":["suspect-pau-dossier-doc","suspect-pau-connection-doc","suspect-pau-alibi-doc","suspect-pau-interrogation-doc"]},
      "suspect-mireia-folder": {"id":"suspect-mireia-folder","type":"folder","category":"suspect","title":"...","description":"...","children":["suspect-mireia-dossier-doc","suspect-mireia-connection-doc","suspect-mireia-alibi-doc","suspect-mireia-interrogation-doc"]},
      "suspect-lluc-folder": {"id":"suspect-lluc-folder","type":"folder","category":"suspect","title":"...","description":"...","children":["suspect-lluc-dossier-doc","suspect-lluc-connection-doc","suspect-lluc-alibi-doc","suspect-lluc-interrogation-doc"]},

      "suspect-claudia-dossier-doc": {"id":"suspect-claudia-dossier-doc","type":"document","category":"suspect-dossier","title":"Fitxa Policial","subtitle":"...","suspectName":"...","photo":"./images/suspects/case-XXX/suspect-claudia.jpg","profile":["...","..."],"personalHistory":["...","..."]},
      "suspect-claudia-connection-doc": {"id":"suspect-claudia-connection-doc","type":"document","category":"suspect-relationship","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-claudia-alibi-doc": {"id":"suspect-claudia-alibi-doc","type":"document","category":"suspect-alibi","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-claudia-interrogation-doc": {"id":"suspect-claudia-interrogation-doc","type":"document","category":"suspect-interrogation","title":"...","subtitle":"...","content":["...","...","..."]},

      "suspect-pau-dossier-doc": {"id":"suspect-pau-dossier-doc","type":"document","category":"suspect-dossier","title":"Fitxa Policial","subtitle":"...","suspectName":"...","photo":"./images/suspects/case-XXX/suspect-pau.jpg","profile":["...","..."],"personalHistory":["...","..."]},
      "suspect-pau-connection-doc": {"id":"suspect-pau-connection-doc","type":"document","category":"suspect-relationship","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-pau-alibi-doc": {"id":"suspect-pau-alibi-doc","type":"document","category":"suspect-alibi","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-pau-interrogation-doc": {"id":"suspect-pau-interrogation-doc","type":"document","category":"suspect-interrogation","title":"...","subtitle":"...","content":["...","...","..."]},

      "suspect-mireia-dossier-doc": {"id":"suspect-mireia-dossier-doc","type":"document","category":"suspect-dossier","title":"Fitxa Policial","subtitle":"...","suspectName":"...","photo":"./images/suspects/case-XXX/suspect-mireia.jpg","profile":["...","..."],"personalHistory":["...","..."]},
      "suspect-mireia-connection-doc": {"id":"suspect-mireia-connection-doc","type":"document","category":"suspect-relationship","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-mireia-alibi-doc": {"id":"suspect-mireia-alibi-doc","type":"document","category":"suspect-alibi","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-mireia-interrogation-doc": {"id":"suspect-mireia-interrogation-doc","type":"document","category":"suspect-interrogation","title":"...","subtitle":"...","content":["...","...","..."]},

      "suspect-lluc-dossier-doc": {"id":"suspect-lluc-dossier-doc","type":"document","category":"suspect-dossier","title":"Fitxa Policial","subtitle":"...","suspectName":"...","photo":"./images/suspects/case-XXX/suspect-lluc.jpg","profile":["...","..."],"personalHistory":["...","..."]},
      "suspect-lluc-connection-doc": {"id":"suspect-lluc-connection-doc","type":"document","category":"suspect-relationship","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-lluc-alibi-doc": {"id":"suspect-lluc-alibi-doc","type":"document","category":"suspect-alibi","title":"...","subtitle":"...","content":["...","...","..."]},
      "suspect-lluc-interrogation-doc": {"id":"suspect-lluc-interrogation-doc","type":"document","category":"suspect-interrogation","title":"...","subtitle":"...","content":["...","...","..."]},

      "forensic-report-doc": {"id":"forensic-report-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "computer-emails-doc": {"id":"computer-emails-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "drawer-notes-doc": {"id":"drawer-notes-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "harbor-shift-doc": {"id":"harbor-shift-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]},
      "timeline-synthesis-doc": {"id":"timeline-synthesis-doc","type":"document","title":"...","subtitle":"...","content":["...","...","..."]}
    }
  },
  "solution": {
    "culprit": "...",
    "motive": "...",
    "method": "...",
    "keyProof": "...",
    "eliminations": [
      "...",
      "...",
      "..."
    ]
  }
}

DESIGN CONSTRAINTS
- Keep the base suspect id family unchanged (`suspect-claudia`, `suspect-pau`, `suspect-mireia`, `suspect-lluc`) but use them as dossier folder/document prefixes rather than flat suspect nodes.
- Time-of-death window must be explicit.
- At least 3 independent evidence lines must converge on culprit.
- Add 1-2 red herrings, but ensure they are later disambiguated.
- Do not require external knowledge.
- Keep all required node IDs present exactly as listed.
- Each suspect dossier must include a single police-style dossier document, a relationship-to-victim document, a tangible alibi/presence document, and an interrogation document.
- The dossier document must merge basic profile plus personal history, exposing them as `profile[]` and `personalHistory[]`.
- Use `photo` paths that point to `./images/suspects/case-XXX/<suspect-base-id>.jpg`; the app will fall back to a default portrait if the image does not exist yet.
- The interrogation document must carry the declared alibi and movements in a long police Q/A transcript style.
- Avoid omniscient narrator commentary inside evidence documents. Evidence should read like real dossier pieces, not explanatory summaries.
- Suspect dossier and relationship documents should read as richer story material, not as flat bullet summaries.

QUALITY TARGET
- Solvable in 25-45 minutes.
- Feels realistic and coherent.
- Clean contradiction resolution in timeline-synthesis-doc and solution.eliminations.
