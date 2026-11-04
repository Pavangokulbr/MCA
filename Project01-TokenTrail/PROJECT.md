# Project 01: TokenTrail — Project Plan

**Status:** Planning · **PRD:** [PRD.md](./PRD.md) · **Mockup:** [mockup/](./mockup/) · **Report:** [document/](./document/)

## Goal in one line
Patients track a clinic queue token on their phone after a QR scan, so they wait nearby instead of in a crowd.

## Open decisions (blockers first)
| # | Decision | Why it matters | Owner | Status |
|---|---|---|---|---|
| 1 | Submission deadline | Sets the whole schedule; none is recorded in the repo | Pavan | **Open** |
| 2 | Tech stack | Drives Ch. 2, 5, 6 and the testing approach | Pavan | **Open** |
| 3 | How alerts are delivered (page only, or push/SMS) | Largest hidden scope item; "alerts at 10/5/2/next" is the core value | Pavan | **Open** |
| 4 | Project/guide details for front matter | Needed before the cover pages | Pavan | **Open** |

## MVP cut line (from PRD §6)
In: token creation, QR per token, live patient page, milestone alerts, basic day-wise summary.
Out: hospital system integration, multi-clinic, forecasting.
Rule: anything not on the "In" list needs an explicit decision before it is built.

## Build order (thin slice first)
1. Staff creates token → QR → patient page shows position. *(proves the core loop)*
2. Staff advances the queue → patient page updates.
3. Milestone alerts (10 / 5 / 2 / next).
4. Day-wise summary dashboard.
5. Mockup polish only after the loop works.

## Evidence plan (testing must be real)
Everything in Ch. 7–8 comes from actual runs. Nothing below may be filled in speculatively.
| Evidence | How to get it genuinely | Collected |
|---|---|---|
| Functional test cases | Run against the built app | No |
| Alert timing test | Simulate a queue of 12+ tokens end to end | No |
| Staff/patient usability feedback | Ask real people, record what they said | No |
| Screenshots | Capture from the running build | No |

## Risks (project, not product)
| Risk | Likelihood | Response |
|---|---|---|
| Alert delivery turns out harder than expected | Medium | Decide #3 early; fall back to in-page alerts only |
| Testing with real clinic users is not feasible | High (ASSUMPTION) | Test with volunteers role-playing; state this honestly in Ch. 7 and Limitations |
| Report written after the build and rushed | Medium | Draft chapters 1–3 now, while the build is in progress |

## Chapter tracker (order per `.claude/03-chapter-structure.md`)

Page targets are planning estimates (ESTIMATE), sized to land ~40 body pages so the 30-page minimum survives layout shrinkage. Re-baseline after the first full draft.

| # | Chapter | Target pp. | Depends on | Status |
|---|---|---|---|---|
| FM | Front matter (Roman numbering) | 6 | Final title, guide/HOD names | Not started |
| 1 | Introduction | 3 | PRD | Not started |
| 2 | Software Requirement Analysis | 3 | Tech stack decision | Not started |
| 3 | System Analysis | 4 | PRD | Not started |
| 4 | System Design (DFD, UML) | 8 | Ch. 2, 3 | Not started |
| 5 | Database Design (ER, normalization) | 4 | Ch. 4 | Not started |
| 6 | Coding / Code Templates | 7 | Working build | Not started |
| 7 | Testing | 6 | Working build, **real** test runs | Not started |
| 8 | Output Screens | 5 | Working build, **real** screenshots | Not started |
| 9 | Conclusions | 2 | All above | Not started |
| 10 | References | 1 | Sources gathered while writing | Not started |
| 11 | Appendices | 2 | As needed | Not started |

Workflow rule (`06-agent-workflow.md`): one chapter at a time, confirmed by Pavan before the next begins. A chapter is marked Not Applicable only after Pavan confirms.
