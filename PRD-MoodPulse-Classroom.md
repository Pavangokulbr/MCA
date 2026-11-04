# PRD: MoodPulse Classroom

## 1) Product Summary
**MoodPulse Classroom** is an anonymous classroom sentiment pulse system.  
Each classroom has its own fixed QR (printed on desks). Students scan and submit only predefined emojis/words to quickly reflect how the session is going.

## 2) Problem
Lecture engagement is hard to measure in the moment.  
Feedback is usually delayed, biased, or too detailed to collect during live teaching.

## 3) Users
- **Primary:** Students (anonymous contributors)
- **Secondary:** Faculty/lecturers
- **Tertiary:** Department management/academic coordinators

## 4) Product Goal
Capture simple, anonymous, time-linked classroom pulse so faculty and management can understand lecture engagement by class and time slot.

## 5) End-to-End Journey (Start → Milestones → End)

### Start
1. Management creates a classroom profile in the admin side.
2. System generates a unique classroom QR.
3. QR is printed and placed on desks in that classroom.
4. Management assigns class schedule/time slots to that classroom.

### Milestones
1. During lecture, students scan desk QR at any point or periodic prompt times.
2. Students submit only predefined options (emoji/word set), fully anonymous.
3. Each response is automatically tagged by:
   - classroom ID
   - timestamp
   - mapped lecture slot
4. Faculty and management view pulse timelines and response distribution by lecture period.
5. Optional hourly quick-check windows keep feedback regular and lightweight.

### End
1. Each lecture gets a clear anonymous sentiment pattern.
2. Faculty identifies where engagement dropped or improved across a session.
3. Management sees class-time trends and can support teaching improvements with evidence.

## 6) MVP Scope (Non-Technical)
- Classroom creation and QR generation (admin)
- Class-time allocation to classrooms (admin)
- Anonymous QR-based student input
- Predefined emoji/word response set only
- Time/class-mapped pulse dashboard and simple reports

## 7) What Makes It “Wow”
- No app friction: scan desk QR, tap one response, done.
- Anonymous but still analytically useful due to classroom/time mapping.
- Converts classroom “vibe” into measurable patterns without collecting identity.

## 8) Success Metrics
- Response participation rate per class
- Consistency of hourly pulse participation
- Reduction in repeated low-engagement time segments over weeks
- Faculty usefulness rating of pulse insights

## 9) Assumptions
- Desk QR remains visible and usable.
- Predefined response set is clear to students.
- Schedule mapping for classroom and lecture slots is maintained.

## 10) Out of Scope for MVP
- Free-text feedback
- Student identity tracking
- Cross-campus benchmarking and deep predictive analytics

## 11) Risks and Mitigation (Non-Technical)
- **Risk:** Random/spam taps  
  **Mitigation:** Lightweight rate limits per device session and periodic validation checks.
- **Risk:** Low participation in some classes  
  **Mitigation:** Keep response action under 5 seconds; use routine hourly pulse moments.
- **Risk:** Misinterpretation of single data points  
  **Mitigation:** Show trends over time, not one-off events alone.
