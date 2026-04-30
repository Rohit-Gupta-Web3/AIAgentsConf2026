# Test Cases

This directory contains focused unit tests for the deterministic Agent Card logic.

## Coverage

- `agent-card.test.ts`
  - `normalizeField`
  - `validateForm`
  - `generateAgentCard`
  - `serializeCards` and `parseCards`

## Purpose

The tests verify the app's core behavior without relying on a backend, external APIs, or browser-only state. This keeps the suite fast and stable while covering:

- positive input paths
- invalid input handling
- deterministic card generation
- saved-card serialization
