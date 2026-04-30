"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AgentCard,
  AgentFormValues,
  generateAgentCard,
  parseCards,
  serializeCards,
  validateForm
} from "@/lib/agent-card";

const STORAGE_KEY = "agent-card-builder:saved-cards";

const initialForm: AgentFormValues = {
  agentIdea: "",
  targetUser: "",
  industry: "",
  taskToAutomate: "",
  availableDataSources: ""
};

const sampleForm: AgentFormValues = {
  agentIdea: "An AI agent that helps small businesses find vendors, compare quotations, contact suppliers, and rank the best options.",
  targetUser: "Small business owners and procurement teams",
  industry: "B2B sourcing and procurement",
  taskToAutomate: "Vendor discovery, quotation comparison, and supplier ranking",
  availableDataSources: "Google search, vendor websites, email replies, WhatsApp messages, and spreadsheets"
};

function downloadMarkdown(filename: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function labelValue(value: string) {
  return value.trim().length > 0 ? value : "Not provided";
}

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [currentCard, setCurrentCard] = useState<AgentCard | null>(null);
  const [savedCards, setSavedCards] = useState<AgentCard[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restored = parseCards(window.localStorage.getItem(STORAGE_KEY));
    setSavedCards(restored);
    if (restored.length > 0) {
      setCurrentCard(restored[0]);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, serializeCards(savedCards));
  }, [isHydrated, savedCards]);

  const hasCurrentCard = Boolean(currentCard);
  const exportFileName = useMemo(() => {
    if (!currentCard) {
      return "agent-card.md";
    }

    const slug = currentCard.agentName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `${slug || "agent-card"}.md`;
  }, [currentCard]);

  function updateField<K extends keyof AgentFormValues>(field: K, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors([]);
    setStatus("");
  }

  function handleGenerate(nextForm = form) {
    const validationErrors = validateForm(nextForm);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setStatus("");
      return;
    }

    const card = generateAgentCard(nextForm);
    setCurrentCard(card);
    setSavedCards((previous) => {
      const filtered = previous.filter((item) => item.markdown !== card.markdown);
      return [card, ...filtered].slice(0, 8);
    });
    setErrors([]);
    setStatus("Agent Card generated and saved locally.");
  }

  async function handleCopy() {
    if (!currentCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(currentCard.markdown);
      setStatus("Markdown copied to clipboard.");
    } catch {
      setStatus("Copy failed. Use export instead.");
    }
  }

  function handleExport() {
    if (!currentCard) {
      return;
    }

    downloadMarkdown(exportFileName, currentCard.markdown);
    setStatus("Markdown export started.");
  }

  function handleSaveCurrent() {
    if (!currentCard) {
      return;
    }

    setSavedCards((previous) => {
      const exists = previous.some((item) => item.id === currentCard.id);
      if (exists) {
        return previous;
      }
      return [currentCard, ...previous].slice(0, 8);
    });
    setStatus("Saved to your local library.");
  }

  function handleDelete(id: string) {
    setSavedCards((previous) => previous.filter((card) => card.id !== id));
    if (currentCard?.id === id) {
      setCurrentCard(null);
    }
    setStatus("Saved card deleted.");
  }

  function handleSample() {
    setForm(sampleForm);
    setErrors([]);
    setStatus("Sample idea loaded.");
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-glow backdrop-blur md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-teal-900/70">
            <span className="rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1">Agent Card Builder</span>
            <span className="text-slate-500">No backend</span>
            <span className="text-slate-500">Local only</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Build Your AI Agent Plan in Minutes
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Enter an idea. Get a practical AI agent card with workflow, tools, risks, and MVP steps.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-teal-900/10 bg-teal-950 p-5 text-teal-50 shadow-[0_20px_60px_rgba(15,118,110,0.25)]">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-100/70">Fast start</p>
              <p className="mt-3 text-lg font-medium">Generate a clean plan without writing prompts from scratch.</p>
              <button
                type="button"
                onClick={() => {
                  handleSample();
                  handleGenerate(sampleForm);
                }}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Generate Agent Card
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <form
            className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-glow backdrop-blur"
            onSubmit={(event) => {
              event.preventDefault();
              handleGenerate();
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Describe the idea</h2>
                <p className="mt-1 text-sm text-slate-600">Keep it rough. The app turns it into a structured agent plan.</p>
              </div>
              <button
                type="button"
                onClick={handleSample}
                className="rounded-full border border-teal-900/10 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Sample idea
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Agent idea" required>
                <textarea
                  value={form.agentIdea}
                  onChange={(event) => updateField("agentIdea", event.target.value)}
                  rows={4}
                  className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  placeholder="Describe the rough AI agent idea"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Target user" required>
                  <input
                    value={form.targetUser}
                    onChange={(event) => updateField("targetUser", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="Who will use it?"
                  />
                </Field>
                <Field label="Industry" required>
                  <input
                    value={form.industry}
                    onChange={(event) => updateField("industry", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="Example: healthcare"
                  />
                </Field>
              </div>
              <Field label="Task to automate" required>
                <textarea
                  value={form.taskToAutomate}
                  onChange={(event) => updateField("taskToAutomate", event.target.value)}
                  rows={3}
                  className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  placeholder="What should the agent do?"
                />
              </Field>
              <Field label="Available data sources" required>
                <textarea
                  value={form.availableDataSources}
                  onChange={(event) => updateField("availableDataSources", event.target.value)}
                  rows={3}
                  className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  placeholder="List data sources, systems, or documents"
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-teal-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Generate Agent Card
              </button>
              {hasCurrentCard ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveCurrent}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    Save current card
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    Copy Markdown
                  </button>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    Export .md
                  </button>
                </>
              ) : null}
            </div>

            <div className="mt-5 min-h-6 text-sm">
              {errors.length > 0 ? (
                <ul className="space-y-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : null}
              {status ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">{status}</p> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-glow backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Generated Agent Card</h2>
                <p className="mt-1 text-sm text-slate-600">Deterministic output based on the fields you provide.</p>
              </div>
              {currentCard ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Ready
                </span>
              ) : null}
            </div>

            {!currentCard ? (
              <EmptyState title="No card generated yet" description="Fill in the form or load the sample idea to generate your first Agent Card." />
            ) : (
              <article className="mt-6 space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 px-5 py-5 text-white">
                  <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Agent name</p>
                  <h3 className="mt-2 text-2xl font-semibold">{currentCard.agentName}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{currentCard.oneLinePitch}</p>
                </div>

                <CardSection title="Problem solved">
                  <p>{currentCard.problemSolved}</p>
                </CardSection>
                <CardSection title="Target user">
                  <p>{currentCard.targetUser}</p>
                </CardSection>
                <CardSection title="5-step workflow">
                  <ol className="space-y-2">
                    {currentCard.workflow.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-900">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardSection>
                <CardSection title="Tools / APIs needed">
                  <ul className="flex flex-wrap gap-2">
                    {currentCard.toolsNeeded.map((tool) => (
                      <li key={tool} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </CardSection>
                <CardSection title="Guardrails">
                  <ul className="space-y-2">
                    {currentCard.guardrails.map((guardrail) => (
                      <li key={guardrail} className="text-slate-700">
                        {guardrail}
                      </li>
                    ))}
                  </ul>
                </CardSection>
                <CardSection title="MVP features">
                  <ul className="space-y-2">
                    {currentCard.mvpFeatures.map((feature) => (
                      <li key={feature} className="text-slate-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardSection>
                <CardSection title="7-day build plan">
                  <ul className="space-y-2">
                    {currentCard.buildPlan.map((day) => (
                      <li key={day} className="text-slate-700">
                        {day}
                      </li>
                    ))}
                  </ul>
                </CardSection>
                <CardSection title="Source snapshot">
                  <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-slate-900">Idea</dt>
                      <dd className="mt-1">{labelValue(currentCard.source.agentIdea)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Task</dt>
                      <dd className="mt-1">{labelValue(currentCard.source.taskToAutomate)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Industry</dt>
                      <dd className="mt-1">{labelValue(currentCard.source.industry)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">Data sources</dt>
                      <dd className="mt-1">{labelValue(currentCard.source.availableDataSources)}</dd>
                    </div>
                  </dl>
                </CardSection>
              </article>
            )}
          </section>
        </section>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-glow backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Saved cards</h2>
              <p className="mt-1 text-sm text-slate-600">Stored locally in your browser.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              {savedCards.length} saved
            </span>
          </div>

          {savedCards.length === 0 ? (
            <EmptyState title="No saved cards yet" description="Generate a card to save it here." />
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savedCards.map((card) => (
                <article key={card.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Saved card</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{card.agentName}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{card.oneLinePitch}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentCard(card)}
                      className="rounded-full bg-teal-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadMarkdown(`${card.agentName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "agent-card"}.md`, card.markdown)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(card.markdown);
                          setStatus("Saved card copied as Markdown.");
                        } catch {
                          setStatus("Copy failed. Use export instead.");
                        }
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(card.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children
}: Readonly<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Required</span> : null}
      </span>
      {children}
    </label>
  );
}

function CardSection({
  title,
  children
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-[1.35rem] border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</h4>
      <div className="mt-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function EmptyState({
  title,
  description
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
