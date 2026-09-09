export const approvedClientResources = [
  {
    id: "architecture-decision-brief",
    title: "Architecture decision brief",
    category: "Discovery",
    summary: "A concise structure for documenting the decision, constraints, affected systems, and accountable roles after an advisory discussion.",
    sections: ["Decision to make", "Architecture and control constraints", "Options considered", "Agreed next increment"],
  },
  {
    id: "delivery-control-checkpoint",
    title: "Delivery control checkpoint",
    category: "Delivery controls",
    summary: "A safe, high-level checkpoint for aligning IAM change scope with review evidence, release approvals, and rollback considerations.",
    sections: ["Scope boundary", "Validation evidence", "Approval and release gate", "Rollback and communication"],
  },
  {
    id: "integration-readiness-prompts",
    title: "Integration readiness prompts",
    category: "Integration",
    summary: "A conversation guide for reviewing connector dependencies, ownership, non-production validation, and exception handling.",
    sections: ["System and connector owners", "Environment readiness", "Lifecycle and error handling", "Support model"],
  },
] as const;
