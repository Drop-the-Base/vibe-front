# Vibe Frontend Architecture

This document describes the target frontend architecture for the Vibe communication platform. It sets the conventions we will follow while replacing the current mock-driven prototype with production-grade features. Treat it as a living document—update it alongside significant architectural decisions.

## Guiding Principles

- **Feature-first organisation** – group code by domain feature (auth, messaging, reports, etc.) so adding or replacing functionality has a contained blast radius.
- **Clear layering** – separate view components, application logic, and infrastructure services. Each layer exposes simple, typed contracts to the next layer up.
- **Typed backend contracts** – mirror backend DTOs in the frontend and keep mapping utilities alongside the service using them. Regenerate or update types whenever backend contracts change.
- **Progressive hardening** – start with simple implementations, but ensure each module has a clear extension path for caching, error handling, and testing.
- **Single sources of truth** – hold shared state in one place (React Query cache, contexts) and derive everything else from it.

## Technology Foundations

- **Runtime**: React 18 with Vite. All new code uses TypeScript (add a `tsconfig.json` at the root of `frontend/` before expanding strongly typed modules).
- **Routing**: React Router. Consolidate route definitions under `src/app/routes` so feature modules only register their own segments.
- **Form state**: React Hook Form + Zod (introduce Zod when we need schema validation).
- **Server communication**: Fetch API wrapped in a thin `api-client`. For caching/server state we will adopt TanStack Query once real APIs land—design the services so they can plug into it without churn.
- **Styling & UI**: Tailwind CSS with the Shadcn component primitives already under `components/ui`. All cross-feature UI primitives live there.

## High-level Directory Layout

```
frontend/src
├── app/
│   ├── providers/        # Top-level contexts (AuthProvider, QueryClientProvider, ThemeProvider)
│   ├── routes/           # Route registration, protected route guards
│   ├── store/            # Global stores that are not tied to a single feature (e.g. layout settings)
│   └── App.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── announcements/
│   ├── reports/
│   ├── messages/
│   ├── cases/
│   ├── library/
│   └── … (extend per domain)
├── shared/
│   ├── ui/               # Design system components (tailwind-based)
│   ├── hooks/            # Reusable hooks (e.g. useToggle, usePagination)
│   ├── utils/            # Cross-cutting utilities (date, formatting, validation)
│   ├── config/           # Environment configuration helpers, constants
│   └── types/            # Primitive/shared types (ID, PaginatedResponse, etc.)
└── test/                 # Test utilities (when we enable testing)
```

### Feature Modules

Each feature directory mirrors the same internal structure:

```
features/<feature>/
├── routes/         # Route components specific to the feature
├── components/     # Feature-specific presentational components
├── hooks/          # Hooks encapsulating feature logic
├── services/       # API calls, DTO mapping, state loaders
├── types/          # DTOs & domain models for the feature
└── index.ts        # Public export surface (components, hooks)
```

- Keep mocks (temporary) in `features/<feature>/mocks/` so we can delete them once backend endpoints are wired in.
- Only expose what the rest of the app needs via the feature `index.ts` to control dependencies.

### Auth Layer

- `features/auth/services/auth-client.ts` wraps `/auth/*` endpoints, handles request payloads, response mapping, and error normalisation.
- `features/auth/state/auth-context.tsx` keeps current session information, relies on the client for network operations, and exposes high-level actions (`login`, `logout`, `refreshSession`). Keep persistence helpers in a separate module (`features/auth/services/session-storage.ts`).
- `features/auth/types/user.ts` contains the `User`, `Role`, and permission type definitions shared across the app.

### API Client & Infrastructure

- `shared/config/environment.ts` – reads `import.meta.env`, sets `API_BASE_URL`, toggles feature flags.
- `shared/api/api-client.ts` – wrapper around `fetch` (or Axios if adopted later) that injects base URL, serialises JSON, and lifts non-2xx responses into typed `ApiError`s.
- `shared/api/interceptors.ts` – handles auth token injection, automatic logout on 401, etc. (Introduce once backend supports tokens.)
- `shared/api/query.ts` – once we adopt TanStack Query, centralise query key factories, cache helpers here.

## State Management Strategy

1. **Ephemeral UI state** – local component state or `useReducer` inside the component tree.
2. **Server state** – load via feature services, cache with TanStack Query (plan ahead by designing service functions to return promises with typed data and accept abort signals).
3. **Global client state** – only when multiple features need the same data (e.g. authenticated user). Use React context or dedicated lightweight Zustand store under `app/store/`.

Avoid mixing concerns: contexts should not execute network requests directly; they should call services and manage the resulting data lifecycle.

## Forms & Validation

- Co-locate form schemas with the feature route handling the form (`features/reports/routes/CreateReport/schema.ts`).
- Share generic form inputs by exporting them from `shared/ui/forms`.
- Provide async validation helpers in the relevant service module if they require API calls.

## Error Handling & Notifications

- Use a central toast helper (`shared/ui/notifications.ts`) so each feature dispatches uniform messages.
- Normalise API errors inside service modules before they reach UI components.
- Add error boundaries per major route (e.g. `features/reports/routes/ReportsErrorBoundary.tsx`).

## Incremental Migration Plan

1. **Scaffold structure** – create the `app`, `features`, and `shared` directories, rehome existing code without altering behaviour.
2. **Auth refactor** – move the current `auth-context` into `features/auth`, introduce the service module, and replace local storage logic with backend calls while keeping fallback mocks for offline dev.
3. **Domain roll-out** – for each mocked feature:
   - Port mock data into `features/<feature>/mocks` (temporary).
   - Define DTOs based on backend contracts in `types/`.
   - Implement service calls and mapping under `services/`.
   - Update routes/components to consume the new service.
   - Remove the mock once the backend endpoint is verified.
4. **Introduce TanStack Query** – once two or more screens depend on shared server state or we need caching/optimistic updates.
5. **Testing enablement** – add MSW handlers per feature to decouple UI tests from backend availability; provide Cypress or Playwright E2E coverage after core flows are stable.

## Tooling & Quality Gates (Future Work)

- Add ESLint + Prettier with shared configs under `frontend/.config/`.
- Configure absolute imports via `tsconfig.json` paths (e.g. `@app`, `@features/*`, `@shared/*`).
- Set up commit hooks (lint-staged) once the codebase is more stable.

## Collaboration Checklist

- When adding a feature, create a short `README.md` inside the feature folder describing the flows and API endpoints.
- Update this architecture document when new cross-cutting decisions are made (e.g. introducing WebSockets, background sync).
- Document environment variables in `docs/environment.md` (to be created) so onboarding remains painless.

By following this structure we can continue replacing mocks with real integrations while keeping the codebase modular, testable, and easy to onboard new developers onto.

