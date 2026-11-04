# PRD: TokenTrail

## 1) Product Summary
**TokenTrail** is a smart virtual queue experience for government clinics.  
It lets patients track their token status on mobile after a QR scan, so they can wait from nearby locations instead of standing in a physical crowd.

## 2) Problem
In many public clinics, patients spend long and uncertain waiting time at the premises.  
This causes stress, overcrowding, and unproductive time for patients and attendants.

## 3) Users
- **Primary:** Patients and patient attendants
- **Secondary:** Registration/front-desk staff
- **Tertiary:** Clinic administration

## 4) Product Goal
Reduce physical crowding and waiting stress while preserving queue fairness and improving patient time usage.

## 5) End-to-End Journey (Start → Milestones → End)

### Start
1. Patient arrives at clinic reception.
2. Staff creates a token in the queue desk screen.
3. A token-linked QR is generated and shared with the patient.
4. Patient scans the QR and opens a live queue page.

### Milestones
1. Patient sees key status: current running token, own token, and people ahead.
2. Patient is free to step out nearby (coffee, pharmacy, errands) without losing queue awareness.
3. Patient gets progressive alerts:
   - 10 people ahead
   - 5 people ahead
   - 2 people ahead
   - Next turn
4. Patient returns on time and stays ready for consultation.

### End
1. Patient is called with minimal idle waiting.
2. Staff handles queue with less crowd pressure at the desk/waiting area.
3. Administration receives simple daily insights:
   - average waiting time
   - no-show/missed-turn count
   - crowding reduction trend

## 6) MVP Scope (Non-Technical)
- Token creation by staff
- QR generation per token
- Patient live queue page
- Milestone notifications
- Basic day-wise summary dashboard

## 7) What Makes It “Wow”
- Public-service queue that behaves like a modern delivery tracker.
- Real-time certainty for patients without forcing them to wait in one place.
- Simple flow with immediate visible value from day one.

## 8) Success Metrics
- Reduced physical waiting crowd at peak hours
- Lower average patient idle waiting time
- Lower missed-turn rate
- Positive patient/staff satisfaction feedback

## 9) Assumptions
- Patients can scan QR and view mobile page.
- Staff follows token creation consistently.
- Clinic allows nearby movement while retaining queue order.

## 10) Out of Scope for MVP
- Full hospital management integration
- Multi-hospital deployment
- Advanced forecasting or AI scheduling

## 11) Risks and Mitigation (Non-Technical)
- **Risk:** Patients miss alerts  
  **Mitigation:** Repeat reminder at shorter intervals near turn.
- **Risk:** Queue updates delayed by staff  
  **Mitigation:** Keep update actions minimal and part of existing desk flow.
- **Risk:** Network issues for some users  
  **Mitigation:** Lightweight status page and clear fallback message at desk.
