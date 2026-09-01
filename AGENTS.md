# IndoKerja Frontend Repository Guidelines

## Sources of Truth

Before coding, read:

- `docs/PROJECT_SPEC.md`
- `docs/IMPLEMENTATION_PLAN.md`

The specification defines what must be built.
The implementation plan defines the development stages.

Work only on the requested stage.

Do not automatically begin later stages.

---

## Technology

This repository uses:

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod

Do not replace these technologies without an explicit requirement.

Do not introduce unnecessary global state libraries such as Redux or
Zustand.

Authentication state should use React Context as defined by the project
specification.

---

## Architecture

Keep application concerns organized in the existing structure:

src/
  api/
  components/
  context/
  features/
  hooks/
  routes/
  types/

Prefer feature-oriented organization.

Reusable generic UI belongs in `components/`.

Feature-specific UI and behavior belong under `features/`.

API request logic belongs in `api/`.

Authentication state belongs in `context/` and related hooks.

Routing belongs in `routes/`.

Do not create unnecessary architectural layers.

---

## TypeScript

Preserve strict TypeScript.

Do not:

- disable strict mode
- introduce `any` without genuine justification
- use unsafe casts merely to silence the compiler
- weaken compiler options to make broken code compile

Prefer clear domain and API types.

---

## Frontend Security

Frontend code is never the real authorization boundary.

Backend authentication, authorization, and resource ownership remain the
source of truth.

Frontend route guards are for user experience only.

Never:

- log JWT tokens
- log passwords
- expose secrets
- hard-code production credentials
- use `dangerouslySetInnerHTML` without an explicit reviewed requirement

JWT storage follows `PROJECT_SPEC.md`.

Because the token is stored in localStorage, avoid introducing XSS-prone
rendering patterns.

Only `VITE_` environment variables intended for browser exposure may be
used by client code.

---

## API Integration

Use the shared Axios instance.

Do not duplicate API base URLs throughout the application.

Do not assume all HTTP 401 responses mean the same thing without
considering authentication flow.

API error handling should provide understandable user feedback while
avoiding exposure of unnecessary internal information.

Do not invent backend API contracts.

Follow the actual backend API and `PROJECT_SPEC.md`.

---

## Forms

Use:

- React Hook Form
- Zod

Forms should provide:

- labels
- validation messages
- loading/submitting states
- duplicate-submit prevention
- useful API error feedback

Do not create custom form infrastructure unless there is a real need.

---

## UX and Accessibility

For asynchronous pages, consider:

- loading state
- error state
- empty state
- success feedback when useful

UI should be:

- responsive
- understandable
- keyboard usable
- semantically structured

Use proper labels and meaningful button text.

Preserve visible focus states.

Do not prioritize decorative complexity over usability.

---

## Code Quality

Prefer simple and readable code.

Avoid:

- unnecessary abstractions
- huge components
- duplicated API logic
- duplicated validation
- premature generic components
- unnecessary dependencies
- premature performance optimization

Extract reusable components only when there is actual reuse or clear
separation of responsibility.

---

## Stage Boundaries

Do not implement future-stage functionality.

In particular, Stage 1 foundation work must not prematurely implement:

- Login workflow
- Registration workflow
- AuthContext business behavior
- route guards
- Job Seeker pages
- Company pages
- application API integration

Those belong to later stages.

---

## Validation

Before completing relevant work, run available checks such as:

```bash
npm run build
npm run lint

Never claim a command passed unless it actually ran successfully.

If the environment prevents validation, report the limitation clearly.

Ambiguity
---------

If a decision could materially change:

*   frontend architecture
    
*   API contracts
    
*   authentication behavior
    
*   security
    
*   routing strategy
    
*   major user workflow
    

stop and ask before implementing it.

For small coding decisions, choose the simplest maintainable option.

Completion Report
-----------------

At the end of a task report:

*   summary
    
*   files created
    
*   files modified
    
*   dependencies changed
    
*   security considerations
    
*   validation commands and actual results
    
*   known limitations
    
*   recommended next stage
    

Do not automatically start the next stage.