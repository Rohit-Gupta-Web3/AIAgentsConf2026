export type AgentFormValues = {
  agentIdea: string;
  targetUser: string;
  industry: string;
  taskToAutomate: string;
  availableDataSources: string;
};

export type AgentCard = {
  id: string;
  createdAt: string;
  agentName: string;
  oneLinePitch: string;
  problemSolved: string;
  targetUser: string;
  workflow: string[];
  toolsNeeded: string[];
  guardrails: string[];
  mvpFeatures: string[];
  buildPlan: string[];
  markdown: string;
  source: AgentFormValues;
};

export const MAX_FIELD_LENGTH = 500;

const stopWords = new Set([
  "a",
  "an",
  "and",
  "for",
  "from",
  "help",
  "helps",
  "in",
  "into",
  "of",
  "on",
  "that",
  "the",
  "to",
  "with"
]);

const workflowTemplates = [
  "Capture the request and classify intent.",
  "Gather the minimum data required from the approved sources.",
  "Rank options using the defined criteria and guardrails.",
  "Draft a recommended action with clear rationale.",
  "Hand off the final result for human review or approval."
];

const buildPlanTemplates = [
  "Day 1: confirm the user story, success metric, and sample inputs.",
  "Day 2: sketch the card fields and validation rules.",
  "Day 3: implement deterministic generation and markdown output.",
  "Day 4: add save, delete, and copy/export flows.",
  "Day 5: refine mobile layout and empty states.",
  "Day 6: test validation, generator logic, and persistence edge cases.",
  "Day 7: polish the launch copy and verify the app shell."
];

export function normalizeField(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateForm(values: AgentFormValues): string[] {
  const issues: string[] = [];

  if (normalizeField(values.agentIdea).length < 10) {
    issues.push("Add a clearer agent idea.");
  }

  if (normalizeField(values.targetUser).length < 3) {
    issues.push("Tell us who will use the agent.");
  }

  if (normalizeField(values.industry).length < 3) {
    issues.push("Add an industry.");
  }

  if (normalizeField(values.taskToAutomate).length < 5) {
    issues.push("Describe the task to automate.");
  }

  if (normalizeField(values.availableDataSources).length < 3) {
    issues.push("List at least one data source.");
  }

  return issues;
}

function splitWords(input: string): string[] {
  return normalizeField(input)
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function selectKeywords(input: string, max = 2): string[] {
  const words = splitWords(input).filter((word) => !stopWords.has(word) && word.length > 2);
  const unique = Array.from(new Set(words));
  return unique.slice(0, max);
}

function buildAgentName(values: AgentFormValues): string {
  const keywords = selectKeywords(values.taskToAutomate || values.agentIdea, 2);
  const industryKeyword = selectKeywords(values.industry, 1)[0];
  const base = keywords.length ? keywords.map(titleCase).join(" ") : "Agent";
  if (industryKeyword) {
    return `${base} ${titleCase(industryKeyword)} Agent`;
  }
  return `${base} Agent`;
}

function buildProblemSolved(values: AgentFormValues): string {
  const task = normalizeField(values.taskToAutomate);
  const industry = normalizeField(values.industry);
  return `It removes the manual work around ${task.toLowerCase()} so ${industry.toLowerCase()} teams can move faster with fewer handoffs.`;
}

function buildPitch(values: AgentFormValues, agentName: string): string {
  const targetUser = normalizeField(values.targetUser);
  const task = normalizeField(values.taskToAutomate);
  return `${agentName} helps ${targetUser.toLowerCase()} automate ${task.toLowerCase()} with a simple, reviewable workflow.`;
}

function buildWorkflow(values: AgentFormValues): string[] {
  const idea = normalizeField(values.agentIdea);
  return [
    `Understand the goal: ${idea}.`,
    workflowTemplates[0],
    workflowTemplates[1],
    workflowTemplates[2],
    workflowTemplates[4]
  ];
}

function buildTools(values: AgentFormValues): string[] {
  const sources = splitWords(values.availableDataSources);
  const tools = new Set<string>(["Next.js UI", "localStorage", "Markdown export"]);

  if (sources.some((word) => ["email", "gmail", "outlook"].includes(word))) {
    tools.add("Email parser");
  }
  if (sources.some((word) => ["sheet", "spreadsheet", "excel", "csv"].includes(word))) {
    tools.add("Spreadsheet importer");
  }
  if (sources.some((word) => ["web", "website", "google", "search"].includes(word))) {
    tools.add("Web source summarizer");
  }
  if (sources.some((word) => ["whatsapp", "chat", "message"].includes(word))) {
    tools.add("Message intake parser");
  }

  return Array.from(tools);
}

function buildGuardrails(values: AgentFormValues): string[] {
  const targetUser = normalizeField(values.targetUser);
  return [
    `Require human approval before any external action on behalf of ${targetUser.toLowerCase() || "the user"}.`,
    "Only use approved data sources and keep traceable reasoning for every recommendation.",
    "Flag missing, stale, or conflicting inputs instead of guessing."
  ];
}

function buildMvpFeatures(values: AgentFormValues): string[] {
  const task = normalizeField(values.taskToAutomate);
  return [
    `A single form that captures the idea and task for ${task.toLowerCase()}.`,
    "A deterministic Agent Card generator.",
    "Save, delete, copy, and export controls.",
    "A clean review surface with empty states and validation."
  ];
}

function buildSevenDayPlan(values: AgentFormValues): string[] {
  const industry = normalizeField(values.industry);
  return buildPlanTemplates.map((line, index) =>
    index === 1 ? `Day 2: tailor the card fields to ${industry.toLowerCase()} needs.` : line
  );
}

function buildMarkdown(card: Omit<AgentCard, "markdown">): string {
  return [
    `# ${card.agentName}`,
    "",
    `**One-line pitch:** ${card.oneLinePitch}`,
    "",
    `**Problem solved:** ${card.problemSolved}`,
    "",
    `**Target user:** ${card.targetUser}`,
    "",
    "## 5-step workflow",
    ...card.workflow.map((step) => `- ${step}`),
    "",
    "## Tools/APIs needed",
    ...card.toolsNeeded.map((tool) => `- ${tool}`),
    "",
    "## Guardrails",
    ...card.guardrails.map((rule) => `- ${rule}`),
    "",
    "## MVP features",
    ...card.mvpFeatures.map((feature) => `- ${feature}`),
    "",
    "## 7-day build plan",
    ...card.buildPlan.map((day) => `- ${day}`)
  ].join("\n");
}

export function generateAgentCard(values: AgentFormValues): AgentCard {
  const normalized: AgentFormValues = {
    agentIdea: normalizeField(values.agentIdea),
    targetUser: normalizeField(values.targetUser),
    industry: normalizeField(values.industry),
    taskToAutomate: normalizeField(values.taskToAutomate),
    availableDataSources: normalizeField(values.availableDataSources)
  };

  const agentName = buildAgentName(normalized);
  const cardBase = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    agentName,
    oneLinePitch: buildPitch(normalized, agentName),
    problemSolved: buildProblemSolved(normalized),
    targetUser: normalized.targetUser,
    workflow: buildWorkflow(normalized),
    toolsNeeded: buildTools(normalized),
    guardrails: buildGuardrails(normalized),
    mvpFeatures: buildMvpFeatures(normalized),
    buildPlan: buildSevenDayPlan(normalized),
    source: normalized
  };

  return {
    ...cardBase,
    markdown: buildMarkdown(cardBase)
  };
}

export function serializeCards(cards: AgentCard[]): string {
  return JSON.stringify(cards);
}

export function parseCards(raw: string | null): AgentCard[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((card): card is AgentCard => {
      return typeof card === "object" && card !== null && "id" in card && "markdown" in card;
    });
  } catch {
    return [];
  }
}
