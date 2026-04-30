import { describe, expect, it } from "vitest";
import {
  generateAgentCard,
  normalizeField,
  parseCards,
  serializeCards,
  validateForm,
  type AgentFormValues
} from "../lib/agent-card";

const sample: AgentFormValues = {
  agentIdea: "An AI agent that helps teams triage inbound customer requests.",
  targetUser: "Support managers",
  industry: "Customer support",
  taskToAutomate: "Classify tickets and draft replies",
  availableDataSources: "Email inbox, helpdesk, and knowledge base"
};

describe("normalizeField", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeField("  hello   world  ")).toBe("hello world");
  });
});

describe("validateForm", () => {
  it("returns validation issues for incomplete input", () => {
    const result = validateForm({
      agentIdea: "idea",
      targetUser: "",
      industry: "",
      taskToAutomate: "",
      availableDataSources: ""
    });

    expect(result).toHaveLength(5);
    expect(result).toContain("Add a clearer agent idea.");
  });

  it("accepts complete input", () => {
    expect(validateForm(sample)).toEqual([]);
  });
});

describe("generateAgentCard", () => {
  it("creates a deterministic-looking card from the supplied idea", () => {
    const card = generateAgentCard(sample);

    expect(card.agentName).toContain("Agent");
    expect(card.targetUser).toBe("Support managers");
    expect(card.workflow).toHaveLength(5);
    expect(card.toolsNeeded).toContain("Email parser");
    expect(card.markdown).toContain("#");
    expect(card.markdown).toContain("## 7-day build plan");
  });
});

describe("serialization", () => {
  it("round-trips saved cards", () => {
    const card = generateAgentCard(sample);
    expect(parseCards(serializeCards([card]))).toHaveLength(1);
  });

  it("returns an empty list for malformed input", () => {
    expect(parseCards("not-json")).toEqual([]);
  });
});
