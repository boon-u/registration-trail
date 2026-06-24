# Glossary

Domain terms used throughout the project. The system is **Oracle / Cerner CIS**
(Clinical Information System), as used by **IWK Health** (Halifax, Nova Scotia).

- **CIS** — Clinical Information System (Oracle/Cerner). The platform being taught.
- **Encounter** — a unique ID representing one *episode of care* (a visit/
  interaction). Links registration, orders, documentation, meds for that visit.
  **The central concept of the whole training.** Rule of thumb: every episode of
  care gets its own encounter.
- **Episode of care** — a single, bounded instance of a patient receiving care;
  what an encounter represents.
- **MRN** — Medical Record Number. Identifies the patient profile. Learners note
  the test patient's MRN after creating it.
- **Pre-registration (pre-reg)** — entering/verifying a patient's demographic and
  visit info *before* arrival; a draft/container for an upcoming appointment.
- **Pre-admit** — the admission equivalent of pre-reg, created before an inpatient
  admission; flips to an inpatient encounter on registration.
- **Check-in** — the action when a patient arrives that flips a pre-reg into the
  appropriate encounter (e.g. pre-reg → outpatient). Turns the grid block green.
- **App Bar** — a launcher bar for applications. Pinning apps gives **single
  sign-on** (no repeated logins). Configurable: large icons, float, "always on top".
- **Storefront** — alternative place to launch apps (no SSO benefit); contrast
  with the App Bar.
- **PM Office** — patient-management app. Left categories: Conversation, Work List,
  Groups, Inquiries. Supports custom groups (pin features into one place).
- **Custom group** — a user-defined group in PM Office to pin frequently used
  features so they're all in one place.
- **Appointment Book / Scheduling** — the scheduling app; toolbars, calendar view,
  appointment books, Books tab, work-in-progress, grid.
- **IWK Allergy** — the specific appointment book used in the outpatient scenario.
- **Proportional vs non-proportional single day** — grid views. Non-proportional
  squeezes appointments to the top with no timeline; proportional maps them to a
  real timeline (which is then trimmed to clinic hours, 7am–5pm).
- **Three scheduling methods** — **Schedule**, **Suggest**, **Drag and drop**.
- **Grid colours** — **gray = pending**, **blue = confirmed**, **green = checked in**.
  (The app's world-status colours intentionally mirror these.)
- **Bed board** — inpatient view for assigning locations/beds; beds coloured by
  gender (male / female / undefined).
- **Discharge encounter** — the action to discharge an inpatient when approved;
  afterward the room is marked **dirty**.
- **Dirty room** — a room flagged for cleaning after a patient leaves.
- **Service interaction** — created as part of recurring appointments.
- **Group container** — a group with a member capacity (here 60) that patients are
  added into for group sessions.
- **Alias exists (error)** — thrown when a duplicate profile / shared health card
  number already exists; the go-live duplicate-profile pitfall.
- **Expiring Health Cards work list** — a list surfacing patients whose health card
  expiry date is approaching, so records can be updated.
- **MSI** — Medical Services Insurance (Nova Scotia's provincial plan).
- **WCB** — Workers' Compensation Board (for workplace injuries).
- **Canadian Armed Forces Health Plan** — coverage for armed forces personnel.
- **Guarantor** — the party responsible for the bill, captured at registration.
- **Administrative sex / pronouns** — registration demographic fields to set
  correctly.
- **GL2 / GL3 / Go-Live** — Go-Live phases. This training is the GL3 enrichment
  stream; several pitfalls come from real GL2 issues.
- **Sandbox / train environment** — the non-production training system. Has **no
  pre-made encounters**, so learners create them (and learn why).
