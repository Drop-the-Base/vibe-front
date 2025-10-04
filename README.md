# UKNF Communication Platform Demo

This repository contains a full-stack demo of a secure communication platform prepared for the UKNF Prompt2Code2 challenge. The goal of the demo is to showcase how authentication, communication workflows, administrative tooling and knowledge management can be prototyped with the help of AI-assisted development.

The workspace is split into:

- `frontend/` – a Vite + React SPA that renders the dashboards, tables and modals defined in the specification using the mock data bundled with the app. The UI components were generated with the help of prompt-engineering sessions and can be connected to the API in future iterations.
- `backend/` – a Spring Boot 3 REST API that provides fully functional endpoints for entities, reports, cases, messages, announcements, FAQs, contact groups, users, access requests, password policies and audit logs. The backend uses in-memory stores by default but is ready for MSSQL integration.
- `docker/` – compose configuration for running the backend, frontend and (optionally) an MSSQL Developer instance inside containers.
- `prompt.md` – a chronological list of the prompts that guided AI-assisted development.

## Quick start

### Prerequisites

- Node.js 20+ for the SPA.
- Java 21 and Maven (or Docker) for the backend API.
- Docker Compose v2 for containerised runs.

### Running the frontend (SPA)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server listens on <http://localhost:5173>. Mock data is baked in for all tables and dashboards.

### Running the backend API locally

```bash
cd backend
mvn clean package -DskipTests
java -jar target/uknf-0.0.1-SNAPSHOT.jar
```

The API listens on <http://localhost:8080> and exposes Swagger UI at `/swagger-ui.html`. On startup a `DemoDataInitializer` seeds representative users, entities, reports, cases, FAQ entries, announcements and message threads so that every endpoint returns realistic payloads straight away.

The in-memory profile is active by default which keeps the service lightweight – no external database is required to explore the API. To switch to MSSQL just set `SPRING_PROFILES_ACTIVE=mssql` (Docker instructions below) and make sure the compose MSSQL service is running.

### Running everything with Docker Compose

```bash
cd docker
docker compose build
docker compose up
```

Available services after `up` finishes:

| Service    | URL                   | Notes                                                      |
|------------|----------------------|------------------------------------------------------------|
| Frontend   | <http://localhost:5173> | Served via nginx, renders the SPA using seeded demo data. |
| Backend    | <http://localhost:8080> | Spring Boot REST API with Swagger UI under `/swagger-ui.html`. |
| MSSQL (opt)| localhost:1433        | Developer edition for future persistence work.             |

The backend mounts `backend/uploads` for library files so that uploads survive container restarts.

## API overview

The Spring Boot backend implements the preferred and additional modules from the specification. Key endpoints (all prefixed with `/api`):

- `/auth/login`, `/auth/register`, `/auth/demo` – authentication flows with hashed passwords.
- `/entities` – CRUD with change history for supervised entities and the “Aktualizator danych podmiotu” use case.
- `/reports` – report registry supporting status transitions, validation artifacts and corrections.
- `/messages` – bidirectional messaging threads with attachment metadata sourced from the library module.
- `/cases` – administrative cases with timeline notes and status management.
- `/library` – file repository supporting upload, version history, access levels and downloads.
- `/announcements` – bulletin board messages with acknowledgement tracking and priority flags.
- `/faq` – knowledge base with tagging, answering and rating flows.
- `/access-requests` – management of external access requests and lifecycle statuses.
- `/admin/users`, `/admin/roles`, `/admin/password-policy` – administrative tooling for accounts, role definitions and password policy governance.
- `/contacts` – address book, contact groups and bulk communication recipients.
- `/audit` – simple audit log feed capturing important demo actions.

Every controller returns typed DTOs aligned with the UI mock-ups, and the in-memory store is initialised with enough data to power dashboards immediately.

## Prompt log & AI usage

The entire implementation was guided through iterative prompts captured in [`prompt.md`](prompt.md). The document lists the most effective prompts, rationale for their selection and the division between code that was generated versus manually adapted.

## Next steps

- Connect the SPA to the REST API by replacing the current mock-data hooks with fetchers.
- Enable Flyway migrations and point the Spring Boot profile to the MSSQL container for persistent storage.
- Extend automated tests once network access to Maven Central is available in the execution environment.

Feel free to explore the API via Swagger and tailor the seeded dataset to your own demos.
