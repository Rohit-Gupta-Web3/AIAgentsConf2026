# From Idea to App in Minutes: Building with Codex Skills

Welcome to the demo repository for the session:

## No Coding Required

This session shows how anyone can use **Codex + Superpowers skills** to turn a simple idea into a working app without manually writing code.

The goal is simple:

> Give Codex an idea in plain English and let it help brainstorm, plan, build, test, and verify the app.

## What You Will Learn

By the end of this demo, you will understand how to:

- Install Superpowers skills in Codex
- Use existing skills instead of creating your own
- Describe an app idea in plain English
- Ask Codex to build a complete working app
- Iterate on the app with follow-up prompts
- Use skills as a repeatable product-building workflow

## What Are Superpowers Skills?

Superpowers skills are ready-made workflows that help Codex follow a better software-building process.

Instead of asking Codex to immediately write code, Superpowers encourages a structured flow:

1. Brainstorm the idea
2. Write a small implementation plan
3. Execute the plan
4. Add tests or verification
5. Review the result
6. Fix issues before completion

This makes Codex more reliable for building real apps.

## Reference

Superpowers GitHub Repository:  
<https://github.com/obra/superpowers>

This repository is referenced only for learning, installation, and understanding how Superpowers skills work with Codex.

## Demo App: Agent Card Builder

In this session, we will build a small app called:

## Agent Card Builder

Agent Card Builder helps users convert a rough AI agent idea into a clean execution card.

For example, a user can enter:

> I want an AI agent that helps small businesses find vendors and compare quotations.

The app will generate an **Agent Card** with:

- Agent name
- One-line pitch
- Problem solved
- Target user
- Workflow steps
- Tools/APIs needed
- Guardrails
- MVP features
- 7-day build plan
- Markdown export

## Install or Verify Superpowers Skills

Paste this first if Superpowers skills are not already installed or visible in Codex.

```text
Install or verify Superpowers skills for Codex.

I want to use existing Superpowers skills in this session, not create a new custom skill.

Please check whether Superpowers skills are available. If they are not available, guide me through the correct installation steps for Codex.

After setup, confirm that Codex can use Superpowers skills for brainstorming, planning, implementation, testing, review, and verification.
```

## Build the App

Use this as the main app-building prompt.

```text
Use Superpowers for this task. Start with brainstorming, then write a small implementation plan, then execute it, test it, and verify before completion.

Build a complete minimal Next.js app called “Agent Card Builder”.

The app should help a non-technical user convert a rough AI agent idea into a clear Agent Card.

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- No backend
- No database
- No auth
- No external APIs
- localStorage only

The app should have:

1. Hero section
Title: “Build Your AI Agent Plan in Minutes”
Subtitle: “Enter an idea. Get a practical AI agent card with workflow, tools, risks, and MVP steps.”
CTA: “Generate Agent Card”

2. Input form
Fields:
- Agent idea
- Target user
- Industry
- Task to automate
- Available data sources

3. Generated Agent Card
Generate using deterministic mock logic, not an API.

Output:
- Agent name
- One-line pitch
- Problem solved
- Target user
- 5-step workflow
- Tools/APIs needed
- Guardrails
- MVP features
- 7-day build plan

4. Save and export
- Save generated cards to localStorage
- Show saved cards below
- Delete saved cards
- Copy Agent Card as Markdown
- Export Agent Card as .md file

Quality:
- Minimal premium UI
- Mobile responsive
- Accessible labels
- Empty states
- Validation
- Sample idea button
- Build must pass
- Fix all errors before final response
```

## Sample Input for the App

Use this sample input inside the app during the live demo.

```text
Agent idea:
An AI agent that helps small businesses find vendors, compare quotations, contact suppliers, and rank the best options.

Target user:
Small business owners and procurement teams.

Industry:
B2B sourcing and procurement.

Task to automate:
Vendor discovery, quotation comparison, and supplier ranking.

Available data sources:
Google search, vendor websites, email replies, WhatsApp messages, and spreadsheets.
```

## Add Founder Mode

After the first version works, use this prompt to show how Codex can safely improve an existing app.

```text
Use Superpowers to safely extend the existing app.

Add a “Founder Mode” toggle. When enabled, the generated Agent Card should also include:
- Market opportunity
- Revenue model
- Why now
- 30-day launch plan

Keep the app minimal. Do not add a backend. Update tests if needed and verify before completion.
```

## Add Lead Capture

Use this only if extra time is available.

```text
Use Superpowers to safely extend the existing app.

Add a simple lead capture section before exporting the Agent Card.

The lead form should collect:
- Name
- Email
- Company
- Use case

Save leads locally using localStorage.

Add:
- Saved leads section
- Delete lead option
- Export leads as CSV

Do not add backend, authentication, database, or external APIs.

Keep the UI minimal and clean. Update tests if needed and verify before completion.
```

## Backup Prompt

Use this if time is running short.

```text
Use Superpowers to build the simplest possible version of Agent Card Builder as a single-page Next.js app.

It should have:
- One textarea for an AI agent idea
- One Generate button
- One output card showing:
  - Agent name
  - Pitch
  - Workflow
  - Tools needed
  - Guardrails
  - MVP steps

Use mock logic only. No backend. No database. No auth. No external APIs.

Make it look clean, mobile responsive, and run successfully.

Verify the build before completion.
```

## Key Takeaway

Codex Skills are not just about faster coding.

They help turn software development into a repeatable process.

> A non-coder can describe what they want, and Codex can help move from idea to working app through a structured workflow.
