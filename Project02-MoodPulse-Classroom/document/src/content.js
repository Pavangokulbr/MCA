'use strict';
// MoodPulse Classroom mini project report - content module for tools/report-builder/build.js
// Cross references use <<fig:key>>, <<tab:key>> and <<lst:key>>; they are resolved to the
// automatic chapter-wise numbers at the bottom of this file, so prose can never drift.

const content = {
  title: 'MOODPULSE CLASSROOM ANONYMOUS LECTURE MOOD PULSE SYSTEM',
  student: { name: '[[PAVAN GOKUL]]', regNo: '[[REGISTER NUMBER]]' },
  guide: { name: '[[GUIDE NAME]]', designation: '[[Designation, Department]]' },
  institution: ['[[DEPARTMENT NAME]]', '[[INSTITUTION NAME]]', '[[CITY - PINCODE]]'],
  monthYear: 'NOVEMBER 2026',
  period: { from: '[[START DATE]]', to: '[[END DATE]]' },
  hod: '[[HOD NAME]]',
  figuresDir: __dirname + '/../figures',
  abstract: "Lecturers rarely learn that a lecture has lost its audience until the end-of-term survey, when it is too late to change anything. This project designs MoodPulse Classroom, a system that lets students report, anonymously and in one tap, how a live lecture is going. Every classroom carries one fixed QR code printed on its desks. A student scans it, chooses one of five labelled moods (Lost, Confused, Okay, Following, Engaged) and optionally says whether the pace is too fast, just right or too slow. The server tags the tap with the classroom, the time and the lecture slot found in the timetable, so faculty see a five-minute pulse for each lecture and management see trends by room and time slot. Privacy is treated as a design requirement. No name, roll number, phone number or location is collected, a random device code that changes every day limits repeat taps, and any five-minute bucket with fewer than five taps is hidden. The proposed implementation uses ASP.NET Core Web API with Entity Framework Core and SQL Server, SignalR for the live view, and an Angular progressive web application. The deliverables are the requirements, the architecture, the database and API design, a verification plan and a high-fidelity prototype of fourteen screens. The system has not been built, deployed or used in a real classroom. All names and numbers in the screens are sample data, and the report states the limits of the design openly, including that a shared QR code cannot stop a leaked photograph from being scanned outside the room.",
  acknowledgement: [
    "I express my sincere gratitude to [[GUIDE NAME]], [[Designation, Department]], for guiding this mini project from the first problem statement to the final report. The regular discussions, the patient reading of every draft and the insistence on separating what is designed from what is proven shaped the quality of this work more than any single technical decision.",
    "I thank [[HOD NAME]], Head of the Department, and the Principal of [[INSTITUTION NAME]] for providing the academic environment, the laboratory facilities and the freedom to choose a project that touches everyday classroom life. I am also grateful to the faculty members of [[DEPARTMENT NAME]] whose lectures on software engineering, databases and web technologies supplied the foundations used throughout this report.",
    "I owe special thanks to my classmates and friends who gave honest opinions on the early screens and wording of the prototype, and who reminded me that a feedback tool will only be used if it takes a few seconds and feels safe. Their comments helped me simplify the student screens again and again.",
    "Finally, I thank my family for their constant encouragement, patience and support during the months in which this report was prepared.",
  ],
  body: [
    { h1: 'Introduction' },
    { p: "A lecture is a conversation in which only one side is usually heard. The lecturer speaks, writes and demonstrates, while sixty or more students listen, copy, drift or get lost, and very little of that inner state travels back to the front of the room. Experienced teachers read faces and ask questions, but a raised hand is a public act, and many students prefer to stay silent rather than admit in front of their peers that they have lost the thread. As a result, the person who most needs to know how the lecture is landing is the person with the least information while the lecture is still running." },
    { p: "Educational research has long treated this gap as a problem of feedback. Black and Wiliam (1998) reviewed a large body of studies and concluded that strengthening formative assessment, meaning the information gathered during learning that is used to adjust teaching, can improve learning. Angelo and Cross (1993) described a family of small classroom assessment techniques, such as the minute paper and the muddiest point, that let a teacher collect quick evidence of understanding without a formal test. These techniques share three properties: they are short, they are anonymous or low-stakes, and they are collected while there is still time to respond. The end-of-term course evaluation that most institutions rely on has none of these properties. It arrives after the course is over, it is long, and it summarises fourteen weeks in a handful of ratings." },
    { p: "MoodPulse Classroom is my proposal for bringing the spirit of those techniques into an ordinary college classroom with the least possible friction. Every classroom gets one fixed QR code, printed on a card and placed on the desks. At any point in a lecture a student scans the code with the phone camera, taps one of five labelled moods and, if they wish, adds whether the pace is too fast, just right or too slow. There is no app to install, no account and no typing. The server attaches the classroom, the time and the lecture slot from the timetable to that tap, so that a faculty member can later see how the mood of the room moved minute by minute, and the department can see which times of the week tend to be weak across many courses." },
    { p: "The problem addressed by this project can be stated precisely. Lecture engagement is difficult to measure in the moment, and the feedback that does exist is delayed, biased by how the course ended, or too detailed to collect while teaching. The system must therefore capture a simple, anonymous and time-linked signal that is cheap enough for students to give regularly and clear enough for faculty and management to act on, without collecting anything that could identify the student who gave it." },
    { p: "The objectives of the project are the following." },
    { numbered: [
      "To define the requirements of an anonymous, one-tap lecture pulse for students, faculty and department management, derived from the product requirements document of the project.",
      "To design a privacy-by-design data model in which a response carries only the room, the time, the lecture slot, a mood, an optional pace and a daily-rotating device hash, and to state the threat model against which that design is judged.",
      "To design a layered ASP.NET Core Web API, a SQL Server database and an API contract that map every tap to a lecture slot, limit repeat taps from one device and aggregate responses into five-minute buckets with small-cell suppression.",
      "To design Angular client screens for students, faculty and management that are accessible, never rely on colour alone, and present trends rather than single data points.",
      "To build and document a high-fidelity prototype of fourteen screens that demonstrates the intended experience.",
      "To prepare a verification plan whose test cases can be executed once the system is built, and to state candidly what has and has not been established so far.",
    ] },
    { p: "The scope covers three groups of users. Students are anonymous contributors who never sign in. Faculty sign in to see the pulse of their own lectures and courses. Department management, consisting of coordinators and the Head of the Department, manage classrooms, QR codes and timetables, and view slot-level trends. Free-text comments, tracking of individual students, comparison across campuses and predictive analytics are outside the scope of this first version, exactly as set out in the product requirements. The project delivers a design and a prototype; it does not deliver a deployed service." },
    { p: "The method followed was iterative and design-led. I began from the product requirements document, listed the users and their journeys, and decided the privacy rules before drawing any screen, because the whole concept depends on students trusting that taps cannot be traced back to them. I then produced the architecture, data model and API design, and a high-fidelity mockup of fourteen screens in which every state a student can meet is drawn, including the cooldown and the no-lecture states. Finally I wrote a verification plan so that the build, when it happens, can be judged against stated expectations. The proposed build order is a thin vertical slice first and polish later, which is justified in Chapter 2." },
    { p: "In order to achieve these goals, the report is divided into different parts, described as follows." },
    { bullets: [
      "Part 1 (Introduction) gives general information about the topic of the project, including the problem statement, the objectives, the scope and the method.",
      "Part 2 (Theoretical Background) describes the concepts and technologies used to create the solution, namely classroom feedback, requirements, privacy by design, mood-scale design, ASP.NET Core, SQL Server with Entity Framework Core, Angular, QR codes, data visualisation, REST API security and software development life cycle models.",
      "Part 3 (Practical Implementation) explains the application overview, the server-side design, the client screens of the prototype and the plan for verifying the system once it is built.",
      "Part 4 (Conclusion) summarises the outcome of the project, states its limitations honestly and lists future work.",
    ] },
    { p: "It is important to state the status of the work at this point. MoodPulse Classroom exists as a documented design and a clickable high-fidelity prototype. It has not been built as a working service, it has not been deployed, and it has not been used by any real student or faculty member. Every course name, faculty name, room and number that appears in the screenshots in Chapter 3 is sample data created for design purposes, and none of it is evidence of how the system performs. Wherever this report describes behaviour, it describes the behaviour the design intends, and the verification plan in Chapter 3 lists what remains to be demonstrated." },
    { h1: 'Theoretical Background' },
    { p: "This chapter covers the study concepts behind the technologies and design decisions used in the project. It first explains why in-lecture feedback matters, then fixes the requirements that the system must satisfy, then discusses the privacy and design principles that shape the product, and finally describes each technology chosen for the proposed implementation together with the alternatives that were considered. The depth is deliberate: in a design project the justification for a decision is as much a result as the decision itself." },
    { h2: 'Classroom feedback and student engagement' },
    { h3: 'Formative feedback' },
    { p: "Feedback is called formative when it is gathered while learning is still in progress and is used to change what happens next. Black and Wiliam (1998) surveyed the research on classroom assessment and concluded that attention to formative assessment can raise learning,. Hattie and Timperley (2007) added that the effect of feedback varies widely with its type, and that it is most useful when it helps answer three questions: where the learner is going, how the learner is going, and where to go next. A lecture pulse addresses the second question from the teacher's side. It tells the lecturer how the class is going at this moment, so that the next five minutes can be changed." },
    { p: "The important point for this project is who the feedback is for. In most college practice, student feedback is collected for institutional reporting: it is read by committees, it is attached to the faculty member's record, and it arrives after the course. A lecture pulse reverses that direction. Its first reader is the lecturer who can still act, and its output is deliberately coarse, so that it informs teaching without becoming a performance score. This reversal explains several later design decisions, among them the absence of a faculty leaderboard and the presence of a private reflection note that only the lecturer can see." },
    { h3: 'Classroom assessment techniques' },
    { p: "Angelo and Cross (1993) collected fifty classroom assessment techniques that a teacher can use in a few minutes with no marking. In the minute paper, students write for one minute on what they learned and what remains unclear. In the muddiest point technique they name the least clear item of the session. Both give the teacher information that a show of hands will not give, because the response is individual and low stakes. Their weakness in a large class is the effort of collecting and reading the papers, which means they are usually used once at the end of the session, by which time the confusion has already done its damage." },
    { p: "MoodPulse can be understood as a digital relative of these techniques with two changes. The answer is restricted to a few predefined options, so that no reading is needed and the results can be summed automatically. And the answer can be given at any moment, so that the same class can be sampled repeatedly during one lecture. The price of both changes is information: a mood tap says that something is wrong but not what. The system therefore adds an optional pace answer and lets the faculty add topic markers during the lecture, so that a dip in the chart can be connected to the topic that was being taught when it happened." },
    { h3: 'Anonymity and timeliness' },
    { p: "Two properties decide whether a feedback channel is used honestly. The first is anonymity. Admitting confusion in front of peers carries a social cost, and a student who suspects that a tap can be traced to a name will either not tap or will tap what seems safe. The design relies on the assumption that anonymity makes honest signalling easier. This assumption is plausible and consistent with common teaching experience, but it has not been tested in this project and should be checked in a consented classroom trial. The second property is timeliness. A signal that arrives within minutes can change the lecture in progress, a signal that arrives after the term can change only next year's course, and a signal that arrives the next day is remembered differently by the students who give it. The five-minute bucket used in the faculty timeline is a compromise between responsiveness and statistical stability: shorter buckets contain too few taps to be meaningful or safe to display." },
    { h2: 'Project Requirements' },
    { p: "The requirements below are derived from the product requirements document (PRD), the project plan and the design decisions recorded with the mockup. Where a requirement goes beyond the PRD, for example the cooldown rule or small-cell suppression, it is marked as a design decision and is treated as an assumption to be confirmed before building." },
    { h3: 'User roles' },
    { p: "The system has three groups of users, whose permissions and access methods differ sharply. <<tab:roles>> lists them. The most important line in the table is the first: students are never authenticated, which is what makes the anonymity promise credible." },
    { table: { key: 'roles', caption: 'User roles and their access', headers: ['Role', 'Who', 'Access method', 'Main capabilities'], widths: [1.2, 1.6, 1.6, 3.2], rows: [
      ['Student', 'Any person in the classroom with a phone', 'Scans the room QR, no sign-in', 'Submit one mood and optional pace; see cooldown and no-lecture states'],
      ['Faculty', 'Lecturers', 'College e-mail and password', 'See own lectures, live pulse, timeline, topic markers, quick checks, course trend, private reflection'],
      ['Management', 'Coordinators and Head of the Department', 'College e-mail and password', 'Manage classrooms, QR codes and timetables; view slot-level trends; no per-faculty ranking'],
    ] } },
    { h3: 'Functional requirements' },
    { p: "The functional requirements are listed in <<tab:fr>>. Each has an identifier so that screens in Section 3.3 and test cases in Section 3.4 can refer to it. The wording uses the word shall for mandatory behaviour of the proposed system." },
    { table: { key: 'fr', caption: 'Functional requirements', size: 19, headers: ['ID', 'Requirement'], widths: [0.8, 7], rows: [
      ['FR-1', 'Management shall create a classroom profile with code, block, floor and desk count.'],
      ['FR-2', 'The system shall generate a unique QR code per classroom that encodes a URL containing a random token, and shall allow regeneration that invalidates the previous version.'],
      ['FR-3', 'Management shall be able to download the QR code and print A6 desk cards that carry the QR code and the anonymity statement.'],
      ['FR-4', 'Management shall maintain a timetable that maps room, weekday and time to course, section and faculty, including bulk import from a CSV file.'],
      ['FR-5', 'A student shall be able to open the pulse page by scanning the QR code with no sign-in, and shall see the room, the course and whether input is open.'],
      ['FR-6', 'A student shall submit exactly one of five predefined moods and optionally one of three pace values; free text shall not be accepted.'],
      ['FR-7', 'The system shall tag every accepted response with classroom, server timestamp and the lecture slot resolved from the timetable.'],
      ['FR-8', 'The system shall accept input only from five minutes before a scheduled lecture until it ends, and otherwise shall show the next scheduled lecture.'],
      ['FR-9', 'The system shall accept one tap per device per ten minutes using a random daily device code, and shall tell the student when the next tap opens.'],
      ['FR-10', 'After each tap the system shall state what is stored and what is never stored.'],
      ['FR-11', 'Faculty and management shall sign in with college e-mail, and the role shall decide the landing page.'],
      ['FR-12', 'Faculty shall see today\'s lectures with status, live mood distribution and a warning when the struggle share is high.'],
      ['FR-13', 'Faculty shall see a lecture timeline in five-minute buckets with summary tiles and topic markers; buckets with fewer than five taps shall be hidden.'],
      ['FR-14', 'Faculty shall be able to open a timed quick check and add topic markers during a live lecture.'],
      ['FR-15', 'Faculty shall see a course trend across lectures, covering mood, participation and where in the hour struggle recurs.'],
      ['FR-16', 'Management shall see a department heatmap by weekday and time slot, with flagged slots, and shall never see a ranking of faculty.'],
      ['FR-17', 'The system shall count scans that fall outside any scheduled slot and show the count to management so that timetable gaps can be corrected.'],
      ['FR-18', 'Faculty shall be able to keep a private reflection note for each lecture that no other user can read.'],
      ['FR-19', 'Faculty shall be able to view a lecture as a table and download it as a PDF.'],
    ] } },
    { h3: 'Non-functional requirements' },
    { p: "Non-functional requirements describe how well the system must behave rather than what it must do. They are listed in <<tab:nfr>>. The figures in the table are design targets or assumptions, not measured results." },
    { table: { key: 'nfr', caption: 'Non-functional requirements', size: 19, headers: ['ID', 'Category', 'Requirement'], widths: [0.8, 1.4, 5.6], rows: [
      ['NFR-1', 'Speed of use', 'Scan to sent in under five seconds for a student who already knows the screen; this is the PRD target and has still to be measured.'],
      ['NFR-2', 'Privacy', 'No name, roll number, phone number, e-mail address, location or contacts shall be collected from students; the daily device code shall be stored only as a hash.'],
      ['NFR-3', 'Accessibility', 'Student and staff pages shall aim at WCAG 2.1 level AA, including text labels with every colour and sufficient contrast.'],
      ['NFR-4', 'Compatibility', 'The student page shall work in current mobile browsers without installing an app; staff pages shall work on desktop browsers.'],
      ['NFR-5', 'Security', 'All traffic shall use HTTPS; staff shall be authenticated with signed tokens and authorised by role; the anonymous endpoint shall be rate limited.'],
      ['NFR-6', 'Capacity', 'Assumed peak of one room of up to about 120 desks tapping within a few minutes when a quick check opens; the largest room in the sample data has 120 desks.'],
      ['NFR-7', 'Maintainability', 'Layered architecture with business rules free of framework code so that they can be unit tested in isolation.'],
      ['NFR-8', 'Data retention', 'Raw responses shall be kept only for a period chosen by the institution; the period is an open policy decision.'],
    ] } },
    { h3: 'Assumptions, constraints and out-of-scope items' },
    { p: "The design rests on a small number of assumptions taken from the PRD. The desk QR remains visible and usable; the predefined response set is clear to students; and the schedule that maps classrooms to lecture slots is kept up to date by the department. If the third assumption fails, the pulse is attached to the wrong lecture or blocked, which is why the design includes a visible count of off-schedule scans and a CSV import that makes correcting the timetable cheap." },
    { p: "The main constraints are that students bring their own phones with a camera and a data connection, that the project is carried out by one student within one semester, and that no real classroom is currently available for trials. This last constraint decides how the report is written: it is a design report supported by a prototype, and it makes no claim about how students actually behave. Items outside the scope of the first version are free-text feedback, any form of student identity tracking, cross-campus benchmarking and predictive analytics, as stated in the PRD." },
    { h2: 'Privacy by design and anonymity' },
    { p: "Privacy by design is the principle that privacy protection is built into the architecture of a system from the start instead of being added by policy afterwards. Cavoukian (2009) states it as seven foundational principles, of which three are directly useful here: privacy as the default setting, privacy embedded into the design, and visibility and transparency toward the user. MoodPulse applies them in a simple form. The system has no field in which a student's identity could be stored, the student is told after every tap what is stored, and the faculty views are built so that they cannot show less than five people's worth of data at a time." },
    { h3: 'Data minimisation and pseudonymous device codes' },
    { p: "Data minimisation means collecting only what the purpose requires. The purpose of a pulse is to learn how the room feels at a time, so the only facts needed are the room, the time, the lecture slot, the mood and, optionally, the pace. A tension appears immediately: to limit repeat taps the server must recognise that two taps come from the same phone, and recognising a phone is a form of identification. The design resolves this with a pseudonymous device code. The browser generates a random code and renews it every day. The server never stores the code itself. It stores a keyed hash of the code, computed with a secret that also changes every day, and uses it only to check the ten-minute cooldown. The hash cannot be linked to a name, a roll number or a phone number, and it cannot be linked from one day to the next. Its only power is to say that two taps within the same day and lecture probably came from the same browser." },
    { h3: 'Small-cell suppression' },
    { p: "Even a data set with no names can reveal individuals when the groups are very small. If a bucket contains one tap, and the lecturer knows who sat in the front row, the tap is no longer anonymous in practice. The idea of requiring that every released record be indistinguishable from several others is the core of k-anonymity (Sweeney, 2002). MoodPulse uses a simple form of the same idea called small-cell suppression: any five-minute bucket with fewer than five taps is not displayed, and any cell of the department heatmap that rests on data from fewer than five lectures is left blank. The threshold of five is a design choice that trades detail against protection, and it should be reviewed with the department before the system goes live. Suppression does not remove all risk, since a determined observer can still use context, but it removes the most obvious cases." },
    { h3: 'Threat model' },
    { p: "A privacy claim is only meaningful against a stated attacker. <<tab:threats>> lists the threats considered in this design, what the design does about them and the risk that remains. The honest reading of the table is that anonymity here is a design goal supported by specific controls and not an absolute guarantee, and that the fixed shared QR code is the weakest point of the whole concept." },
    { table: { key: 'threats', caption: 'Threat model and residual risks', size: 18, headers: ['Threat', 'Who or what', 'Mitigation in the design', 'Residual risk'], widths: [1.3, 1.4, 2.8, 2.4], rows: [
      ['T1 Off-room scan', 'Person with a photo of the QR', 'Input only inside lecture slot; cooldown; QR regeneration; blocked scans counted', 'A photo scanned during a lecture cannot be told apart from a genuine scan'],
      ['T2 Repeat taps', 'One device pressing repeatedly', 'Cooldown by hashed device code; rate limit by address', 'Clearing site data or using another browser starts a new code'],
      ['T3 Re-identification', 'Person who knows who attended', 'No free text; buckets under five taps hidden; aggregate views only', 'Context knowledge can still suggest who tapped when the class is small'],
      ['T4 Linking across days', 'Analyst with database access', 'Device code and secret change daily; only a hash is stored', 'Taps within one day by one browser remain linkable, by intent'],
      ['T5 Insider misuse', 'Administrator or database operator', 'No identity stored; access by role; logs contain no personal data', 'Outside information such as camera footage could correlate with taps'],
      ['T6 Ranking of faculty', 'Management or colleagues', 'No leaderboard in any view; slots and rooms are the unit of comparison', 'Social use of the data outside the system cannot be controlled'],
      ['T7 Account attack', 'Attacker targeting staff accounts', 'Password hashing, signed short-lived tokens, lockout, HTTPS', 'Weak passwords chosen by users'],
      ['T8 Flooding', 'Script posting to the anonymous endpoint', 'Rate limiting, small request bodies, validation, front-door filtering', 'A distributed attack needs network-level protection'],
    ] } },
    { h2: 'Designing a mood scale' },
    { p: "The mood scale is the only input the student ever gives, so its design decides the quality of everything downstream. Three questions arise: how many levels, what labels, and what colours." },
    { p: "I chose five levels. Two or three levels are quick, but they merge useful differences: a student who is slightly confused and a student who is completely lost need different responses from the lecturer, and a simple thumbs up or down cannot tell them apart. More than five levels slow the choice and invite arbitrary distinctions that the data cannot support. Five levels with a neutral midpoint are familiar from rating scales and give a natural split into a struggling side (Lost and Confused), a neutral middle (Okay) and a positive side (Following and Engaged). Each level carries a short plain phrase, such as I can't follow this or Some parts are unclear, because a label that is explained in the student's own words is read faster and interpreted more consistently than an unlabelled face." },
    { table: { key: 'mood', caption: 'The five mood levels and the optional pace answer', headers: ['Level', 'Student-facing phrase', 'Side of the scale', 'Colour'], widths: [1.2, 2.4, 2.2, 1.4], rows: [
      ['Lost', "I can't follow this", 'Struggling', '#C2410C'],
      ['Confused', 'Some parts are unclear', 'Struggling', '#F08C2E'],
      ['Okay', 'Getting by', 'Neutral', '#B9B5C4'],
      ['Following', 'I understand it', 'With the lesson', '#5E8FEA'],
      ['Engaged', 'Really interested', 'With the lesson', '#1F4FBF'],
      ['Pace (optional)', 'Too fast, Just right, Too slow', 'Separate question', 'None'],
    ] } },
    { p: "Pace is kept separate from mood on purpose. A student can be confused because the lecturer is going too fast, or confused because the explanation is unclear, and the two problems need different remedies. Making pace a second, optional question preserves this distinction without forcing every student to answer it. <<tab:mood>> summarises the levels and <<fig:mood>> shows the scale as it is used throughout the prototype." },
    { fig: { key: 'mood', file: 'd-moodscale.png', caption: 'The five-level mood scale with its diverging colour ramp and the derived shares', widthCm: 14 } },
    { p: "For colour I used a diverging scheme. Brewer (2005) distinguishes sequential, diverging and qualitative schemes, and recommends diverging schemes when the data has a meaningful midpoint with two directions that matter. A mood scale is such data: orange for struggle on one side, blue for being with the lesson on the other, and a neutral grey in the middle. The palette was chosen and checked for colour-blind separation using a palette-validation script, and ColorBrewer, Brewer's colour tool, similarly marks which of its schemes remain distinguishable for common types of colour-vision deficiency. A noticeable minority of users, more often men, have a red-green colour-vision deficiency, and a scale that depended on a red to green contrast would fail for them." },
    { p: "Colour is never the only carrier of meaning. Success criterion 1.4.1 of the Web Content Accessibility Guidelines 2.1 (World Wide Web Consortium, 2018) requires that colour is not the only visual means of conveying information, and criterion 1.4.3 requires a contrast ratio of at least 4.5 to 1 for normal text. In the prototype every mood is therefore shown as a coloured tile, a drawn face and a written label together, every chart carries a text legend with percentages, and text on coloured grounds is black. The faces are custom drawings and not operating-system emoji, so that they look identical on every phone, which is also a small privacy gain because rendering differences cannot be used to tell devices apart." },
    { h2: 'ASP.NET Core Web API' },
    { p: "ASP.NET Core is Microsoft's open-source, cross-platform framework for building web applications and HTTP services on the .NET platform. A Web API project exposes controllers or minimal endpoints that receive HTTP requests, bind the request data to typed C# objects, run application code and return JSON. The request passes through a pipeline of middleware components, each of which can inspect or change the request and response. Authentication, authorisation, rate limiting, exception handling, logging and routing are all middleware, and the order in which they are registered is part of the design. Dependency injection is built into the framework, so controllers receive the services they need through constructors, which makes it natural to write code against interfaces and to replace real services with test doubles in tests (Microsoft, ASP.NET Core documentation)." },
    { p: "Three features of the framework matter most to this project. First, the built-in rate-limiting middleware allows policies such as fixed window or token bucket limits to be attached to individual endpoints, which suits the anonymous pulse endpoint that must be protected without requiring a login. Second, SignalR, the real-time library of ASP.NET Core, lets the server push events to connected browsers over WebSockets and falls back to other transports when WebSockets are unavailable (Microsoft, Introduction to ASP.NET Core SignalR). This is how the live lecture view of a faculty member can update without refreshing. If SignalR proves unnecessary, short polling every few seconds is an acceptable fallback, because the live view needs freshness of seconds and not milliseconds. Third, policy-based authorisation lets endpoints demand a role such as Faculty or Management declaratively." },
    { p: "I chose ASP.NET Core over the alternatives for practical reasons. Node.js with Express would also serve JSON quickly,, but I am stronger in C#, and static typing across the domain model, the data-access layer and the API contracts catches a whole class of mistakes before running. The deciding factors were my own skills, the first-class integration with Entity Framework Core and SQL Server, and the straightforward hosting path on Azure. The framework releases a new version every year and designates some as long-term-support releases, so the proposed build would target the current long-term-support release." },
    { p: "The code of the API is organised in a Clean Architecture style, in which the business rules sit at the centre and do not depend on web or database code (Martin, 2017). The rules that matter in this project, namely resolving a timestamp to a lecture slot, enforcing the cooldown and computing bucket shares, are pure logic and therefore easy to test without a database. The layers are described in Section 3.2.2." },
    { h2: 'SQL Server and Entity Framework Core' },
    { p: "SQL Server is Microsoft's relational database system. A relational database stores data in tables of rows and columns, enforces integrity with primary keys, foreign keys, unique constraints and check constraints, and answers questions with SQL. For MoodPulse the data is naturally relational: classrooms have QR versions and timetable slots, slots have lecture sessions, and sessions have responses and markers. The central analytical question, how many taps of each mood fell into each five-minute bucket of one lecture, is a grouped aggregate, which a relational engine performs well when the responses are indexed by session and time. In deployment the database would be Azure SQL Database, the managed service of the same engine, which provides backups and patching without administration effort." },
    { p: "Entity Framework Core (EF Core) is the object-relational mapper that connects C# classes to tables. A class derived from the context type represents a session with the database, each table is exposed as a set of entities, and queries are written in LINQ and translated to SQL. Changes are tracked and written with a single save operation, and migrations record schema changes as versioned code so that the database structure can be reproduced on any machine (Microsoft, Entity Framework Core documentation). I plan to use EF Core for ordinary reads and writes and to allow hand-written SQL, or a carefully tuned query, for the bucket aggregation if the generated SQL proves inefficient." },
    { p: "The alternatives were considered briefly. A document database such as MongoDB is flexible but offers weaker constraints, and the relationships here are firm. PostgreSQL would be an equally valid relational choice, but SQL Server pairs naturally with the .NET tools and with Azure. One design detail follows from the choice of database: timestamps are stored with offset information, so that comparison against the institution's local timetable is explicit and no daylight-saving or server-time-zone assumption is hidden in the data." },
    { h2: 'Angular and progressive web apps' },
    { p: "Angular is a TypeScript framework for building single-page applications. An application is built from components, each combining a template, styles and behaviour, and from services that hold shared logic and are provided to components by dependency injection. The router maps URLs to components and supports guards that can block navigation, for example sending a visitor who is not signed in to the login page or hiding management pages from faculty. Forms, an HTTP client and reactive programming support through RxJS are part of the framework (Angular Team, Angular documentation). Because the framework is opinionated, a project with three kinds of users and many screens stays consistent in structure, which matters for a one-person project that must still be maintainable." },
    { p: "A progressive web app (PWA) is a web application that uses a web app manifest and a service worker to behave more like an installed application: it can load its shell quickly, keep working with a poor connection, and be added to the home screen. Angular provides a service-worker package that generates the necessary configuration. For the student side the PWA idea is used lightly. The student opens the page from a QR scan in an ordinary browser tab, and the service worker's most valuable contribution is that the small application shell loads instantly on a second visit, which supports the under-five-seconds goal. The pulse itself still needs a connection, and the page says so plainly if the phone is offline, because a tap that is queued and sent minutes later would be attached to the wrong moment." },
    { p: "React with a component library and Vue are comparable alternatives, and both would produce the same screens. I chose Angular because it matches my existing skills, because its built-in structure suits several role-specific areas inside one codebase, and because a typed template and service model makes it easier to keep client code aligned with the API contract in Section 3.2.1." },
    { h2: 'QR codes and abuse resistance' },
    { h3: 'What a QR code is' },
    { p: "A QR code is a two-dimensional matrix barcode standardised in ISO/IEC 18004 (International Organization for Standardization, 2024). It encodes data, in this project a short URL, in a pattern of dark and light modules, with three position-detection squares that let a camera find and orient the symbol. The standard defines symbol versions of increasing size and four levels of error correction, which allow a damaged or partly obscured symbol to be read: the levels recover roughly seven, fifteen, twenty-five and thirty percent of the symbol respectively. A laminated desk card that is scuffed during a semester therefore remains readable, particularly if a higher level is chosen and the URL is short. The standard describes the symbol and its decoding. It says nothing about who is allowed to scan, so any protection against misuse must come from the system behind the URL." },
    { h3: 'Fixed per-room code versus per-session code' },
    { p: "A fixed code per room is simple and cheap: it is printed once, placed on every desk, and used for the whole semester. Its weakness is that anyone who photographs it can submit a tap from anywhere. The opposite design is a code that changes for every lecture, shown on a projector or printed fresh, which ties a scan to the presence of the person who sees the screen. That design resists off-room scanning much better but costs effort every lecture, depends on a working projector, and fails quietly when the lecturer forgets. The PRD asks for one fixed code per classroom, and I have kept to it because adoption friction is the principal risk of the whole idea. The trade-off is therefore accepted knowingly and compensated with several smaller controls." },
    { p: "Those controls form layers rather than a single defence. The server accepts input only inside a scheduled lecture window, so a photographed code is useless at midnight. A random token in the URL stops anyone from guessing the code of another room. A per-device cooldown and an address-based rate limit slow down repeated taps. Management can regenerate the code of a room, which invalidates every printed card of the old version at once, as a response to a leak, and the system counts scans that arrive outside any slot so that a leak shows up as a spike in blocked scans." },
    { h2: 'Data visualisation principles' },
    { p: "The faculty and management screens are, in the end, charts, and a misleading chart is worse than none. Tufte (1983) argues that a graphic should show the data with as little decoration as possible and should not distort its magnitudes. Four principles guided the design. First, use the chart type that matches the question. A stacked bar of five mood shares per five-minute bucket answers how the composition of the room changed over the lecture, and it keeps the counts visible through the bar height. A heatmap answers where in a grid of days and slots something is high or low, which is the question of the department view. Small multiples, a repeated small chart per lecture or per week, let the eye compare many sessions without a legend lookup." },
    { p: "Second, show trends, not single points. The PRD lists misinterpretation of single data points as a risk, and the course trend screen therefore plots eight lectures side by side and a heatmap of struggle by minute across them, so that a recurring pattern stands apart from a one-off bad day. Third, label directly and do not rely on colour alone: every chart has numerical labels or a text legend, and every colour used for a mood is paired with its word. Fourth, be honest about missing data. A bucket that is hidden because it has too few taps is drawn as absent, and a heatmap cell without enough lectures shows a dash and not a pale colour that could be read as a low value. Bars start at zero, and percentages are shown beside the number of taps behind them." },
    { h2: 'REST API design and security' },
    { p: "Representational State Transfer, introduced by Fielding (2000), is an architectural style for networked systems in which resources are identified by URLs and manipulated through a small, uniform set of operations. In practice a REST API over HTTP uses nouns in routes, such as classrooms or lectures, and the verbs GET, POST, PUT and DELETE for reading, creating, replacing and deleting, with status codes such as 200, 201, 400, 401, 403, 404, 409 and 429 for outcomes. Requests are stateless, which means that every request carries what the server needs, and this makes the service easy to scale horizontally." },
    { p: "Staff endpoints are protected with JSON Web Tokens. A JSON Web Token is a compact, signed set of claims (Jones, Bradley and Sakimura, 2015). After a successful sign-in the server issues a short-lived token containing the staff identifier and role; the client sends it in the Authorization header; and the server validates the signature and expiry before every request and then applies role-based authorisation, so that a Faculty token can read only the lectures of its owner while a Management token can manage classrooms. Object-level checks are essential in addition to role checks: a lecturer must not be able to read another lecturer's lecture merely by changing an identifier in the URL." },
    { p: "The Open Worldwide Application Security Project publishes the OWASP API Security Top 10, a list of the most serious API risks. Several apply directly. Broken object-level authorisation is the risk just described. Broken authentication concerns the sign-in of staff. Unrestricted resource consumption and unrestricted access to sensitive business flows describe an anonymous endpoint that can be flooded or abused by scripts (OWASP Foundation, 2023), which is the situation of the pulse endpoint. The design answers with rate limits, small validated request bodies that accept only enumerated values, the lecture-window check and the cooldown, and with HTTPS everywhere." },
    { h2: 'Software development life cycle models' },
    { p: "A software development life cycle model organises the activities of building software: requirements, design, implementation, testing and release. The waterfall model arranges them in a strict sequence in which each stage is completed before the next begins. Royce (1970) described this sequence while also warning that it is risky for large systems, because problems that surface late in testing force expensive rework. Iterative and incremental models build the system in passes, each delivering a working part so that feedback shapes the next. Agile methods, which Sommerville (2016) discusses at length, push the same idea to short cycles and close contact with users. <<tab:sdlc>> compares them for this project." },
    { table: { key: 'sdlc', caption: 'Life cycle models compared for this project', size: 19, headers: ['Model', 'Strength', 'Weakness for this project', 'Fit'], widths: [1.3, 2.4, 2.9, 1.0], rows: [
      ['Waterfall', 'Clear stages and documents', 'Late discovery of usability and privacy problems; the real classroom is unavailable until the end', 'Low'],
      ['Iterative and incremental', 'Working slice early; each pass reviewed', 'Needs discipline to keep scope within the MVP list', 'High'],
      ['Agile (Scrum style)', 'Fast adaptation with real users', 'Assumes a team and regular user access, which a single-student project lacks', 'Partial'],
    ] } },
    { p: "I chose an iterative and incremental approach with a thin vertical slice built first, as set out in the project plan. The order is: first, management creates a classroom and a QR code is generated; second, a student scans, taps and the response is stored with the classroom and time; third, the timestamp is mapped to a lecture slot; fourth, the faculty timeline view is added; and fifth, the management trends view is built and the interface is polished. <<fig:iter>> shows the sequence. The student experience and the slot mapping are the riskiest parts of the idea, since they decide whether anyone uses the system and whether the data means anything, so they are proven first and the dashboards, which depend on them, come last." },
    { fig: { key: 'iter', file: 'd-iterative.png', caption: 'Proposed build order as a sequence of thin vertical increments', widthCm: 10.5 } },
    { h1: 'Practical Implementation' },
    { p: "This chapter turns the theory of Chapter 2 into a concrete design. Section 3.1 gives an overview of the application, its users, workflow, architecture and modules. Section 3.2 describes the planned server side, covering the API, the layers, the database and the core rules. Section 3.3 presents the client application through the fourteen screens of the high-fidelity prototype, and Section 3.4 sets out the plan for verifying the system. The chapter is titled Practical Implementation to follow the structure of the standard report, but its honest content is a design and a prototype: the server and the clients described here have not been built. Code in this chapter is illustrative design-level code, written to show the shape of the solution, and it has not been compiled or run." },
    { h2: 'Application overview' },
    { h3: 'Roles and end-to-end workflow' },
    { p: "The system serves students, faculty and management, as in <<fig:usecase>>. The workflow starts with management. A coordinator creates a classroom profile in the management area, and the system generates a unique QR code for it. The code is printed on A6 desk cards and placed on the desks of that room, and the coordinator maps the weekly timetable of the room, listing for each slot the course, the section and the faculty member. From then on the system is passive until a lecture starts." },
    { fig: { key: 'usecase', file: 'd-usecase.png', caption: 'Use-case diagram of MoodPulse Classroom', widthCm: 13.5 } },
    { p: "During a lecture, students scan the desk code at any moment, or when the lecturer opens a timed quick check. The page that opens already knows the room, the course and the slot, so the student's only job is to tap a mood. The server stores the tap with the room, the time and the slot. Faculty watch the live distribution on their Today screen, add topic markers as they move between topics, and afterwards open the lecture timeline to see where the room's mood moved. Over the weeks, the course trend shows whether a pattern repeats, and the management heatmap shows which weekday and time slot are weak across the department. Each lecture thus ends with an anonymous sentiment pattern, which is the end state described in the PRD." },
    { h3: 'Architecture' },
    { p: "The proposed architecture is shown in <<fig:arch>>. Three Angular applications, one for each group of users, talk to a single ASP.NET Core Web API over HTTPS. Ordinary requests use REST with JSON, and the live lecture view uses a SignalR connection. The API is divided into API, application, domain and infrastructure layers, with cross-cutting concerns such as validation and logging that must not record personal data. The infrastructure layer is the only part that knows about SQL Server and about the library that draws QR images. The student's phone reaches the system only through the QR code on the desk card." },
    { fig: { key: 'arch', file: 'd-architecture.png', caption: 'System architecture of the proposed solution', widthCm: 14.5 } },
    { h3: 'Technology stack and modules' },
    { p: "<<tab:stack>> lists the technologies chosen and the reason for each. The choices follow my own skills and the Microsoft ecosystem, and the alternatives that were rejected are discussed in Chapter 2. Version numbers are intentionally omitted, since the proposed build would use the current long-term-support releases at the time of building." },
    { table: { key: 'stack', caption: 'Technology stack', size: 20, headers: ['Concern', 'Technology', 'Reason'], widths: [1.5, 2.6, 3.9], rows: [
      ['Server framework', 'ASP.NET Core Web API (C#)', 'Typed, layered, built-in dependency injection, rate limiting and authorisation'],
      ['Data access', 'Entity Framework Core', 'Typed queries, migrations, constraints mapped from the model'],
      ['Database', 'SQL Server, Azure SQL Database in deployment', 'Relational integrity, strong aggregation, managed backups'],
      ['Live updates', 'SignalR, or short polling as fallback', 'Pushes new buckets to the faculty view within seconds'],
      ['Client', 'Angular progressive web app', 'One codebase for three role areas; routing guards; service worker'],
      ['Authentication', 'JSON Web Tokens with role claims', 'Stateless, standard, supported by the framework'],
      ['QR codes', 'ISO/IEC 18004 symbols generated on the server', 'Per-room URL with random token; downloadable as PNG'],
      ['Hosting', 'Azure App Service, Static Web Apps, Key Vault', 'Managed hosting and secrets, described in Section 3.2.5'],
    ] } },
    { p: "The functionality is divided into six modules, listed in <<tab:modules>> with the screens and requirements that belong to each. The division follows the user groups and, within management, the two data domains of rooms and timetable." },
    { table: { key: 'modules', caption: 'Modules of the system', size: 20, headers: ['Module', 'Responsibility', 'Screens', 'Requirements'], widths: [1.7, 3.3, 1.2, 1.5], rows: [
      ['Pulse capture', 'Resolve room and slot, validate, apply cooldown, store response', 'M1 to M5', 'FR-5 to FR-10'],
      ['Room and QR management', 'Classrooms, QR versions, desk cards, blocked scans', 'A2, A4', 'FR-1 to FR-3, FR-17'],
      ['Timetable', 'Slot mapping and CSV import', 'A3', 'FR-4, FR-7, FR-8'],
      ['Identity', 'Sign-in, roles, tokens', 'F1', 'FR-11'],
      ['Lecture analytics', 'Today view, timeline, markers, quick checks, notes, export', 'F2, F3', 'FR-12 to FR-14, FR-18, FR-19'],
      ['Trends', 'Course trend and department heatmap', 'F4, A1', 'FR-15, FR-16'],
    ] } },
    { h3: 'Submitting a pulse' },
    { p: "The sequence of a single tap is the heart of the system and is shown in <<fig:seq>>. The student phone first asks the API for the context of the room, identified by the token in the scanned URL. The API finds the room, asks the timetable service which slot is running or about to start, and returns the room, the course and the slot, or a no-lecture answer. When the student presses send, the phone posts the mood, the optional pace and the daily device code. The API checks again that a slot is open, since time has passed, checks the cooldown against the stored hashes, inserts the response, publishes an update to the SignalR hub and answers with the time when the next tap will be allowed. Two failure paths are shown at the foot of the figure: no active slot and cooldown. Both end without storing anything." },
    { fig: { key: 'seq', file: 'd-sequence.png', caption: 'Sequence of a student pulse from scan to live update', widthCm: 14, maxHeightCm: 15.5 } },
    { h3: 'What is stored and what is never stored' },
    { p: "<<fig:dfd>> is a data-flow diagram of the system at the first level. The student supplies a QR token and receives room, course and slot from process 1.0. The student then supplies mood, pace and code to process 2.0, which writes a valid pulse to the response store. Process 3.0 reads the stored responses, aggregates them into buckets and shares, suppresses small buckets and returns the result to faculty. Process 4.0 lets management maintain rooms, QR versions and the timetable. The dashed box lists the data that never enters any store: the student's name, roll number, phone number, e-mail address, location, contacts, network address and advertising identifier. The network address is seen transiently by the rate limiter in memory, but it is not written to the database or to the logs." },
    { fig: { key: 'dfd', file: 'd-dfd.png', caption: 'Level-1 data-flow diagram showing what is stored and what is never stored', widthCm: 15, maxHeightCm: 15 } },
    { h2: 'Server-side design' },
    { p: "The server side is described in two parts. Section 3.2.1 plans the API, listing the endpoints, the data exchanged and the error model, and the later sections describe the internal design that fulfils that contract. Nothing in this section has been implemented, and the listings are illustrative design-level code." },
    { h3: 'API planning' },
    { p: "The API is grouped by the module that owns it. Routes use nouns, JSON bodies use camel case, and every endpoint that is not for students requires a signed token with the role shown in the tables. The two student endpoints are anonymous, and they are the only endpoints reachable without a token apart from sign-in. <<tab:apistudent>> lists the student and identity endpoints." },
    { table: { key: 'apistudent', caption: 'Endpoints for students and sign-in', size: 19, headers: ['Method', 'Route', 'Role', 'Purpose'], widths: [0.9, 3.0, 1.3, 3.0], rows: [
      ['GET', '/api/rooms/{token}/context', 'Anonymous', 'Return room, course, slot and whether input is open, or the next lecture'],
      ['POST', '/api/rooms/{token}/pulses', 'Anonymous', 'Submit mood, optional pace and device code; returns next allowed time'],
      ['POST', '/api/auth/login', 'Anonymous', 'Exchange college e-mail and password for a signed token'],
      ['GET', '/api/auth/me', 'Any staff', 'Return the signed-in user and role for routing'],
    ] } },
    { p: "Faculty endpoints, in <<tab:apifaculty>>, are scoped to the signed-in lecturer: the server checks that the lecture belongs to the lecturer before returning anything, which is the object-level check discussed in Section 2.10. The live view uses a SignalR hub at /hubs/lecture; a client joins a lecture group after the same ownership check and receives an update whenever a new accepted response changes the current bucket." },
    { table: { key: 'apifaculty', caption: 'Endpoints for faculty', size: 19, headers: ['Method', 'Route', 'Role', 'Purpose'], widths: [0.9, 3.2, 1.0, 3.1], rows: [
      ['GET', '/api/faculty/today', 'Faculty', "List today's lectures with status and live distribution"],
      ['GET', '/api/lectures/{id}/pulse', 'Faculty', 'Return buckets, shares, tiles and markers; small buckets omitted'],
      ['POST', '/api/lectures/{id}/markers', 'Faculty', 'Add a topic marker at the current time'],
      ['POST', '/api/lectures/{id}/quick-checks', 'Faculty', 'Open a timed quick-check window'],
      ['GET, PUT', '/api/lectures/{id}/note', 'Faculty', 'Read or save the private reflection of the author'],
      ['GET', '/api/lectures/{id}/export', 'Faculty', 'Download the lecture view as PDF or CSV'],
      ['GET', '/api/courses/{id}/trend', 'Faculty', 'Return per-lecture shares, participation and struggle heatmap'],
    ] } },
    { p: "Management endpoints are in <<tab:apimgmt>>. They require the Coordinator or Head of the Department role. The regeneration of a QR code is a separate POST so that it cannot happen by accident through an ordinary update, and the user interface adds a confirmation step." },
    { table: { key: 'apimgmt', caption: 'Endpoints for management', size: 19, headers: ['Method', 'Route', 'Role', 'Purpose'], widths: [0.9, 3.4, 1.2, 2.7], rows: [
      ['GET', '/api/admin/overview?week=', 'Management', 'Slot heatmap, tiles and flagged slots for a week'],
      ['GET, POST', '/api/admin/classrooms', 'Management', 'List or create classrooms'],
      ['PUT', '/api/admin/classrooms/{id}', 'Management', 'Edit room details or switch pulse off'],
      ['POST', '/api/admin/classrooms/{id}/qr', 'Management', 'Regenerate the QR code; old version revoked'],
      ['GET', '/api/admin/classrooms/{id}/qr.png', 'Management', 'Download the current QR code image'],
      ['GET, PUT', '/api/admin/classrooms/{id}/timetable', 'Management', 'Read or save the slots of one room'],
      ['POST', '/api/admin/classrooms/{id}/timetable/import', 'Management', 'Import slots from a CSV file with a row-level error report'],
      ['GET', '/api/admin/blocked-scans', 'Management', 'Counts of off-schedule scans by room and slot'],
    ] } },
    { p: "Three illustrative message bodies show the contract for the student journey. <<lst:ctx>> is the answer to the context request when a lecture is open, <<lst:post>> is the pulse submission and its success answer, and <<lst:err>> is the cooldown error. The sample values in the listings are the same fictional data as in the prototype screens." },
    { code: { key: 'ctx', caption: 'Illustrative design-level response to GET /api/rooms/{token}/context', text: String.raw`{
  "room": "C-204",
  "state": "open",
  "course": "Data Mining",
  "slot": { "start": "10:00", "end": "10:55" },
  "moods": ["lost", "confused", "okay", "following", "engaged"],
  "paces": ["tooFast", "justRight", "tooSlow"]
}` } },
    { code: { key: 'post', caption: 'Illustrative design-level request and success response for a pulse', text: String.raw`POST /api/rooms/{token}/pulses
{ "mood": "confused", "pace": "tooFast", "deviceCode": "k3Fq...random" }

201 Created
{ "recordedAt": "2026-11-04T10:24:07+05:30",
  "nextTapAt":   "2026-11-04T10:34:07+05:30" }` } },
    { code: { key: 'err', caption: 'Illustrative design-level error body for a tap inside the cooldown', text: String.raw`429 Too Many Requests
{ "type": "COOLDOWN",
  "title": "You have already tapped",
  "status": 429,
  "nextTapAt": "2026-11-04T10:34:07+05:30" }` } },
    { p: "Errors use the problem-details style of ASP.NET Core, with a stable machine-readable type so that the client can choose its screen. <<tab:errors>> lists the error model. Two entries correspond to prototype screens: the cooldown error leads to the already-tapped screen, and the no-lecture error leads to the no-class screen. A revoked QR code answers with a gone status so that the student sees a clear message to ask for the current card, which is more helpful than a generic not-found page." },
    { table: { key: 'errors', caption: 'Error model of the API', size: 19, headers: ['Type', 'HTTP', 'When', 'Client behaviour'], widths: [1.7, 0.7, 2.7, 2.9], rows: [
      ['NO_ACTIVE_LECTURE', '409', 'No slot is open for the room now', 'Show the no-lecture screen with the next lecture'],
      ['COOLDOWN', '429', 'Same device hash tapped within ten minutes in this lecture', 'Show the already-tapped screen with the next time'],
      ['QR_REVOKED', '410', 'Token belongs to an older QR version', 'Ask the student to scan the current card'],
      ['QR_UNKNOWN', '404', 'Token matches no room', 'Show a neutral not-found page'],
      ['VALIDATION', '400', 'Mood or pace not in the allowed set, body too large', 'Show a generic retry message'],
      ['RATE_LIMITED', '429', 'Too many requests from one network address', 'Ask the student to wait a moment'],
      ['UNAUTHENTICATED', '401', 'Missing or expired staff token', 'Redirect to sign-in'],
      ['FORBIDDEN', '403', 'Role or object ownership check failed', 'Show an access message'],
    ] } },
    { h3: 'Server design' },
    { p: "The solution is divided into four projects with a one-way dependency rule, shown in <<fig:layers>>. The domain project holds the entities, the mood and pace enumerations and the pure rules such as the cooldown policy and the slot resolver; it references no framework. The application project holds the use cases, such as recording a pulse, getting a lecture pulse, importing a timetable and regenerating a QR code, and the interfaces they need, such as a clock, a repository or a hashing service. The infrastructure project implements those interfaces with EF Core, a QR image writer and a CSV reader. The API project hosts the controllers, the SignalR hub and the middleware, and wires everything together through dependency injection. Because the rules do not depend on the web or the database, they can be unit tested with simple in-memory stand-ins." },
    { fig: { key: 'layers', file: 'd-layers.png', caption: 'Proposed solution structure with the direction of dependencies', widthCm: 13.5 } },
    { p: "The domain model has a small number of entities, shown in <<lst:entities>>. A Classroom owns its QR versions and timetable slots. A TimetableSlot ties a room, a weekday and a time range to a course and a faculty member. A LectureSession is one occurrence of a slot on a date, and a PulseResponse belongs to a session. The listing is a design skeleton and omits constructors, validation and navigation details." },
    { code: { key: 'entities', caption: 'Illustrative design-level domain entities and enumerations', text: String.raw`public enum Mood { Lost = 1, Confused, Okay, Following, Engaged }
public enum Pace { TooFast = 1, JustRight, TooSlow }

public class Classroom {
    public int ClassroomId { get; set; }
    public string Code { get; set; }          // e.g. "C-204"
    public int DeskCount { get; set; }
    public bool PulseEnabled { get; set; }
    public List<QrCode> QrCodes { get; } = new();
}

public class QrCode {
    public int QrCodeId { get; set; }
    public int ClassroomId { get; set; }
    public int Version { get; set; }
    public string Token { get; set; }         // 128-bit random, base64url
    public DateTimeOffset IssuedAt { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }
}

public class PulseResponse {
    public long ResponseId { get; set; }
    public int SessionId { get; set; }
    public int? QuickCheckId { get; set; }
    public Mood Mood { get; set; }
    public Pace? Pace { get; set; }
    public DateTimeOffset SubmittedAt { get; set; }
    public byte[] DeviceHash { get; set; }    // keyed hash, never the code
}` } },
    { p: "The application layer exposes its behaviour through interfaces so that the API project depends on abstractions, as in <<lst:iface>>. The slot resolver and the cooldown policy are separate because they change for different reasons: the timetable rules may gain special cases such as exam days, and the cooldown length is a policy that the department may wish to tune." },
    { code: { key: 'iface', caption: 'Illustrative design-level service interfaces', text: String.raw`public interface ISlotResolver {
    // Returns the running slot, or the slot opening within 5 minutes,
    // or null when input must be closed.
    Task<ResolvedSlot?> ResolveAsync(int classroomId, DateTimeOffset now);
}

public interface ICooldownPolicy {
    TimeSpan Window { get; }                  // 10 minutes by default
    bool IsBlocked(DateTimeOffset? lastTap, DateTimeOffset now);
}

public interface IPulseService {
    Task<PulseReceipt> RecordAsync(string qrToken, PulseInput input,
                                   DateTimeOffset now);
    Task<LecturePulse> GetLecturePulseAsync(int sessionId, int staffId);
}` } },
    { h3: 'Database design' },
    { p: "The relational design in <<fig:er>> has eleven tables. Classrooms and their QR versions are separate, so that regenerating a code adds a new row and revokes the previous one without losing history. A timetable slot is a recurring weekly rule, whereas a lecture session is a concrete occurrence on a date, created when the first valid pulse arrives or when a faculty member first opens it. Responses, topic markers, quick-check windows and private notes all hang off the lecture session. BlockedScans stores only the room, the time and a reason, which is enough to show the count of off-schedule scans to management and carries no device information." },
    { fig: { key: 'er', file: 'd-er.png', caption: 'Entity-relationship diagram of the proposed database', widthCm: 13.5, maxHeightCm: 16 } },
    { p: "The definitions of the principal tables follow in <<tab:dbresp>>, <<tab:dbqr>> and <<tab:dbslot>>. The remaining tables are small and are shown with their key columns in the diagram: Classrooms holds the unique room code, block, floor, desk count and a switch that turns the pulse off for rooms such as laboratories. Types are those of SQL Server, and <<lst:ddl>> gives the SQL of the response table. Foreign keys are enforced, enumerations are stored as small integers with check constraints, and every timestamp uses datetimeoffset. The table of responses is the largest and receives almost all of the traffic, so it has a composite index on session and submission time that supports bucket aggregation and the cooldown lookup." },
    { table: { key: 'dbresp', caption: 'Table PulseResponses', size: 19, headers: ['Column', 'Type', 'Key or constraint', 'Notes'], widths: [1.6, 1.6, 2.2, 3.0], rows: [
      ['ResponseId', 'bigint identity', 'Primary key', 'Surrogate key'],
      ['SessionId', 'int', 'Foreign key to LectureSessions, not null', 'Lecture slot occurrence'],
      ['QuickCheckId', 'int null', 'Foreign key to QuickCheckWindows', 'Set when the tap came in a quick check'],
      ['Mood', 'tinyint', 'Check between 1 and 5, not null', 'Lost to Engaged'],
      ['Pace', 'tinyint null', 'Check between 1 and 3', 'Optional'],
      ['SubmittedAt', 'datetimeoffset', 'Not null', 'Server time, never client time'],
      ['DeviceHash', 'binary(32)', 'Not null; index with SessionId', 'Keyed hash of daily device code'],
    ] } },
    { table: { key: 'dbqr', caption: 'Table QrCodes', size: 19, headers: ['Column', 'Type', 'Key or constraint', 'Notes'], widths: [1.6, 1.6, 2.2, 3.0], rows: [
      ['QrCodeId', 'int identity', 'Primary key', ''],
      ['ClassroomId', 'int', 'Foreign key to Classrooms, not null', 'Owning room'],
      ['Version', 'int', 'Unique with ClassroomId', 'Counts up with each regeneration'],
      ['Token', 'char(22)', 'Unique, not null', 'Random base64url token in the printed URL'],
      ['IssuedAt', 'datetimeoffset', 'Not null', 'Shown on the management screen'],
      ['RevokedAt', 'datetimeoffset null', '', 'Null for the current version'],
    ] } },
    { table: { key: 'dbslot', caption: 'Table TimetableSlots', size: 19, headers: ['Column', 'Type', 'Key or constraint', 'Notes'], widths: [1.6, 1.6, 2.2, 3.0], rows: [
      ['SlotId', 'int identity', 'Primary key', ''],
      ['ClassroomId', 'int', 'Foreign key, not null', 'Room where the lecture is held'],
      ['CourseId', 'int', 'Foreign key, not null', 'Course and section'],
      ['StaffId', 'int', 'Foreign key, not null', 'Faculty member'],
      ['DayOfWeek', 'tinyint', 'Check between 1 and 7', 'Weekly recurrence'],
      ['StartTime, EndTime', 'time', 'Check that EndTime is after StartTime', 'Local institution time'],
      ['EffectiveFrom, EffectiveTo', 'date', 'Nullable end', 'Allows a new term without losing history'],
    ] } },
    { code: { key: 'ddl', caption: 'Illustrative design-level SQL for the response table and its index', text: String.raw`CREATE TABLE dbo.PulseResponses (
    ResponseId   bigint IDENTITY(1,1) PRIMARY KEY,
    SessionId    int            NOT NULL
        REFERENCES dbo.LectureSessions(SessionId),
    QuickCheckId int            NULL
        REFERENCES dbo.QuickCheckWindows(QuickCheckId),
    Mood         tinyint        NOT NULL CHECK (Mood BETWEEN 1 AND 5),
    Pace         tinyint        NULL     CHECK (Pace BETWEEN 1 AND 3),
    SubmittedAt  datetimeoffset NOT NULL,
    DeviceHash   binary(32)     NOT NULL
);

CREATE INDEX IX_PulseResponses_Session_Time
    ON dbo.PulseResponses (SessionId, SubmittedAt)
    INCLUDE (Mood, Pace, DeviceHash);` } },
    { p: "<<lst:ddl>> shows the design of the response table in SQL. In the build, the same structure would be produced by EF Core migrations generated from the entity configuration, and the SQL would be reviewed before being applied. The included columns make the common aggregation query answerable from the index alone." },
    { h3: 'Core server logic' },
    { p: "Four pieces of logic carry the product's meaning, and each is small enough to be specified exactly. The first is the mapping of a timestamp to a lecture slot. The server converts the instant to the institution's local time, takes the weekday and looks for a slot of that room whose range contains the time. Input is also allowed during the five minutes before a slot starts. If the instant lies inside a running slot, that slot wins even when another slot begins in five minutes, so that the end of one lecture is never mixed with the start of the next. If no slot qualifies, the answer is the no-lecture state with the next slot, and the attempt is counted as a blocked scan." },
    { p: "The second is the device code and cooldown. The browser keeps a random code for the current day. On receipt, the server computes a keyed hash of the code with a secret that is derived for that date, and stores only the hash. A tap is rejected if a response with the same hash and the same lecture session exists within the last ten minutes. <<lst:record>> gives the logic as pseudo-code. Because the code lives in the browser, clearing site data or switching browsers produces a new code, so the cooldown reduces repeat taps but cannot eliminate them. This limit is accepted and is repeated in the Conclusion." },
    { code: { key: 'record', caption: 'Illustrative design-level pseudo-code for recording a pulse', text: String.raw`function RecordPulse(token, input, now):
    qr = FindQr(token)
    if qr is null:             raise QR_UNKNOWN
    if qr.RevokedAt is set:    raise QR_REVOKED
    if not input.mood in 1..5: raise VALIDATION
    if input.pace given and not in 1..3: raise VALIDATION

    slot = SlotResolver.Resolve(qr.ClassroomId, now)
    if slot is null:
        CountBlockedScan(qr.ClassroomId, now)
        raise NO_ACTIVE_LECTURE(next = NextSlot(qr.ClassroomId, now))

    session = GetOrCreateSession(slot, date(now))
    hash = HMAC(DailySecret(date(now)), input.deviceCode)
    last = LastTapTime(session, hash)
    if Cooldown.IsBlocked(last, now):
        raise COOLDOWN(next = last + Cooldown.Window)

    Insert(PulseResponse(session, input.mood, input.pace, now, hash))
    Hub.Publish(session, CurrentBucket(session))
    return Receipt(recordedAt = now, nextTapAt = now + Cooldown.Window)` } },
    { p: "The third piece is aggregation into five-minute buckets with small-cell suppression, drawn in <<fig:buckets>> and given as pseudo-code in <<lst:buckets>>. Responses of a session are grouped by the number of whole five-minute intervals from the slot start, and by mood. A bucket whose total is below five is returned as hidden, without counts, so that nothing about it reaches the browser. The rule is applied on the server and not in the client, because a client-side rule would still send the hidden numbers over the network. The example in the figure uses made-up numbers purely to explain the rule." },
    { fig: { key: 'buckets', file: 'd-buckets.png', caption: 'Bucket aggregation with small-cell suppression and an explanatory example', widthCm: 13.5 } },
    { code: { key: 'buckets', caption: 'Illustrative design-level pseudo-code for bucket aggregation with suppression', text: String.raw`function BuildTimeline(session, minCell = 5):
    rows = SELECT Mood, SubmittedAt FROM PulseResponses
           WHERE SessionId = session.Id
    buckets = group rows by floor((SubmittedAt - session.Start) / 5 min)
    result = []
    for each bucket b in order:
        total = count(b)
        if total < minCell:
            result.add({ start: b.Start, hidden: true })
        else:
            shares = for each mood m: count(b where Mood = m) / total
            result.add({ start: b.Start, total: total, shares: shares,
                         struggle: shares[Lost] + shares[Confused] })
    return result` } },
    { p: "The fourth piece is the derived measures shown on faculty and management screens. The share of each mood in a bucket is its count divided by the bucket total. The struggle share is the sum of the Lost and Confused shares. Participation is the number of distinct device hashes in a lecture divided by the enrolled count of the course, and the screens call these phones, since one phone is the best available proxy for one student; a student who uses two phones would be counted twice and a pair sharing one phone once. The pace summary counts only students who answered the optional question. The department heatmap groups lectures by weekday and slot, averages the positive share, and shows a cell only when it is based on at least five lectures. A cell is flagged when it is at least twelve points below the department average for two weeks running, which is the rule printed under the heatmap in the prototype." },
    { h3: 'Security, privacy controls and deployment' },
    { p: "The security design combines the controls already described. All traffic uses HTTPS. Passwords of staff are stored only as salted hashes produced by a slow password-hashing function, tokens are short-lived, and sign-in attempts are limited. The anonymous endpoint has an address-based rate limit and a body size limit, accepts only the allowed enumerations and never echoes input. Logs record request outcomes and error types but no device code, no token and no network address. Secrets, such as the daily-secret derivation key and the token signing key, live in a key vault and are not in source control. Management and faculty views are authorised by role and by ownership. Privacy controls are also operational: the prototype's confirmation screen states what is and is not stored, and the retention period of raw responses is set by the institution." },
    { p: "The proposed deployment is shown in <<fig:azure>>. The Angular build is served from a static hosting service, the API runs in a managed application service, and the database is a managed SQL database reached over a private endpoint. Secrets come from a key vault through a managed identity, so that no credential is stored in configuration files. Monitoring uses an application-insights service configured to avoid personal data. A managed SignalR service is optional and would be added only if the number of simultaneous faculty connections made it necessary. The topology is a proposal; nothing in it has been provisioned." },
    { fig: { key: 'azure', file: 'd-azure.png', caption: 'Proposed Azure deployment topology', widthCm: 14 } },
    { h2: 'Web application design' },
    { p: "The client application is presented through a high-fidelity prototype of fourteen screens. The prototype is a design artefact: the screens are drawn at full visual detail and the first three student screens can be clicked through, but they are not connected to a server and no data is stored. **All course names, faculty names, room numbers and figures that appear in the screenshots are fictional sample data created for the design. They are not measurements and are not evidence of how the system performs.** The prototype is organised by user group: five student screens, four faculty screens and four management screens, plus an overview sheet. Each screen is explained below with its purpose, what is on it, the design reasoning and the requirements it serves." },
    { h3: 'Visual design' },
    { p: "<<fig:overview>> is the overview sheet of the prototype. It sets the visual language that every screen follows: a playful classroom style with high-saturation backgrounds in lime, yellow, pink, sky and lilac, black outlines, rounded pill-shaped buttons, and a bold geometric sans-serif for headlines. The sheet also lists the five answers with their colour codes, the three flows (student, faculty and management) and the palette. The tagline Scan. Tap. Done. states the product's promise, and the yellow student card repeats the target of under five seconds from scan to sent." },
    { fig: { key: 'overview', file: '00-Overview.png', caption: 'Overview of flows, mood scale and palette in the prototype (sample data)', widthCm: 15 } },
    { p: "The playful style is a deliberate choice for the student side. A tool used voluntarily during a lecture competes with every other thing on the phone, and a screen that looks like a university form would be abandoned, whereas a friendly, high-contrast screen invites a quick tap. The same black outline and pill vocabulary is kept on the staff screens, but with calmer cream backgrounds and more white space, since faculty and management read charts and should not be distracted. Text is black on every coloured ground, which was a rule from the start so that contrast does not depend on the particular colour. The mood colours form the diverging scale discussed in Section 2.4, and each appears with its label on the sheet itself, so the legend never relies on colour alone." },
    { h3: 'Student screens' },
    { p: "The five student screens form a single short journey with two exceptional states. <<fig:m1>> and <<fig:m2>> show the pick screen before and after a choice, and <<fig:m3>> and <<fig:m4>> show the confirmation and the cooldown. <<fig:m5>> shows the screen for the case where no lecture is running." },
    { figs: { cols: 2, maxHeightCm: 12.5, items: [
      { key: 'm1', file: 'M1-PickMood.png', caption: 'Student screen M1, pick a mood (sample data)' },
      { key: 'm2', file: 'M2-Selected.png', caption: 'Student screen M2, mood and pace selected (sample data)' },
    ] } },
    { p: "Screen M1 opens when a student scans the desk QR code. It carries the context that the system already knows, in a pill at the top: Room C-204, Data Mining, Live. The student has to supply nothing but a feeling. The heading asks How's class going for you? and below it five large cards are stacked, each with a coloured face tile, the mood word in bold, a short explanation in plain words (for example Lost, I can't follow this) and an empty radio circle on the right. The vertical list uses the full width of the phone, so each target is large enough for a thumb, and the label and the face carry meaning together with the colour. An optional Pace question follows with three pill buttons, Too fast, Just right and Too slow. A black pill in the top corner reads Anonymous with a lock icon, so that the promise is visible before the first tap. The main button at the foot is white and reads Pick how you feel to send, which tells the student why it cannot be pressed yet. This screen satisfies FR-5 and FR-6." },
    { p: "Screen M2 shows the same page after the student chose Confused and Too fast. The chosen card turns yellow, receives a heavier shadow and a filled radio button, and the selected pace pill turns solid black, so the selection is visible by shape and fill and not by colour alone. The foot button becomes black and now reads Send anonymously with an arrow. The pace question was kept separate from the mood because the two answers diagnose different problems, as discussed in Section 2.4, and it was kept optional so that the shortest path remains two taps. The button stays at the bottom of the screen, within thumb reach on a tall phone, and there is no text field anywhere on the page, which follows FR-6 and protects anonymity." },
    { figs: { cols: 2, maxHeightCm: 12.5, items: [
      { key: 'm3', file: 'M3-Thanks.png', caption: 'Student screen M3, recorded anonymously (sample data)' },
      { key: 'm4', file: 'M4-AlreadyIn.png', caption: 'Student screen M4, already responded, cooldown (sample data)' },
    ] } },
    { p: "Screen M3 confirms the tap on a pink background. A white card shows the chosen face and the message Thanks, got it, followed by a sentence that repeats the answer and the time (Confused, too fast at 10:24) and states that the lecturer sees only the class total and never who tapped. A yellow strip with a clock icon says that the next tap opens at 10:34 and invites the student to scan again whenever the mood changes. A white card at the bottom lists What we store (room, time, the tap and a random code that resets every day, only to stop repeat taps) and What we never store (name, roll number, phone number, location or contacts). I consider this the most important text in the whole product: trust is what allows honest taps, and the screen puts the privacy statement where the student is looking at the moment of doubt. It satisfies FR-9 and FR-10." },
    { p: "Screen M4 is what the student sees if the same phone scans again within ten minutes. The yellow page shows a circular countdown ring with 6:00 min left in a pink centre, the heading You've already tapped!, a sentence confirming that the earlier answer is counted, and a black pill saying that the next tap opens at 10:34. The card at the bottom explains that the limit uses a random code that resets every day and cannot be linked to the student's name, roll number or phone. The screen turns a rejection into an explanation, which matters because a silently ignored tap would look like a fault. The cooldown is the proposed answer to the spam risk named in the PRD. It is an assumption, because a fixed shared code cannot prove that a tap comes from a person in the room, and the countdown screen does not claim otherwise. It satisfies FR-9." },
    { p: "Screen M5 appears when the QR is scanned outside any scheduled slot. On a sky-blue ground, the heading reads No class here right now, and the text says that it is 13:12 on a Wednesday and that pulses open five minutes before a lecture and close when it ends. A white card labelled Next in C-204 names the next lecture (Cloud Computing, Thursday 5 November, 09:00 to 09:55, with the lecturer's name) so that the screen is useful and not only a refusal. A small note tells students who reach this page by mistake that each desk QR belongs to one classroom and that they should scan the card on their own desk. The screen exists to keep off-hours scans from polluting the data of a lecture, and it corresponds to the no-lecture error of the API. It satisfies FR-8." },
    { figs: { cols: 2, maxHeightCm: 12.5, items: [
      { key: 'm5', file: 'M5-NoLecture.png', caption: 'Student screen M5, no lecture right now (sample data)' },
    ] } },
    { h3: 'Faculty screens' },
    { p: "Faculty see four screens, shown in <<fig:f1>>, <<fig:f2>>, <<fig:f3>> and <<fig:f4>>. They move from sign-in through the daily view to the detail of one lecture and finally to the trend over a course." },
    { fig: { key: 'f1', file: 'F1-Login.png', caption: 'Faculty screen F1, faculty and staff sign-in (sample data)', widthCm: 14 } },
    { p: "Screen F1 is the sign-in page for faculty and other staff. The page is split in two halves. The left half is pink and carries the logo, a headline that reads See how your lecture is landing, while you can still change it, the department name and a strip of the five mood colours at the foot. The right half is cream and holds the form with the heading Faculty and staff sign-in, a line saying that students do not need an account because they just scan, a field for the college e-mail, a field for the password with masked characters, a black Sign in button, a link for a forgotten password and a note listing the roles Faculty, Coordinator and HOD. The role decides the landing page after sign-in. The e-mail address in the screenshot is a fictional sample address. The sentence about students is intentional, since it reminds everyone that identity exists only on the staff side. This screen satisfies FR-11." },
    { fig: { key: 'f2', file: 'F2-Today.png', caption: "Faculty screen F2, today's lectures (sample data)", widthCm: 15 } },
    { p: "Screen F2 answers one question at a glance: how is my class going right now. A navigation bar offers Today and My courses and shows the date and the user. The largest card is the live lecture, with its room and time, the course and section, and a line stating 80 taps from 46 phones, 74 percent of 62 enrolled. A coloured stacked bar shows the mood shares so far with a legend that spells out each percentage, and an orange warning at the top right states that Lost plus Confused stood at 69 percent in the last ten minutes. Three buttons follow: Open a quick check for two minutes, a plus Topic marker and Open timeline. The two smaller cards show an ended lecture with a short summary line and an upcoming lecture with a tip drawn from the earlier section of the same course. A yellow strip at the bottom summarises the week. The numbers here are sample data." },
    { p: "Several decisions are visible on this screen. The warning is based on the last ten minutes and not on the whole lecture, because a lecturer wants to know what is happening now, and a long-run average would hide a sudden change. The participation sentence counts phones and not students, which is honest about what the system can know. The quick check is a button for the faculty member and not a fixed hourly timer; the PRD describes periodic prompts, and I chose to let the lecturer trigger them so that a prompt arrives at a natural pause. The screen satisfies FR-12 and FR-14." },
    { fig: { key: 'f3', file: 'F3-LectureDetail.png', caption: 'Faculty screen F3, lecture pulse timeline (sample data)', widthCm: 15 } },
    { p: "Screen F3 is the main analytical screen. A header gives the course, section, date, time, room and the state Ended, with buttons Download PDF and View as table. Four coloured tiles show the headline numbers: 137 taps from 49 phones (79 percent of 62), 50 percent Following plus Engaged against a course average of 57 percent, a peak struggle of 73 percent between 10:25 and 10:30, and the share of 35 percent who said the pace was too fast, out of the 89 who answered the pace question. The central chart, titled Pulse every 5 minutes, is a stacked bar per five-minute bucket from 10:00 to 10:50, with a count axis, a legend and, drawn over the bars, black vertical lines labelled with the topics the lecturer marked: Recap: association rules, Apriori, candidates, Worked example and Q and A. A caption states that buckets with fewer than five taps are hidden to protect anonymity." },
    { p: "Below the chart, a section titled What happened gives three numbered observations written in plain language: struggle peaked about seven minutes after the lecturer began candidate generation, it fell once the worked example was shown and stayed low, and the taps dropped towards the end in what the text calls a common end-of-class pattern and not necessarily disengagement. A second panel shows the whole lecture as one bar and a text area titled Your reflection, marked as visible only to the lecturer, which contains a sample note. The topic markers are what turn a mood chart into a teaching insight, because they connect a dip to what was being taught. The restraint of the interpretive text matters too: the screen says what the data shows and cautions against over-reading the tail. This screen satisfies FR-13, FR-18 and FR-19." },
    { fig: { key: 'f4', file: 'F4-CourseTrend.png', caption: 'Faculty screen F4, course trend across lectures (sample data)', widthCm: 15 } },
    { p: "Screen F4 shows a course over its last eight lectures. A segmented control at the top right switches between Section A, Section B and the other course. Two bar charts sit side by side: the share of Following plus Engaged for each lecture, with a course average of 57 percent, and the participation per lecture, defined as phones that tapped divided by enrolled. Each has a one-line interpretation underneath, for example that the dips coincide with the first lecture of a new algorithm. Under them, a heatmap titled Where in the hour do students struggle? has one row for each lecture and one column for each five-minute bucket, shaded from light to dark orange by the Lost plus Confused share, with a legend from 0 percent to 70 percent or more. A yellow banner states the pattern found in the sample data: struggle clusters at minutes 20 to 30 in five of eight lectures, typically after the formal definition and before an example." },
    { p: "This screen is the answer to the PRD risk that a single data point can be misread. Showing eight lectures side by side lets the lecturer see whether a bad day was a one-off or part of a pattern, and the heatmap reveals where in the hour the problem recurs, which no per-lecture total could do. The bar charts start at zero and carry value labels, the heatmap has a text legend, and the interpretive banner is worded as a suggestion. The screen satisfies FR-15." },
    { h3: 'Management screens' },
    { p: "Management see four screens, shown in <<fig:a1>>, <<fig:a2>>, <<fig:a3>> and <<fig:a4>>. The first three are web pages with a shared navigation bar carrying a blue Management badge and the entries Overview, Classrooms and QR, and Timetable. The fourth is the printed desk card." },
    { fig: { key: 'a1', file: 'A1-DeptOverview.png', caption: 'Management screen A1, department overview slot heatmap (sample data)', widthCm: 15 } },
    { p: "Screen A1 gives the Head of the Department a view by time and room. The header names the department and the week and the scope of six classrooms. Four tiles show the lectures pulsed (142 of 156 scheduled), the average participation, the share of Following plus Engaged and the number of flagged slots, which is three, all at 14:00. The main element is a heatmap of Following plus Engaged for each weekday and time slot, from 09:00 to 15:00, with a blue sequential scale, numerical values written in every cell and dashed empty cells with a dash where no data exists, which happens on Saturday afternoons. Three outlined cells are flagged. The caption explains that an outlined cell is at least twelve points below the department average for two weeks running. A white card titled Suggested action reads the pattern as a timing effect and proposes moving labs or activity-based sessions into that slot, with a button to open the timetable. A lilac card titled How this page protects people lists three promises: grouping by slot and room and no ranking by faculty, a minimum of five lectures behind every cell, and the statement that even the Head of the Department cannot identify a tap." },
    { p: "The absence of a faculty leaderboard is the most important decision on this screen and is a deliberate one. If the department view became a ranking tool, faculty would stop opening quick checks, and the data would stop being honest. Grouping by slot and room turns the same data into a question about the timetable and not about people, as the suggested action shows. The page satisfies FR-16." },
    { fig: { key: 'a2', file: 'A2-Classrooms.png', caption: 'Management screen A2, classrooms and QR codes (sample data)', widthCm: 15 } },
    { p: "Screen A2 manages rooms and codes. A table lists six rooms with block and floor, the desk count, the current QR version, the taps today, the time of the last tap and a status pill such as Active, Cards missing: 6, Pulse off (lab) or Events only. The row of Room C-204 is highlighted, and a detail panel on the right shows the QR pattern of that room together with its version and issue date, the number of printed cards against desks, the number of mapped classes per week and the number of off-schedule scans this week, with the note that they are blocked. Three buttons follow: Print desk cards in A6 size, Download QR as PNG and, in pink, Regenerate QR with an ellipsis. A short warning under the button explains that regeneration makes every printed card of the room stop working at once and should be used only if the code has been shared outside the room. The QR pattern drawn in the prototype is illustrative and is not a working code." },
    { p: "The design reflects the main weakness of the fixed code. Regeneration is the remedy when a photograph of a desk code circulates in a messaging group, so it is made available but distinguished by colour and by its wording, which warns of the cost. The status column makes physical problems visible, for example six missing cards in one room, and the count of off-schedule scans links this screen to the timetable. It satisfies FR-1, FR-2, FR-3 and FR-17." },
    { fig: { key: 'a3', file: 'A3-Timetable.png', caption: 'Management screen A3, room timetable and slot mapping (sample data)', widthCm: 15 } },
    { p: "Screen A3 is where the timetable that gives taps their meaning is maintained. The page title names the room and the term, and states that 22 slots are mapped and who last updated them. A room selector, an Import CSV button and a black Save changes button sit at the top right. A pink banner raises an issue found from the data: Thursday 15:00 has nine blocked scans but no class mapped, with a button to add that slot if a class really meets then. The main grid has one column for each time slot and one row for each weekday, and each mapped slot is a card coloured by course and showing the course, the section and the faculty member. Free slots are dashed boxes with a plus sign, and a legend of coloured chips lists the courses. The nine blocked scans match the count shown on the classroom screen." },
    { p: "The timetable is the weakest dependency of the design, since the PRD assumes that the schedule is kept current. The screen reduces that risk in two ways. A CSV import allows a whole term to be loaded at once, and the banner turns the blocked scans, which would otherwise be silent, into a prompt to correct the schedule. The courses are distinguished by colour, but each card also carries its name in text. The screen satisfies FR-4 and FR-17." },
    { fig: { key: 'a4', file: 'A4-DeskCard.png', caption: 'Management screen A4, printed A6 desk card (sample data)', widthCm: 7 } },
    { p: "Screen A4 is the printed card that is laminated and placed on the desks. On a lime background it carries the logo, the question How's class going?, a large QR pattern, three numbered steps (Scan, Tap one face, Done) and a row of five squares in the mood colours, each with its text label (Lost, Confused, Okay, Following, Engaged), so that the card also works as a legend and the colours are never the only carrier of meaning. A black strip at the bottom states that the system is anonymous by design, with no login and no name, together with the room, the department and the QR version. The instructions are short enough to be understood without explanation, and the anonymity statement is printed next to the code so that the student sees it before scanning. I chose the wording anonymous by design instead of an absolute promise such as complete anonymity, because the threat model in Section 2.3.3 admits residual risks and a printed claim should not promise more than the design can support. The card supports FR-3." },
    { p: "<<tab:trace>> collects the screens and the requirements they serve, so that every functional requirement can be traced to at least one screen or to server behaviour." },
    { table: { key: 'trace', caption: 'Traceability between screens and requirements', size: 19, headers: ['Screen', 'User group', 'Requirements served'], widths: [2.6, 1.4, 3.8], rows: [
      ['M1 Pick a mood, M2 Selected', 'Student', 'FR-5, FR-6'],
      ['M3 Recorded anonymously', 'Student', 'FR-9, FR-10'],
      ['M4 Already responded', 'Student', 'FR-9'],
      ['M5 No lecture now', 'Student', 'FR-8'],
      ['F1 Sign-in', 'Faculty', 'FR-11'],
      ['F2 Today', 'Faculty', 'FR-12, FR-14'],
      ['F3 Lecture timeline', 'Faculty', 'FR-13, FR-18, FR-19'],
      ['F4 Course trend', 'Faculty', 'FR-15'],
      ['A1 Department overview', 'Management', 'FR-16'],
      ['A2 Classrooms and QR', 'Management', 'FR-1, FR-2, FR-3, FR-17'],
      ['A3 Room timetable', 'Management', 'FR-4, FR-17'],
      ['A4 Desk card', 'Management', 'FR-3'],
      ['Server behaviour without a screen', 'System', 'FR-7 (slot tagging)'],
    ] } },
    { h2: 'Verification plan' },
    { p: "This section is a plan and not a record. The system has not been built, so no test has been executed and no result exists. The purpose of writing the plan now is twofold. It forces the requirements to be specific enough to be checked, and it fixes in advance what evidence will be accepted, so that results are not chosen after the fact. When the build exists, each case below will be run, and its status will change from Planned to a recorded outcome with evidence such as a test log or a screenshot from the running build." },
    { h3: 'Test strategy' },
    { p: "The strategy uses several levels, listed in <<tab:strategy>>. The fast levels at the top are automated and will run on every change, and the slower levels with people involved will run at the end of each increment of the build order in Section 2.11. The tools named are candidates and not commitments. Usability testing follows the approach described by Nielsen (1993): a small group of volunteers is given realistic tasks, such as sending a mood from the desk card, and is observed, while the facilitator records where they hesitate or err. The volunteers would be asked for informed consent, and the prototype or build would be used with sample data and not with live lectures until a trial is agreed with the department." },
    { table: { key: 'strategy', caption: 'Planned test levels', size: 19, headers: ['Level', 'What is checked', 'Candidate tools', 'When'], widths: [1.3, 3.0, 2.0, 1.5], rows: [
      ['Unit', 'Slot resolver, cooldown policy, bucket aggregation, suppression, derived shares', 'xUnit with in-memory stand-ins', 'Every change'],
      ['Integration', 'API with a real SQL Server test database: endpoints, constraints, authorisation, error model', 'ASP.NET Core test host, test database', 'Every change'],
      ['Client component', 'Angular components and route guards', 'Angular testing utilities', 'Every change'],
      ['End to end', 'Complete journeys: scan, tap, live update, timeline', 'Browser automation', 'End of each increment'],
      ['Accessibility', 'Keyboard use, labels, contrast, colour-independence against WCAG 2.1 AA', 'Automated checker plus manual review', 'End of each increment'],
      ['Usability', 'Task completion and time to send with volunteers', 'Observed sessions', 'Before any trial'],
      ['Privacy and security review', 'Stored fields, logs, rate limits, role and object checks, OWASP API list', 'Checklist and review with guide', 'Before any trial'],
    ] } },
    { h3: 'Planned test cases' },
    { p: "<<tab:tc1>> lists the planned cases for the student and server behaviour, and <<tab:tc2>> lists the planned cases for staff features, timetable import, privacy and accessibility. Together they cover all six modules and the edge cases that the design treats as most important: the cooldown, the no-lecture state, an off-schedule scan, a burst of rapid taps, a regenerated QR code, a hidden small bucket and errors in a timetable import. The status of every case is Planned because execution awaits the build." },
    { table: { key: 'tc1', caption: 'Planned test cases for pulse capture and server rules', size: 16, headers: ['ID', 'Scenario', 'Steps and input', 'Expected result', 'Status'], widths: [0.6, 1.7, 2.6, 2.7, 0.8], rows: [
      ['TC-01', 'Valid tap in a running lecture', 'Open context with valid token during a mapped slot; post mood Confused and pace Too fast', 'Context shows room, course and slot; response stored with session and hash; 201 with next tap time', 'Planned'],
      ['TC-02', 'Tap without pace', 'Post mood Okay with no pace', 'Accepted; pace stored as null', 'Planned'],
      ['TC-03', 'Invalid mood value', 'Post mood 7 or an unknown word', '400 VALIDATION; nothing stored', 'Planned'],
      ['TC-04', 'Free text rejected', 'Post a body with an extra comment field', 'Extra field ignored or rejected; nothing but allowed fields stored', 'Planned'],
      ['TC-05', 'No lecture now', 'Scan when no slot is running or opening within 5 minutes', '409 NO_ACTIVE_LECTURE with next lecture; nothing stored; blocked scan counted', 'Planned'],
      ['TC-06', 'Pulse opens early', 'Scan 5 minutes before a slot starts, then 6 minutes before', 'Accepted at 5 minutes; closed at 6 minutes', 'Planned'],
      ['TC-07', 'Pulse closes at the end', 'Tap one minute after the slot ends with no slot following', 'Closed; no-lecture answer', 'Planned'],
      ['TC-08', 'Back-to-back lectures', 'Tap during the last 3 minutes of a slot that is followed by another slot', 'Assigned to the running slot, not the next one', 'Planned'],
      ['TC-09', 'Cooldown', 'Send a valid tap, then another from the same device code after 4 minutes', '429 COOLDOWN with next time; second tap not stored', 'Planned'],
      ['TC-10', 'Cooldown expiry', 'Send a second tap 10 minutes and 1 second after the first', 'Accepted and stored', 'Planned'],
      ['TC-11', 'New day new code', 'Send taps with codes of two different dates', 'Hashes differ; second tap not blocked', 'Planned'],
      ['TC-12', 'Spam burst', 'Send 50 requests in one second from one address', 'Rate limiter answers RATE_LIMITED after the policy limit; stored taps do not exceed the cooldown rule', 'Planned'],
      ['TC-13', 'Regenerated QR', 'Regenerate the QR of a room, then open the old token', '410 QR_REVOKED; new token works', 'Planned'],
      ['TC-14', 'Unknown token', 'Open a token that matches no room', '404 QR_UNKNOWN with no information about other rooms', 'Planned'],
      ['TC-15', 'Small bucket hidden', 'Store 4 taps in one bucket and 6 in another', 'Timeline returns the first as hidden with no counts and the second with shares', 'Planned'],
    ] } },
    { table: { key: 'tc2', caption: 'Planned test cases for staff features, timetable, privacy and accessibility', size: 16, headers: ['ID', 'Scenario', 'Steps and input', 'Expected result', 'Status'], widths: [0.6, 1.7, 2.6, 2.7, 0.8], rows: [
      ['TC-16', 'Staff sign-in', 'Sign in as faculty with valid and then invalid password', 'Valid gives token and Today page; invalid gives 401 with no detail on which part was wrong', 'Planned'],
      ['TC-17', 'Role restriction', 'Use a Faculty token on an admin endpoint', '403 FORBIDDEN', 'Planned'],
      ['TC-18', 'Object ownership', 'Faculty A requests the lecture of Faculty B by identifier', '403 FORBIDDEN; no data returned', 'Planned'],
      ['TC-19', 'Live update', 'Faculty views a live lecture; a student taps', 'Live distribution changes within a few seconds without a page refresh', 'Planned'],
      ['TC-20', 'Topic marker', 'Add a marker during a live lecture', 'Marker stored with the current time and shown on the timeline', 'Planned'],
      ['TC-21', 'Quick check window', 'Open a two-minute quick check', 'Taps in the window carry the quick-check identifier; window closes after two minutes', 'Planned'],
      ['TC-22', 'Private reflection', 'Save a note, then read it as another faculty member', 'Author can read; other user receives 403', 'Planned'],
      ['TC-23', 'Heatmap minimum data', 'Provide a slot with 4 lectures and a slot with 5 lectures', 'First cell empty with a dash; second cell shown', 'Planned'],
      ['TC-24', 'No faculty ranking', 'Inspect every management response and screen', 'No view or payload orders or ranks faculty', 'Planned'],
      ['TC-25', 'Timetable CSV import with errors', 'Import a file with an unknown room, an end time before start and a duplicate slot', 'Valid rows reported as importable; each bad row reported with its line and reason; nothing saved until confirmed', 'Planned'],
      ['TC-26', 'Timetable overlap', 'Save two slots that overlap in the same room', 'Rejected with a clear message', 'Planned'],
      ['TC-27', 'Stored data inspection', 'After several taps, inspect database rows and logs', 'No name, phone, location, address or raw device code anywhere', 'Planned'],
      ['TC-28', 'Colour independence', 'View the student and staff pages in greyscale and with a colour-vision simulation', 'Every mood and chart series remains identifiable by text label', 'Planned'],
      ['TC-29', 'Keyboard and contrast check', 'Complete the student and sign-in journeys with keyboard only; measure text contrast', 'All controls reachable with visible focus; text meets WCAG 2.1 AA ratios', 'Planned'],
      ['TC-30', 'Scan to sent time', 'Time volunteers from camera scan to confirmation on a mid-range phone', 'Time recorded for each; compared with the five-second design target', 'Planned'],
    ] } },
    { h3: 'Accessibility, privacy and acceptance criteria' },
    { p: "Three further reviews are planned that are not single test cases. The accessibility review will check the student and staff pages against WCAG 2.1 level AA, in particular criteria 1.4.1 and 1.4.3 discussed earlier, keyboard operation, visible focus and sensible labels for screen readers, using an automated checker for the mechanical part and a manual walk-through for the rest. The privacy review will list every field in the database and every log statement and confirm that each is on the allowed list of Section 3.1, and will repeat the threat model of <<tab:threats>> against the built system. A security review will walk through the OWASP API Security list and attempt the abuse cases of the threat table, in particular rapid repeated posting and the use of a regenerated code." },
    { p: "Acceptance of the build would require that all cases above are executed, that failures are fixed or explicitly accepted by the guide, and that the evidence is stored with the report. It should be noted that this plan verifies the software against its requirements. It does not establish that the product is useful. Whether students will use the pulse honestly, whether faculty find it helpful and whether it changes teaching are questions of value and can only be answered by a consented trial in a real classroom, measuring the success metrics of the PRD: participation rate per class, consistency of pulse participation, reduction of repeated low-engagement segments over weeks and faculty usefulness ratings. None of these has been measured." },
    { h1: 'Conclusion' },
    { p: "This project set out to design a way for students to tell their lecturer, anonymously and in a few seconds, how a live lecture is going, and for faculty and management to see that signal as a pattern over time. The result is a complete design and a high-fidelity prototype. The requirements are written down as nineteen functional and eight non-functional requirements. The architecture is a layered ASP.NET Core Web API over SQL Server with Angular clients, and the data model, API contract and core rules are specified in enough detail to be built. The central rules are the mapping of a timestamp to a lecture slot, a ten-minute per-device cooldown based on a daily-rotating hashed code, five-minute aggregation and the suppression of any bucket with fewer than five taps. A prototype of fourteen screens shows every state a student can meet and the views that faculty and management need, and a verification plan of thirty cases records what must be shown once the system exists." },
    { p: "Three ideas from the design deserve to be restated because they shaped most decisions. First, trust is the product. A student who suspects that a tap can be traced will stop tapping or tap defensively, so the confirmation screen states what is stored and what is never stored, and the data model has no place to hold an identity. Second, a mood tap is only useful with context. Attaching the room, the time and the lecture slot from a maintained timetable is what turns an anonymous tap into evidence about a lecture, which is why the timetable and its import are given their own screen. Third, the interface must lead to the right reading of the data. The design shows trends and not single points, hides sparse buckets, labels every colour with a word, and refuses to rank faculty, because a tool that is used as a ranking would soon be avoided by the people it is meant to help." },
    { p: "The limitations of the work must be stated plainly. The system is a prototype: it has not been built, deployed or used in a real classroom. Every number in the screenshots is sample data, and no participation rate, usefulness or accuracy has been measured. The assumptions on which the design rests have not been validated with real students or faculty. These include that the five labels are understood consistently, that anonymity actually encourages honest taps, that a ten-minute cooldown is a sensible length, and that a threshold of five protects privacy in classes of the sizes found in the department. The anti-spam approach is an assumption and not a proven answer. A fixed QR code can be photographed and scanned from outside the room, and the design can only limit the damage through the lecture window, the cooldown, rate limits, regeneration and the count of blocked scans. The cooldown relies on a code held in the browser, so clearing the site data starts a new code. Anonymity is a design goal with a stated threat model, not a guarantee, and residual risks listed in <<tab:threats>> remain. Finally, the success metrics of the PRD, namely participation, consistency, reduction of repeated low-engagement segments and faculty usefulness, are still to be measured." },
    { p: "Working on the design taught me several lessons. The most useful one was to write the privacy rules before any screen, because they decided the content of the student pages, the shape of the database and the form of the charts. A second lesson was that every feature of a feedback tool has a social side effect: the optional pace question, the lecturer-controlled quick check and the absence of a leaderboard were each decisions about how people will behave and not only about what the software can do. A third was that a prototype is an effective way of finding gaps in requirements, since drawing the cooldown and no-lecture screens exposed rules, such as what happens at the boundary of two lectures, that the PRD had not stated. Lastly, writing the verification plan before the build showed which requirements were still vague, for example the exact meaning of participation, and prompted me to define it as distinct device hashes divided by enrolled students." },
    { p: "Several enhancements are planned for future work, in this order. The first is to build the thin vertical slice described in Section 2.11 and execute the verification plan, recording genuine evidence. The second is a pilot in one classroom, with the consent of the lecturer and the students and the approval of the department, to measure the PRD success metrics and to learn whether the assumptions above hold. The third is to evaluate stronger controls against off-room scanning that keep friction low, such as a short-lived code displayed on the classroom projector or a coarse presence check, and to weigh them against the privacy cost. Further work includes a Section B comparison view that keeps anonymity, an export for the department's quality-assurance reports, support for several languages in the student screens, and a review of the small-cell threshold and retention period with the institution's data-protection owner." },
    { references: [
      "Angelo, T. A. and Cross, K. P., Classroom Assessment Techniques: A Handbook for College Teachers, 2nd edition, Jossey-Bass, 1993.",
      "Angular Team, Angular documentation, angular.dev, accessed November 2026.",
      "Black, P. and Wiliam, D., Assessment and Classroom Learning, Assessment in Education: Principles, Policy and Practice, 1998.",
      "Brewer, C. A., Designing Better Maps: A Guide for GIS Users, Esri Press, 2005.",
      "Cavoukian, A., Privacy by Design: The 7 Foundational Principles, Information and Privacy Commissioner of Ontario, 2009.",
      "Fielding, R. T., Architectural Styles and the Design of Network-based Software Architectures, Doctoral dissertation, University of California, Irvine, 2000.",
      "Hattie, J. and Timperley, H., The Power of Feedback, Review of Educational Research, 2007.",
      "International Organization for Standardization, ISO/IEC 18004:2024 Information technology, Automatic identification and data capture techniques, QR code bar code symbology specification, ISO/IEC, 2024.",
      "Jones, M., Bradley, J. and Sakimura, N., JSON Web Token (JWT), RFC 7519, Internet Engineering Task Force, 2015.",
      "Martin, R. C., Clean Architecture: A Craftsman's Guide to Software Structure and Design, Prentice Hall, 2017.",
      "Microsoft, ASP.NET Core documentation, Microsoft Learn, accessed November 2026.",
      "Microsoft, Entity Framework Core documentation, Microsoft Learn, accessed November 2026.",
      "Microsoft, Introduction to ASP.NET Core SignalR, Microsoft Learn, accessed November 2026.",
      "Nielsen, J., Usability Engineering, Academic Press, 1993.",
      "OWASP Foundation, OWASP API Security Top 10, 2023 edition, OWASP, 2023.",
      "Royce, W. W., Managing the Development of Large Software Systems, Proceedings of IEEE WESCON, 1970.",
      "Sommerville, I., Software Engineering, 10th edition, Pearson, 2016.",
      "Sweeney, L., k-Anonymity: A Model for Protecting Privacy, International Journal on Uncertainty, Fuzziness and Knowledge-Based Systems, 2002.",
      "Tufte, E. R., The Visual Display of Quantitative Information, Graphics Press, 1983.",
      "World Wide Web Consortium, Web Content Accessibility Guidelines (WCAG) 2.1, W3C Recommendation, 2018.",
    ] },
  ],
};

// ---- resolve <<fig:key>>, <<tab:key>>, <<lst:key>> to automatic chapter numbers ----
(function resolveRefs(c) {
  const ids = { fig: {}, tab: {}, lst: {} };
  let ch = 0, nf = 0, nt = 0, nl = 0;
  for (const b of c.body) {
    if (b.h1) { ch++; nf = 0; nt = 0; nl = 0; continue; }
    if (b.fig) { nf++; if (b.fig.key) ids.fig[b.fig.key] = `Fig. ${ch}.${nf}`; }
    if (b.figs) for (const it of b.figs.items) { nf++; if (it.key) ids.fig[it.key] = `Fig. ${ch}.${nf}`; }
    if (b.table) { nt++; if (b.table.key) ids.tab[b.table.key] = `Table ${ch}.${nt}`; }
    if (b.code) { nl++; if (b.code.key) ids.lst[b.code.key] = `Listing ${ch}.${nl}`; }
  }
  const sub = (s) => s.replace(/<<(fig|tab|lst):([a-z0-9]+)>>/g, (m, k, id) => {
    if (!ids[k][id]) throw new Error('Unresolved reference ' + m);
    return ids[k][id];
  });
  const walk = (v) => {
    if (typeof v === 'string') return sub(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = walk(v[k]); return o; }
    return v;
  };
  c.body = walk(c.body);
  c.abstract = sub(c.abstract);
  c.refIds = ids;
})(content);

module.exports = content;
