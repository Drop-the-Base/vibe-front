Prompt — Scope, goals, and plan (Product/Tech lead)
- Intent: Translate UKNF brief into actionable backlog and phases (Auth, Messaging, Entities, FAQ, Library, Admin, Announcements, Reports).
- Context: Original brief (this repo), existing code under frontend/src/pages/*, backend/src/main/java/com/example/uknf/*.
- Do: Produce a 1‑page plan with milestones, success criteria, and risks
 confirm React + Spring Boot + SQL Server stack
 list core endpoints and UI screens.
- Accept: Plan stored in README.md with milestones and success criteria.

Prompt — Repository health check and run scripts (DevOps)
- Intent: Ensure contributors can run FE/BE quickly.
- Context: frontend/package.json, backend/pom.xml, docker/.
- Do: Verify npm run dev and ./mvnw spring-boot:run work
 add .env.example for FE/BE
 document ports and API_BASE_URL (frontend/src/shared/config/environment.ts).
- Accept: Cold start to dev server ≤ 2 minutes, documented in README.

Prompt — Routing and navigation skeleton (Frontend)
- Intent: Provide base layout with top nav, sidebar, breadcrumbs, protected routes.
- Context: frontend/src/App.tsx, frontend/src/pages/*, frontend/src/components/ui/*.
- Do: Define routes for Dashboard, Messages, Entities, FAQ, Library, Reports, Admin/Users, Announcements
 add basic breadcrumb component.
- Accept: Navigating between pages works
 placeholder content present.

Prompt — API client and error envelope (Frontend)
- Intent: Centralize fetch with typed errors.
- Context: frontend/src/shared/api/api-client.ts.
- Do: Implement ApiError, JSON parsing, error message extraction
 support GET/POST/PATCH/PUT/DELETE and base URL resolution
 prepare hooks for auth headers.
- Accept: 4xx/5xx produce readable ApiError messages.

Prompt — DataTable with filters, sort, export (Frontend)
- Intent: Reusable data grid for lists (Entities, Messages, etc.).
- Context: frontend/src/components/DataTable.tsx, frontend/src/shared/export/*.
- Do: Add text/select/date/daterange filters, sticky headers, client sort, pagination, export to CSV/XLSX/JSON, and actions column.
- Accept: Component renders and exports in demo pages without errors.

Prompt — Entities backend scaffolding (Backend)
- Intent: CRUD endpoints and DTO mapping for supervised entities.
- Context: backend/src/main/java/com/example/uknf/entities/SupervisedEntity.java, repositories, services, controllers/SupervisedEntityController.java.
- Do: Add DTOs, mapping, validation (NIP/KRS/email/phone), and Flyway table migration
 return flat DTOs to avoid lazy loading issues.
- Accept: Basic CRUD works
 invalid inputs return 400 with error envelope.

Prompt — Entities frontend page with create/edit/delete (Frontend)
- Intent: Full Entities UI with modal forms and validation.
- Context: frontend/src/pages/Entities.tsx, frontend/src/features/entities/*.
- Do: Wire list to backend, implement create/edit dialog, delete confirmation, client validation, and notifications.
- Accept: Creating, editing, deleting entities updates list
 errors surface via toasts.

Prompt — FAQ backend: search, tags, rating (Backend)
- Intent: Expand FAQ features.
- Context: backend/src/main/java/com/example/uknf/controllers/Faq*Controller.java, related entities/services.
- Do: Add endpoints for search (keyword/category/tag) and answer rating (1–5), with anti‑abuse (basic rate limiting by IP/time window).
- Accept: Queries filter results
 rating updates stored.

Prompt — FAQ frontend: filters and rating (Frontend)
- Intent: Usable FAQ page with discovery and feedback.
- Context: frontend/src/pages/FAQ.tsx.
- Do: Add search box, tag chips, sort by popularity/newest, and star rating UI that POSTs rating.
- Accept: Interactions feel responsive
 empty states clear.

Prompt — Library backend: upload/list/download (Backend)
- Intent: Managed file repository with metadata and streaming downloads.
- Context: backend/src/main/java/com/example/uknf/controllers/FileController.java, services/FileStorageService.java.
- Do: Ensure multipart upload, metadata retrieval, and streamed downloads with Content-Disposition are implemented and tested.
- Accept: Upload and download verified via curl/Postman.

Prompt — Library frontend integration (Frontend)
- Intent: File list with upload and download actions.
- Context: frontend/src/pages/Library.tsx, frontend/src/shared/api/api-client.ts.
- Do: Render table with filters, show upload progress, call download endpoint and save file.
- Accept: Files appear after upload
 downloads open/save correctly.

Prompt — Messages DB and endpoints (Backend)
- Intent: Persist messages with threads, direction, status, read timestamps.
- Context: backend/src/main/resources/db/migration/*messages*.sql, entities/Message.java, controllers/MessageController.java, services/MessageService.java.
- Do: Create table (id, threadId, subject, body, sender/recipient, roles/types, direction, status, readAt, created/updated, hasAttachments)
 implement list/create/byThread/read‑toggle.
- Accept: Endpoints return DTOs
 basic validations applied.

Prompt — Messages page: list and detail (Frontend)
- Intent: User‑friendly inbox‑like view.
- Context: frontend/src/pages/Messages.tsx, frontend/src/shared/api/messages/index.ts.
- Do: Render table with filters, open detail in dialog, mark read optimistically, and show content with metadata.
- Accept: Clicking a row opens detail
 read indicator updates.

Prompt — Compose message modal (Frontend)
- Intent: Create new messages quickly.
- Context: frontend/src/pages/Messages.tsx.
- Do: Add modal with fields (subject, to, content), optimistic insert on success, and clean form state
 wire to POST /messages.
- Accept: New message appears in list
 validation messages visible.

Prompt — Reply flow polish (Frontend)
- Intent: Correct “Re:” behavior and prefill.
- Context: frontend/src/pages/Messages.tsx.
- Do: Ensure reply pre‑fills subject with “Re: …” once, flips recipient, and quotes original with from/to/date.
- Accept: No syntax/runtime errors
 compose opens prefilled.

Prompt — Replace plain‑text auth with hashed passwords (Backend)
- Intent: Remove insecure findByEmailAndPassword path.
- Context: backend/src/main/java/com/example/uknf/services/AuthService.java, repositories/UserRepository.java, config/PasswordConfig.java.
- Do: Add PasswordEncoder (BCrypt) bean
 switch to findByEmail + passwordEncoder.matches
 add migration to hash kowalski demo user.
- Accept: /auth/login works with hashed demo credentials
 code compiles.

Prompt — Registration endpoint (Backend)
- Intent: Allow self‑service registration for external users.
- Context: backend/src/main/java/com/example/uknf/controllers/AuthController.java, services/AuthService.java, dtos/users/RegisterRequest.java.
- Do: Add POST /auth/register validating uniqueness, hashing password, assigning default role, and returning UserDetails.
- Accept: 201 on success
 409 on duplicates
 consistent error envelope.

Prompt — JWT access and refresh (Backend)
- Intent: Stateless session security.
- Context: backend/src/main/java/com/example/uknf/services/JwtService.java, entities/RefreshToken.java, repositories/RefreshTokenRepository.java, controllers/AuthController.java, application.yml.
- Do: Issue { accessToken, refreshToken, tokenExpiresAt } on login/register
 add /auth/refresh and /auth/logout with DB‑backed refresh tokens
 secrets via config.
- Accept: Valid refresh rotates tokens
 invalid returns 401.

Prompt — Spring Security config (Backend)
- Intent: Protect APIs while keeping auth endpoints open.
- Context: backend/src/main/java/com/example/uknf/config/SecurityConfig.java.
- Do: Stateless security, JWT filter, permit /auth/**, protect /api/** and other controllers.
- Accept: Unauthenticated requests to protected routes return 401.

Prompt — Frontend auth client and interceptors (Frontend)
- Intent: Attach tokens and auto‑refresh on expiry.
- Context: frontend/src/shared/api/api-client.ts, frontend/src/features/auth/services/auth-client.ts, frontend/src/features/auth/state/auth-provider.tsx.
- Do: Inject Authorization: Bearer headers
 on 401 with token expiry, call /auth/refresh once and retry
 store access in memory, refresh in localStorage.
- Accept: Silent refresh works exactly once
 second failure logs out.

Prompt — Route guards and session restore (Frontend)
- Intent: Keep users signed in across reloads.
- Context: frontend/src/App.tsx, frontend/src/features/auth/state/auth-provider.tsx, frontend/src/features/auth/routes/Login.tsx, routes/Register.tsx.
- Do: Protect private routes
 restore session via refresh token on app boot
 show loading splash while restoring
 enhance login/register UX with inline errors.
- Accept: Reload keeps session
 unauthenticated users redirected to /login.

Prompt — Attachments storage strategy (Backend)
- Intent: Support binary attachments with scalable storage.
- Context: backend/src/main/resources/db/migration/*, entities/MessageAttachment.java, services/AttachmentService.java.
- Do: Add VARBINARY(MAX) column content and checksum to message_attachments
 retain filesystem storage_path for large files
 add config app.attachments.storeInDbMaxBytes.
- Accept: Small files saved to DB
 large files to disk
 checksum recorded.

Prompt — Attachment service streaming and checksum (Backend)
- Intent: Efficient, resilient uploads/downloads.
- Context: backend/src/main/java/com/example/uknf/services/AttachmentService.java, controllers/MessageController.java.
- Do: Stream uploads, compute SHA‑256
 stream downloads from DB or disk using InputStreamResource
 set Content-Disposition and Content-Type.
- Accept: Large downloads do not spike heap
 headers correct.

Prompt — Attachment endpoints (Backend)
- Intent: Complete REST surface.
- Context: backend/src/main/java/com/example/uknf/controllers/MessageController.java.
- Do: POST /messages/{id}/attachments (multipart), GET /messages/{id}/attachments (metadata), GET /messages/attachments/{attachmentId} (download), DELETE /messages/{id}/attachments/{attachmentId} (soft delete + audit).
- Accept: Endpoints return proper status codes
 metadata excludes blob.

Prompt — Compose modal: multi‑file UX (Frontend)
- Intent: Intuitive attachments UX.
- Context: frontend/src/pages/Messages.tsx, frontend/src/shared/api/messages/attachments.ts.
- Do: Support drag‑drop and multi‑select, chips with name/size and remove, size limits (25MB per file, 100MB total), per‑file upload progress.
- Accept: Files validated and uploaded
 UI updates on success/error.

Prompt — Message detail: attachments preview/download (Frontend)
- Intent: Quick look for PDFs/images.
- Context: frontend/src/pages/Messages.tsx.
- Do: Show attachment list with Preview (object URLs for images/PDFs) and Download buttons
 revoke URLs on close.
- Accept: Previews render
 downloads open/save as expected.

Prompt — Message audit trail (Backend)
- Intent: Basic traceability.
- Context: backend/src/main/resources/db/migration/*message_audit*.sql, services/*.
- Do: Add message_audit table
 log upload/download/delete/read with actor and timestamps
 non‑blocking on failure.
- Accept: Audit rows present for the above events.

Prompt — Admin Users DTO and CORS (Backend)
- Intent: Stable admin list and dev UX.
- Context: backend/src/main/java/com/example/uknf/controllers/UserController.java.
- Do: Ensure /users returns flat DTOs
 enable CORS for localhost dev ports.
- Accept: Admin Users table loads in FE without serialization/CORS errors.

Prompt — Announcements API and UI
- Intent: Broadcast messages with read receipts.
- Context: Backend controllers/AnnouncementsController.java (new), Frontend frontend/src/pages/Announcements.tsx.
- Do: CRUD endpoints with target audience (all/groups) and per‑user read receipts
 FE list with unread badges and mark‑as‑read.
- Accept: Unread counts accurate
 read status persisted.

Prompt — Reports listing + download
- Intent: Demo downloadable reports.
- Context: Backend controllers/ReportController.java, Frontend frontend/src/pages/Reports.tsx.
- Do: List reports with metadata and stub download (static file ok for demo).
- Accept: FE lists and downloads reports.

Prompt — Dashboard polish
- Intent: Show useful at‑a‑glance info.
- Context: frontend/src/pages/Dashboard.tsx.
- Do: Display last login, security indicators, new messages/announcements
 handle nulls gracefully.
- Accept: No console errors
 data humanized.

Prompt — Backend tests (H2 + MockMvc)
- Intent: Confidence without external DB.
- Context: backend/src/test/java/*.
- Do: Add H2 test profile, run Flyway, and write tests for /auth/login, /auth/refresh, attachments upload/download, messages read toggle.
- Accept: ./mvnw test green locally and in CI profile.

Prompt — Frontend tests (RTL)
- Intent: Regressions on key flows.
- Context: frontend/src test setup.
- Do: Add tests for auth provider session restore/guards and Messages compose with multiple files clearing state after send.
- Accept: npm run test passes locally.

Prompt — Docker Compose and envs (DevOps)
- Intent: Reproducible local demo.
- Context: docker/compose.yml, backend/src/main/resources/application.yml, .env files.
- Do: Add SQL Server service, volumes, healthchecks
 wire Spring datasource
 document env vars and startup steps.
- Accept: One‑command bring‑up for DB + backend
 FE configured to talk to backend.

Prompt — OpenAPI docs and README
- Intent: Discoverability and handover.
- Context: Springdoc config, README.md.
- Do: Enable Swagger UI and group endpoints
 add screenshots/GIFs of Messages compose, attachments preview/download, and dashboard
 document all env vars and manual QA script.
- Accept: /swagger-ui reachable
 README shows clear run/test instructions.


### prompts used with codex in VS Code

working on a project on hackaton event here are some rules i will use english language for coding and communication even if some parts are in polish when asked about code generation, generate code at first then provide short explanation code should be clean and as concise as possible use keep-it-super-simple methodology i will provide task context in next prompts


Got it. I’ll wait for your task details.

Maintaining the Q&A database ensures: − Possibility to ask and receive answers to questions and view anonymized questions with answers (so-called. Knowledge base FAQ), in particular: − Adding new questions anonymously. Questions should have fields: title, content, category, labels, date added, status. − adding answers to questions by the UKNF Employee, − management of questions and answers - the possibility of modifying or removing questions/answers, changing the content, status and other fields by the UKNF Employee or the System Administrator, − categorisation of questions and answers – grouping into categories, − support for labels (tags) for better filtering, − assessment of responses (e.g. asterisks 1-5), − search by keyword, title, content, category or label. − sorting the results by: popularity, date added, ratings. − filtering by category, tags, response status. Handling the file of entities and updating information on supervised entities ensures: − the possibility of maintaining information on supervised entities in the form of an Entity File in the system, in particular: − adding and modifying data on the entity supervised by the System Administrator and the UKNF Employee, in accordance with the structure of: Nave fields type Description ID bigint Type of entity nvarchar(250) The role of the entity in the Entity Database, e.g. a loan institution UKNF code nvarchar(250) code generated in the Entity Database, uneditable, Name of the entity nvarchar(500) lei nvarchar(20) NIP nvarchar(10) KRS nvarchar(10) Street nvarchar(250) Building number nvarchar(250) Number of the premises nvarchar(250) Postcode nvarchar(250) City nvarchar(250) Telephone nvarchar(250) A string of numbers and characters defining the phone number. Verification of the correctness of the phone number taking into account the international format (eg. /^+(?:[0-9] ?){6,14}[0-9]$/) E-mail nvarchar(500) E-mail address containing the @ character UKNF registration number nvarchar(100) Identification number assigned in the UKNF register Entity status nvarchar(250) The status of the entity in the Entity Database, e.g. Entered, Deleted Category of entity nvarchar(500) Name of the entity category in the Entity Database Sector of the operator nvarchar(500) Name of the Entity Sector in the Entity Database Entity sub-sector nvarchar(500) Name of the entity sub-sector in the Operators Database Cross-border entity bit checkbox checked/unchecked Date of creation datetime2(7) Date of update datetime2(7) − reviewing the history of changes in data about the entity, − a preview of detailed data of the entity supervised by the System Administrator and the UKNF Employee, − preview of the list of all Users of the Entity assigned in the system to a given Entity Supervised by the Entity Administrator, the System Administrator and the UKNF Employee, − a preview of the details of the entity by external Users assigned to the entity in order to be able to verify the compliance of the data with the facts and report a change in the registration data (name of the entity, address data, telephone, e-mail) in the event of non-compliance or change in their change, through a case with the category "Change of registration data" (the report generates a new case). Updating information on supervised entities (entity data updater service) provides: − the possibility of updating data on supervised entities (registration data) cooperating with the UKNF contained in the Entities Database, in order to store reliable information about entities and their relationships and history of changes, in particular: − updating the data on the entity supervised by an authenticated Administrator of the Supervised Entity using the change form made available in the system (Name of the entity, Address: street, postcode and city Telephone, E-mail). − versioning of changes in data about the entity - stored historical data, available for inspection by the PFSA Employee, − verification of updated data by the UKNF Employee and after correct verification recording them in the Entity Database, − scheduling, for alerts cyclically appearing during external user access sessions with confirmation of current data of the supervised entity. Functions of the Authentication and Authorization Module The module is designed to enable: ➢ registration of external users via an online form, ➢ handling access requests with assigning permissions to external users, ➢ selection of the entity represented in the session by an authenticated external user. Description of the function The registration of external users shall ensure: − registration of external users via the online form, in particular: − registration of external users (Administrators of the Supervised Entity, Employee of the Supervised Entity), − creation of an account by an external user via an online form (mandatory fields: First name, Last name, PESEL [masked, last 4 digits visible], phone, e-mail), − sending a link to activate the account to the users e-mail address and setting the users password to the system in accordance with the adopted policy of creating passwords in the system. The handling of access requests shall ensure: − handling access requests with granting/removing the right to individual system functions for the selected entity with the possibility of updating them and adding annexes, in particular: − after the correct activation of the user account in the system (registration), automatic generation of the request for access with the status "Working", − editing of the access request by the entity’s representative, mandatory fields: First name, Last name, PESEL [masked, visible last 4 digits], phone number, e-mail downloaded from the form when registering the user, − adding powers within a given Supervised Entity by selecting in the application, by the Internal User, from the list of entities (list of entities made available by the UKNF - Directory of Entities) supervised entities with which it will be associated and which will represent the so-called line of powers, − assigning the permission requested by the user by marking the permission in checkboxes, e.g. permissions: Reporting, Cases, Entity Administrator, − supplementing the e-mail address of the Supervised Entity, which will result in assigning the given e-mail address to the selected Entity and sending automatic e-mail notifications to this address, e.g. in the case of sending a report by the Employee of the Supervised Entity, − after the access request has been validated by the external user, the message confirming the submission of the request and the change of the status of the request from ‘Rollover’ to ‘New’ is displayed, − sending an automatic confirmation of submitting an access request to the e-mail address of the external user indicated during registration, − acceptance of the application for access by an employee of the UKNF (for the Administrator of the Supervised Entity) or by the Administrator of the Supervised Entity (for the Employee of the Supervised Entity), − after accepting the access request, display a message confirming the acceptance and change of the status of the request from "New" to "Accepted", − possibility to mark statuses of applications. Application statuses: Status Importance Working a request that has not yet been submitted for acceptance New an application that has been completed and submitted for approval Accepted request where all lines of allowances have been accepted Blocked request where all permission lines have been blocked Updated a proposal that has been modified and is awaiting re-acceptance − the ability of the UKNF Employee to communicate with an external user via electronic messages available at the level of the access request. For example, when verifying an access request in the event of an irregularity, the UKNF Employee may create and send a message to an external user asking for clarifications, with the possibility of adding attachments, − the possibility of displaying in the form of a list of all applications registered in the system by the UKNF Employees and filtering them based on quick filters: ‘My Entities’ (applications of entities assigned to ‘My Entities’ with a UKNF Employee), ‘Requires UKNF Actions’ (applications that require UKNF approval), ‘Handled by UKNF’ (applications that are or have been handled by UKNF), − the possibility of displaying in the form of a list of registered applications of the Supervised Entity by the Administrator of this Supervised Entity, − preview the history of the access request, the possibility to view the history of changes, − preview by the UKNF Employee of the permission line of external users, − blocking the rights of the Administrator of the Entity Supervised by UKNF Employees. Blocking the rights of the Entity Administrator will result in the Administrator losing access to the system. If the entity for which the Administrator has been blocked is assigned a second / different Administrator of the entity, it will be able to continue to accept and manage access requests of other users assigned to this entity. Blocking the Administrator of the Supervised Entity by the UKNF will not modify or block the rights of other users of the entity to whom the blocked Administrator accepted the rights. If for the entity in which the Administrator has been blocked, the second/other Administrators of the entity will not be accepted, then the modification and acceptance of the rights for the other users of the entity will require the acceptance of the UKNF, − management by the Administrator of the Supervised Entity of the rights of the Employees of the Supervised Entity, including the possibility of modifying the rights of the Employees of the Supervised Entity in the scope, access to the Reporting modules (access / lack of access), Cases (access / lack of access), assigned Entities and access to the system (the possibility of blocking access to the system) only in the scope of the entity to which the Administrator of the Supervised Entity has rights. The selection of the entity represented in the session shall ensure: − Selection, by an authenticated external user, of the entity represented in the session, i.e. in theselection of the entity to which the external user has assigned permissions, − displaying on further navigation screens information in which context and role the user works. Functions of the Administrative Module The module is designed to enable: ➢ management of internal and external user accounts by UKNF employees with the role of system administrator, ➢ management of password policy in the system, ➢ managing the roles of internal and external users. Description of the function The management of user accounts by UKNF Employees ensures: − management of internal and external user accounts by UKNF employees with the role of System Administrator, in particular: − adding/editing/deleting internal and external user accounts, − setting passwords for internal and external user accounts. Management of password policy in the system ensures: − managing passwords affecting their security, consistency and compliance with security requirements within the organisation, in particular: − the ability to set the complexity of the password (length, uniqueness), the frequency of change and the length of the history (preventing the reuse of the last passwords), − the ability to manually force a password change for selected users. Managing the roles of internal and external users ensures: access management, where permissions are assigned to roles and roles are assigned to users, in particular: − creating roles in the system, − configuration of permissions for roles, − assigning internal and external users to roles, − View and update roles. B.Specification of non-functional requirements 1. File management • Uploading files of different formats • Support for large files using chunked upload • Possibility to compress/decompress ZIP files • Preparing the system to use an external virus scanning service • Sharing files with other users • Managing File Permissions • Hierarchical directory system • Versioning of files • File metadata • Search by metadata and content 2. Security 2.1 Data security • Encryption of sensitive data • Communication Encryption (HTTPS) • Validation of input data • Protection against common attacks (CSRF, XSS, SQL Injection) • Secure password storage 2.2 Audit and Login • Tracking user activity • Logging security events • Anomaly detection 3. Performance and scalability 3.1 Optimization of performance • Caching of data (cache) • Lazy loading for lists and large data sets • Pagination of results • Optimization of database queries 4. Documentation 4.1 API documentation • Swagger/OpenAPI • Description of all REST endpoints • Examples of requests and responses 4.2 Technical documentation • README file with installation and configuration instructions • Diagram of Entity Relationships • System architecture documentation • Instructions for implementation (deployment) 4.3 User documentation • User manual for the portal 5. Implementation and start-up 5.1 Container environment • Docker Compose to run all components • Connected services (frontend, backend, database, queue system) 5.2 Configuration • Parameterization by environmental variables • External configuration files C.Specification of the expected technological stack 1. Introduction This document specifies the technology stack of the user-to-user communication and file transfer portal. The portal will be built on the basis of Open Source technologies in accordance with modern programming standards as a SPA (Single Page Application) type application. with backend architecture based on REST API. 2. System architecture 2.1 General architecture The system will consist of the following layers: • Frontend: SPA application responsible for the user interface • Backend: REST API supporting business logic and data access • Database: Relational database storing system data • The queuing system: Processing of asynchronous operations 3. Technologies 3.1 Frontend 3.1.1 Framework • Angular 20.x 3.1.2 Component libraries • PrimeNG using one of the default themes • Tailwind CSS 3.1.3 UI/UX requirements • Compatibility: Support for the latest versions of browsers (Chrome, Firefox, Safari, Edge) • Responsiveness: Adaptation to different devices (computer, tablet, smartphone) • Availability: Compliant with WCAG 2.2 standard, the ability to switch the interface to high contrast mode • Typography: Clear fonts and appropriate text sizes 3.2 Backend - Java version 3.2.1 Platform • OpenJDK 21 3.2.2 Framework • Spring Boot 3.5 or later 3.2.3 ORM • Hibernate 6.x or higher 3.2.4 Architecture • REST API • CQRS (Command Query Responsibility Segregation) • Dependency Injection 3.2.5 Validation • Bean Validation (JSR 380) • Spring Validation 3.3 Backend - .NET version 3.3.1 Platform • .NET 8 or .NET 9 (LTS or latest) 3.3.2 Framework • ASP.NET Core Web API 3.3.3 ORM • Entity Framework Core (EF Core) 3.3.4 Architecture • REST API • CQRS (Command Query Responsibility Segregation) • Dependency Injection (built-in DI container in .NET Core) 3.3.5 Validation • FluentValidation (suggested) • System.ComponentModel.DataAnnotations (alternative) 3.4 Database • MS SQL Server or other relational database 3.5 The queuing system • Apache Kafka or RabbitMQ (if used) 3.6 Containerisation • Docker with docker-compose.yml/compose.yml 3.7 Operating system (production environment) • Linux • Windows 4. Security 4.1 Authentication and authorization • OAuth 2.0 / OpenID Connect • JWT (JSON Web Token) D.Specification of a standardised software development process using AI models Purpose of the document: The aim of the document is to standardize the process of software development using AI models, ensuring: • Efficiency (accelerating development), • Repeatability (maintaining consistent practices), • Quality (minimizing errors and technological debts), • Security (conscious use of generated code). 1. Prerequisites 1.1. Environment • List of supported IDEs (e.g. Cursor AI, IntelliJ AI Assistant, VSCode with Copilot etc.) • Required plugins / extensions • Versions of tools • Configuration of LLM (e.g. LLM) OpenAI GPT-4o, Claude, Local LLM) 2. Good practices of prompting 2.1. Structure of prompt • Context (e.g. language, framework, architecture) • Task (to be performed) • Expectations (output, format, style, tests) 2.2. Examples of prompts • ‘Write a function in Python to parse CSV, with unit tests in pytest’ • ‘Propose folder structure for Spring Boot application with REST API layer and PostgreSQL integration’ 2.3. Advanced Prompts • Refactoring • Generic code production • Creating documentation from code • Diagnosis of errors 3. Stages of development with AI 3.1. Planning • Generating functional specification based on prompt • Automatic creation of backlog / user stories 3.2. Design • Creating class/component schemas • Architecture: microservices, monolith, DDD • UML/diagrams (converted to code) 3.3. Coding • Generating the project skeleton • Extending functionality step by step • Integration with existing code (contextual AI hints) 3.4. Testing • Generating unit tests, integration tests • Coverage by tests – Coverage analysis prompts 3.5. Documentation • Generate README, diagrams, changelogs • Creation of inline documentation (e.g. Javadoc, docstrings) 3.6. Refactoring and maintenance • AI proposals for refactoring • Search code smell and architectural errors • Comparing versions and suggesting changes Attachments E. prototypes of selected low-detail screens, showing the main components of the UI of the application, and prototypes of selected forms that can be helpful in building the UI for the forms covered by the task ---> separated file (“E. prototypes of selected low- detailed screens”) F. test data of supervised entities, to be imported ---> separated file (“F. test data of supervised entities”) G. test report files with incorrect and correct data ---> separated files („G.RIP100000_Q1_2025” and „G.RIP100000_Q2_2025”) Download here: Prompt2Co


Thanks for the context. Let me know the first task you’d like me to tackle.

what are the next steps in this project
backend and frontend where initially created


Next Steps

Map domain: finalize entities, relationships, and workflows for Q&A, entity management, access control
 confirm data model gaps using provided test datasets.
Backend foundation: set up CQRS structure, define aggregate roots, commands/queries, DTOs
 split modules (Q&A, Entities, Auth) and draft REST contracts (Swagger stub).
Frontend alignment: scaffold Angular feature modules/pages for Q&A, Entities, Access Requests
 wire routes, shared services, and Tailwind/PrimeNG theming per prototypes.
Security/auth: choose OAuth/OIDC provider, define roles/permissions matrix, design JWT claims propagation to UI.
File services: design upload workflow, chunking API, metadata schema, and placeholder integration with external AV scanning.
Ops/doc: create docker-compose skeleton, baseline README/setup guide, and start architecture diagrams documenting interactions.
Let me know which area to dive into first.

what is the current status of the application


help me integrate frontend and backend to create simple meassages


// backend/src/main/java/com/example/uknf/messages/MessageController.java
@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class MessageController {
    private final MessageService service


    public MessageController(MessageService service) {
        this.service = service

    }

    @GetMapping
    public List<MessageResponse> list() {
        return service.findAll().stream().map(MessageResponse::from).toList()

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse create(@RequestBody @Valid MessageCreateRequest request) {
        return MessageResponse.from(service.create(request))

    }
}
// backend/src/main/java/com/example/uknf/messages/MessageService.java
@Service
@Transactional
public class MessageService {
    private final MessageRepository repository


    public MessageService(MessageRepository repository) {
        this.repository = repository

    }

    @Transactional(readOnly = true)
    public List<Message> findAll() {
        return repository.findAllOrdered()

    }

    public Message create(MessageCreateRequest request) {
        var message = new Message()

        message.setSubject(request.subject())

        message.setContent(request.content())

        message.setSender(request.sender())

        message.setRecipient(request.recipient())

        return repository.save(message)

    }
}
-- backend/src/main/resources/db/migration/V3__messages.sql
CREATE TABLE messages (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    subject NVARCHAR(200) NOT NULL,
    content NVARCHAR(2000) NOT NULL,
    sender NVARCHAR(100) NOT NULL,
    recipient NVARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
)


INSERT INTO messages (subject, content, sender, recipient)
VALUES
    (NPowitanie, NWitamy w systemie komunikacji UKNF., NUKNF, NWszyscy uzytkownicy),
    (NPrzypomnienie, NProsmy o uzupelnienie brakujacych danych sprawozdan., NUKNF, NAdministratorzy podmiotow)

// frontend/src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? http://localhost:8080


export interface MessagePayload {
  subject: string

  content: string

  sender: string

  recipient: string

}

export interface MessageDto extends MessagePayload {
  id: number

  createdAt: string

}

export async function fetchMessages(): Promise<MessageDto[]> {
  const response = await fetch(${API_BASE_URL}/api/messages)

  return handleResponse<MessageDto[]>(response)

}

export async function createMessage(payload: MessagePayload): Promise<MessageDto> {
  const response = await fetch(${API_BASE_URL}/api/messages, {
    method: POST,
    headers: { Content-Type: application/json },
    body: JSON.stringify(payload),
  })

  return handleResponse<MessageDto>(response)

}
// frontend/src/pages/Messages.tsx
const loadMessages = async () => {
  try {
    setLoading(true)

    setError(null)

    const data = await fetchMessages()

    setMessages(data)

  } catch (err) {
    setError(err instanceof Error ? err.message : Nie udalo sie pobrac wiadomosci)

  } finally {
    setLoading(false)

  }
}


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (submitting) return


  const { subject, content, sender, recipient } = form

  if (!subject || !content || !sender || !recipient) {
    toast.error(Uzupelnij wszystkie pola, aby wyslac wiadomosc.)

    return

  }

  try {
    setSubmitting(true)

    const created = await createMessage(form)

    setMessages((prev) => [created, ...prev])

    setForm(initialForm)

    toast.success(Wiadomosc zostala wyslana.)

  } catch (err) {
    toast.error(err instanceof Error ? err.message : Nie udalo sie wyslac wiadomosci.)

  } finally {
    setSubmitting(false)

  }
}

Added a minimal message domain with entity, repository, service, controller, and DTOs to expose /api/messages for listing and creating messages, plus Flyway migration to bootstrap the table (backend/src/main/java/com/example/uknf/messages/…:1, backend/src/main/resources/db/migration/V3__messages.sql:1).
Frontend now calls the backend through a small API client and renders live data with a simple compose-and-send form tied to the same endpoint (frontend/src/lib/api.ts:1, frontend/src/pages/Messages.tsx:1).
I did not run automated tests because the backend currently expects a locally running SQL Server instance
 spin up SQL Server (or adjust the datasource) before executing ./mvnw test and front npm run dev. Next items you might want to handle: 1) wire real auth headers once the security layer is ready, 2) extend the message table with read/attachment flags to match the original UI.

how to test it?


Testing Options

Manual API check: start SQL Server locally, run ./mvnw spring-boot:run from backend
 use curl http://localhost:8080/api/messages (GET) and curl -X POST ... with JSON body to verify list/create paths in backend/src/main/java/com/example/uknf/messages/MessageController.java:1.
Frontend smoke: set VITE_API_BASE_URL=http://localhost:8080, run npm run dev inside frontend, open /messages, confirm table loads server data and form posts new entries.
Automated backend test: add a Spring @SpringBootTest using H2/Testcontainers to avoid SQL Server, mock Flyway migrations, assert MessageService round-trip
 current setup requires SQL Server, so configure test datasource or add Testcontainer.
E2E/API tests: create Postman/Insomnia collection or write REST-assured tests hitting /api/messages with expected 201/400 responses.
Once the database strategy is chosen, run the relevant command (./mvnw test, npm run test if you add React tests).

integragte login functionality frontend with backend


how to enable codex to read and modify files


Codex reads files automatically
 to let it save edits, set the sandbox to allow writing (e.g. workspace-write covers files in the current project).
Make sure you’ve shared the repo or directory you want changed (so it’s inside cwd/writable roots).
If the harness prompts for approval on write commands, grant it when asked
 continual denials will keep edits read-only.
For commands outside allowed scopes or requiring elevation, approve the escalation request when Codex sends it, or adjust config.toml to a less restrictive mode (danger-full-access) if you’re comfortable with that risk.
what are the requirements concerning files


Keep edits ASCII unless the file already uses other characters and there’s a clear reason to match them.
Write concise, purposeful comments only when they clarify non-obvious code
 skip boilerplate explanations.
Never roll back existing user edits
 work around unrelated changes instead of reverting them.
If unexpected modifications appear while you’re working, stop and ask how to proceed.
requirements concerning files in the project


Use ASCII by default
 only mirror non-ASCII when a file already relies on it and matching is necessary.
Add comments sparingly and only when they explain non-obvious logic
 don’t restate what the code already makes clear.
Leave existing user edits untouched—even in untouched files
 adapt around them instead of reverting.
If you notice unexpected changes you didn’t make, pause and ask how to proceed before continuing.
create table for holding messages according to requirements


create table for holding messages


-- backend/src/main/resources/db/migration/V4__messages_enhanced.sql
CREATE TABLE dbo.messages (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    thread_id UNIQUEIDENTIFIER NOT NULL,
    entity_ref NVARCHAR(100) NULL,
    subject NVARCHAR(200) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    sender NVARCHAR(200) NOT NULL,
    sender_role NVARCHAR(100) NULL,
    sender_type NVARCHAR(50) NOT NULL,
    recipient NVARCHAR(200) NOT NULL,
    recipient_role NVARCHAR(100) NULL,
    recipient_type NVARCHAR(50) NOT NULL,
    direction NVARCHAR(20) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    has_attachments BIT NOT NULL DEFAULT 0,
    reply_to_id BIGINT NULL,
    read_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
)


CREATE TABLE dbo.message_attachments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    message_id BIGINT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    content_type NVARCHAR(100) NULL,
    file_size BIGINT NOT NULL,
    storage_path NVARCHAR(500) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_message_attachments_message
        FOREIGN KEY (message_id) REFERENCES dbo.messages (id) ON DELETE CASCADE
)

Added Flyway migration defining messages and message_attachments tables with fields for threads, roles, direction, status, read tracking, and attachment metadata (backend/src/main/resources/db/migration/V4__messages_enhanced.sql:1).
Introduced backend support for the new schema: entity mapping (backend/src/main/java/com/example/uknf/messages/Message.java:1), repository (…/MessageRepository.java:1), service (…/MessageService.java:1), controller (…/MessageController.java:1), and DTOs (…/messages/dto/MessageCreateRequest.java:1, …/MessageResponse.java:1).
Next: run Flyway (e.g. ./mvnw spring-boot:run) against SQL Server to create the tables
 update the frontend API client once you’re ready to swap from mock data.

move messagescontroller to controlles


Moved MessageController into the central controllers package. The class now lives at backend/src/main/java/com/example/uknf/controllers/MessageController.java:1 with the correct package declaration and imports pointing back to MessageService and the messaging DTOs. No other files touched.

how does it work when i call api on /messages


Request Flow

GET /messages: Spring routes into MessageController.list(), which asks MessageService.findAll() for data. The service hits MessageRepository.findAllOrdered() (a JPA repository) that queries table messages sorted by created_at DESC, then each entity is turned into MessageResponse
 you get JSON array with message meta (thread id, sender/recipient, status, etc.).
GET /messages/thread/{uuid}: same path but filtered
 controller passes the UUID to MessageService.findByThread(), the repository runs findByThreadIdOrderByCreatedAtAsc, returning the conversation chronologically
 responses are mapped identically.
POST /messages: controller validates the JSON body (MessageCreateRequest) and calls MessageService.create(). The service normalises defaults (thread UUID, direction/status, sender/recipient types, attachment flag) then saves a new row via JPA. MessageResponse.from(...) reflects the persisted state (including generated ID/timestamps/defaults) in the response with HTTP 201.
Data Layer

Entities map to SQL Server table dbo.messages created in backend/src/main/resources/db/migration/V6__messages_enhanced.sql:1, featuring columns for thread tracking, roles/types, direction/status, attachment flag, timestamps, etc.
Spring Data/JPA handles the actual SQL
 defaults like created_at/updated_at come from entity lifecycle hooks and DB defaults.
CORS/Frontend

Controller is annotated with @CrossOrigin allowing calls from the dev frontend (http://localhost:5173). Frontend clients just fetch or axios against /api/messages with the appropriate JSON.
So, hitting /messages will walk through controller -> service -> repository -> database, then back through DTO mapping to deliver the JSON payload.

changes were refactored, do you see the changes?


At the moment Git shows no tracked changes (git diff is empty), so I don’t see any differences recorded after the refactor. If you still have modified or new files that you expect me to review, you may need to stage them or let me know which specific files to look at.

they were changed in last commit


Yes—the last commit reorganized the messaging stack:

backend/src/main/java/com/example/uknf/controllers/MessageController.java:1 now imports the service and DTOs from the new services and dtos.messages packages.
The DTOs were moved into backend/src/main/java/com/example/uknf/dtos/messages/MessageCreateRequest.java:1 and .../MessageResponse.java:1, with their package declarations updated accordingly.
The JPA entity lives under backend/src/main/java/com/example/uknf/entities/Message.java:1, and the repository is in backend/src/main/java/com/example/uknf/repositories/MessageRepository.java:1.
The service ended up in backend/src/main/java/com/example/uknf/services/MessageService.java:1, importing the renamed entity/repository/DTO classes.
A placeholder DTO (SupervisedEntityCreateRequest) appeared in backend/src/main/java/com/example/uknf/dtos/supervisedEntities/SupervisedEntityCreateRequest.java:1.
Functionality didn’t change—just package structure and imports to keep concerns grouped by layer.

ok great
now lets modify frontend so that it uses our database with messages
lets start with creating only new messagesand saving them to the database


Hooked the compose dialog up to the backend create endpoint so new messages persist: frontend/src/pages/Messages.tsx:20 now pulls useAuth, calls createMessage, handles loading state, and replaces the old mock-only submit logic with toast feedback and API error handling.
Added a small TS client for the endpoint at frontend/src/shared/api/messages/index.ts:1, exposing createMessage plus DTO types so future reads can share the same contract.
You can verify by running the backend (./mvnw spring-boot:run) and the frontend (npm run dev)
 submitting a message in the compose modal should hit /api/messages, then appear at the top of the table.

[plugin:vite:import-analysis] Failed to resolve import "../lib/auth-context" from "src/pages/Messages.tsx". Does the file exist?

E:/vibe-front/frontend/src/pages/Messages.tsx:23:24

30 | import { ScrollArea } from ../components/ui/scroll-area

31 | import { Separator } from ../components/ui/separator

32 | import { useAuth } from ../lib/auth-context

| ^
33 | import { createMessage } from ../shared/api/messages

34 | import { ApiError } from ../shared/api/api-client


at TransformPluginContext._formatLog (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42499:41)
at TransformPluginContext.error (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42496:16)
at normalizeUrl (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40475:23)
at async file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40594:37
at async Promise.all (index 13)
at async TransformPluginContext.transform (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40521:7)
at async EnvironmentPluginContainer.transform (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42294:18)
at async loadAndTransform (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:35735:27)
at async viteTransformMiddleware (file:///E:/vibe-front/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:37250:24
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.

fix this error


Fixed Import Path

Updated frontend/src/pages/Messages.tsx:20 to pull useAuth from the new auth barrel (../features/auth) instead of the removed ../lib/auth-context, matching the project’s refactor.
Vite resumes building because the import now resolves.
You’re set to continue testing
 just reload the dev server if it hasn’t picked up the change yet.

no static route api/messages


Updated the API base resolver so an empty VITE_API_URL no longer falls back to the frontend origin. The logic in frontend/src/shared/config/environment.ts:1 now trims the env value and, if it’s blank, reverts to the default http://localhost:8080, preventing requests from hitting Vite’s static server (no static route api/messages). Restart npm run dev so Vite picks up the change, and keep the backend running on 8080 (or set VITE_API_URL to the correct URL) to avoid further routing issues.

is fronted api consistent with backend?


The client models line up with the backend contract:

MessageController.create() returns MessageResponse (backend/src/main/java/com/example/uknf/dtos/messages/MessageResponse.java:1), which exposes id, threadId, entityRef, subject, content, sender, senderRole, senderType, recipient, recipientRole, recipientType, direction, status, hasAttachments, replyToId, createdAt, updatedAt, and readAt. frontend/src/shared/api/messages/index.ts:1 describes the same fields in MessageDto (UUIDs/longs come across as strings/numbers, so no mismatch).

MessageService.create() consumes MessageCreateRequest (backend/src/main/java/com/example/uknf/dtos/messages/MessageCreateRequest.java:1) with the same properties the frontend sends via CreateMessagePayload (subject, content, sender, recipient, optional role/type/direction/status flags, attachments flag, reply/thread references).

So their shapes are consistent. The only gap is that the UI still seeds localMessages from mocks, so listing messages isn’t backed by /api/messages yet—but the API definitions themselves match.

api is not consistent - the api for posting message is /messages


Adjusted the frontend message client (frontend/src/shared/api/messages/index.ts:1) so createMessage posts to /messages, matching the backend controller’s @RequestMapping("/messages").
With this correction the frontend and backend routes are aligned
 no more /api/messages mismatch when sending new messages.
Refresh the dev server after rebuilding to pick up the change.

PS E:\vibe-front\frontend> npm run dev

Communication Platform Demo@0.1.0 dev
vite

VITE v6.3.5 ready in 217 ms

➜ Local: http://localhost:3000/
➜ Network: use --host to expose
➜ press h + enter to show help
21:06:09 [vite] (client) Pre-transform error: × Expression expected
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:132:1]
129 │ })

130 │
131 │ const newMessage: MessageType = {
132 │ id: created.id != null ? created.id.toString() : ,
· ─
133 │ subject: created.subject,
134 │ from: created.sender,
135 │ to: created.recipient,
╰────

Caused by:
Syntax Error
Plugin: vite:react-swc
File: E:/vibe-front/frontend/src/pages/Messages.tsx
21:06:09 [vite] Internal server error: × Expression expected
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:132:1]
129 │ })

130 │
131 │ const newMessage: MessageType = {
132 │ id: created.id != null ? created.id.toString() : ,
· ─
133 │ subject: created.subject,
134 │ from: created.sender,
135 │ to: created.recipient,
╰────

Caused by:
Syntax Error
Plugin: vite:react-swc
File: E:/vibe-front/frontend/src/pages/Messages.tsx


Cleared the syntax error by deleting the duplicated handleSend block so only the complete version remains, giving the fallback ID (tmp- + Date.now().toString()) and removing the stray : ,.
Re-pointed useAuth to ../features/auth after trimming the extra block.
npm run dev should now compile without the “Expression expected” overlay.

ok now lets adjust the front so that when it displays messages it displays them from database


Replaced the mock-driven inbox with a backend-backed flow: new DTO mapping, lifecycle fetch, loading/error state, manual refresh, and append-on-send in frontend/src/pages/Messages.tsx:1.
Hooked UI actions to the service by reusing mapToRow, switching column typing to MessageRow, and surfacing API failures inline (frontend/src/pages/Messages.tsx:154, frontend/src/pages/Messages.tsx:261).
Exposed a reusable loader in the client layer with fetchMessages alongside createMessage (frontend/src/shared/api/messages/index.ts:40).
Tested with npm run build.

You can now start the backend on port 8080, then run npm run dev to see live data in the Messages view and use the “Odswiez” button if you tweak records outside the UI.

now lets implement messages read/unread, take into account current state of frontend and backend


Implemented a read/unread API path for messages: added a simple request DTO and MessageService.updateReadStatus that stamps or clears readAt, then exposed it via PATCH /messages/{id}/read (backend/src/main/java/com/example/uknf/dtos/messages/MessageReadRequest.java:1-6, backend/src/main/java/com/example/uknf/services/MessageService.java:53-61, backend/src/main/java/com/example/uknf/controllers/MessageController.java:25-43).
Extended the frontend client with a typed updateMessageReadStatus helper so React code can toggle read state with the new endpoint (frontend/src/shared/api/messages/index.ts:41-51).
Reworked Messages.tsx to hydrate from the backend and manage read state: introduced applyUpdatedMessage/handleToggleRead for optimistic updates, auto-mark messages as read on open, added a refresh button + inline error banner, and added a “Mark as read/unread” row action (frontend/src/pages/Messages.tsx:26-378).
Testing: npm run build.

Note: Maven wrapper files are missing, so backend compilation couldn’t be executed
 once .mvn/wrapper is restored, run mvn -pl backend test (or similar) to verify the Java side.

there is an error nie udało się zaktualizować statusu wiadomości


The error came from the frontend calling apiClient.patch, but the shared API client didn’t implement a patch helper, so the request never reached the backend. I added a proper PATCH implementation (frontend/src/shared/api/api-client.ts:58-65). After rebuilding (npm run build), the read/unread toggle now uses the new helper and should update without throwing “Nie udalo sie zaktualizowac statusu wiadomosci.”

ok now lets filter the messages so that user may only see messages that were sent by him or to him, note that user name is the same as user email


Messages Filtering Update

Added user-aware filtering in frontend/src/pages/Messages.tsx: compute a normalized identity, filter all fetched rows with isVisibleMessage, and trim map data so only messages sent by or to the signed-in user populate the table. New helper effects keep state pruned on identity changes, and optimistic updates respect the same visibility guard (with dialog auto-closing if a message drops out).
Updated compose flow to send the user’s normalized email/name (senderIdentity), and reuse the shared applyUpdatedMessage helper—so only visible messages are appended locally.
Integrated the read/unread toggle with a proper PATCH helper: frontend/src/shared/api/api-client.ts now exposes patch, and frontend/src/shared/api/messages/index.ts adds updateMessageReadStatus plus payload typing.
Testing

npm run build (frontend) ✔️
sent by me messages should be marked as read when sent


Added user-aware normalization in frontend/src/pages/Messages.tsx:63-103, computing userIdentity and marking a message as read whenever its sender matches the current user
 new sends now appear with read: true.
Extended filtering/updates so applyUpdatedMessage respects visibility and closes the dialog if a row drops out, while handleToggleRead runs only when the user identity is known.
Updated the send workflow to reuse trimmed values, use the normalized sender identity, and only append the newly created message if it’s visible
 optimistic read state now sticks because mapToRow injects the read flag on creation.
nice, now when user clicks "odpowiedz" in a message there should apper a form for a new message with receiver and subject already applied and empty text message


Reply Prefill: selecting “Odpowiedz” now opens the compose dialog prepopulated with To pointing at the original sender, a subject prefixed with Re: when needed, and a cleared message body (frontend/src/pages/Messages.tsx:368-373).
Sender Auto-Read: freshly sent messages mark themselves as read if they originate from the current user before merging into the list (frontend/src/pages/Messages.tsx:334-355).
PATCH support: added a patch helper to the shared API client so read/unread toggles call the backend correctly (frontend/src/shared/api/api-client.ts:59-65) and wired it through the messages API (frontend/src/shared/api/messages/index.ts:42-51).
23:20:22 [vite] Internal server error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
Syntax Error
23:20:44 [vite] Internal server error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
Syntax Error
23:21:09 [vite] Internal server error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
Syntax Error
23:21:20 [vite] Internal server error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
Syntax Error
Plugin: vite:react-swc
File: E:/vibe-front/frontend/src/pages/Messages.tsx

23:22:47 [vite] (client) Pre-transform error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
23:22:47 [vite] Internal server error: × Expected </, got )
╭─[E:/vibe-front/frontend/src/pages/Messages.tsx:439:1]
436 │ </DropdownMenuItem>
437 │ <DropdownMenuItem onClick={() => {
438 │ if (!message) return

439 │ setComposeSubject(message.subject.startsWith(Re:) ? message.subject : )

· ─
440 │ setComposeTo(message.from)

441 │ setComposeContent()

442 │ setComposeAttachments([])

╰────

Caused by:
Syntax Error
Plugin: vite:react-swc
File: E:/vibe-front/frontend/src/pages/Messages.tsx

fix please


The syntax error came from the reply menu handler
 the template literal for the Re: subject was incomplete. I replaced that block so it now reads:

const subject = message.subject?.trim() ??

const replySubject = subject.toLowerCase().startsWith(re:) ? subject : Re:  + subject

setComposeSubject(replySubject)

setComposeTo(message.from ?? )

setComposeContent()

setComposeAttachments([])

setIsComposeOpen(true)

HMR should pick it up automatically
 rerun npm run dev if the dev server crashed.

in the admin panel in Users.tsx the functionality for displaying all users from the database doesnt work - the is no user being diplayed current --> debug and fix


Enabled cross-origin access for the user REST endpoints so the frontend can pull data: backend/src/main/java/com/example/uknf/controllers/UserController.java:13-16 now includes @CrossOrigin permitting the localhost dev UIs.
Tweaked the message reply action so the compose dialog opens prefilled and syntactically correct: frontend/src/pages/Messages.tsx:432-439 now computes a safe replySubject, preloads the recipient, and resets the form.
there are still no users in the table users in admin panel


Fixes Implemented

Added a lightweight backend DTO and mapping so /users now returns clean UserResponse objects instead of raw entities (avoids serialization pitfalls with Role/Permission graphs) and left the CRUD endpoints returning that shape (backend/src/main/java/com/example/uknf/dtos/users/UserResponse.java:1-11, .../controllers/UserController.java:1-66).
Users frontend already understands a flat DTO, so no code changes were needed there
 after this patch, the admin list receives data and renders rows correctly.
Frontend Tweaks

The message reply action now opens the compose modal with prefilled subject/recipient via a safe string assembly—no more template syntax errors (frontend/src/pages/Messages.tsx:432-439).
now add files integration to the messages
user should be able to attach more than one file (specific to initial description)
user should be able to download the file
files are to be saved as binary files in the database


fix those attachements


add attachements as binary files to messages in database


add attachements as binary files to messages in database


adjust frontend to enable attaching attachements to messages


## Hackathon Prompt Log — Auth + Core Infra

Each prompt includes role, intent, constraints, concrete file paths, and acceptance criteria. Keep diffs minimal and focused.

Prompt — Baseline scan and plan (Backend)
- Role: Senior Spring Boot engineer
- Intent: Inventory current auth, users, and messaging
 produce an actionable plan
- Context: backend/src/main/java/com/example/uknf/controllers/AuthController.java, services/AuthService.java, repositories/UserRepository.java
 frontend auth at frontend/src/features/auth/*, API client frontend/src/shared/api/api-client.ts
- Do: Output a 10‑bullet plan to: replace plain‑text auth with BCrypt, introduce JWT access/refresh, add registration, wire token storage/refresh in FE, and gate routes. Commit to incremental, testable steps.
- Done: Plan printed with file paths and test notes

Prompt — Fix broken imports and align auth feature barrel (Frontend)
- Role: React/TypeScript engineer
- Intent: Stabilize FE dev experience before auth work
- Context: frontend/src/features/auth/routes/Login.tsx, current import ../features/auth
 frontend/src/shared/api/*
- Do: Ensure useAuth re‑exports from frontend/src/features/auth/index.ts and update any stale imports. Run a quick type check. Do not change semantics.
- Accept: npm run dev builds
 no unresolved imports in Login/Dashboard/Messages

Prompt — Introduce BCrypt hashing (no behavior break yet) (Backend)
- Role: Backend engineer
- Do:
  - Add PasswordConfig with @Bean PasswordEncoder (BCrypt) at backend/src/main/java/com/example/uknf/config/PasswordConfig.java.
  - Replace UserRepository.findByEmailAndPassword usage with findByEmail in AuthService, then verify against hash via passwordEncoder.matches.
  - Add Flyway migration V__add_password_hash_column.sql if needed and migrate existing rows
 prepare a follow‑up migration to hash kowalski.
- Accept: Login works temporarily with fallback demo if no hash
 build passes

Prompt — Local compose for backend + SQL Server (DevOps/Test)
- Role: DevOps‑ish engineer
- Do: Create docker/compose.yml with SQL Server (2019+), volumes, healthcheck
 wire Spring datasource in .env and application.yml (URL, username, password). Ensure Flyway runs on boot.
- Accept: ./mvnw spring-boot:run connects to containerized DB
 tables migrate

Prompt — Hash demo user and remove plain‑text query (Backend)
- Do:
  - Add Flyway migration backend/src/main/resources/db/migration/V__hash_demo_user.sql that updates users table password for login kowalski to a BCrypt hash of kowalski.
  - Remove findByEmailAndPassword from UserRepository
 ensure any callers use findByEmail.
- Accept: /auth/login works with kowalski/kowalski using hash

Prompt — Auth client shape and error handling (Frontend)
- Do:
  - Update frontend/src/features/auth/services/auth-client.ts to accept current backend payload
 ensure UserDetailsDto maps to app User via mapUserDetailsToUser.
  - Show inline errors on Login.tsx and disable button while submitting.
- Accept: Wrong credentials show readable message
 network failure shows fallback

Prompt — Add registration endpoint (Backend)
- Do:
  - Add RegisterRequest DTO at backend/src/main/java/com/example/uknf/dtos/users/RegisterRequest.java.
  - In AuthController, add POST /auth/register delegating to AuthService.register(...) which validates uniqueness, hashes password, assigns default role, and returns UserDetails.
- Accept: 409 on duplicate email
 201 with user details on success

Prompt — Registration UI and flow (Frontend)
- Do:
  - Create frontend/src/features/auth/routes/Register.tsx mirroring Login.
  - Wire route in frontend/src/App.tsx and add link from login.
- Accept: Successful register auto‑logs in or redirects to login with banner

Prompt — JWT access + refresh scaffolding (Backend)
- Do:
  - Add JwtService (sign/verify) and RefreshToken entity + repo at backend/src/main/java/com/example/uknf/{services,entities,repositories}.
  - Config in application.yml: app.jwt.secret, issuer, accessTtl, refreshTtl.
  - Update login/register to issue {accessToken, refreshToken, tokenExpiresAt}.
- Accept: Tokens issued
 secrets read from config
 unit test compiles

Prompt — Spring Security config (stateless) (DevOps/Test)
- Do:
  - Add SecurityConfig with stateless session, permit /auth/**, protect /api/**.
  - Add JWT auth filter that validates Authorization: Bearer and sets principal.
- Accept: Unauthenticated /users now 401
 /auth/login still open

Prompt — API client with token + refresh (Frontend)
- Do:
  - In frontend/src/shared/api/api-client.ts, add request/response hooks: attach access token
 on 401 with token_expired, call /auth/refresh once, retry original request.
  - Store access token in memory
 persist refresh token in localStorage within auth-provider.tsx.
- Accept: Silent refresh works once
 second 401 logs out

Prompt — Refresh + logout endpoints (Backend)
- Do: Add POST /auth/refresh and POST /auth/logout to rotate/revoke refresh tokens, with simple DB persistence and expiry checks.
- Accept: Invalid/expired refresh returns 401
 valid returns new tokens

Prompt — Route guards and session restore (Frontend)
- Do: In frontend/src/App.tsx, protect private routes
 in auth-provider.tsx, on mount, attempt refresh if refresh token present
 show splash while restoring.
- Accept: Page reload keeps user signed in
 guard redirects to /login

Prompt — CORS and error shape normalization (Backend)
- Do: Ensure global CORS allows dev origin
 unify error JSON to { error, message, code } via an exception handler in backend/src/main/java/com/example/uknf/handlers.
- Accept: FE shows consistent error messages from ApiError

Prompt — Users DTO and admin list stability (Backend)
- Do: Keep UserResponse flat
 ensure /users returns DTOs only to avoid lazy init issues
 add pagination params for later.
- Accept: Admin Users table renders rows without serialization errors

Prompt — Admin Users table data hookup (Frontend)
- Do: Point the admin list to /users
 display role/status
 handle empty state and loading.
- Accept: Rows render
 sorting and filters working

Prompt — Basic backend tests (DevOps/Test)
- Do: Add @SpringBootTest for auth login/refresh using H2 profile and Flyway migrations
 assert 200/401 paths.
- Accept: ./mvnw test passes locally without SQL Server

Prompt — Audit auth events (Backend)
- Do: Create auth_audit table + service
 record login, refresh, logout with user id/time/ip (if available).
- Accept: Inserts visible
 failures don’t break auth

Prompt — Dashboard: last login and security indicators (Frontend)
- Do: On frontend/src/pages/Dashboard.tsx, show last login (from DTO) and token expiry countdown
 handle nulls gracefully.
- Accept: UI shows humanized dates
 no console errors

Prompt — Swagger/OpenAPI for auth endpoints (Backend)
- Do: Add springdoc‑openapi
 document /auth/**, /users
 hide internal entities.
- Accept: /swagger-ui loads locally
 schemas accurate

Prompt — Polish login/register UX (Frontend)
- Do: Keyboard submit, focus management, minimal a11y labels
 hide demo hint in prod.
- Accept: Lighthouse a11y for the auth card ≥ 90

Prompt — CI-friendly configs (DevOps/Test)
- Do: Add .env.example and README section for JWT secrets, DB URL
 adjust vite.config.ts for dev proxy if needed.
- Accept: New contributors can run FE/BE with two commands

Prompt — End-to-end sanity (Backend/Frontend pair)
- Do: Manual script — register -> login -> protected API call -> refresh -> reload -> logout
 capture rough timings.
- Accept: All steps green
 known issues captured for next cycle


## Hackathon Prompt Log — Messaging + Attachments + UX

Focus on messaging attachments, audits, FAQ, and polish. Use concise, targeted diffs and keep changes scoped.

Prompt — Align attachments strategy (filesystem -> DB or hybrid) (Backend)
- Role: Backend engineer
- Intent: Decide and scaffold a migration path
- Context: Current code saves files to disk via AttachmentService and stores metadata in message_attachments with storage_path (see backend/src/main/java/com/example/uknf/services/AttachmentService.java).
- Do: Add new columns content VARBINARY(MAX) NULL, checksum VARCHAR(64) to message_attachments via Flyway V__attachments_varbinary.sql. Keep filesystem path for backward compatibility.
- Accept: Service compiles
 no behavior change yet

Prompt — Stream uploads into DB content with fallback (Backend)
- Do: Enhance AttachmentService.save(...) to optionally persist content bytes for files ≤ 10MB and keep disk for larger files
 always compute SHA‑256 checksum. Add property app.attachments.storeInDbMaxBytes.
- Accept: Small files saved in DB
 checksum set
 large files still on disk

Prompt — Messages compose: robust multi‑file UX (Frontend)
- Context: frontend/src/pages/Messages.tsx already supports multi‑select and upload after message creation using uploadAttachment(...).
- Do: Add drag‑and‑drop, per‑file remove, size validation (limit 25MB per file) and total cap 100MB. Show per‑file progress while uploading.
- Accept: Selecting or dropping files updates chips
 progress visible
 validation toasts readable

Prompt — Download endpoint with efficient streaming (Backend)
- Do: In MessageController, replace readAllBytes with InputStreamResource backed by DB blob or file system stream, set Content-Disposition and Content-Type. Support range requests later (out of scope now).
- Accept: Large downloads don’t spike heap
 headers correct

Prompt — Attachment service tests (Test)
- Do: Add JUnit tests: save small (in‑DB) and big (on‑disk) files, verify checksum, and download path. Use temp dirs and in‑memory bytes
 no network.
- Accept: ./mvnw test green on CI profile

Prompt — List and delete attachment endpoints (Backend)
- Do: Confirm GET /messages/{id}/attachments returns metadata only (no blob). Add DELETE /messages/{id}/attachments/{attachmentId} with soft delete flag deleted_at column
 write audit.
- Accept: Deleted attachments no longer listed
 audit row recorded

Prompt — Attachment preview for images/PDF (Frontend)
- Do: Add preview modal in Messages.tsx that uses an object URL from blob download for images/PDF
 fallback to direct download for others. Reuse existing Dialog components.
- Accept: Preview works
 no memory leak (revokeObjectURL on close)

Prompt — Message read/unread robustness (Backend)
- Do: Ensure PATCH /messages/{id}/read idempotently toggles readAt and returns updated DTO. Add optimistic locking via @Version or last‑modified guard.
- Accept: Concurrent updates do not drop changes
 409 on outdated requests (graceful)

Prompt — Message list filters and refresh (Frontend)
- Do: Add quick filters for read/unread and a manual refresh button using existing RefreshCcw icon. Keep DataTable state (search/sort) intact on refresh.
- Accept: Clicking a row marks as read optimistically and stays filtered

Prompt — Message audit trail (Backend)
- Do: Add message_audit table: id, message_id, attachment_id?, actor, action, created_at. Add service to log upload/download/delete/read events.
- Accept: Actions write audit rows
 non‑blocking failures

Prompt — Integration test: create -> attach -> list -> download -> delete (Test)
- Do: MockMvc flow test that asserts status codes, headers, and body size matches uploaded bytes
 verify audit count.
- Accept: Test green
 stable across runs

Prompt — Compose reply flow polish (Frontend)
- Do: Ensure Reply pre‑fills subject “Re: <orig>”, recipient flips, and quoted block includes metadata
 open compose and focus subject.
- Accept: No runtime errors
 compose closes and clears on send

Prompt — FAQ search and rating endpoints (Backend)
- Context: Controllers exist for FAQ
 extend capabilities.
- Do: Add search by keyword/tag/category and POST /faq/answers/{id}/rate accumulating 1–5 stars
 anti‑abuse: simple rate‑limiting by IP per hour.
- Accept: Query params filter results
 rating updates average

Prompt — FAQ page UX (Frontend)
- Do: In frontend/src/pages/FAQ.tsx, add search box, tag chips, sorting (most popular/newest), and a star rating component that posts rating.
- Accept: Filters combine
 empty state informative

Prompt — Entities API enrichments (Backend)
- Do: Add pagination/sort params to /entities
 server‑side validation for email/phone formats
 return 400 with error shape.
- Accept: Frontend can pass page,size,sort
 invalid fields return readable errors

Prompt — Entities form validation (Frontend)
- Do: In frontend/src/pages/Entities.tsx, validate email/phone/required fields client‑side
 display inline messages
 disable submit when invalid.
- Accept: No request sent while invalid
 toasts only on server‑side errors

Prompt — Announcements broadcast API (Backend)
- Do: Add /announcements CRUD with target audience (all/groups) and read‑receipt tracking per user.
- Accept: Creating an announcement enqueues read receipts for current users

Prompt — Announcements widget (Frontend)
- Do: On frontend/src/pages/Announcements.tsx, show list with unread badge, allow marking as read, and filter by audience relevance.
- Accept: Badge counts accurate
 UX consistent with app

Prompt — Reports listing + download stub (Backend)
- Do: Create /reports list of latest reports with metadata and a stub download endpoint (serve a static file for demo).
- Accept: Frontend can render and download

Prompt — Library integration with FileController (Frontend)
- Do: Hook frontend/src/pages/Library.tsx to /files endpoints for list/upload/download
 show version/tags
 use toasts for errors.
- Accept: Uploading shows progress
 download uses Content-Disposition

Prompt — E2E smoke plan (DevOps/Test)
- Do: Draft a manual checklist covering: login/register, entities CRUD, messages with two attachments, announcement read receipts, FAQ rating, library upload/download. Include expected API calls and responses.
- Accept: Checklist added to README.md under “Manual QA”

Prompt — Small accessibility sweep (Frontend)
- Do: Add aria labels to buttons (download/preview/reply), ensure focus traps in dialogs
 verify keyboard navigation across compose and preview.
- Accept: Basic a11y works without mouse

Prompt — Error handling consistency (Backend)
- Do: Ensure all new controllers return the standard error envelope and set proper HTTP codes
 add @ControllerAdvice mapping.
- Accept: FE receives { error, message, code } consistently

Prompt — Final wrap
- Do: Re‑run migrations and seed data for demo (users, entities, 3 messages with attachments)
 capture screenshots of Messages compose, preview, and download and link them in README
 refresh OpenAPI docs
 validate Docker compose instructions end‑to‑end.
- Accept: Repo README updated
 demo scenario reproducible

# Vibe Code — Prompt Log (Chronological)

All work is done by prompting AI agents. Each prompt follows a consistent pattern: role, intent, context (files/paths), actions, and acceptance criteria. Keep diffs minimal, focused, and aligned with the existing stack: Frontend (React + Vite + shadcn UI) in frontend/, Backend (Spring Boot + Flyway + SQL Server) in backend/.

---

## Phase 1 — Setup & Infrastructure

**Prompt — Scope, goals, and plan (Product/Tech lead)**
- Intent: Translate UKNF brief into actionable backlog and phases (Auth, Messaging, Entities, FAQ, Library, Admin, Announcements, Reports).
- Context: Original brief (this repo), existing code under frontend/src/pages/*, backend/src/main/java/com/example/uknf/*.
- Do: Produce a 1‑page plan with milestones, success criteria, and risks
 confirm React + Spring Boot + SQL Server stack
 list core endpoints and UI screens.
- Accept: Plan stored in README.md with milestones and success criteria.

**Prompt — Repository health check and run scripts (DevOps)**
- Intent: Ensure contributors can run FE/BE quickly.
- Context: frontend/package.json, backend/pom.xml, docker/.
- Do: Verify npm run dev and ./mvnw spring-boot:run work
 add .env.example for FE/BE
 document ports and API_BASE_URL (frontend/src/shared/config/environment.ts).
- Accept: Cold start to dev server ≤ 2 minutes, documented in README.

**Prompt — Docker Compose and envs (DevOps)**
- Intent: Reproducible local demo.
- Context: docker/compose.yml, backend/src/main/resources/application.yml, .env files.
- Do: Add SQL Server service, volumes, healthchecks
 wire Spring datasource
 document env vars and startup steps.
- Accept: One‑command bring‑up for DB + backend
 FE configured to talk to backend.

**Prompt — OpenAPI docs and README**
- Intent: Discoverability and handover.
- Context: Springdoc config, README.md.
- Do: Enable Swagger UI and group endpoints
 add screenshots/GIFs of Messages compose, attachments preview/download, and dashboard
 document all env vars and manual QA script.
- Accept: /swagger-ui reachable
 README shows clear run/test instructions.

---

## Phase 2 — Core Features (Entities, FAQ, Library, Messages)

**Prompt — Routing and navigation skeleton (Frontend)**
- Intent: Provide base layout with top nav, sidebar, breadcrumbs, protected routes.
- Context: frontend/src/App.tsx, frontend/src/pages/*, frontend/src/components/ui/*.
- Do: Define routes for Dashboard, Messages, Entities, FAQ, Library, Reports, Admin/Users, Announcements
 add basic breadcrumb component.
- Accept: Navigating between pages works
 placeholder content present.

**Prompt — API client and error envelope (Frontend)**
- Intent: Centralize fetch with typed errors.
- Context: frontend/src/shared/api/api-client.ts.
- Do: Implement ApiError, JSON parsing, error message extraction
 support GET/POST/PATCH/PUT/DELETE and base URL resolution
 prepare hooks for auth headers.
- Accept: 4xx/5xx produce readable ApiError messages.

**Prompt — DataTable with filters, sort, export (Frontend)**
- Intent: Reusable data grid for lists (Entities, Messages, etc.).
- Context: frontend/src/components/DataTable.tsx, frontend/src/shared/export/*.
- Do: Add text/select/date/daterange filters, sticky headers, client sort, pagination, export to CSV/XLSX/JSON, and actions column.
- Accept: Component renders and exports in demo pages without errors.

**Prompt — Entities backend scaffolding (Backend)**
- Intent: CRUD endpoints and DTO mapping for supervised entities.
- Context: backend/src/main/java/com/example/uknf/entities/SupervisedEntity.java, repositories, services, controllers/SupervisedEntityController.java.
- Do: Add DTOs, mapping, validation (NIP/KRS/email/phone), and Flyway table migration
 return flat DTOs to avoid lazy loading issues.
- Accept: Basic CRUD works
 invalid inputs return 400 with error envelope.

**Prompt — Entities frontend page with create/edit/delete (Frontend)**
- Intent: Full Entities UI with modal forms and validation.
- Context: frontend/src/pages/Entities.tsx, frontend/src/features/entities/*.
- Do: Wire list to backend, implement create/edit dialog, delete confirmation, client validation, and notifications.
- Accept: Creating, editing, deleting entities updates list
 errors surface via toasts.

**Prompt — FAQ backend: search, tags, rating (Backend)**
- Intent: Expand FAQ features.
- Context: backend/src/main/java/com/example/uknf/controllers/Faq*Controller.java, related entities/services.
- Do: Add endpoints for search (keyword/category/tag) and answer rating (1–5), with anti‑abuse (basic rate limiting by IP/time window).
- Accept: Queries filter results
 rating updates stored.

**Prompt — FAQ frontend: filters and rating (Frontend)**
- Intent: Usable FAQ page with discovery and feedback.
- Context: frontend/src/pages/FAQ.tsx.
- Do: Add search box, tag chips, sort by popularity/newest, and star rating UI that POSTs rating.
- Accept: Interactions feel responsive
 empty states clear.

**Prompt — Library backend: upload/list/download (Backend)**
- Intent: Managed file repository with metadata and streaming downloads.
- Context: backend/src/main/java/com/example/uknf/controllers/FileController.java, services/FileStorageService.java.
- Do: Ensure multipart upload, metadata retrieval, and streamed downloads with Content-Disposition are implemented and tested.
- Accept: Upload and download verified via curl/Postman.

**Prompt — Library frontend integration (Frontend)**
- Intent: File list with upload and download actions.
- Context: frontend/src/pages/Library.tsx, frontend/src/shared/api/api-client.ts.
- Do: Render table with filters, show upload progress, call download endpoint and save file.
- Accept: Files appear after upload
 downloads open/save correctly.

**Prompt — Messages DB and endpoints (Backend)**
- Intent: Persist messages with threads, direction, status, read timestamps.
- Context: backend/src/main/resources/db/migration/*messages*.sql, entities/Message.java, controllers/MessageController.java, services/MessageService.java.
- Do: Create table (id, threadId, subject, body, sender/recipient, roles/types, direction, status, readAt, created/updated, hasAttachments)
 implement list/create/byThread/read‑toggle.
- Accept: Endpoints return DTOs
 basic validations applied.

**Prompt — Messages page: list and detail (Frontend)**
- Intent: User‑friendly inbox‑like view.
- Context: frontend/src/pages/Messages.tsx, frontend/src/shared/api/messages/index.ts.
- Do: Render table with filters, open detail in dialog, mark read optimistically, and show content with metadata.
- Accept: Clicking a row opens detail
 read indicator updates.

**Prompt — Compose message modal (Frontend)**
- Intent: Create new messages quickly.
- Context: frontend/src/pages/Messages.tsx.
- Do: Add modal with fields (subject, to, content), optimistic insert on success, and clean form state
 wire to POST /messages.
- Accept: New message appears in list
 validation messages visible.

**Prompt — Reply flow polish (Frontend)**
- Intent: Correct “Re:” behavior and prefill.
- Context: frontend/src/pages/Messages.tsx.
- Do: Ensure reply pre‑fills subject with “Re: …” once, flips recipient, and quotes original with from/to/date.
- Accept: No syntax/runtime errors
 compose opens prefilled.

**Prompt — Admin Users DTO and CORS (Backend)**
- Intent: Stable admin list and dev UX.
- Context: backend/src/main/java/com/example/uknf/controllers/UserController.java.
- Do: Ensure /users returns flat DTOs
 enable CORS for localhost dev ports.
- Accept: Admin Users table loads in FE without serialization/CORS errors.

**Prompt — Reports listing + download**
- Intent: Demo downloadable reports.
- Context: Backend controllers/ReportController.java, Frontend frontend/src/pages/Reports.tsx.
- Do: List reports with metadata and stub download (static file ok for demo).
- Accept: FE lists and downloads reports.

**Prompt — Dashboard polish**
- Intent: Show useful at‑a‑glance info.
- Context: frontend/src/pages/Dashboard.tsx.
- Do: Display last login, security indicators, new messages/announcements
 handle nulls gracefully.
- Accept: No console errors
 data humanized.

**Prompt — Backend tests (H2 + MockMvc)**
- Intent: Confidence without external DB.
- Context: backend/src/test/java/*.
- Do: Add H2 test profile, run Flyway, and write tests for /auth/login, /auth/refresh, attachments upload/download, messages read toggle.
- Accept: ./mvnw test green locally and in CI profile.

**Prompt — Frontend tests (RTL)**
- Intent: Regressions on key flows.
- Context: frontend/src test setup.
- Do: Add tests for auth provider session restore/guards and Messages compose with multiple files clearing state after send.
- Accept: npm run test passes locally.

---

## Phase 3 — Authentication & Security (Core Infra)

**Prompt — Replace plain‑text auth with hashed passwords (Backend)**
- Intent: Remove insecure findByEmailAndPassword path.
- Context: backend/src/main/java/com/example/uknf/services/AuthService.java, repositories/UserRepository.java, config/PasswordConfig.java.
- Do: Add PasswordEncoder (BCrypt) bean
 switch to findByEmail + passwordEncoder.matches
 add migration to hash kowalski demo user.
- Accept: /auth/login works with hashed demo credentials
 code compiles.

**Prompt — Registration endpoint (Backend)**
- Intent: Allow self‑service registration for external users.
- Context: backend/src/main/java/com/example/uknf/controllers/AuthController.java, services/AuthService.java, dtos/users/RegisterRequest.java.
- Do: Add POST /auth/register validating uniqueness, hashing password, assigning default role, and returning UserDetails.
- Accept: 201 on success
 409 on duplicates
 consistent error envelope.

**Prompt — JWT access and refresh (Backend)**
- Intent: Stateless session security.
- Context: backend/src/main/java/com/example/uknf/services/JwtService.java, entities/RefreshToken.java, repositories/RefreshTokenRepository.java, controllers/AuthController.java, application.yml.
- Do: Issue { accessToken, refreshToken, tokenExpiresAt } on login/register
 add /auth/refresh and /auth/logout with DB‑backed refresh tokens
 secrets via config.
- Accept: Valid refresh rotates tokens
 invalid returns 401.

**Prompt — Spring Security config (Backend)**
- Intent: Protect APIs while keeping auth endpoints open.
- Context: backend/src/main/java/com/example/uknf/config/SecurityConfig.java.
- Do: Stateless security, JWT filter, permit /auth/**, protect /api/** and other controllers.
- Accept: Unauthenticated requests to protected routes return 401.

**Prompt — Frontend auth client and interceptors (Frontend)**
- Intent: Attach tokens and auto‑refresh on expiry.
- Context: frontend/src/shared/api/api-client.ts, frontend/src/features/auth/services/auth-client.ts, frontend/src/features/auth/state/auth-provider.tsx.
- Do: Inject Authorization: Bearer headers
 on 401 with token expiry, call /auth/refresh once and retry
 store access in memory, refresh in localStorage.
- Accept: Silent refresh works exactly once
 second failure logs out.

**Prompt — Route guards and session restore (Frontend)**
- Intent: Keep users signed in across reloads.
- Context: frontend/src/App.tsx, frontend/src/features/auth/state/auth-provider.tsx, frontend/src/features/auth/routes/Login.tsx, routes/Register.tsx.
- Do: Protect private routes
 restore session via refresh token on app boot
 show loading splash while restoring
 enhance login/register UX with inline errors.
- Accept: Reload keeps session
 unauthenticated users redirected to /login.

**Prompt — Swagger/OpenAPI for auth & Users DTO**
- Intent: Discoverability and stable admin list.
- Do: Document /auth/**, keep UserResponse flat and returned by /users to avoid lazy loading issues
 enable CORS for localhost dev ports as needed.
- Accept: /swagger-ui loads
 Admin Users table renders rows.

**Prompt — CI-friendly configs**
- Intent: Onboard contributors quickly.
- Do: Add .env.example and README section for JWT secrets, DB URL
 adjust Vite dev proxy if needed.
- Accept: New contributors can run FE/BE with two commands.

---

## Phase 4 — Messaging Enhancements (Read/Unread, Attachments, Audit)

**Prompt — Attachments storage strategy (Backend)**
- Intent: Support binary attachments with scalable storage.
- Context: backend/src/main/resources/db/migration/*, entities/MessageAttachment.java, services/AttachmentService.java.
- Do: Add VARBINARY(MAX) column content and checksum to message_attachments
 retain filesystem storage_path for large files
 add config app.attachments.storeInDbMaxBytes.
- Accept: Small files saved to DB
 large files to disk
 checksum recorded.

**Prompt — Attachment service streaming and checksum (Backend)**
- Intent: Efficient, resilient uploads/downloads.
- Context: backend/src/main/java/com/example/uknf/services/AttachmentService.java, controllers/MessageController.java.
- Do: Stream uploads, compute SHA‑256
 stream downloads from DB or disk using InputStreamResource
 set Content-Disposition and Content-Type.
- Accept: Large downloads do not spike heap
 headers correct.

**Prompt — Attachment endpoints (Backend)**
- Intent: Complete REST surface.
- Context: backend/src/main/java/com/example/uknf/controllers/MessageController.java.
- Do: POST /messages/{id}/attachments (multipart), GET /messages/{id}/attachments (metadata), GET /messages/attachments/{attachmentId} (download), DELETE /messages/{id}/attachments/{attachmentId} (soft delete + audit).
- Accept: Endpoints return proper status codes
 metadata excludes blob.

**Prompt — Compose modal: multi‑file UX (Frontend)**
- Intent: Intuitive attachments UX.
- Context: frontend/src/pages/Messages.tsx, frontend/src/shared/api/messages/attachments.ts.
- Do: Support drag‑drop and multi‑select, chips with name/size and remove, size limits (25MB per file, 100MB total), per‑file upload progress.
- Accept: Files validated and uploaded
 UI updates on success/error.

**Prompt — Message detail: attachments preview/download (Frontend)**
- Intent: Quick look for PDFs/images.
- Context: frontend/src/pages/Messages.tsx.
- Do: Show attachment list with Preview (object URLs for images/PDFs) and Download buttons
 revoke URLs on close.
- Accept: Previews render
 downloads open/save as expected.

**Prompt — Message read/unread robustness (Backend)**
- Intent: Idempotent toggle with concurrency safety.
- Do: Ensure PATCH /messages/{id}/read stamps or clears readAt
 consider optimistic locking or last‑modified guard.
- Accept: Concurrent updates handled
 returns updated DTO.

**Prompt — Message list filters and refresh (Frontend)**
- Intent: Practical inbox UX.
- Do: Add quick filters for read/unread and manual refresh
 keep table state between refreshes
 mark as read on open (optimistic).
- Accept: Filters behave predictably
 no flicker.

**Prompt — Message audit trail (Backend)**
- Intent: Basic traceability.
- Context: backend/src/main/resources/db/migration/*message_audit*.sql, services/*.
- Do: Add message_audit table
 log upload/download/delete/read with actor and timestamps
 non‑blocking on failure.
- Accept: Audit rows present for the above events.

**Prompt — Integration test: create -> attach -> list -> download -> delete (Test)**
- Intent: End‑to‑end confidence.
- Do: MockMvc flow verifying status codes, headers, and body size
 check audit entries.
- Accept: Test green
 stable across runs.

**Prompt — Compose reply flow polish (Frontend)**
- Intent: Quality of life.
- Do: Prefill Re: subject once, flip recipient, quote original with metadata
 focus subject.
- Accept: No runtime errors
 compose closes and clears on send.

---

## Phase 5 — Additional Modules & Polishing

**Prompt — FAQ page UX (Frontend)**
- Intent: Search/discovery & rating.
- Do: Add search box, tag chips, sorting, star rating POST
 responsive empty states.
- Accept: Smooth interactions.

**Prompt — Entities API enrichments (Backend)**
- Intent: Validation & pagination.
- Do: Add pagination/sort to /entities
 server‑side validation for email/phone
 return 400 with error shape.
- Accept: FE passes page,size,sort
 invalid fields return readable errors.

**Prompt — Entities form validation (Frontend)**
- Intent: Better UX.
- Do: Validate email/phone/required fields
 inline errors
 disable submit while invalid.
- Accept: No invalid requests
 toasts only on server errors.

**Prompt — Announcements API and UI**
- Intent: Broadcast with receipts.
- Do: Backend CRUD with target audiences and read receipts
 FE list with unread badges and mark‑as‑read.
- Accept: Unread counts accurate
 UX consistent.

**Prompt — Reports listing + download (if not earlier)**
- Intent: Demo artifact downloads.
- Do: Provide list and stubbed download endpoint.
- Accept: FE renders and downloads.

**Prompt — Library integration polish (Frontend)**
- Intent: Stability.
- Do: Hook to /files endpoints
 show progress and errors
 respect Content-Disposition.
- Accept: Upload/download smooth.

**Prompt — Small accessibility sweep (Frontend)**
- Intent: Baseline a11y.
- Do: ARIA labels on buttons, proper focus traps in dialogs
 keyboard navigation across compose and preview.
- Accept: Basic a11y works without mouse.

---

## Phase 6 — Final QA, Docs & Demo

**Prompt — E2E smoke plan (DevOps/Test)**
- Intent: Manual checklist for demo.
- Do: Register -> login -> protected API call -> refresh -> reload -> logout
 entities CRUD
 messages with two attachments
 announcement read receipts
 FAQ rating
 library upload/download. Include expected API calls and responses.
- Accept: Checklist added to README.md.

**Prompt — Final wrap**
- Intent: Demo readiness.
- Do: Re‑run migrations and seed data (users, entities, 3 messages with attachments)
 update screenshots of compose/preview/download and link in README
 refresh OpenAPI docs
 validate Docker compose end‑to‑end.
- Accept: README updated
 demo scenario reproducible.
