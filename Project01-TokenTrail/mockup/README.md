# TokenTrail — Mockup

**Design canvas:** https://claude.ai/artifact/Uy53TBTkRNouBSSBTrxhHV (private until shared from the canvas Share menu)

17 artboards, high fidelity, with design-rationale notes beside each screen.

| Persona | Screens |
|---|---|
| Overview | 00 Flows, colour roles, type |
| Patient (mobile web, 390×844) | P1 Live status · P2 10 ahead · P3 5 ahead · P4 2 ahead · P5 Your turn · P6 Missed turn · P7 Done + feedback · P8 Offline · P9 Expired token |
| Staff (desktop) | S1 Sign-in · S2 Registration desk · S3 Token QR · S4 Printed slip (80 mm) · S5 Doctor's room console |
| Admin (desktop) | A1 Daily summary · A2 Clinic setup |

**Visual language:** IBM Plex Sans + Plex Mono (token numbers), deep blue `#0A58A8` for action/progress, amber reserved for the one "act now" alert (5 ahead).

**Assumptions drawn into the mockup (confirm before building):**
- Alert delivery = browser push + SMS backup (PROJECT.md decision #3).
- Missed turn → one re-entry, placed after the current patient.
- Token valid for day of issue only; 5-minute grace after call.

> All names, tokens and numbers are **sample data**. They are not test evidence and must not be used as Chapter 8 screenshots — capture those from the real build. Mockup images may be used as *design figures* (Chapter 4/8 GUI layouts) if labelled as mockups.
