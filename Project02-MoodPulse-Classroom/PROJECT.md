# Project 02: MoodPulse Classroom — Project Plan

**Status:** Planning · **PRD:** [PRD.md](./PRD.md) · **Mockup:** [mockup/](./mockup/) · **Report:** [document/](./document/)

## Goal in one line
Students scan a fixed desk QR and tap one preset emoji; faculty see an anonymous, time-mapped engagement pattern per lecture.

## Open decisions (blockers first)
| # | Decision | Why it matters | Owner | Status |
|---|---|---|---|---|
| 1 | Submission deadline | Sets the whole schedule; none is recorded in the repo | Pavan | **Open** |
| 2 | Tech stack | Drives Ch. 2, 5, 6 and the testing approach | Pavan | **Open** |
| 3 | Anti-spam approach for a fixed, shared QR | Anyone with the QR can submit; "anonymous" and "trustworthy" pull against each other | Pavan | **Open** |
| 4 | Can a real class be used for testing? | Decides whether Ch. 7 has genuine participation data | Pavan | **Open** |
| 5 | Project/guide details for front matter | Needed before the cover pages | Pavan | **Open** |

## MVP cut line (from PRD §6)
In: classroom + QR creation, class-slot allocation, anonymous predefined-option input, time/class-mapped dashboard.
Out: free text, student identity, cross-campus benchmarks, prediction.
Rule: anything not on the "In" list needs an explicit decision before it is built.

## Build order (thin slice first)
1. Admin creates classroom → QR generated.
2. Student scans → taps emoji → response stored with classroom + timestamp.
3. Map timestamp to lecture slot.
4. Faculty timeline view per lecture.
5. Admin trends view, then mockup polish.

## Evidence plan (testing must be real)
Everything in Ch. 7–8 comes from actual runs. Nothing below may be filled in speculatively.
| Evidence | How to get it genuinely | Collected |
|---|---|---|
| Functional test cases | Run against the built app | No |
| Spam/rate-limit test | Attempt repeated submissions from one device | No |
| Participation data | Only from real students in a real session (see decision #4) | No |
| Screenshots | Capture from the running build | No |

## Risks (project, not product)
| Risk | Likelihood | Response |
|---|---|---|
| No real class available, so no genuine participation data | High (ASSUMPTION) | State it plainly in Ch. 7 and Limitations; do not simulate "student" data and present it as real |
| Fixed QR can be scanned from outside the room | Medium | Resolve decision #3 before building |
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

## Decisions recorded (4 Nov 2026)
- **Stack (decision #2):** ASP.NET Core Web API + EF Core + SQL Server (Azure SQL), SignalR, Angular PWA. Chosen to match the author's existing skills; it is a design choice, not yet built.
- **Report status:** `document/` holds the submission .docx (built by `tools/report-builder`, content in `document/src/content.js`). It documents the design and the high-fidelity prototype only. Nothing has been implemented or tested, so the verification plan lists every test case as "Planned".
- **Still open:** institution details, register number, guide/HOD names and dates (yellow fields in the .docx).
