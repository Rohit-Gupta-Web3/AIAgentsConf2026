# Agent Card Builder

Agent Card Builder is a minimal Next.js app that helps a non-technical user turn a rough AI agent idea into a clear, practical Agent Card.

## What it does

- Uses the Next.js App Router with TypeScript and Tailwind CSS
- Runs fully in the browser with `localStorage` only
- Generates deterministic Agent Cards without any API calls
- Saves, deletes, copies, and exports cards as Markdown
- Keeps the UI minimal, responsive, and accessible

## Included output

Each generated Agent Card includes:

- Agent name
- One-line pitch
- Problem solved
- Target user
- 5-step workflow
- Tools/APIs needed
- Guardrails
- MVP features
- 7-day build plan

## UX flow

1. Read the hero message and start from the sample idea or your own rough idea.
2. Fill in the form fields.
3. Generate a card with deterministic mock logic.
4. Save the card locally, copy it as Markdown, or export it as a `.md` file.
5. Review and manage saved cards below the main generator.

## Validation and empty states

- Required fields are validated before generation.
- Empty saved-state and empty output-state panels are shown when there is nothing to display.
- Clipboard copy errors fall back to the export path.

## Test coverage

- Pure generator and validation logic
- Serialization and parse failure handling

Detailed test structure and coverage notes live in [`tests/README.md`](tests/README.md).

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

## Sample idea

The app ships with a sample idea for a procurement-focused AI agent that helps small businesses find vendors, compare quotations, contact suppliers, and rank the best options.
