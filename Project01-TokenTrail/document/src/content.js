'use strict';
/*
 * TokenTrail mini project report - content module for tools/report-builder/build.js
 * Cross references: write {F:key}, {T:key}, {L:key} in prose. They are resolved to the
 * automatic labels (Fig. 3.4, Table 2.1, Listing 3.2) at the end of this file, and the
 * resolver checks that every item is mentioned before it appears.
 * Inline code is written between the guillemets  «like this»  and converted to backticks.
 */
const path = require('path');
const body = [];
const B = (...blocks) => body.push(...blocks);

const abstract =
  'Waiting for a consultation in a government clinic usually means sitting or standing in a crowded hall without knowing when one\'s turn will come. ' +
  'TokenTrail is a proposed smart virtual queue that removes this uncertainty. Registration staff create a token for each patient, the system produces a QR code linked to that token, and the patient scans it to open a live page that shows the token now being served, the number of people ahead and an estimated wait expressed as a range. ' +
  'Progressive alerts at 10, 5 and 2 people ahead, and when the patient is called, are delivered by browser push with an SMS backup, so the patient can wait at a nearby place instead of in the hall. ' +
  'This report documents the theoretical background and the design of the system. The background covers queueing concepts, the requirements, ASP.NET Core, SQL Server with Entity Framework Core, Angular progressive web apps, SignalR, Web Push, QR codes, REST security and software development life cycle models. ' +
  'The design covers a clean-architecture server, a REST and SignalR interface, a relational database, a token state machine, a wait-time estimate based on recent consultation durations, an alert engine and a proposed Azure deployment. ' +
  'A high-fidelity prototype of 17 screens for patients, registration and room staff, and administrators illustrates the design using fictional sample data, and a verification plan lists the planned test cases. ' +
  'The system has not yet been built, deployed or evaluated with real users, so the report makes no claims about measured performance. ' +
  'Its main assumptions, namely the alert channel, the single re-entry rule and the alert thresholds, are stated openly and are to be confirmed with clinic staff in a field trial planned as future work.';

const acknowledgement = [
  'I express my sincere gratitude to [[GUIDE NAME]], [[Designation, Department]], for guiding this mini project from the first idea to the final report. Her advice and encouragement, and the time she gave to the drafts of this report, shaped both the design and the way it is written down.',
  'I am thankful to [[HOD NAME]], Head of the Department, and to the Principal of [[INSTITUTION NAME]] for providing the academic environment, the laboratory facilities and the freedom to choose a problem from public service. I also thank all the faculty members of [[DEPARTMENT NAME]] whose lectures on software engineering, database systems and web technologies are the foundation of this work.',
  'I thank my family for their constant encouragement and for the patience they showed while I spent long hours on the design and the documentation. Their support made it possible to complete this work on time.',
  'Finally, I thank my friends and classmates for their encouragement and for the many conversations about the idea. Any remaining mistakes in this report are my own.',
];

/* =====================================================================
   1  INTRODUCTION
   ===================================================================== */
B({ h1: 'Introduction' });
B(
  { p: 'Outpatient departments (OPDs) in government clinics and hospitals serve a large number of people in a short working window. In many such clinics a patient arrives early, registers at a counter, receives a paper slip or a number and then waits in a corridor or hall until the doctor\'s room calls that number. The doctor sees patients one after another, so the order of service is simple. What is not simple is the waiting itself. The patient cannot tell whether the call will come in twenty minutes or in two hours, and therefore dares not leave the building, even to buy medicine, eat something or sit in a quieter place.' },
  { p: 'Waiting in a crowd has costs that go beyond boredom. Halls that are full make it harder for staff to move, increase the stress of sick and elderly patients and of the attendants who accompany them, and leave people standing for long periods. Uncertainty adds to the strain: research on service queues has long reported that unexplained and uncertain waits feel longer than known and explained waits (Maister, 1985). The time of the patient and of the attendant, who often has to take leave from work, is spent in one place only because there is no reliable way to know when the turn is near.' },
  { p: 'A virtual queue separates the position in the queue from the physical place of waiting. The patient still receives a token and the order of service stays first come, first served, but the position is tracked by software and shown on the patient\'s own phone. Food-delivery and ride-hailing applications have made people familiar with this style of live tracking, where the user sees a status, a distance and an expected time instead of a silent wait. TokenTrail applies the same idea to a public clinic, with the additional requirement that it must work without installing an application, without a patient login and on a low-cost smartphone.' },
  { p: '**Problem statement.** Patients and attendants in government clinics have no dependable way to know how close their turn is. They must therefore stay in the crowded waiting area, and the clinic cannot reduce the crowd without risking that patients miss their turn. The problem is to design a queue system that lets patients wait anywhere nearby, tells them in time to come back, keeps the order of service fair and gives the administration simple daily figures about waiting and missed turns.' },
  { p: '**Objectives.** The objectives of this mini project are as follows.' },
  { numbered: [
    'To study queue management in public outpatient departments and identify the information a waiting patient needs.',
    'To derive a clear set of requirements for patients, registration staff, doctor\'s-room staff and administrators.',
    'To design a QR-based virtual queue in which a token is created by staff and tracked by the patient on a mobile web page.',
    'To design progressive alerts at 10, 5 and 2 people ahead and at the patient\'s turn, with a backup channel for patients who cannot receive push notifications.',
    'To design the server, the database, the interface and the security of the system using ASP.NET Core, SQL Server and Angular.',
    'To build a high-fidelity prototype of the patient, staff and administrator screens, including the failure states, and to document the design rationale.',
    'To prepare a verification plan that can be executed once the system is built.',
  ] },
  { p: '**Scope and users.** The scope is a single hospital block with several departments, each with one or more consultation rooms. The primary users are patients and their attendants, the secondary users are the registration staff and the staff in the doctor\'s room, and the tertiary users are the clinic administrators. The minimum product consists of token creation by staff, a QR code for each token, a live patient page, milestone alerts and a basic day-wise summary. Integration with a hospital management system, deployment across several hospitals and forecasting by machine learning are outside this scope.' },
  { p: '**Methodology in brief.** The work follows an iterative and incremental approach. It started with a product requirements document that fixed the problem, the users, the end-to-end journey and the success metrics. A project plan then recorded the open decisions, the technology stack and a thin-slice build order in which the core loop of token, QR and live position is proven first. A high-fidelity prototype of 17 screens was drawn to test the design on paper, and this report records the resulting design. The prototype uses fictional sample data and the system itself is not yet built, so every statement about behaviour in this report describes the intended design and not an observed result.' },
  { p: 'In order to achieve these objectives, the report is divided into the following parts.' },
  { bullets: [
    'Part 1 (Introduction) gives general information about the topic, the problem, the objectives, the scope and the method followed.',
    'Part 2 (Theoretical Background) describes queueing concepts, the project requirements and the technologies and methods used to design the solution, namely ASP.NET Core, SQL Server and Entity Framework Core, Angular, real-time notification, QR codes, REST security and software development life cycle models.',
    'Part 3 (Practical Implementation) explains the application overview, the planning and design of the server side, the design of the web application with its prototype screens, and the plan for verifying the system.',
    'Part 4 (Conclusion) summarises the outcome of the work, states its limitations honestly and lists the future enhancements.',
  ] },
  { p: 'During the preparation of the design, several decisions had to be made without evidence from real clinics, such as how an alert should be delivered and what should happen to a patient who misses a call. Instead of hiding these decisions, the report marks them as assumptions in Chapter 2 and returns to them in Chapter 4, because they are the first things to be confirmed with clinic staff before the system is built.' },
);

/* =====================================================================
   2  THEORETICAL BACKGROUND
   ===================================================================== */
B({ h1: 'Theoretical Background' });
B({ p: 'This chapter covers the concepts and technologies on which the design of TokenTrail rests. It begins with the ideas of queue management in public outpatient departments, continues with the project requirements derived from the product requirements document and the prototype, and then explains each technology and method used in the design: ASP.NET Core, SQL Server and Entity Framework Core, Angular and progressive web apps, real-time updates and notifications, QR codes, REST API design and security, and software development life cycle models. For each of them the chapter states what it is, how it works, why it was chosen and which alternatives were considered.' });

/* ---------------- 2.1 ---------------- */
B({ h2: 'Queue management in public outpatient departments' });
B({ p: 'A queue exists whenever customers arrive faster than they can be served for some period of time. An outpatient department is a typical single-stage service system: patients arrive at random times, a limited number of doctors serve them, and the time spent with each patient varies from case to case. Queue management is the set of rules and tools that decide who is served next, how the waiting is organised and what the waiting person is told. This section introduces the concepts that the design of TokenTrail uses.' });
B({ h3: 'Queue discipline and token systems' });
B(
  { p: 'The queue discipline is the rule that selects the next customer. The most common rule in public services is first in, first out (FIFO), also called first come, first served, because it is easy to explain and is widely accepted as fair. Other disciplines give priority to some classes of customers, for example senior citizens, pregnant women and persons with disabilities, which many OPD policies recognise. A practical system therefore needs FIFO as the default and a small, explicit exception for priority patients.' },
  { p: 'A token system makes the discipline visible without requiring people to stand in a line. At registration the patient receives a token, which is a number that records the arrival order. The room calls tokens in sequence, and the patient may sit anywhere in the hall. Tokens usually carry a prefix that identifies the department, such as B for general medicine in the prototype, so that several queues can run side by side without confusion. A token system is a first step towards a virtual queue, but the patient still has to be physically present to see a display board or to hear a call.' },
);
B({ h3: 'Perception of waiting' });
B({ p: 'The experience of waiting is not determined by duration alone. Maister (1985) summarised several propositions about the psychology of queues, among them that unoccupied time feels longer than occupied time, that anxiety makes waits feel longer, that uncertain waits feel longer than known and finite waits, and that unexplained waits feel longer than explained ones. These propositions guide the design of the patient page. It tells the patient who is being served, how many are ahead and what to do next, which addresses uncertainty and anxiety, and it explicitly tells the patient that stepping out is allowed, which turns idle time into usable time. Nielsen (1993) makes a related point in usability engineering: a system should always keep users informed about what is going on, through appropriate feedback within reasonable time.' });
B({ h3: 'No-shows, missed turns and priority' });
B(
  { p: 'In a queue where people are free to move around, some of them will not be present when called. This is called a no-show or a missed turn. A strict rule that cancels the token immediately is harsh on a patient who was only a few minutes late, whereas waiting for ever stalls the doctor and delays everybody else. The usual compromise is a short grace period after the call, followed by a recovery path. TokenTrail uses a grace period of five minutes, configurable by the administrator, and allows one re-entry per token per day. These values are design defaults that have not been validated against real clinic behaviour.' },
  { p: 'Priority handling needs equal care. If priority tokens are too easy to obtain, the ordinary queue loses its meaning, and if they are hidden from view, patients suspect unfairness. For this reason the design makes the priority flag an explicit choice of the registration staff, according to the OPD policy printed beside the checkbox on the registration screen, and it shows a visible badge on the staff queue list. The exact placement rule is a policy decision of the clinic and is treated as an assumption in this report.' },
);
B({ h3: 'Little\'s law and the estimate of waiting time' });
B(
  { p: 'Little\'s law is a result of queueing theory that relates three averages of a stable system. If L is the long-run average number of customers in the system, λ is the long-run average arrival rate and W is the long-run average time a customer spends in the system, then L = λW (Little, 1961). The result holds under very general conditions and does not depend on the distribution of arrivals or on the order in which customers are served, which is why it is used so widely (see also Kleinrock, 1975). As purely illustrative arithmetic, if on average 12 patients are present in a department and patients arrive at an average rate of 6 per hour, the average time spent in the system is 12 / 6 = 2 hours.' },
  { p: 'Little\'s law describes averages over a long period, so it cannot tell an individual patient how long that patient will wait. For the individual, a more direct estimate is needed. If k patients are ahead of a patient and the average service interval of the room is d minutes, then the expected remaining wait is about k × d minutes, and because service times vary, the honest way to present it is as a range around this value. The prototype follows this principle and shows the wait as a range such as 25–35 minutes rather than as a single number. Section 3.2.2 describes how the range is to be computed.' },
);
B({ h3: 'Virtual queues' });
B(
  { p: 'A virtual queue keeps the order of service in software and lets the customer wait anywhere. It has been adopted in many service settings, including banks, theme parks and telephone call centres, where a customer is offered a place in the line and a notification when the turn is near. For a clinic, the essential elements are a way to join (here, a token issued at the desk), a way to follow the position (a link in the QR code) and a way to be called back (alerts).' },
);

/* ---------------- 2.2 ---------------- */
B({ h2: 'Project Requirements' });
B({ p: 'The requirements in this section are derived from the product requirements document, the project plan and the 17 prototype screens. Features that appear in the prototype but not in the original document, such as the "I\'m on my way" button, the pause of a queue, priority tokens, the SMS backup, the re-entry after a missed turn and the three patient languages, are treated as part of the design and are included below. The identifiers FR-1 to FR-22 and NFR-1 to NFR-12 are used in Chapter 3 to show which screen or module satisfies which requirement.' });
B({ h3: 'User roles' });
B(
  { p: '{T:roles} lists the four roles of the system. The patient role needs no account: possession of the QR link is the credential, which keeps the entry barrier at zero but also means that the page must show only minimal information. The three staff roles sign in with a staff identifier and a PIN, and the role decides which screen opens after sign-in.' },
  { table: { key: 'roles', caption: 'User roles and their main responsibilities', widths: [1.6, 1.6, 4.6], headers: ['Role', 'Access', 'Main responsibilities'], rows: [
    ['Patient or attendant', 'QR link, no login', 'Scan the QR code, follow the live position, receive alerts, return on time, give optional feedback'],
    ['Registration staff', 'Staff ID and PIN', 'Create tokens, show or print the QR, resend the SMS link, re-queue a patient after a missed turn'],
    ['Doctor\'s room staff', 'Staff ID and PIN', 'Call the next patient, recall, mark a no-show, pause and resume the queue'],
    ['Administrator', 'Staff ID and PIN', 'View the daily summary, export data, configure departments, rooms, alert rules and languages'],
  ] } },
);
B({ h3: 'Functional requirements' });
B(
  { p: 'The functional requirements are listed in {T:fr}. The priority column follows the minimum product of the original document: "Core" items belong to the first release, and "Extended" items come from the prototype and may be deferred if time is short. The prototype itself marks the "I\'m on my way" button as the first thing to cut.' },
  { table: { key: 'fr', caption: 'Functional requirements', size: 20, widths: [0.7, 5.6, 0.9], headers: ['ID', 'Requirement', 'Priority'], rows: [
    ['FR-1', 'Staff sign in with a staff ID and a 6-digit PIN and choose the desk or room they work at for the shift.', 'Core'],
    ['FR-2', 'Registration staff create a token by choosing the department and entering the patient name, optional mobile number, age and visit type (new or review).', 'Core'],
    ['FR-3', 'The system issues a token number that is unique for the department and the day and carries the department prefix, for example B-053.', 'Core'],
    ['FR-4', 'Each token has a QR code that encodes an unguessable link; the QR is shown large on the screen and can be printed on an 80 mm slip.', 'Core'],
    ['FR-5', 'When a mobile number is given, the link is sent by SMS; staff can resend it.', 'Extended'],
    ['FR-6', 'The patient page opens from the link without login and shows the patient\'s token, the token now being served, the number of people ahead and the estimated wait as a range.', 'Core'],
    ['FR-7', 'The patient page updates itself without a manual refresh whenever the queue changes.', 'Core'],
    ['FR-8', 'The system sends alerts when 10, 5 and 2 people are ahead and when the patient is called; the thresholds are configurable.', 'Core'],
    ['FR-9', 'If the patient has not opened the page since the previous alert, a reminder is repeated when one person is ahead.', 'Core'],
    ['FR-10', 'Alerts are delivered by browser push and, as a backup, by SMS for patients without push permission or without a smartphone.', 'Extended'],
    ['FR-11', 'Room staff can call the next patient, recall the current one, mark a no-show and pause or resume the queue.', 'Core'],
    ['FR-12', 'A patient who does not arrive within the grace period after a call is marked as missed and sees a recovery screen with a desk verification code.', 'Core'],
    ['FR-13', 'Staff can re-queue a missed token once per day; the token is placed after the patient currently in the room and keeps the same link.', 'Extended'],
    ['FR-14', 'The patient can tell the room "I\'m on my way" after being called, and the room console shows that the patient\'s page is open.', 'Extended'],
    ['FR-15', 'Staff can mark a token as priority according to OPD policy; priority tokens are shown with a badge and placed by the clinic rule.', 'Extended'],
    ['FR-16', 'When the network is lost, the patient page shows the last known status with its time and retries automatically.', 'Core'],
    ['FR-17', 'Tokens are valid only on the day of issue; an expired or invalid link shows a clear page that directs the patient to the registration desk.', 'Core'],
    ['FR-18', 'After the consultation the patient can give optional, anonymous feedback with two taps.', 'Extended'],
    ['FR-19', 'The patient page is available in English, Kannada and Hindi; the administrator chooses which languages are enabled.', 'Extended'],
    ['FR-20', 'The administrator sees a daily summary with tokens per hour, average wait, missed-turn rate, and the share of patients who waited away from the hall, filtered by date and department, with CSV export.', 'Core'],
    ['FR-21', 'The administrator configures departments, rooms, default consultation time, working hours, alert thresholds, grace period, re-entry rule and token validity.', 'Extended'],
    ['FR-22', 'Significant staff actions (token creation, call, no-show, re-queue, setting changes) are written to an audit log.', 'Extended'],
  ] } },
);
B({ h3: 'Non-functional requirements' });
B(
  { p: 'The non-functional requirements in {T:nfr} describe qualities rather than features. Where a numeric target is given, it is a design target to be verified after the build, and not a measured result. The usability and accessibility figures are taken from the design rules visible in the prototype overview screen: text of at least 15 px on patient screens, contrast of at least 4.5 to 1, and touch targets of 48 px.' },
  { table: { key: 'nfr', caption: 'Non-functional requirements', size: 20, widths: [0.8, 1.5, 5.0], headers: ['ID', 'Quality', 'Requirement'], rows: [
    ['NFR-1', 'Usability', 'A new patient should understand the live page without instructions: token, now serving, people ahead and wait appear in one card; the main actions are labelled with text, not icons alone.'],
    ['NFR-2', 'Accessibility', 'Patient and staff screens aim at WCAG 2.1 level AA, including colour contrast of 4.5 to 1, 48 px touch targets, visible focus and no information conveyed by colour alone.'],
    ['NFR-3', 'Performance', 'Design target: a queue change reaches connected patient pages within a few seconds, and the patient page loads quickly on a low-end phone over a mobile network.'],
    ['NFR-4', 'Availability', 'The service should be available throughout OPD registration hours; planned maintenance is outside those hours.'],
    ['NFR-5', 'Reliability', 'A stale count must err on the safe side: the queue only moves forward, so the page shows last known data with a time stamp rather than a blank page.'],
    ['NFR-6', 'Security', 'Staff endpoints require authentication and role-based authorisation; patient links are unguessable, read-only and limited to the day of issue; all traffic uses HTTPS.'],
    ['NFR-7', 'Privacy', 'The QR code and the link carry no personal data; the patient page shows no full name; personal data is kept only as long as needed for the service day.'],
    ['NFR-8', 'Localisation', 'Interface text for patients is stored in translation files so that languages can be added without code changes.'],
    ['NFR-9', 'Portability', 'The patient page runs in current mobile browsers without installation; the staff console runs in a desktop browser.'],
    ['NFR-10', 'Maintainability', 'Layered architecture with business rules independent of frameworks; alert thresholds and turn rules are settings, not code.'],
    ['NFR-11', 'Auditability', 'Actions that change the queue or the settings can be traced to a staff user and a time.'],
    ['NFR-12', 'Scalability', 'The design targets one hospital block with a few hundred tokens a day and can be scaled out by adding App Service instances and a managed SignalR service.'],
  ] } },
);
B({ h3: 'Assumptions, constraints and out of scope' });
B(
  { p: 'Several assumptions underlie the requirements, and each of them needs confirmation before the system is built. First, patients can scan a QR code and open a mobile web page, or alternatively receive an SMS. Second, staff create a token for every patient and press the call button on time, because every patient alert is driven by that button. Third, the clinic allows patients to stay nearby while the order is preserved, and patients stay within about ten minutes of the OPD. Fourth, alerts are delivered by browser push with an SMS backup, which is a decision recorded in the project plan and not yet confirmed. Fifth, a missed token may re-enter once, after the patient currently in the room, which is a rule to be agreed with the clinic.' },
  { p: 'The main constraints are that the work is carried out by one student with limited time, that the technology stack is limited to tools the student already knows, that the expected users include people with low literacy and low-cost phones, and that the system must not require an application installation. The following items are explicitly out of scope for the first release: integration with a full hospital management system, deployment across several hospitals, advanced forecasting or artificial-intelligence scheduling, appointment booking and payments, and storing any clinical information.' },
);

/* ---------------- 2.3 ---------------- */
B({ h2: 'ASP.NET Core Web API' });
B(
  { p: 'ASP.NET Core is the open-source, cross-platform framework from Microsoft for building web applications and HTTP services with C#. A Web API built with it receives HTTP requests, runs them through a pipeline of components called middleware, and returns responses, usually in JSON. The pipeline is where cross-cutting concerns such as HTTPS redirection, authentication, authorisation, rate limiting, cross-origin resource sharing (CORS) and error handling are configured, in the order in which they must run. The framework includes the Kestrel web server, so the same application runs on a developer laptop, in a container or in a managed cloud service (Microsoft, ASP.NET Core documentation).' },
  { p: 'Two built-in facilities matter most for this project. The first is dependency injection: services such as a queue service or an SMS sender are registered once as interfaces and received by constructors, which makes the layers of the application independent of each other and makes it possible to replace an SMS provider or to substitute a test double. The second is the model binding and validation system: request bodies are mapped to C# classes and checked against declared rules, such as required fields and maximum lengths, before the controller code runs. Controllers are small classes whose methods are mapped to routes and HTTP verbs by attributes, and the same framework hosts the SignalR hubs that Section 2.6 describes.' },
  { p: 'I chose ASP.NET Core because it is the stack in which I am most comfortable, because it has first-class support for real-time communication through SignalR and because it fits the Azure services proposed for deployment. The main alternatives were Node.js with Express, which has a smaller runtime footprint but weaker built-in structure for large business rules, and Java with Spring Boot, which is similar in capability but would require a new language and tooling. For a project whose risk lies in the design and not in learning a new framework, familiarity is a legitimate engineering argument.' },
);

/* ---------------- 2.4 ---------------- */
B({ h2: 'SQL Server and Entity Framework Core' });
B(
  { p: 'SQL Server is a relational database management system. Data is stored in tables with typed columns, rows are identified by primary keys, and relationships between tables are expressed by foreign keys. The language T-SQL is used to define, query and change the data. The central guarantee of such a system is the set of ACID properties: a transaction is atomic, keeps the data consistent with the declared constraints, is isolated from concurrent transactions and is durable once committed. For a queue these properties are important, because two staff members may press "call next" at nearly the same moment, and the database must make sure that one token is not called twice.' },
  { p: 'Entity Framework Core (EF Core) is an object-relational mapper. The programmer describes entities as C# classes and a «DbContext» that exposes them as sets. Queries are written in LINQ and translated into SQL, and changes made to tracked objects are written back by «SaveChanges» in a single transaction. The mapping can be refined with a fluent API that declares keys, maximum lengths, indexes and relationships, and schema changes are managed by migrations, which are generated C# files that can be applied to a database in order (Microsoft, Entity Framework Core documentation). EF Core also supports optimistic concurrency through a row-version column, which lets the application detect that a row was changed by someone else between reading and saving, and this is the planned mechanism for the call-next operation.' },
  { p: 'EF Core was chosen because it removes repetitive data-access code, parameterises queries by default, which is a first line of defence against SQL injection, and keeps the data model visible in the domain code. The alternatives were Dapper, a lightweight micro-ORM that gives full control over SQL but needs more hand-written code, and a document database such as MongoDB, which the sample report used. A relational database is a better fit here because the data is strongly structured, the relationships between departments, rooms, tokens and alerts are important, and the daily summary needs grouped and aggregated queries.' },
);

/* ---------------- 2.5 ---------------- */
B({ h2: 'Angular and progressive web apps' });
B(
  { p: 'Angular is a TypeScript-based framework from Google for building single-page applications. An Angular application is a tree of components, each combining a template, styles and a class, and the framework supplies a router for moving between screens, a dependency injection system, reactive forms with validation, and an HTTP client. Asynchronous data in Angular is commonly handled with RxJS observables, which fit naturally with a live queue: a stream of «queueUpdated» events from the server is turned into a stream of view states for the patient page (Angular documentation, angular.dev).' },
  { p: 'A progressive web app (PWA) is a web application that adds app-like capabilities by using standard browser features. Three ingredients define it. The first is HTTPS, which is required for most of the advanced features. The second is a web app manifest, a JSON file that gives the application a name, icons and a display mode so that it can be added to the home screen. The third is a service worker, a script that the browser runs separately from the page. A service worker can intercept network requests and serve cached files when the network is unavailable, and it can receive push messages even when the page is not open. Angular provides a service-worker package and a «SwPush» service that wrap these capabilities.' },
  { p: 'For TokenTrail, the PWA approach answers three of the stated constraints. The patient must not install an application, so the page opens from a QR scan in any modern mobile browser. The patient may lose the network for short periods, so the application shell is cached and the last known status can be shown offline, as the offline screen of the prototype does. Finally, alerts must reach the patient when the page is in the background, and the service worker is the standard way to receive a push message in that state. Support for web push differs between browsers and operating systems, and on some platforms it requires the page to be added to the home screen, so the design does not rely on push alone, which is the reason for the SMS backup.' },
  { p: 'I chose one Angular application for all three audiences, with separate routes and lazy-loaded modules for the patient, staff and admin areas. This keeps one codebase, one build and one design system, while the patient bundle stays small because staff and admin code is loaded only after sign-in. The alternatives were React, which is equally capable but less opinionated about structure, and native Android and iOS apps, which would give better push control but would demand installation, app-store publishing and two codebases, all of which conflict with the zero-install requirement.' },
);

/* ---------------- 2.6 ---------------- */
B({ h2: 'Real-time updates and notifications' });
B(
  { p: 'A live queue page has two different communication needs. While the page is open, it should change as soon as the queue changes. When the page is closed or the phone is locked, the patient should still be reached at the milestones. The first need is met by a real-time connection from the server to the page, the second by notifications that are delivered by an external channel. TokenTrail uses SignalR for the first and Web Push with an SMS backup for the second.' },
  { p: 'SignalR is the ASP.NET Core library for real-time web communication. The server defines a hub, a class whose methods can be called by clients and which can call methods on connected clients. SignalR negotiates the best available transport automatically, trying WebSockets first and falling back to Server-Sent Events or long polling when necessary (Microsoft, ASP.NET Core SignalR documentation). Clients can be put into groups, so that a change in one room queue is sent only to the patients of that room. The Angular client uses the «@microsoft/signalr» package, which supports automatic reconnection. When many servers are used, the connections must be coordinated, and Azure SignalR Service can take over this work, which is why it is shown as an optional component in the proposed deployment.' },
  { p: 'The Web Push mechanism combines three browser features: the Push API, the service worker and the Notifications API. When the patient allows notifications, the browser creates a subscription that consists of an endpoint URL on the browser vendor\'s push service and a pair of keys. The application server stores the subscription and, when an alert is due, sends an HTTP request to the endpoint using the protocol defined in RFC 8030. The payload is encrypted as specified in RFC 8291, and the server identifies itself to the push service with the VAPID scheme of RFC 8292, so that the push service can tell which application is sending. The service worker then wakes up and displays the notification. The patient must grant permission, may deny it, and cannot be reached by push if the browser or device does not support it.' },
  { p: 'SMS is the backup channel because it works on any phone, including basic feature phones, and needs no permission. An application server calls the HTTP API of an SMS gateway provider with the message text and the number. SMS costs money per message and may be delayed by the operator network, and in India commercial SMS is regulated by the telecom authority, with registration requirements for senders and message templates that must be checked with the chosen provider. For these reasons SMS is used as a fallback and for patients without a smartphone, and not as the first channel.' },
);

/* ---------------- 2.7 ---------------- */
B({ h2: 'QR codes' });
B(
  { p: 'A QR code is a two-dimensional barcode that stores data in a square grid of dark and light modules. It was developed for industrial use and is specified in the international standard ISO/IEC 18004. A QR symbol contains three large finder patterns in three corners that let a camera locate and orient the code, timing patterns that give the module grid, alignment patterns in larger symbols, and format information that records the error-correction level and the mask used. The data itself can be encoded in numeric, alphanumeric, byte or Kanji modes, and the symbol size is selected from a range of versions, from the smallest to the largest, according to the amount of data. Error correction is based on Reed-Solomon codes at four levels, L, M, Q and H, which tolerate roughly seven, fifteen, twenty-five and thirty percent of the symbol being damaged or hidden, and a medium or higher level suits a short link printed on a thermal slip.' },
  { p: 'TokenTrail generates one QR code for each token and not one for the whole clinic. The code encodes only an address of the form «https://host/t/CODE», where CODE is a random string generated by a cryptographically secure generator. In the prototype the visible code has eight characters, and with an alphabet of 32 symbols this gives 32 to the power 8, that is about 1.1 × 10^12 possible codes, of which only a few hundred are valid on any day. Together with rate limiting and expiry at the end of the day, this makes guessing impractical. The QR code contains no name, phone number or medical information, so a lost or photographed slip reveals at most a token number and its current position.' },
  { p: 'The per-token design has two advantages over a single fixed QR code for a department. It allows the server to know which token is being viewed and therefore to compute the position and the alerts for that patient, and it allows an expired or mistyped link to be detected and answered with a clear page. Its disadvantage is that a code has to be produced and shown or printed for every patient, which is why the registration screen shows the QR immediately and offers a printed slip and an SMS link as alternatives. The QR image shown in the prototype is drawn for layout purposes, and the address on it uses a placeholder domain.' },
);

/* ---------------- 2.8 ---------------- */
B({ h2: 'REST API design and security' });
B(
  { p: 'Representational State Transfer (REST) is an architectural style for networked applications described by Fielding (2000). Its constraints are a client-server separation, stateless requests in which each request carries all the information needed to process it, cacheable responses, a uniform interface, a layered system and optional code on demand. In practice, a REST API identifies things by nouns in URLs, such as «/tokens» and «/rooms», and uses the HTTP verbs to express the operation: GET reads, POST creates or triggers an action, PUT replaces and DELETE removes. Status codes report the outcome, for example 201 for a created resource, 400 for a malformed request, 401 for missing authentication, 403 for insufficient rights, 404 for an unknown resource, 409 for a conflict and 429 for too many requests. A stateless API is easy to scale out, because any server instance can handle any request.' },
  { p: 'Authentication for staff uses JSON Web Tokens. A JWT is a compact, URL-safe string made of a header, a set of claims and a signature, as defined in RFC 7519 (Jones, Bradley and Sakimura, 2015). After a successful sign-in with staff ID and PIN, the server returns a short-lived signed token whose claims include the user identifier and the role. The client sends it in the «Authorization» header and the server checks the signature and the expiry on every request. Role-based authorisation is then declared with attributes on controllers and actions, so that, for example, only room staff may call the next patient and only administrators may change the settings. PINs are stored only as salted hashes made with a slow password-hashing function.' },
  { p: 'Patient access follows a different model. The patient has no account, and the unguessable link acts as a capability: whoever holds it may view that one token, read-only, until the end of the day. This is simple and suits the zero-login requirement, but it means that the endpoints behind the link must check that the code exists and is still valid, must return the same response for every kind of failure to avoid revealing which codes exist, and must be protected by rate limiting. The OWASP API Security Top 10 lists broken object-level authorisation as the first risk of APIs, and the capability-link design answers it by making the object identifier itself the secret and by never exposing sequential identifiers on public routes (OWASP Foundation, 2023).' },
  { p: 'The OWASP Top 10 of 2021 is a widely used awareness list of the most serious web application security risks (OWASP Foundation, 2021). {T:owasp} maps its categories to the measures planned for TokenTrail. Besides these measures, every request body is validated on the server for type, length and allowed values, CORS is restricted to the known front-end origin, secrets are kept out of the source code, and the audit log records the actions of staff. Security testing is part of the verification plan in Chapter 3, and none of these measures has been exercised yet.' },
  { table: { key: 'owasp', caption: 'OWASP Top 10 (2021) categories and the planned measures', size: 20, widths: [2.2, 4.6], headers: ['Category', 'Planned measure in TokenTrail'], rows: [
    ['A01 Broken Access Control', 'Role attributes on every staff endpoint; public routes limited to a token code; no sequential identifiers in public URLs'],
    ['A02 Cryptographic Failures', 'HTTPS only; PIN hashes with salt; phone numbers encrypted at rest and removed after the service day; secrets in Azure Key Vault'],
    ['A03 Injection', 'EF Core parameterised queries; server-side validation of all inputs; no dynamic SQL built from user input'],
    ['A04 Insecure Design', 'Threat review of the patient link and the call-next operation during design; one re-entry rule enforced on the server'],
    ['A05 Security Misconfiguration', 'Restricted CORS, security headers, production settings separate from development, no detailed errors in production'],
    ['A06 Vulnerable and Outdated Components', 'Use of the current long-term-support releases; regular dependency updates and package audit'],
    ['A07 Identification and Authentication Failures', 'Rate-limited sign-in, lockout after repeated failures, short-lived JWT, PIN change by administrator'],
    ['A08 Software and Data Integrity Failures', 'Signed tokens, build and deployment from a controlled pipeline, database migrations reviewed before release'],
    ['A09 Security Logging and Monitoring Failures', 'Audit log of staff actions and Application Insights telemetry with alerts on repeated failures'],
    ['A10 Server-Side Request Forgery', 'The server calls only fixed, configured provider endpoints and never a URL taken from a request'],
  ] } },
);

/* ---------------- 2.9 ---------------- */
B({ h2: 'Software development life cycle models' });
B(
  { p: 'A software development life cycle (SDLC) model organises the activities of requirements, design, construction, testing and delivery. The waterfall model, described in the form usually attributed to Royce (1970), performs these activities as successive phases, each completed before the next begins. It is easy to manage and produces thorough documents, but it assumes that requirements are known in advance and delays feedback from users until the end. Iterative and incremental models deliver the system in a series of increments, each passing through a small cycle of planning, design, construction and testing, so that feedback can change later increments (Sommerville, 2016; Pressman and Maxim, 2019).' },
  { p: 'Agile methods emphasise working software, collaboration with users and response to change over following a fixed plan, as stated in the Agile Manifesto (Beck et al., 2001). Scrum is the best known agile framework. It organises work in fixed-length sprints, with defined roles (product owner, scrum master and developers), events (sprint planning, daily scrum, sprint review and retrospective) and artefacts (product backlog, sprint backlog and increment), as described in the Scrum Guide (Schwaber and Sutherland, 2020). Kanban, another agile approach, limits work in progress and visualises flow without fixed sprints. {T:sdlc} compares the models in terms of this project.' },
  { table: { key: 'sdlc', caption: 'Comparison of life cycle models for this project', size: 20, widths: [1.4, 2.0, 2.0, 2.0], headers: ['Model', 'Idea', 'Strength', 'Fit for TokenTrail'], rows: [
    ['Waterfall', 'Sequential phases', 'Clear documents and milestones', 'Poor: several rules are still assumptions that will change with feedback'],
    ['Iterative and incremental', 'Grow the system in increments', 'Early working core; feedback each cycle', 'Good: the core loop can be proven first'],
    ['Scrum', 'Fixed sprints, defined roles and events', 'Disciplined cadence and review', 'Partial: roles and ceremonies are heavy for one student'],
    ['Kanban', 'Visual flow, limited work in progress', 'Flexible, little overhead', 'Useful as a personal task board within iterations'],
  ] } },
);
B(
  { p: 'I chose an iterative and incremental approach with a thin-slice build order. The reasons are specific to the project. Several rules, such as the alert channel, the re-entry rule and the thresholds, are not yet evidence-based and will need adjustment after contact with clinic staff, which rules out a strict waterfall. The project is carried out by one person, so the roles and events of Scrum would be formal without adding value, although its idea of a short cycle and a reviewed increment is retained. The value of the product lies in one loop, namely that staff create a token, the patient sees the position and the page updates when the queue moves, and therefore this loop should work end to end before anything else is polished.' },
  { p: '{F:sdlc} shows the planned increments, in the order recorded in the project plan. The first increment proves the core loop of token, QR and live position. The second makes the queue move when staff call the next patient and updates the page. The third adds the alerts at 10, 5 and 2 people ahead and at the call, with the SMS backup. The fourth adds the daily summary for the administrator, and the fifth hardens the system with accessibility checks, edge states and languages. Each increment passes through the same short cycle of planning, design, building, testing and review. The work reported here covers the planning and design of all five increments and the prototype, and the build and test activities are future work.' },
  { fig: { key: 'sdlc', file: 'd-sdlc.png', caption: 'Planned increments and the repeated development cycle', widthCm: 15 } },
);

/* =====================================================================
   3  PRACTICAL IMPLEMENTATION
   ===================================================================== */
B({ h1: 'Practical Implementation' });
B({ p: 'This chapter presents the practical part of the work: the overview of the application, the design of the server side, the design of the web application with the screens of the high-fidelity prototype, and the plan for verifying the system. The word implementation is used in the sense of the sample report, as the practical counterpart of the theory in Chapter 2. It is important to be precise about its status. TokenTrail has been designed in detail and its interface has been drawn as a prototype, but the server and the Angular application have not been built. The code listings in this chapter are therefore illustrative design-level skeletons, which have not been compiled or run, and all behaviour is described as intended behaviour.' });

/* ---------------- 3.1 ---------------- */
B({ h2: 'Application overview' });
B({ h3: 'Roles and use cases' });
B(
  { p: 'TokenTrail has four kinds of users, listed in {T:roles}: patients and their attendants, registration staff, doctor\'s-room staff and administrators. {F:usecase} shows the use cases of each of them. The patient\'s use cases revolve around one object, the token: scanning its QR code, viewing its status, receiving alerts, announcing arrival, choosing a language and giving feedback. Registration staff create and hand over tokens and repair the queue when a patient misses a call. Room staff control the pace of the queue. The administrator observes the results and tunes the rules. Staff of every role sign in first, and the role decides which screen opens.' },
  { fig: { key: 'usecase', file: 'd-usecase.png', caption: 'Use case diagram of TokenTrail', widthCm: 14.5, maxHeightCm: 15.5 } },
);
B({ h3: 'End-to-end workflow' });
B(
  { p: 'The workflow below follows a patient from arrival to the end of the visit, and it matches the journey of the product requirements document with the additions of the prototype. The numbers in brackets refer to the screens of Section 3.3.' },
  { numbered: [
    'Registration staff sign in at the start of the shift and choose their desk (S1).',
    'The patient arrives at the desk. Staff create a token with the department, the patient name, an optional mobile number, the age and the visit type, and mark priority if the OPD policy applies (S2).',
    'The system issues the next token number of that department and shows a large QR code, and it sends the link by SMS if a number was given. Staff may print an 80 mm slip for patients who prefer paper (S3, S4).',
    'The patient scans the QR code with the phone camera. A live page opens without installation or login and shows the token, the token now being served, the number of people ahead and the estimated wait range (P1).',
    'The patient may leave the hall. As the room calls patients, the page updates itself, and the system sends alerts at 10, 5 and 2 people ahead (P2, P3, P4). If the page has not been opened since the last alert, a reminder is repeated at one person ahead.',
    'When the room calls the token, the page shows a full-screen call with the room and the grace time, and the patient may tap "I\'m on my way" (P5, S5).',
    'If the patient does not arrive within the grace time, the token is marked as missed. The patient sees a recovery screen and registration staff can re-queue the token once (P6, S2).',
    'After the consultation the patient may answer two anonymous questions (P7). If the network is lost or the link has expired, the patient sees a designed fallback page instead of an error (P8, P9).',
    'At any time the administrator can view the daily summary and adjust the clinic rules (A1, A2).',
  ] },
);
B({ h3: 'System architecture' });
B(
  { p: '{F:arch} shows the architecture. The clients are the three areas of one Angular progressive web app: the patient view, the staff console and the admin screens. They talk to the ASP.NET Core Web API over HTTPS using JSON for requests and over a SignalR connection for live updates. The API is organised in layers according to the principles of clean architecture (Martin, 2017), with the domain model and the rules at the centre, application services around them, and the controllers, the hub, the data access and the adapters for SMS and push at the outer edge. A hosted background service, the alert engine, evaluates the alert thresholds whenever the queue changes. The data is stored in SQL Server, and alerts leave the system through the browser push services and an SMS gateway.' },
  { fig: { key: 'arch', file: 'd-architecture.png', caption: 'System architecture of TokenTrail', widthCm: 15 } },
  { p: 'The main architectural decisions follow from the requirements. The patient page is read-mostly and must be light, so it receives a small status object and not the whole queue. The queue is the single source of truth in the database, so that any server instance can answer any request, and SignalR is used only to tell clients that something changed. The domain rules, such as the state machine of a token and the order of the queue, are kept in a project that has no reference to ASP.NET Core or EF Core, so that they can be tested without a web server or a database.' },
);
B({ h3: 'Technology stack' });
B(
  { p: 'The technology stack is shown in {T:stack}. It is a design choice that matches the skills of the student. Version numbers are intentionally not fixed in this report: the plan is to use the current long-term-support release of .NET and a current release of Angular at the time of the build.' },
  { table: { key: 'stack', caption: 'Technology stack', size: 20, widths: [1.6, 2.4, 3.4], headers: ['Layer', 'Technology', 'Role in TokenTrail'], rows: [
    ['Client', 'Angular progressive web app (TypeScript)', 'Patient page, staff console and admin screens from one codebase'],
    ['Live updates', 'ASP.NET Core SignalR', 'Pushes queue changes to open pages through groups per room'],
    ['Alerts', 'Web Push (service worker, VAPID) and an SMS gateway', 'Milestone alerts with SMS as backup channel'],
    ['Server', 'ASP.NET Core Web API (C#), current long-term-support release', 'REST endpoints, hub, background alert engine, authentication'],
    ['Data access', 'Entity Framework Core', 'Mapping, migrations, optimistic concurrency'],
    ['Database', 'SQL Server (Azure SQL Database in deployment)', 'Tokens, departments, rooms, alerts, feedback, audit'],
    ['Security', 'JWT bearer tokens, role-based authorisation, rate limiting', 'Staff access control and protection of public routes'],
    ['Hosting', 'Azure App Service, Key Vault, Application Insights', 'Proposed deployment, secrets and monitoring'],
    ['Quality tools', 'Unit-test framework, Angular component tests, browser-based UI tests, accessibility checker', 'Planned verification described in Section 3.4'],
  ] } },
);
B({ h3: 'Modules' });
B(
  { p: 'The system is divided into eight modules, listed in {T:modules} together with the screens that expose them and the requirements they satisfy. The division follows the way the work will be built: the first four modules make up the thin slice of the core loop, the alert engine and the reporting follow, and the clinic setup and the audit trail complete the release.' },
  { table: { key: 'modules', caption: 'Modules, screens and requirements', size: 20, widths: [2.0, 2.8, 1.4, 1.6], headers: ['Module', 'Responsibility', 'Screens', 'Requirements'], rows: [
    ['M1 Authentication', 'Staff sign-in, roles, shift desk or room', 'S1', 'FR-1'],
    ['M2 Token management', 'Create tokens, QR and slip, SMS link, priority, re-queue', 'S2, S3, S4', 'FR-2 to FR-5, FR-13, FR-15'],
    ['M3 Queue control', 'Call next, recall, no-show, pause and resume', 'S5', 'FR-11, FR-12, FR-14'],
    ['M4 Patient page', 'Live status, offline and expired pages, recovery, languages', 'P1, P5, P6, P8, P9', 'FR-6, FR-7, FR-12, FR-16, FR-17, FR-19'],
    ['M5 Alert engine', 'Threshold evaluation, push and SMS delivery, repeat reminder', 'P2, P3, P4', 'FR-8 to FR-10'],
    ['M6 Feedback and reports', 'Feedback capture, daily summary, CSV export', 'P7, A1', 'FR-18, FR-20'],
    ['M7 Clinic setup', 'Departments, rooms, alert rules, turn rules, languages', 'A2', 'FR-21'],
    ['M8 Audit', 'Record of staff actions', 'none (background)', 'FR-22'],
  ] } },
);
B({ h3: 'Token life cycle' });
B(
  { p: 'The token is the central object, and its life cycle is shown in {F:state}. A token starts in the state WAITING when staff create it. The call of the room moves it to CALLED, which in the prototype also means that the patient is in the room, because the room console shows a running timer from the moment of the call. From CALLED the token either goes to COMPLETED when the consultation finishes, or to MISSED when the grace period of five minutes has passed or staff mark a no-show. A MISSED token may be re-queued once, which returns it to WAITING, and a second miss closes it as EXPIRED, so the patient must collect a new token at the desk. At the end of the service day every unfinished token becomes EXPIRED, and its link then shows the expired page. A recall repeats the call without changing the state.' },
  { fig: { key: 'state', file: 'd-state.png', caption: 'State diagram of a token', widthCm: 14.5 } },
);
B({ h3: 'Interaction between the parts' });
B(
  { p: '{F:seq} traces the most important interaction through the system, from the creation of a token to the delivery of an alert. Steps 1 to 3 show the desk creating a token. Steps 4 to 6 show the patient scanning the QR code, receiving the first status and opening the SignalR connection. Steps 7 to 9 show the room calling the next patient, which updates the database and notifies the connected pages. Steps 10 and 11 show the alert engine evaluating the thresholds and sending a Web Push or SMS alert. The diagram deliberately omits the fallback paths, which are described with the alert engine in Section 3.2.2.' },
  { fig: { key: 'seq', file: 'd-sequence.png', caption: 'Sequence from token creation to alert delivery', widthCm: 14.5, maxHeightCm: 16 } },
);

/* ---------------- 3.2 ---------------- */
B({ h2: 'Server-side design' });
B({ p: 'The server side is described in two steps, as in the sample report. Section 3.2.1 plans the interface of the server, that is, which endpoints the clients need. Section 3.2.2 describes how the server is designed internally: its structure, the domain model, the database, the rules for the queue, the estimate of waiting time, the alert engine, the security measures and the deployment. All endpoints, schemas and listings are design proposals.' });
B({ h3: 'API planning' });
B(
  { p: 'The API follows the REST conventions of Section 2.8. All routes start with «/api/v1», bodies are JSON with camel-case names, times use ISO 8601, and staff endpoints expect a JWT in the «Authorization» header. Public patient routes are identified by the token code and never by the numeric identifier. {T:apistaff} lists the endpoints of the staff modules M1 (authentication), M2 (token management) and M3 (queue control), and {T:apiother} lists the patient endpoints of modules M4 to M6 and the administrator endpoints of modules M6 and M7.' },
  { table: { key: 'apistaff', caption: 'Staff endpoints (modules M1, M2 and M3)', size: 19, widths: [0.8, 2.7, 1.2, 2.8], headers: ['Method', 'Route', 'Role', 'Purpose'], rows: [
    ['POST', '/api/v1/auth/login', 'Public', 'Sign in with staff code, PIN and desk or room; returns a short-lived JWT'],
    ['GET', '/api/v1/auth/me', 'Any staff', 'Return the signed-in user, role and workplace'],
    ['POST', '/api/v1/tokens', 'Registration', 'Create a token; returns number, public code and wait range'],
    ['GET', '/api/v1/tokens', 'Registration, Room', 'List the tokens of a department, filtered by status or text'],
    ['GET', '/api/v1/tokens/{id}/slip', 'Registration', 'Return the data for the 80 mm slip and the QR address'],
    ['POST', '/api/v1/tokens/{id}/resend-sms', 'Registration', 'Send the patient link again by SMS'],
    ['POST', '/api/v1/tokens/{id}/requeue', 'Registration', 'Re-queue a missed token once, after the verification code is checked'],
    ['GET', '/api/v1/rooms/{roomId}/console', 'Room', 'Return the current patient, the up-next list, day counts and activity'],
    ['POST', '/api/v1/rooms/{roomId}/call-next', 'Room', 'Complete the current token and call the next one'],
    ['POST', '/api/v1/rooms/{roomId}/recall', 'Room', 'Repeat the call for the current token'],
    ['POST', '/api/v1/rooms/{roomId}/no-show', 'Room', 'Mark the called token as missed'],
    ['POST', '/api/v1/rooms/{roomId}/pause', 'Room', 'Pause the queue; waiting patients see a break message (resume uses the route /resume)'],
  ] } },
  { table: { key: 'apiother', caption: 'Patient and administrator endpoints (modules M4 to M7)', size: 19, widths: [0.8, 2.9, 1.2, 2.6], headers: ['Method', 'Route', 'Role', 'Purpose'], rows: [
    ['GET', '/api/v1/public/tokens/{code}', 'Link holder', 'Return the live status for the patient page (P1 to P6, P8)'],
    ['POST', '/api/v1/public/tokens/{code}/on-my-way', 'Link holder', 'Tell the room that the patient is coming'],
    ['PUT', '/api/v1/public/tokens/{code}/push-subscription', 'Link holder', 'Store or replace the browser push subscription'],
    ['POST', '/api/v1/public/tokens/{code}/feedback', 'Link holder', 'Store the two optional feedback answers'],
    ['GET', '/api/v1/public/tokens/{code}/recovery', 'Link holder', 'Return the recovery steps and verification code after a missed turn'],
    ['GET', '/api/v1/admin/summary', 'Administrator', 'Return the daily summary for a date and department (CSV export under /export)'],
    ['GET, PUT', '/api/v1/admin/settings', 'Administrator', 'Read or save alert rules, turn rules and languages'],
    ['GET, POST, PUT', '/api/v1/admin/departments', 'Administrator', 'List, add and change departments and their rooms'],
  ] } },
  { p: 'The public routes need no JWT but are rate limited, return only a minimal status object and answer every unknown, mistyped or expired code in the same way. The server also exposes a SignalR hub at «/hubs/queue». A patient page joins a group named after its token code and a staff console joins the group of its room. The hub raises three events: «queueUpdated» carries the new status, «tokenCalled» announces a call and «queuePaused» announces a pause or resume. Two illustrative bodies show the shape of the messages. {L:jsoncreate} shows the creation of a token with the values of the fictional sample data, and {L:jsonstatus} shows the public status response, which contains everything the patient page needs and no full name.' },
  { code: { key: 'jsoncreate', caption: 'Illustrative design-level JSON for creating a token (sample data)', text:
`POST /api/v1/tokens
{ "departmentId": 1, "patientName": "Mohammed Irfan",
  "mobile": "9845122307", "age": 41, "visitType": "New",
  "isPriority": false }

201 Created
{ "id": 9153, "number": "B-053", "publicCode": "7KQ2M9XD",
  "link": "https://tt.example.in/t/7KQ2M9XD", "peopleAhead": 16,
  "waitRange": { "minMinutes": 60, "maxMinutes": 75 },
  "smsQueued": true }` } },
  { code: { key: 'jsonstatus', caption: 'Illustrative design-level JSON for the public status route (sample data)', text:
`GET /api/v1/public/tokens/{code}
200 OK
{ "number": "B-047", "department": "General Medicine",
  "room": "Room 3", "nowServing": "B-032", "peopleAhead": 14,
  "waitRange": { "minMinutes": 50, "maxMinutes": 65 },
  "state": "Waiting", "nextAlertAt": 10, "queuePaused": false,
  "updatedAt": "2026-11-04T09:52:00+05:30" }` } },
  { p: 'Errors use the problem-details format so that the Angular client can handle them in one place. {L:jsonerror} shows an illustrative refusal of a second re-entry, and {T:errors} lists the status codes used and the expected client behaviour.' },
  { code: { key: 'jsonerror', caption: 'Illustrative design-level error response for a refused re-queue', text:
`409 Conflict   Content-Type: application/problem+json
{ "type": "https://tt.example.in/problems/requeue-limit",
  "title": "Re-entry limit reached", "status": 409,
  "detail": "This token has already been re-queued once today.",
  "code": "REQUEUE_LIMIT" }` } },
  { table: { key: 'errors', caption: 'Error model', size: 19, widths: [0.8, 1.8, 2.4, 2.4], headers: ['Status', 'Meaning', 'Example', 'Client behaviour'], rows: [
    ['400', 'Invalid input', 'Age missing, mobile number of wrong length', 'Show the message beside the field'],
    ['401', 'Not signed in or JWT expired', 'Call-next after the session ended', 'Return to sign-in, keep typed data'],
    ['403', 'Role not allowed', 'Registration user calls an admin route', 'Show a short message; log the attempt'],
    ['404', 'Unknown or expired code', 'Mistyped or old patient link', 'Show the expired-token page (P9)'],
    ['409', 'Rule conflict', 'Second re-entry, call-next on a paused queue', 'Show the reason from the error code'],
    ['429', 'Too many requests', 'Repeated link guesses', 'Wait for the time in «Retry-After»'],
    ['500', 'Unexpected error', 'Unhandled server failure', 'Show a generic message; keep last known status'],
  ] } },
);
B({ h3: 'Server design' });
B(
  { p: '**Solution structure.** The server is organised as one solution of four source projects and three test projects, shown in {L:structure}. The dependencies point inwards, as in {F:layers}: the Api and Infrastructure projects depend on Application, and Application depends on Domain, while Domain depends on nothing. The Application project declares interfaces such as «IQueueRepository» and «IAlertSender», and the Infrastructure project implements them with EF Core, the SMS gateway client and the Web Push client. This arrangement keeps the rules of the queue testable in isolation and allows a provider to be replaced without touching them.' },
  { code: { key: 'structure', caption: 'Illustrative design-level solution structure', text:
`TokenTrail.sln
  src/
    TokenTrail.Domain/          entities, state machine, queue rules
    TokenTrail.Application/     use cases, DTOs, interfaces, estimator
    TokenTrail.Infrastructure/  EF Core, SMS client, Web Push client
    TokenTrail.Api/             controllers, SignalR hub, hosted services
  tests/   Domain.Tests, Application.Tests, Api.IntegrationTests
  web/     tokentrail-app (Angular PWA: patient, staff, admin)` } },
  { fig: { key: 'layers', file: 'd-layers.png', caption: 'Dependency direction between the layers of the server', widthCm: 11.5 } },
  { p: '**Domain model.** The domain model has three important concepts. A department owns a prefix and one or more rooms. A room has exactly one queue per service day. A token belongs to one room and one day and moves through the states of {F:state}. {L:entity} is a design-level sketch of the token entity. Its set accessors are private, so that the status can change only through methods that enforce the rules, and a row-version property is included for the optimistic concurrency described later. The enumeration «QueueClass» expresses the ordering rule explained below.' },
  { code: { key: 'entity', caption: 'Illustrative design-level sketch of the Token entity', text:
`public enum TokenStatus { Waiting, Called, Completed, Missed, Expired }
public enum QueueClass : byte { ReEntry = 0, Priority = 1, Regular = 2 }

public class Token
{
    public long Id { get; private set; }
    public string PublicCode { get; private set; } = default!;
    public string Number { get; private set; } = default!;   // B-053
    public int RoomId { get; private set; }
    public DateOnly IssueDate { get; private set; }
    public TokenStatus Status { get; private set; } = TokenStatus.Waiting;
    public QueueClass QueueClass { get; private set; }
    public DateTimeOffset QueueStamp { get; private set; }
    public int ReEntryCount { get; private set; }
    public byte[] RowVersion { get; private set; } = default!;

    public void Call(DateTimeOffset now)
    {
        if (Status != TokenStatus.Waiting)
            throw new DomainException("Only a waiting token is called.");
        Status = TokenStatus.Called;
    }

    public void Requeue(DateTimeOffset now, int maxReEntries)
    {
        if (Status != TokenStatus.Missed || ReEntryCount >= maxReEntries)
            throw new DomainException("Re-entry is not allowed.");
        (Status, QueueClass, QueueStamp) =
            (TokenStatus.Waiting, QueueClass.ReEntry, now);
        ReEntryCount++;
    }
}` } },
  { p: '**Database design.** The relational design is shown in the entity-relationship diagram of {F:er}. It has nine tables. Department and Room describe the clinic. ClinicSetting stores the alert and turn rules, and a new row is written at every save, so that a token can keep a reference to the rules that applied when it was issued, which matches the statement on the clinic setup screen that live tokens keep the rules of the day. StaffUser holds the staff accounts. Token is the central table. PushSubscription, AlertLog and Feedback hang from Token, and AuditLog records staff actions. The diagram shows the main columns and the key relationships, and the complete column definitions of the Token table are given in {T:tokentable}.' },
  { fig: { key: 'er', file: 'd-er.png', caption: 'Entity-relationship diagram of the proposed database', widthCm: 14.5, maxHeightCm: 17 } },
  { table: { key: 'tokentable', caption: 'Proposed definition of the Token table', size: 19, widths: [1.7, 1.5, 1.6, 3.0], headers: ['Column', 'Type', 'Constraint', 'Description'], rows: [
    ['Id', 'BIGINT', 'Primary key, identity', 'Internal identifier, never shown in public URLs'],
    ['PublicCode', 'CHAR(8)', 'Unique, not null', 'Random code used in the QR link'],
    ['Sequence', 'INT', 'Unique with department and day', 'Running number of the token within the department and day'],
    ['Number', 'VARCHAR(8)', 'Not null', 'Prefix and sequence, for example B-053'],
    ['DepartmentId', 'INT', 'Foreign key', 'Department that issued the token'],
    ['RoomId', 'INT', 'Foreign key', 'Room whose queue the token joins'],
    ['IssuedByStaffId', 'INT', 'Foreign key', 'Registration user who created the token'],
    ['SettingsId', 'INT', 'Foreign key', 'Rule set that applied at issue time'],
    ['IssueDate', 'DATE', 'Not null', 'Service day; the token expires when the day ends'],
    ['VisitType', 'TINYINT', 'Not null', 'New or review'],
    ['IsPriority', 'BIT', 'Not null, default 0', 'Priority flag set by staff according to OPD policy'],
    ['Status', 'TINYINT', 'Not null', 'Waiting, called, completed, missed or expired'],
    ['QueueClass', 'TINYINT', 'Not null', 'Re-entry, priority or regular; first key of the queue order'],
    ['QueueStamp', 'DATETIMEOFFSET', 'Not null', 'Second key of the queue order: issue time or re-queue time'],
    ['PatientName, Age, Sex', 'NVARCHAR, TINYINT, CHAR', 'Nullable', 'Shown to staff only; cleared after the service day'],
    ['PhoneCipher', 'VARBINARY(256)', 'Nullable', 'Encrypted mobile number, used only to send SMS; cleared after the day'],
    ['PhoneHash', 'BINARY(32)', 'Nullable', 'Keyed hash used to detect duplicate registrations'],
    ['ReEntryCount', 'TINYINT', 'Not null, default 0', 'Number of re-entries already used'],
    ['IssuedAt, CalledAt, CompletedAt', 'DATETIMEOFFSET', 'Nullable except IssuedAt', 'Time stamps used for the wait and consultation figures'],
    ['RowVersion', 'ROWVERSION', 'Concurrency token', 'Detects two staff changing the same token at once'],
  ] } },
  { p: '{L:ddl} gives the corresponding fragment of SQL for the Token table and its two most important indexes. The unique constraints implement three rules at the database level: no two tokens share a public code, no two tokens of one department share a sequence on one day, and the queue query for one room, day and status can use a covering index. Constraints in the database are the last line of defence if the application code has a defect, and they are therefore declared in addition to the checks in the domain layer. The other tables are summarised in {T:othertables}.' },
  { code: { key: 'ddl', caption: 'Illustrative design-level SQL for the Token table (SQL Server)', text:
`CREATE TABLE dbo.Token (
    Id            BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    PublicCode    CHAR(8)       NOT NULL,
    Sequence      INT           NOT NULL,
    Number        VARCHAR(8)    NOT NULL,
    DepartmentId  INT           NOT NULL REFERENCES dbo.Department(Id),
    RoomId        INT           NOT NULL REFERENCES dbo.Room(Id),
    IssueDate     DATE          NOT NULL,
    Status        TINYINT       NOT NULL DEFAULT 0,
    QueueClass    TINYINT       NOT NULL,
    QueueStamp    DATETIMEOFFSET(0) NOT NULL,
    PhoneCipher   VARBINARY(256) NULL,
    ReEntryCount  TINYINT       NOT NULL DEFAULT 0,
    RowVersion    ROWVERSION    NOT NULL,
    -- remaining columns as in the Token table definition
    CONSTRAINT UQ_Token_PublicCode UNIQUE (PublicCode),
    CONSTRAINT UQ_Token_DaySeq UNIQUE (DepartmentId, IssueDate, Sequence)
);

CREATE INDEX IX_Token_RoomQueue
    ON dbo.Token (RoomId, IssueDate, Status, QueueClass, QueueStamp);` } },
  { table: { key: 'othertables', caption: 'Summary of the other tables', size: 19, widths: [1.5, 3.2, 2.7], headers: ['Table', 'Main columns', 'Constraints and notes'], rows: [
    ['Department', 'Id, Name, Prefix, DefaultConsultMinutes, OpenTime, CloseTime, IsActive', 'Prefix unique; default consultation time seeds the wait estimate'],
    ['Room', 'Id, DepartmentId, Name, DoctorName, IsPaused', 'Foreign key to Department; the pause flag drives the break message'],
    ['ClinicSetting', 'Id, thresholds, grace minutes, re-entries, repeat rule, languages, CreatedAt', 'Rows are never updated; the newest row applies to new tokens'],
    ['StaffUser', 'Id, StaffCode, PinHash, Role, DisplayName, IsActive', 'StaffCode unique; PIN stored only as a salted hash'],
    ['PushSubscription', 'Id, TokenId, Endpoint, P256dh, Auth, CreatedAt', 'Foreign key to Token; deleted with the token data at day end'],
    ['AlertLog', 'Id, TokenId, Threshold, Channel, SentAt, Status', 'Unique on (TokenId, Threshold) so an alert is never sent twice'],
    ['Feedback', 'Id, TokenId, WaitRating, SteppedOut, SubmittedAt', 'Unique on TokenId; holds no name or phone number'],
    ['AuditLog', 'Id, StaffUserId, Action, TokenId, At', 'Append only; no update or delete permission for the application account'],
  ] } },
);
B(
  { p: '**Token state machine rules.** The transitions of {F:state} are enforced by the domain layer, and {T:transitions} lists them with their guards. Every change is written inside a database transaction together with an audit record, and the SignalR notification is sent only after the transaction has been committed, so that a patient page never shows a state that was later rolled back. The queue of a room can be paused, and while it is paused the call operation is refused with a conflict response. The grace period is checked by a small hosted service that scans called tokens at short intervals, which means that a token is marked as missed even if the room staff do not press any button.' },
  { table: { key: 'transitions', caption: 'Token transitions and their guards', size: 19, widths: [1.1, 1.7, 1.1, 3.4], headers: ['From', 'Event', 'To', 'Guard and effect'], rows: [
    ['Waiting', 'Call next', 'Called', 'The queue is not paused and the token is first in the queue order; the call time is stored and the call alert is raised'],
    ['Called', 'Recall', 'Called', 'The call is repeated; the state and the call time stay the same'],
    ['Called', 'Consultation finished or next call', 'Completed', 'The completion time is stored; the service interval is added to the statistics'],
    ['Called', 'Grace period over or no-show marked', 'Missed', 'Allowed only after a call; the recovery page is shown to the patient'],
    ['Called', 'Grace period over, no re-entry left', 'Expired', 'The patient has used the allowed re-entry and must collect a new token'],
    ['Missed', 'Re-queue', 'Waiting', 'Re-entry count is below the limit; the verification code matches; class becomes re-entry and the stamp is the current time'],
    ['Waiting, Called, Missed', 'End of service day', 'Expired', 'Run by the day-end job; personal data of the token is cleared at the same time'],
  ] } },
  { p: '**Queue order and people ahead.** The order of a queue is defined by two keys, the queue class and the queue stamp. A re-entered token has class 0, a priority token class 1 and a regular token class 2, and tokens are sorted by class first and by stamp second. Within a class the stamp is the issue time, so the order is first come, first served, and a re-entered token carries the time of its re-queue. The number of people ahead of a token is the number of tokens of the same room and day that are currently called plus the number of waiting tokens that sort before it, as in {L:ahead}. The called patient is therefore counted, so a patient who is next in line has one person ahead, the patient in the room. This definition is an interpretation of the prototype, in which the next patient on the room console is shown as one ahead, and the figures in the screens are sample data that are not meant to be reconciled with each other.' },
  { code: { key: 'ahead', caption: 'Illustrative design-level query for the number of people ahead', text:
`int PeopleAhead(Token t) =>
    db.Tokens.Count(x =>
        x.RoomId == t.RoomId && x.IssueDate == t.IssueDate &&
        (x.Status == TokenStatus.Called ||
         (x.Status == TokenStatus.Waiting &&
          (x.QueueClass < t.QueueClass ||
           (x.QueueClass == t.QueueClass &&
            x.QueueStamp < t.QueueStamp)))));` } },
  { p: 'The placement of priority tokens and of re-entered tokens is a matter of clinic policy, and the design makes a deliberate choice that must be confirmed. A priority token is placed before all regular tokens but after earlier priority tokens, and a re-entered token is placed after the patient currently in the room, as the recovery screen of the prototype promises. The second rule favours a patient who has already reached the front of the queue once, but it also lets that patient overtake everybody who has been waiting honestly, which is the reason for limiting it to one re-entry and for making it a setting.' },
  { p: '**Estimate of waiting time.** The estimate is based on the recent behaviour of the room and not on a fixed number per patient. The service interval of a room is the time between two successive calls. The server keeps the last ten service intervals of the room for the day, ignores intervals that include a pause, and computes their mean d and their standard deviation s. When fewer than five intervals are available, d is blended with the default consultation time D of the department, so that d = (n × mean + (5 − n) × D) / 5 for n between 0 and 4, and s is taken as half of d. For a patient with k people ahead, the expected wait is E = r + (k − 1) × d, where r = max(d − elapsed, 1) is the remaining time of the patient currently in the room and elapsed is the time since that call, counted without pauses. For k = 0 the wait is zero.' },
  { p: 'Because the service intervals vary, the server returns a range and not a single value. If the intervals are treated as independent, the standard deviation of the sum of k of them is about s × √k, and the range is therefore E − s√k to E + s√k, with the lower end not below zero. For display, both ends are rounded to whole minutes, and to multiples of five minutes when the upper end exceeds twenty minutes, which gives ranges of the kind shown in the prototype, such as 5–9 minutes, 12–18 minutes or 50–65 minutes. The independence assumption is a simplification, and the whole formula is a design proposal whose quality can only be judged against real queue data. {L:estimate} expresses the calculation in pseudo-code.' },
  { code: { key: 'estimate', caption: 'Pseudo-code for the estimate of waiting time (design level)', text:
`function EstimateWait(k, stats, defaultMinutes, elapsedMinutes):
    if k == 0: return Range(0, 0)
    n = min(stats.sampleCount, 5)
    d = (n * stats.mean + (5 - n) * defaultMinutes) / 5
    s = (stats.sampleCount >= 5) ? stats.stdDev : 0.5 * d
    r = max(d - elapsedMinutes, 1)
    expected = r + (k - 1) * d
    spread = s * sqrt(k)
    low  = max(expected - spread, 0)
    high = expected + spread
    return RoundForDisplay(low, high)` } },
  { p: '**Alert engine.** The alert engine decides who must be alerted after every change of a queue. The thresholds are 10, 5 and 2 people ahead, and the call itself is the fourth alert, at zero people ahead. These values are the defaults shown on the clinic setup screen, and they are configurable defaults and not optimal values derived from evidence. The engine runs as a hosted service that is triggered after each committed queue change. {F:alertflow} shows the logic. For every waiting or called token, the engine computes the people ahead and collects the thresholds that have been crossed and not yet logged. If several thresholds were crossed at once, for example because a few patients left the queue together, only one message is sent, for the smallest threshold crossed, and all crossed thresholds are recorded so that older messages are not sent late. When a token is issued with fewer people ahead than a threshold, the thresholds already passed are recorded as skipped and no alert is sent for them.' },
  { fig: { key: 'alertflow', file: 'd-alertflow.png', caption: 'Logic of the alert engine after a queue change', widthCm: 12.5, maxHeightCm: 16 } },
  { p: 'The repeat rule answers the risk, named in the product requirements, that patients miss alerts. If one person is ahead, the page has not been opened since the last alert and no reminder has been sent, the engine sends a reminder. The reminder is also logged, so that the unique key of the alert log prevents duplicates when two queue changes are processed close together. The channel is chosen at sending time: a Web Push message is tried first when an active subscription exists, and the SMS backup is used when there is no subscription, when the push service reports failure, or when the patient has no smartphone and received the link by SMS only. {L:alertcode} gives the same logic in pseudo-code, and {L:interfaces} shows the main interfaces of the application layer.' },
  { code: { key: 'alertcode', caption: 'Pseudo-code for alert selection (design level)', text:
`function OnQueueChanged(room):
    for t in WaitingAndCalledTokens(room):
        ahead = PeopleAhead(t)
        rules = RulesOf(t)                # rule set stored at issue
        crossed = [T for T in rules.thresholds + [0]
                   if ahead <= T and not AlertLog.Exists(t, T)]
        if crossed is not empty:
            T = min(crossed)
            AlertLog.AddAll(t, crossed)   # unique (token, threshold)
            Send(t, MessageFor(T))
        else if rules.repeatAtOne and ahead == 1
                and not AlertLog.Exists(t, 1)
                and not t.PageOpenedSince(LastAlertTime(t)):
            AlertLog.Add(t, 1)
            Send(t, MessageFor(1))
    Publish("queueUpdated", room)             # SignalR groups of the room

function Send(t, message):
    if t.HasPushSubscription and TryWebPush(t, message): return
    if t.HasPhone and rules.smsBackup: SendSms(t, message)` } },
  { code: { key: 'interfaces', caption: 'Illustrative design-level interfaces of the application layer', text:
`public interface IQueueService
{
    Task<TokenCreated> CreateTokenAsync(CreateToken cmd,
                                        CancellationToken ct);
    Task<CalledToken?> CallNextAsync(int roomId, int staffId,
                                     CancellationToken ct);
    Task MarkNoShowAsync(int roomId, int staffId, CancellationToken ct);
    Task RequeueAsync(long tokenId, string code, int staffId,
                      CancellationToken ct);
    Task<PublicStatus?> GetPublicStatusAsync(string publicCode,
                                             CancellationToken ct);
}

public interface IAlertSender
{
    Task<DeliveryResult> SendAsync(AlertMessage m, CancellationToken ct);
}` } },
  { p: '**Missed turn and re-entry.** When a token is called, a five-minute grace timer starts. If the patient does not arrive, the token becomes missed, the patient page switches to the recovery screen and the room moves on to the next patient. The recovery screen tells the patient to go to the registration desk, shows a four-digit desk verification code and states that one re-entry is allowed per token and day. Registration staff see the token in the list of items that need attention, check the code and press the re-queue button, and the server applies the rule of {T:transitions}. The same link then shows the new position, so no new QR code is needed. The grace period, the number of re-entries and the position of the re-entry are settings of the administrator. The verification code prevents a stranger who has found a link from asking staff for a re-entry, but it is not a strong security mechanism, and its details are to be reviewed.' },
  { p: '**Concurrency and real-time delivery.** Two staff members may press the call button almost simultaneously, for example one at the room console and one at a second desk. The call operation therefore runs in a transaction, reads the current and the next token together with their row versions and writes the changes. If another transaction has changed the same rows, EF Core raises a concurrency exception, and the service either repeats the operation once or returns a conflict response, so that one token is never called twice. After a successful commit the hub sends «queueUpdated» to the groups of the affected tokens. The patient page also polls the status route every fifteen seconds when the connection is lost, which is the retry interval shown on the offline screen, so that a missed event does not leave a page stale for long.' },
  { p: '**Security and privacy.** {T:security} summarises the security and privacy measures of the design in addition to the general measures of {T:owasp}. The central principle is data minimisation: the QR code, the link and the public status carry no personal data, and the data that staff need to register a patient is kept only for the service day. The patient name, age and sex are used by staff to identify the person at the desk. The mobile number is stored encrypted only to send SMS, and a keyed hash of it is used to detect duplicate registrations. A day-end job clears these personal fields, deletes push subscriptions and marks unfinished tokens as expired. Feedback is stored without a name, and since the personal data of the token is cleared, the feedback can no longer be traced to a person after the day ends. Which retention period is acceptable depends on the clinic policy and on the data-protection law in force, such as India\'s Digital Personal Data Protection Act, 2023, and this must be reviewed with the clinic before deployment (Government of India, 2023).' },
  { table: { key: 'security', caption: 'Security and privacy measures', size: 20, widths: [1.6, 2.4, 3.4], headers: ['Area', 'Risk', 'Planned measure'], rows: [
    ['Patient link', 'Guessing another patient\'s link', 'Eight random characters from a secure generator (about 1.1 × 10^12 combinations), rate limiting, uniform failure response, expiry at day end'],
    ['QR code and URL', 'Personal data exposed by a lost slip', 'No name, number or clinical data in the code or the address'],
    ['Patient page', 'Identification of a person from the screen', 'No full name; mobile number shown only in masked form; room and department only'],
    ['Mobile number', 'Leak of contact data', 'Encrypted column with a key in Key Vault; hash for duplicate detection; cleared at day end'],
    ['Staff sign-in', 'Stolen or guessed PIN', 'Salted PIN hash, lockout and rate limiting, short-lived JWT, administrator reset'],
    ['Staff actions', 'Misuse or disputes', 'Append-only audit log of token, queue and settings changes'],
    ['Transport and storage', 'Interception, data loss', 'HTTPS with HSTS, TLS to the database, automated backups of Azure SQL'],
    ['Public routes', 'Abuse and automated scanning', 'Rate limiting per address and per code, request size limits, no sequential identifiers'],
  ] } },
  { p: '**Deployment on Azure.** The proposed deployment is shown in {F:deploy}. The ASP.NET Core application and the compiled Angular files are hosted together on Azure App Service, which gives HTTPS, a certificate, deployment slots for a staged release and the ability to add instances. Azure SQL Database stores the data. Azure Key Vault holds the connection string, the keys for encryption and the credentials of the SMS provider and the VAPID keys, and the application reads them through a managed identity, so that no secret is kept in the source code. Application Insights collects telemetry and can raise alerts on failures. When more than one App Service instance is used, Azure SignalR Service is added to coordinate the connections, which is why it is marked as optional. The SMS gateway and the browser push services are external services reached over HTTPS. A continuous integration pipeline that builds the solution, runs the tests and deploys to a staging slot is planned. Nothing in this topology has been created yet, and the choice of Azure is a design decision that matches the skills of the student, not a statement about an existing environment.' },
  { fig: { key: 'deploy', file: 'd-deploy.png', caption: 'Proposed deployment topology on Microsoft Azure', widthCm: 15 } },
);

/* ---------------- 3.3 ---------------- */
B({ h2: 'Web application design' });
B({ p: 'This section presents the design of the web application through the 17 screens of the high-fidelity prototype, which was drawn on a design canvas with a short rationale note beside each screen. **All hospital names, doctors, patients, token numbers, times and statistics in the screens are fictional sample data**, drawn only to show layout and behaviour. They are not records of real people, usage data, measurements or evidence of the performance of the system, and the screens are mock-ups and not output of a running application. For each screen the text states what it shows, the design decision behind it and the requirements it supports.' });

B({ h3: 'Design system and prototype overview' });
B(
  { p: '{F:overview} is the overview board of the prototype. It states the promise of the product, "Wait anywhere nearby. Never miss your turn.", groups the screens by persona (nine patient screens P1 to P9, five staff screens S1 to S5 and two administrator screens A1 and A2) and fixes the visual language used on every other screen. P6, P8 and P9 are failure states that are designed as normal screens and not left as raw errors.' },
  { fig: { key: 'overview', file: '00-Overview.png', caption: 'Prototype overview board with flows, colour roles and typography (mock-up)', widthCm: 15 } },
  { p: 'The palette gives one job to each colour: ink (#0E1726) for text, trail blue (#0A58A8) for actions and progress, a light blue tint (#E7F0FA) for information, amber (#C2570C) for the single moment at which the patient must act (five people ahead), red (#B42318) for a missed turn and green (#157F3B) for completion. The board explains that if everything is urgent, nothing is. Colour is always accompanied by words, which supports NFR-2. Token numbers are set in IBM Plex Mono so that fixed-width digits do not shift as the queue moves, and all other text uses IBM Plex Sans. The stated rules are a minimum text size of 15 px on patient screens, a contrast ratio of at least 4.5 to 1 and touch targets of 48 px. They are design rules, and whether the finished screens satisfy them is a question for the accessibility check of Section 3.4, which has not been carried out.' },
);

B({ h3: 'Patient screens' });
B(
  { p: 'The patient screens are designed for a phone about 390 px wide, opened by the browser after the QR scan. They share one layout: a header with the logo, the hospital and block name and a language switch, a banner that changes with the stage, a token card, an alert track and two help buttons. The happy path runs from P1 to P5 and ends with P7. {F:p1} and {F:p2} show the first two screens.' },
  { figs: { cols: 2, maxHeightCm: 13.5, items: [
    { key: 'p1', file: 'P1-LiveStatus.png', caption: 'P1 Live status after the QR scan (mock-up, sample data)' },
    { key: 'p2', file: 'P2-TenAhead.png', caption: 'P2 Alert at 10 people ahead (mock-up, sample data)' },
  ] } },
  { p: '**P1 Live status.** The screen that opens after the scan answers the three questions of a waiting patient: who is being served, how many are before me, and can I leave. A blue banner answers the last one, "You\'re free to step out", and promises alerts at 10, 5 and 2 people ahead. The token card shows B-047 in large monospaced type with the department chip and the room and doctor, then the token now being served, the people ahead and the estimated wait as a range (50–65 minutes in the sample). The range is deliberate, because a single wrong minute value would destroy trust. The full name is not shown, so a person who holds only the link learns nothing about the patient. The alert track below shows four empty circles labelled 10, 5, 2 and Now that fill from left to right, a green check with the note that alerts are on for this phone with an SMS backup to a masked number, and the time of the last update. Two large buttons offer "Find Room 3" and "Help · Desk 2", and the header switch offers English, Kannada and Hindi. The screen supports FR-6, FR-7, FR-10, FR-19 and NFR-1.' },
  { p: '**P2 Alert at 10 people ahead.** P2 reuses the layout of P1 so that the patient learns nothing new. The information banner becomes a solid blue banner with a bell and the text "10 people ahead of you", with the advice to stay within ten minutes of OPD Block B, and the first marker of the track is filled. The tone is calm because nothing needs to be done yet. The screen supports FR-8. {F:p3} and {F:p4} show the next two alerts, whose banners escalate while the card and track keep their layout.' },
  { figs: { cols: 2, maxHeightCm: 13.5, items: [
    { key: 'p3', file: 'P3-FiveAhead.png', caption: 'P3 Alert at 5 people ahead (mock-up, sample data)' },
    { key: 'p4', file: 'P4-TwoAhead.png', caption: 'P4 Alert at 2 people ahead (mock-up, sample data)' },
  ] } },
  { p: '**P3 Alert at 5 people ahead.** This alert has to change behaviour, so it alone uses amber. The banner reads "5 ahead — start heading back now" and asks the patient to reach Waiting Area B within ten minutes, which rests on the unverified assumption that patients stay within about ten minutes of the OPD. Because amber is used nowhere else its appearance carries meaning, and the words make the message independent of the colour. **P4 Alert at 2 people ahead.** P4 turns the instruction into a location: "2 ahead — please wait near Room 3", with Waiting Area B on the ground floor and a request to keep the screen open. The dark ink banner stands out without suggesting an error. If this page has not been opened, the design repeats the reminder at one person ahead, which answers the product risk that patients miss alerts, and the clinic setup screen has a switch for it. The screens support FR-8 and FR-9.' },
  { p: '{F:p5} and {F:p6} show the call and the recovery path after a missed call.' },
  { figs: { cols: 2, maxHeightCm: 13.5, items: [
    { key: 'p5', file: 'P5-YourTurn.png', caption: 'P5 Your turn, full-screen call (mock-up, sample data)' },
    { key: 'p6', file: 'P6-MissedTurn.png', caption: 'P6 Missed turn and recovery (mock-up, sample data)' },
  ] } },
  { p: '**P5 Your turn.** When the room calls the token, a full-screen blue panel shows "CALLED AT 10:51", the headline "It\'s your turn" and the token number in very large type that can be read at arm\'s length in a busy corridor. A white card says "Go now to Room 3" with the doctor, the department and the position of the room, and a short text states the rule: arrive within five minutes, otherwise the turn moves on and the patient can re-join at Desk 2. The black button "I\'m on my way" tells the room that the patient is coming, which can reduce premature no-show decisions. The prototype notes that it is optional and the first feature to cut if time is short. The screen supports FR-8, FR-12 and FR-14.' },
  { p: '**P6 Missed turn.** A missed turn is treated as a recovery path and not as an error. A pale red card says "You missed your turn" and states the facts: called at 10:51, window ended at 10:56. The card "You haven\'t lost your visit" lists three numbered steps: go to Registration Desk 2, show the screen so that staff place the patient after the patient currently in Room 3, and wait for the page to update, with no new QR code. A dashed box shows a four-digit desk verification code valid until the OPD closes, and a note repeats that one re-entry per token and day is allowed. The re-entry rule is an assumption to be confirmed with the clinic, and this screen has no language switch, a point to review under FR-19. The screen supports FR-12 and FR-13.' },
  { p: '{F:p7} and {F:p8} show the end of the visit and the offline state.' },
  { figs: { cols: 2, maxHeightCm: 13.5, items: [
    { key: 'p7', file: 'P7-Done.png', caption: 'P7 Consultation complete and feedback (mock-up, sample data)' },
    { key: 'p8', file: 'P8-Offline.png', caption: 'P8 Offline with last known status (mock-up, sample data)' },
  ] } },
  { p: '**P7 Done and feedback.** A green card confirms "Consultation complete" with the token, room and time, and three tiles summarise the visit: time issued, total wait and alerts sent ("4 of 4" in the sample). A card marked "Anonymous · 10 sec" asks how the waiting was (Easy, Okay, Difficult) and whether the patient waited outside the waiting hall (Yes mostly, A little, No), with "Send feedback" and a plain "Skip". The screenshot shows one answer selected to illustrate the selected state. The second question is the only honest signal of crowding reduction that needs no sensors, and it feeds the "waited away from hall" figure of the administrator summary. The screen supports FR-18.' },
  { p: '**P8 Offline.** When the connection is lost the page does not turn blank. A grey banner says "You\'re offline" and explains that the screen shows the last known status from 10:24 and that the queue only moves forward, so the place is not lost. The card and track show the last known values and the footer says that the page is retrying every 15 seconds. The design relies on the fact that a stale count errs in the safe direction, because the true number of people ahead can only be smaller, and on the service worker cache and retry logic of Section 3.2.2. The screen supports FR-16 and NFR-5.' },
  { p: '**P9 Expired token** ({F:p9}). A token is valid only on the day of issue. An old or tampered link shows a calendar icon, the headline "This token has expired", the issue date and the rule. A card asks "Visiting today?" and sends the patient to Registration Desk 1 or 2, with the registration hours, and a note covers the case of an incomplete link issued today, which staff can re-send by SMS. A button gives directions to registration. The design points the patient to the desk instead of a dead end, and the same page answers a mistyped code, because the server gives one uniform answer to every failure. The screen supports FR-17.' },
  { figs: { cols: 2, maxHeightCm: 13.5, items: [
    { key: 'p9', file: 'P9-Expired.png', caption: 'P9 Expired or invalid token (mock-up, sample data)' },
  ] } },
);

B({ h3: 'Staff screens' });
B(
  { p: 'The staff screens are designed for a desktop browser at the registration desk and in the doctor\'s room, with the goal of speed at a crowded counter. They share a top bar with the logo, the workplace, the time and the end-shift link. {F:s1} shows the sign-in screen.' },
  { fig: { key: 's1', file: 'S1-Login.png', caption: 'S1 Staff sign-in (mock-up, sample data)', widthCm: 14 } },
  { p: '**S1 Staff sign-in.** A dark left panel shows the hospital, its departments and three facts for the day (registration opening time, departments live, rooms). The form on the right is headed "Sign in to start your shift" and has the staff ID, a six-digit PIN and a "Working at" drop-down for the desk or room, chosen once per shift. A "Start shift" button, a "Forgot PIN? Ask admin" link and a count of signed-in devices complete it. One sign-in serves desk, room and admin roles and the role decides the landing screen, so staff do not learn several entry points. The screen supports FR-1 and NFR-6.' },
  { p: '{F:s2} shows the registration desk, the busiest screen of the system.' },
  { fig: { key: 's2', file: 'S2-QueueDesk.png', caption: 'S2 Registration desk with token form and live queue (mock-up, sample data)', widthCm: 15 } },
  { p: '**S2 Registration desk.** The "New token" form is designed to be filled in four fields followed by Enter: department and room, patient name, an optional mobile number with the age, and the visit type (new or review). A check box marks a priority patient under the OPD policy, a line shows the next token number and its estimated wait, and a large button reads "Create token & show QR". Below, a "Needs attention" panel lists a missed token with a re-queue button and a patient without a smartphone with a resend-SMS button, so that staff do not have to search the list for exceptions. On the right are four summary tiles, department tabs with waiting counts and the live queue table, in which each row shows token, patient, age and sex, visit type, issue time, alerts sent and a status chip such as "In Room 3", "Next up", "2 ahead", "5 ahead" or "10 ahead", so staff can see who has already been warned. Priority patients carry a badge. The table shows age and sex although the form shows only age, so sex capture must be added to the form or removed from the list. The screen supports FR-2, FR-3, FR-5, FR-13 and FR-15. {F:s3} and {F:s4} show what follows the button press.' },
  { fig: { key: 's3', file: 'S3-TokenCreated-crop.png', caption: 'S3 Token created with QR code (mock-up, cropped, sample data)', widthCm: 14 } },
  { p: '**S3 Token created.** A card appears over a dimmed background. The left half shows the QR code at a large size with "Ask the patient to scan", the short link and the note "Opens in any phone camera. No app, no login." The right half confirms "Token created" with the time, shows B-053 in large type, the patient name, age and sex, the department, room and visit type, tiles for people ahead and estimated wait, a confirmation that the link was sent by SMS to a partly masked number, and buttons "Print slip (P)" and "Next patient (Enter)". The link uses a placeholder domain, and the QR pattern in the mock-up is drawn for layout only. The name appears on this staff screen but, by design, never in the QR code or on the patient page. The screen supports FR-4 and FR-5.' },
  { fig: { key: 's4', file: 'S4-TokenSlip.png', caption: 'S4 Printed token slip for an 80 mm printer (mock-up, sample data)', widthCm: 4.6 } },
  { p: '**S4 Token slip.** Patients without a smartphone receive a slip on an 80 mm thermal printer. It shows the hospital and desk, "YOUR TOKEN" and the number in very large type, the department, room, date and issue time, the QR code and three plain steps: scan to see the live queue, wait nearby and expect alerts at 10, 5 and 2 ahead, and, without a smartphone, receive alerts by SMS or ask at the desk. The footer says that the slip is valid today only with one re-entry if missed. It carries no patient name, so a lost slip reveals nothing about the person, and it is black and white for the thermal printer. The screen supports FR-4. {F:s5} shows the doctor\'s room console.' },
  { fig: { key: 's5', file: 'S5-RoomConsole.png', caption: 'S5 Doctor\'s room console with the call-next action (mock-up, sample data)', widthCm: 15 } },
  { p: '**S5 Doctor\'s room console.** Every press of "Call next" drives every patient alert, and the product fails if the button is not pressed on time, which is the delayed-update risk of the product requirements. The screen is therefore dominated by one large action, "Complete B-046 and call next", which names the next patient and has the shortcut N. Above it, a card shows the patient in the room with a running timer. Three secondary buttons give "Recall" (R), "Mark no-show" (M) and "Pause queue (break)" (P), and a sentence explains that pausing tells waiting patients that the place is held and stops the wait estimate from counting down. The right column lists the next five patients with their alert state (for example "Page open · 1 ahead"), shows day figures and an activity log that includes the line that a patient tapped "On my way". The screen supports FR-11, FR-12, FR-14 and FR-22.' },
);

B({ h3: 'Administrator screens' });
B(
  { p: 'The administrator screens use a dark sidebar with the entries Daily summary, Live queues, Clinic setup and Staff and devices; only the summary and the setup screens are part of the prototype, and the other two entries are placeholders for future work. {F:a1} shows the daily summary.' },
  { fig: { key: 'a1', file: 'A1-DailySummary.png', caption: 'A1 Daily summary dashboard (mock-up, sample data)', widthCm: 15 } },
  { p: '**A1 Daily summary.** The controls choose a date and department and export CSV. Four tiles show tokens issued, the average wait from token to call with median and longest, the share of patients who waited away from the hall, and the missed-turn rate, and each maps to a success metric of the product requirements. A bar chart shows tokens per hour, a second chart shows the missed-turn rate over six OPD days, and a table gives the same figures by department. A footnote makes an important caveat: "waited away from hall" comes from the optional feedback of P7, so it reflects only the patients who answered (97 of 212 in the sample). All figures, including the falling trend in the chart, are sample numbers drawn to show the layout, and they are not results. The screen supports FR-20. {F:a2} shows the clinic setup.' },
  { fig: { key: 'a2', file: 'A2-Settings.png', caption: 'A2 Clinic setup with departments, alert rules and turn rules (mock-up, sample data)', widthCm: 15 } },
  { p: '**A2 Clinic setup.** The subtitle states that changes apply to tokens issued after saving and that live tokens keep the rules of today, which is why each token stores a reference to its rule set. The first card lists departments and rooms with prefix, doctor, default consultation time, hours and status (one department is off today). "Patient alerts" holds the thresholds 10, 5 and 2 and switches for the repeat reminder and the SMS backup. "Turn rules" holds the grace period, the re-entries per token, the re-entry position, the token validity and the patient languages, where English is fixed and Kannada, Hindi and Tamil can be switched. The rules are settings and not code, so a clinic can tune them without a new release, and the thresholds of this report are only defaults. The screen supports FR-8, FR-9, FR-13, FR-19 and FR-21. {T:traceability} summarises which screens satisfy which requirements.' },
  { table: { key: 'traceability', caption: 'Traceability between screens and functional requirements', size: 20, widths: [1.2, 5.6], headers: ['Screen', 'Functional requirements'], rows: [
    ['P1 to P4', 'FR-6, FR-7, FR-8, FR-9, FR-10, FR-19'],
    ['P5, P6', 'FR-8, FR-12, FR-13, FR-14'],
    ['P7, P8, P9', 'FR-18, FR-16, FR-17'],
    ['S1, S2', 'FR-1, FR-2, FR-3, FR-5, FR-13, FR-15'],
    ['S3, S4, S5', 'FR-4, FR-5, FR-11, FR-12, FR-14, FR-22'],
    ['A1, A2', 'FR-20, FR-21, FR-8, FR-9, FR-13, FR-19'],
  ] } },
);

/* ---------------- 3.4 ---------------- */
B({ h2: 'Verification plan' });
const tcStaff = [
  ['Valid staff sign-in (FR-1)', 'Enter a valid staff ID, the correct PIN and a desk; repeat for a room user.', 'A JWT is issued; the desk user lands on the registration desk and the room user on the call-next console.'],
  ['Wrong PIN and lockout (FR-1, NFR-6)', 'Enter a wrong PIN repeatedly until the configured limit is reached.', 'Sign-in is refused with a generic message; the account is locked for the configured time; each failure is logged.'],
  ['Create a token (FR-2, FR-3, FR-4)', 'Choose General Medicine, enter a name, a valid mobile number and an age, visit type new.', 'The next token number of the department is issued with a unique public code; a QR link is shown; an SMS is queued.'],
  ['Create a token without a mobile number (FR-2)', 'Create a token and leave the mobile field empty.', 'The token is created, no SMS is queued, and the QR code and the slip are still available.'],
  ['Token numbers under concurrency (FR-3)', 'Two desks create tokens for the same department at the same moment.', 'The two tokens receive different consecutive numbers; the unique constraint is never violated.'],
  ['Priority token (FR-15)', 'Create a priority token while several regular tokens wait.', 'The token has the badge and sorts before regular tokens and after earlier priority tokens; people-ahead values of others are updated.'],
  ['Call next (FR-11)', 'Press call next in a room that has a current patient and waiting patients.', 'The current token becomes completed, the next one becomes called, and all pages of the room update.'],
  ['Simultaneous call next (FR-11, NFR-5)', 'Send two call-next requests for the same room at the same time.', 'Exactly one succeeds; the other is repeated once or refused with a conflict; no token is called twice.'],
  ['Recall (FR-11)', 'Press recall for the current token.', 'The call is repeated to the patient; the state and the call time are unchanged.'],
  ['Pause and resume (FR-11)', 'Pause the queue, try to call next, then resume.', 'Call next is refused while paused; waiting pages show the break message and the estimate stops counting down; after resume the normal behaviour returns.'],
  ['Missed turn by grace period (FR-12)', 'Call a token and take no action for longer than the grace period.', 'The token becomes missed automatically; the patient page shows the recovery screen; the room moves on.'],
  ['Re-queue once (FR-13)', 'Re-queue a missed token with the correct verification code, then miss the call again and try to re-queue again.', 'The first re-queue places the token after the current patient; after the second miss the token is expired and a further re-queue is refused with a conflict.'],
  ['Wrong verification code (FR-13)', 'Try to re-queue a missed token with a wrong code.', 'The request is refused and logged; the token stays missed.'],
];
const tcPatient = [
  ['Scan a valid QR code (FR-6)', 'Open the link of a waiting token on a phone.', 'The page shows the token, the token now being served, the people ahead and a wait range; the response contains no full name.'],
  ['Live update without refresh (FR-7)', 'Call next at the room console while a patient page is open.', 'The page updates without a manual refresh within the target time.'],
  ['Milestone alerts in a long queue (FR-8)', 'Simulate a queue of at least 12 tokens and move it step by step.', 'Alerts are produced at 10, 5, 2 and at the call, each exactly once, and the alert log holds one row per threshold.'],
  ['Several thresholds crossed at once (FR-8)', 'Remove several tokens at once so that a token moves from 12 to 4 ahead.', 'Only the 5-ahead message is sent; the 10-ahead alert is recorded as superseded and is not sent late.'],
  ['Token issued close to the front (FR-8)', 'Create a token when only 3 people are ahead.', 'No alert is sent at creation; the thresholds already passed are recorded as skipped; the 2-ahead alert is sent later.'],
  ['Repeat reminder (FR-9)', 'Reach one person ahead once with the page not opened and once with the page opened.', 'A reminder is sent in the first case and not in the second.'],
  ['Push permission denied (FR-10)', 'Deny notifications and let the queue reach a threshold.', 'The SMS backup is sent and the alert log shows the SMS channel.'],
  ['Push delivery failure (FR-10)', 'Delete the push subscription at the push service and trigger an alert.', 'The failure is detected and the SMS backup is used.'],
  ['Duplicate scan (FR-6)', 'Open the same link on two phones.', 'Both show the same status; only the latest push subscription is kept; the alerts are not duplicated.'],
  ['Offline state (FR-16)', 'Switch the phone to flight mode while the page is open, then restore the network.', 'The offline banner with the last known time is shown; after restoration the page retries and shows the current status.'],
  ['Expired and invalid links (FR-17)', 'Open a link of the previous day and a random code.', 'The expired page is shown for both with the same response shape; repeated attempts are rate limited.'],
  ['I am on my way (FR-14)', 'Tap the button after the call, and try it before the call.', 'The room console shows the tap after the call; before the call the request is refused.'],
  ['Feedback (FR-18)', 'Submit both answers on one token, and skip on another.', 'The submitted answers are stored without a name; skipping stores nothing.'],
  ['Language switch (FR-19)', 'Switch between English, Kannada and Hindi on the status screens.', 'All texts change; the token numbers stay unchanged; no text is cut off.'],
];
const tcAdmin = [
  ['Daily summary values (FR-20)', 'Load a known set of tokens into a test database and open the summary.', 'The tiles, charts, department table and the CSV file equal the values calculated by hand.'],
  ['Settings apply to new tokens only (FR-21)', 'Change the thresholds and save, then create a new token.', 'The new token uses the new thresholds and tokens issued before keep the old ones.'],
  ['Role authorisation (NFR-6)', 'Call an admin route with a registration user and a room-staff route with a patient link.', 'Both requests are refused with 403 or 401 and are logged.'],
  ['Rate limiting (NFR-6)', 'Send many requests to a public route from one address.', 'Requests above the limit receive 429 with a retry time.'],
  ['Day-end job (NFR-7)', 'Run the job on a test database that has unfinished tokens.', 'Unfinished tokens become expired; names, ages, phone data and push subscriptions are cleared.'],
  ['Accessibility check (NFR-2)', 'Run an automated checker and a manual keyboard and screen-reader pass on P1 to P9, S2 and S5.', 'No failures against WCAG 2.1 level AA; contrast at least 4.5 to 1; touch targets at least 48 px.'],
  ['Usability with volunteers (NFR-1)', 'Ask volunteers who role-play patients to scan, say how many people are ahead and say whether they may leave.', 'Task success and comments are recorded honestly; problems found are listed for the next iteration.'],
  ['Load smoke test (NFR-3, NFR-12)', 'Open several hundred simulated patient pages and move a queue.', 'Updates reach the pages within the target time and no errors are logged.'],
];
const tcTotal = tcStaff.length + tcPatient.length + tcAdmin.length;
let tcNo = 0;
const tcRows = (list) => list.map((r) => ['TC-' + String(++tcNo).padStart(2, '0'), r[0], r[1], r[2], 'Planned']);
const tcHeaders = ['ID', 'Scenario', 'Steps or input', 'Expected result', 'Status'];
const tcWidths = [0.7, 1.7, 2.3, 2.6, 0.9];
B({ h3: 'Test strategy' });
B(
  { p: 'This section is a plan, and not a report of tests. Because the system has not been built, none of the tests below has been executed, and the plan records what will be checked and how once the build exists. The project plan states the rule that governs this section: evidence must come from real runs, and nothing may be filled in speculatively. For that reason the status of every test case in this chapter is "Planned", and there is no column for actual results. The execution of the plan awaits the build, and the results will be recorded in the final report of the implemented system.' },
  { p: 'The strategy uses several levels of testing. Unit tests check the pure rules of the domain layer without a database: the token state machine, the queue order, the estimate of waiting time and the selection of alerts. Integration tests run the application layer and the Web API against a test SQL Server database, and they check constraints, transactions, concurrency, authorisation and the SignalR notifications. Component tests check the Angular screens against a simulated API, and browser-based end-to-end tests drive the real screens through the main journeys from token creation to feedback. The simulation of a queue of at least twelve tokens, moved step by step, is the main test of the alert timing, as the project plan requires.' },
  { p: 'Non-functional checks complete the strategy. A security pass checks the measures of {T:owasp} and {T:security}, including role checks, rate limiting and the behaviour of public routes for invalid codes. An accessibility check against WCAG 2.1 level AA (W3C, 2018) combines an automated checker with a manual pass with the keyboard and a screen reader, and verifies contrast and the size of touch targets. A usability test with volunteers will follow. Real clinic patients and staff are probably not available for a student project, so the volunteers will role-play patients and staff, and the report will say so openly and will not present their comments as the opinion of clinic users. A small load test with simulated pages checks the behaviour of the live updates. Compatibility is checked on a few common mobile browsers and screen sizes.' },
);
B({ h3: 'Planned test cases' });
B(
  { p: 'The plan contains ' + tcTotal + ' test cases. {T:tcstaff} covers the staff modules (sign-in, token creation, queue control and the missed-turn path), {T:tcpatient} covers the patient page and the alert engine including the edge cases, and {T:tcadmin} covers the administration and the non-functional checks. The edge cases required by the design are the missed turn (TC-11 to TC-13), the offline state (TC-23), the expired token (TC-24), the duplicate scan (TC-22), the priority token (TC-06) and the paused queue (TC-10). Expected results describe the intended behaviour of the design, and they will be compared with the observed behaviour only when the tests are run.' },
  { table: { key: 'tcstaff', caption: 'Planned test cases for the staff modules', size: 17, widths: tcWidths, headers: tcHeaders, rows: tcRows(tcStaff) } },
  { table: { key: 'tcpatient', caption: 'Planned test cases for the patient page and the alert engine', size: 17, widths: tcWidths, headers: tcHeaders, rows: tcRows(tcPatient) } },
  { table: { key: 'tcadmin', caption: 'Planned test cases for administration and non-functional checks', size: 17, widths: tcWidths, headers: tcHeaders, rows: tcRows(tcAdmin) } },
  { p: 'Each test case will receive an entry in a test log when it is executed, with the date, the build version, the observed result and, where a failure occurs, a defect report. A test case is regarded as passed only when the observed result equals the expected result. The plan will be revised when the clinic confirms or changes the assumptions listed in Chapter 2, because several expected results, such as the placement of a re-entered token, depend on them.' },
);

/* =====================================================================
   4  CONCLUSION
   ===================================================================== */
B({ h1: 'Conclusion' });
B(
  { p: 'This report has documented the theoretical background and the design of TokenTrail, a smart virtual queue for government clinics. The starting point was a simple observation: patients wait in crowded halls because they have no reliable way to know when their turn is near. The proposed system separates the position in the queue from the place of waiting. Staff create a token, a QR code opens a live page, and alerts at 10, 5 and 2 people ahead and at the call bring the patient back on time. The report explained the concepts behind this idea, derived 22 functional and 12 non-functional requirements, and described the technologies chosen to meet them: ASP.NET Core, SQL Server with Entity Framework Core, Angular as a progressive web app, SignalR, Web Push and SMS, QR codes and a layered security design.' },
  { p: 'The practical part described the application as a whole and its server side in detail: a clean-architecture solution, a REST and SignalR interface, a relational schema with the rules enforced by constraints, a token state machine, an ordering rule for priority and re-entered tokens, an estimate of waiting time that returns a range, an alert engine that avoids duplicate and late messages, a security and privacy design based on minimal data, and a proposed deployment on Azure. The web application was presented through 17 prototype screens, in which the failure states (a missed turn, no network and an expired token) are designed as carefully as the happy path. A verification plan with ' + tcTotal + ' planned test cases completes the work.' },
  { p: '**Limitations.** The most important limitation is the status of the work: TokenTrail is a design and a high-fidelity prototype, and it has not been built, deployed, load tested or used by any patient or staff member. The screens show fictional sample data, so they say nothing about real waiting times or about the effect of the system on crowding. The assumptions of the design have not been validated with real users. These include the alert channel, namely browser push with an SMS backup, whose delivery on real devices is unknown, and the rule that a missed patient may re-enter once after the current patient, which has to be agreed with the clinic because it lets one patient overtake others. The thresholds of 10, 5 and 2 people ahead, the five-minute grace period and the wait-estimate formula are configurable defaults chosen for plausibility, and they are not optimal values derived from evidence. The prototype also contains small gaps that the final design must close, such as the missing language switch on some screens, the sex field that appears in the lists but not in the form, and the two navigation entries of the administrator area that have no screen.' },
  { p: '**Lessons learned from the design process.** Designing before building taught several lessons. The first is that failure states deserve screens of their own: an offline page, an expired link and a missed-turn recovery path are the places where trust in the system is won or lost, and drawing them early exposed rules, such as the single re-entry, that would otherwise have been decided in the middle of coding. The second is that the sample data in a prototype should be generated from the data model, because several numbers in the screens, for example the people ahead compared with the token numbers, do not reconcile exactly, and a seed script for the real system will remove this ambiguity. The third is that the rules a clinic may want to change, such as the thresholds and the grace period, belong in settings and not in code, and the design of the database with versioned settings follows from that. The fourth is that privacy is easier to design in than to add later, and the decision to keep every personal field out of the QR code and the public page simplified the security design. Finally, writing every assumption down, with the screen or requirement it affects, turned a vague uncertainty into a list that can be checked.' },
  { p: '**Future enhancements.** The immediate next step is to build the system in the five increments of Section 2.9, starting with the thin slice in which staff create a token, the QR code opens the live page and the page follows the queue. After the build, the verification plan of Section 3.4 should be executed and its results recorded as evidence. The next step is a small field trial with clinic staff, in which the assumptions about alerts, re-entry and thresholds are confirmed or changed. The trial should measure the success metrics of the product requirements: the physical crowd at peak hours, the idle waiting time of patients, the missed-turn rate and the satisfaction of patients and staff. Later enhancements include a screen for live queues and for staff and devices, a cancel function for tokens, a display board in the waiting hall, further languages such as Tamil, an integration with the hospital management system, support for several hospitals, and a better estimate of waiting time that learns from the history of each doctor, provided that the data collected in the trial justifies it.' },
);

B({ references: [
  'Angular Team (Google), Angular documentation, https://angular.dev, accessed November 2026.',
  'Beck, K. et al., Manifesto for Agile Software Development, https://agilemanifesto.org, 2001.',
  'Fielding, R. T., Architectural Styles and the Design of Network-based Software Architectures, Doctoral dissertation, University of California, Irvine, 2000.',
  'Government of India, The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023), Ministry of Law and Justice, 2023.',
  'International Organization for Standardization and International Electrotechnical Commission, ISO/IEC 18004:2024 Information technology, Automatic identification and data capture techniques, QR code bar code symbology specification, ISO/IEC, 2024.',
  'Jones, M., Bradley, J. and Sakimura, N., JSON Web Token (JWT), RFC 7519, Internet Engineering Task Force, 2015.',
  'Kleinrock, L., Queueing Systems, Volume 1: Theory, Wiley, 1975.',
  'Little, J. D. C., A Proof for the Queuing Formula L = λW, Operations Research, 9(3), pp. 383-387, INFORMS, 1961.',
  'Maister, D. H., The Psychology of Waiting Lines, in Czepiel, J. A., Solomon, M. R. and Surprenant, C. F. (eds.), The Service Encounter, Lexington Books, 1985.',
  'Martin, R. C., Clean Architecture: A Craftsman\'s Guide to Software Structure and Design, Prentice Hall, 2017.',
  'Microsoft, ASP.NET Core documentation (including SignalR, authorization and rate limiting), Microsoft Learn, https://learn.microsoft.com/aspnet/core, accessed November 2026.',
  'Microsoft, Azure SQL Database documentation, Microsoft Learn, https://learn.microsoft.com/azure/azure-sql, accessed November 2026.',
  'Microsoft, Entity Framework Core documentation, Microsoft Learn, https://learn.microsoft.com/ef/core, accessed November 2026.',
  'Nielsen, J., Usability Engineering, Academic Press, 1993.',
  'OWASP Foundation, OWASP API Security Top 10, 2023 edition, https://owasp.org/API-Security, 2023.',
  'OWASP Foundation, OWASP Top 10, 2021 edition, https://owasp.org/Top10, 2021.',
  'Pressman, R. S. and Maxim, B. R., Software Engineering: A Practitioner\'s Approach, 9th edition, McGraw-Hill Education, 2019.',
  'Royce, W. W., Managing the Development of Large Software Systems, Proceedings of IEEE WESCON, 1970.',
  'Schwaber, K. and Sutherland, J., The Scrum Guide, https://scrumguides.org, 2020.',
  'Sommerville, I., Software Engineering, 10th edition, Pearson, 2016.',
  'Thomson, M. and Beverloo, P., Voluntary Application Server Identification (VAPID) for Web Push, RFC 8292, Internet Engineering Task Force, 2017.',
  'Thomson, M., Damaggio, E. and Raymor, B., Generic Event Delivery Using HTTP Push, RFC 8030, Internet Engineering Task Force, 2016.',
  'Thomson, M., Message Encryption for Web Push, RFC 8291, Internet Engineering Task Force, 2017.',
  'World Wide Web Consortium (W3C), Web Content Accessibility Guidelines (WCAG) 2.1, W3C Recommendation, https://www.w3.org/TR/WCAG21/, 2018.',
] });

/* =====================================================================
   Resolve cross references, check order, export
   ===================================================================== */
(function finish() {
  const defs = {}; const defIndex = {};
  let ch = 0, f = 0, t = 0, l = 0;
  body.forEach((b, i) => {
    if (b.h1 !== undefined) { ch++; f = 0; t = 0; l = 0; }
    if (b.fig) { f++; defs[b.fig.key] = `Fig. ${ch}.${f}`; defIndex[b.fig.key] = i; }
    if (b.figs) for (const it of b.figs.items) { f++; if (it.key) { defs[it.key] = `Fig. ${ch}.${f}`; defIndex[it.key] = i; } }
    if (b.table) { t++; if (b.table.key) { defs[b.table.key] = `Table ${ch}.${t}`; defIndex[b.table.key] = i; } }
    if (b.code) { l++; if (b.code.key) { defs[b.code.key] = `Listing ${ch}.${l}`; defIndex[b.code.key] = i; } }
  });
  const re = /\{([FTL]):(\w+)\}/g;
  const firstRef = {};
  body.forEach((b, i) => {
    const texts = [];
    if (b.p) texts.push(b.p);
    if (b.bullets) texts.push(...b.bullets);
    if (b.numbered) texts.push(...b.numbered);
    for (const s of texts) { let m; re.lastIndex = 0; while ((m = re.exec(s))) if (firstRef[m[2]] === undefined) firstRef[m[2]] = i; }
  });
  for (const k of Object.keys(defs)) {
    if (firstRef[k] === undefined) console.warn('[content] never referenced in prose: ' + k);
    else if (firstRef[k] >= defIndex[k] && !(firstRef[k] === defIndex[k])) console.warn('[content] referenced after it appears: ' + k);
    else if (firstRef[k] === defIndex[k]) console.warn('[content] referenced only inside own block: ' + k);
  }
  const conv = (s) => s.replace(re, (m, a, k) => { if (!defs[k]) { console.warn('[content] unknown ref ' + m); return m; } return defs[k]; }).replace(/«/g, '`').replace(/»/g, '`');
  const walk = (o, key) => {
    if (typeof o === 'string') return key === 'text' ? o : conv(o);
    if (Array.isArray(o)) return o.map((x) => walk(x));
    if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o)) r[k] = walk(o[k], k); return r; }
    return o;
  };
  module.exports.body = walk(body);
  module.exports.abstract = conv(abstract);
  module.exports.acknowledgement = acknowledgement.map(conv);
})();

module.exports.title = 'TOKENTRAIL SMART VIRTUAL QUEUE FOR GOVERNMENT CLINICS';
module.exports.student = { name: '[[PAVAN GOKUL]]', regNo: '[[REGISTER NUMBER]]' };
module.exports.guide = { name: '[[GUIDE NAME]]', designation: '[[Designation, Department]]' };
module.exports.institution = ['[[DEPARTMENT NAME]]', '[[INSTITUTION NAME]]', '[[CITY - PINCODE]]'];
module.exports.monthYear = 'NOVEMBER 2026';
module.exports.period = { from: '[[START DATE]]', to: '[[END DATE]]' };
module.exports.hod = '[[HOD NAME]]';
module.exports.figuresDir = path.resolve(__dirname, '../figures');
