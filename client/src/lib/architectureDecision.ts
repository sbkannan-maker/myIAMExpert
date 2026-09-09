export type ArchitecturePath = "iiq" | "isc" | "hybrid";

export type DecisionQuestion = {
  id: string;
  prompt: string;
  supportingText: string;
  options: Array<{ value: ArchitecturePath; label: string; detail: string }>;
};

export const architectureDecisionQuestions: DecisionQuestion[] = [
  {
    id: "delivery-context",
    prompt: "What best describes the delivery context?",
    supportingText: "Choose the operating reality you need to support first.",
    options: [
      { value: "iiq", label: "Established enterprise platform", detail: "I need to work deeply with an existing enterprise governance environment." },
      { value: "isc", label: "Cloud-first service adoption", detail: "I need cloud-delivered onboarding and scalable service operations." },
      { value: "hybrid", label: "Coexisting delivery planes", detail: "I need to evolve across enterprise and cloud delivery contexts together." },
    ],
  },
  {
    id: "control-priority",
    prompt: "Which control outcome leads the decision?",
    supportingText: "Prioritize the governance or delivery capability with the greatest immediate value.",
    options: [
      { value: "iiq", label: "Tailored governance depth", detail: "Complex lifecycle, certification, policy, or workflow extension is the priority." },
      { value: "isc", label: "Rapid cloud connectivity", detail: "Configuration-led connectivity and cloud operating reach are the priority." },
      { value: "hybrid", label: "One control story across both", detail: "Governance, ownership, and evidence must remain clear across multiple delivery planes." },
    ],
  },
  {
    id: "modernization-path",
    prompt: "How will the operating model evolve?",
    supportingText: "Select the path that best represents the next planning horizon.",
    options: [
      { value: "iiq", label: "Extend the existing core", detail: "Build on current integrations and mature enterprise processes." },
      { value: "isc", label: "Adopt cloud delivery progressively", detail: "Accelerate cloud-led adoption for new applications and services." },
      { value: "hybrid", label: "Modernize incrementally", detail: "Keep existing controls stable while introducing cloud capabilities in focused journeys." },
    ],
  },
];

export type ArchitectureDecision = {
  path: ArchitecturePath;
  title: string;
  summary: string;
  nextAction: string;
  catalogCategory: string;
  scores: Record<ArchitecturePath, number>;
};

const decisionCopy: Record<ArchitecturePath, Omit<ArchitectureDecision, "path" | "scores">> = {
  iiq: {
    title: "IdentityIQ is the strongest current fit",
    summary: "Your choices prioritize enterprise governance depth, established integration, and tailored control design. Start with an IIQ-centered delivery plan, then introduce adjacent services only where they simplify a specific outcome.",
    nextAction: "Explore governance, workflow, and advanced IIQ patterns",
    catalogCategory: "Advanced",
  },
  isc: {
    title: "Identity Security Cloud is the strongest current fit",
    summary: "Your choices prioritize cloud-delivered connectivity, scalable service operations, and configuration-led adoption. Start with an ISC-centered delivery plan and make ownership, lifecycle context, and evidence explicit from the first integration.",
    nextAction: "Explore cloud-ready integration and onboarding patterns",
    catalogCategory: "Infrastructure",
  },
  hybrid: {
    title: "A hybrid approach is the strongest current fit",
    summary: "Your choices span enterprise governance depth and cloud delivery reach. Use a hybrid roadmap: define shared ownership and lifecycle policy first, then assign each journey to the delivery plane with the clearest control outcome.",
    nextAction: "Explore integration, governance, and modernization patterns",
    catalogCategory: "Governance",
  },
};

export function recommendArchitecture(answers: Record<string, ArchitecturePath | undefined>): ArchitectureDecision {
  const scores: Record<ArchitecturePath, number> = { iiq: 0, isc: 0, hybrid: 0 };
  architectureDecisionQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer) scores[answer] += 1;
  });

  const topScore = Math.max(scores.iiq, scores.isc, scores.hybrid);
  const leaders = (Object.keys(scores) as ArchitecturePath[]).filter((path) => scores[path] === topScore);
  const path: ArchitecturePath = leaders.length === 1 ? leaders[0] : "hybrid";
  return { path, scores, ...decisionCopy[path] };
}
