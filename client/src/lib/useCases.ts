export interface UseCase {
  id: number;
  title: string;
  category: "JML" | "Compliance" | "RBAC" | "Workflows" | "Governance" | "Infrastructure";
  complexity: "Beginner" | "Intermediate" | "Advanced";
  businessRequirement: string;
  technicalSpecifications: string[];
  keywords: string[];
}

export const useCases: UseCase[] = [
  {
    id: 1,
    title: "Complex Joiner with Multi-Source Correlation",
    category: "JML",
    complexity: "Advanced",
    businessRequirement:
      "A new employee is hired and exists in both the HR system (Workday) and a secondary Contractor Management System. SailPoint must correlate these two records into a single identity to prevent duplicate accounts and ensure birthright access is granted based on the combined attributes.",
    technicalSpecifications: [
      "Authoritative Sources: Configure two Applications as authoritative.",
      "Correlation Rule: Implement a Correlation Rule (BeanShell) that searches for existing identities using a unique identifier like employeeNumber or a composite key (e.g., lastName + last4SSN).",
      "Identity Mapping: Map attributes from both sources into the Identity object (e.g., jobTitle from HR and contractorType from CMS).",
      "Role Assignment: Define Business Roles with Membership Criteria that evaluate attributes from both sources (e.g., department == 'Finance' && contractorType == 'External').",
    ],
    keywords: ["correlation", "multi-source", "identity", "joiner", "birthright"],
  },
  {
    id: 2,
    title: "Time-Bound Mover with Grace Period",
    category: "JML",
    complexity: "Advanced",
    businessRequirement:
      "An employee moves from Department A to Department B. They need immediate access to Dept B's resources but must retain Dept A's access for a 7-day grace period to finish pending tasks.",
    technicalSpecifications: [
      "Lifecycle Event: Configure a Mover event triggered by a change in the department attribute.",
      "Custom Workflow: Customize the LCM Mover workflow to include a Wait step or create a Request object with an execution date set to 7 days in the future.",
      "Identity Attribute: Create a temporary attribute accessRetentionExpiry to track the revocation date.",
      "Task Definition: Use the Perform Maintenance task to process expired access requests.",
    ],
    keywords: ["mover", "grace period", "lifecycle", "department", "workflow"],
  },
  {
    id: 3,
    title: "Immediate Leaver with Legal Hold",
    category: "JML",
    complexity: "Advanced",
    businessRequirement:
      "When a high-risk employee leaves, all access must be disabled immediately, but their mailbox and home directory must be placed on Legal Hold (not deleted) for 90 days.",
    technicalSpecifications: [
      "Identity Trigger: Monitor active status in HR source.",
      "Workflow Logic: Use LCM Leaver to disable accounts.",
      "Connector Customization: Add a Provisioning Policy for Active Directory to toggle msExchLitigationHoldEnabled to true.",
      "Retention Task: Create a Scheduled Task (BeanShell) that queries identities with terminatedDate > 90 days and legalHold == true to trigger final deletion.",
    ],
    keywords: ["leaver", "legal hold", "compliance", "retention", "security"],
  },
  {
    id: 4,
    title: "Rehire with Identity History Restoration",
    category: "JML",
    complexity: "Intermediate",
    businessRequirement:
      "A former employee returns after 6 months. SailPoint should recognize them as a rehire, restore their previous Identity History (for audit), but only grant new birthright access based on their current role.",
    technicalSpecifications: [
      "Identity Correlation: Match with inactive identities.",
      "Lifecycle Event: Rehire event logic.",
      "Audit Logs: Preservation of historical snapshots.",
    ],
    keywords: ["rehire", "history", "audit", "identity", "restoration"],
  },
  {
    id: 5,
    title: "Micro-Certification for High-Risk Entitlements",
    category: "Compliance",
    complexity: "Advanced",
    businessRequirement:
      "Any time a user is granted Domain Admin or Superuser access, a targeted certification must be triggered immediately for their manager to approve, rather than waiting for the quarterly cycle.",
    technicalSpecifications: [
      "Event-Based Certification: Triggered via a Workflow after a provisioning event.",
      "Certification Definition: Targeted at specific high-risk entitlements.",
    ],
    keywords: ["certification", "compliance", "high-risk", "approval", "domain admin"],
  },
  {
    id: 6,
    title: "Continuous Compliance with Automated Remediation",
    category: "Compliance",
    complexity: "Advanced",
    businessRequirement:
      "If a user is found to have a Toxic Combination of entitlements (SoD violation), SailPoint should automatically revoke the most recently added entitlement and notify the Security Operations Center (SOC).",
    technicalSpecifications: [
      "SoD Policy: Detective vs. Preventative.",
      "Policy Violation Workflow: Custom remediation logic in the PolicyViolation workflow.",
    ],
    keywords: ["SoD", "compliance", "remediation", "violation", "security"],
  },
  {
    id: 7,
    title: "Manager Delegation and Re-assignment",
    category: "Compliance",
    complexity: "Intermediate",
    businessRequirement:
      "During a certification campaign, if a manager is on leave, their certifications should automatically delegate to their designated backup. If no backup is found, it should escalate to the next level of management.",
    technicalSpecifications: [
      "Delegation Rules: Workgroup-based or attribute-based delegation.",
      "Escalation Logic: Custom rule in the Certification Definition.",
    ],
    keywords: ["delegation", "certification", "escalation", "manager", "backup"],
  },
  {
    id: 8,
    title: "Dynamic Role Mining and Refinement",
    category: "RBAC",
    complexity: "Intermediate",
    businessRequirement:
      "The business wants to identify common access patterns among users in the Finance department to create new IT roles.",
    technicalSpecifications: [
      "Role Mining: IdentityIQ Role Mining tool (Directed vs. Undirected).",
      "Role Archive: Versioning of roles during refinement.",
    ],
    keywords: ["role mining", "RBAC", "patterns", "finance", "refinement"],
  },
  {
    id: 9,
    title: "Attribute-Based Access Control (ABAC) for Sensitive Data",
    category: "RBAC",
    complexity: "Advanced",
    businessRequirement:
      "Access to a Sensitive Project folder is granted only if the user's ProjectCode matches the folder's ProjectCode and their ClearanceLevel is 'Secret'.",
    technicalSpecifications: [
      "Match Rules: Complex filters using identity and account attributes.",
      "Provisioning Rules: Rule-based assignment of entitlements.",
    ],
    keywords: ["ABAC", "access control", "attributes", "sensitive data", "rules"],
  },
  {
    id: 10,
    title: "Multi-Tier Approval with Dynamic Routing",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "Access requests for the SAP Production environment require approval from the Manager, the SAP Resource Owner, and finally the Security Team. If the request is >$10,000 in value (custom field), it requires CFO approval.",
    technicalSpecifications: [
      "Workflow Customization: Subprocess or modify LCM Provisioning workflow.",
      "Approval Schemes: Use manager, owner, and security approval schemes.",
      "Dynamic Scripting: In the Approval step, use a BeanShell script to check the value attribute from the Attributes map of the ProvisioningPlan.",
      "Workgroups: Define a CFO_Approvers workgroup for the conditional step.",
    ],
    keywords: ["approval", "workflow", "routing", "SAP", "multi-tier"],
  },
  {
    id: 11,
    title: "ServiceNow Ticket Integration for Manual Fulfillment",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "For disconnected applications, SailPoint should open a ServiceNow ticket for manual provisioning, wait for the ticket to be closed, and then update the identity's status.",
    technicalSpecifications: [
      "ServiceNow Integration Module (SIM): Integration via REST API.",
      "Ticketing Workflow: Logic to poll for ticket status or handle inbound webhooks.",
    ],
    keywords: ["ServiceNow", "integration", "workflow", "manual", "fulfillment"],
  },
  {
    id: 12,
    title: "Password Management with Intercept",
    category: "Workflows",
    complexity: "Intermediate",
    businessRequirement:
      "When a user changes their password in Active Directory, it should automatically sync to their SAP and Salesforce accounts.",
    technicalSpecifications: [
      "Password Intercept Agent: Installed on Domain Controllers.",
      "Password Sync Group: Configuration in IIQ to group applications for sync.",
    ],
    keywords: ["password", "sync", "intercept", "Active Directory", "provisioning"],
  },
  {
    id: 13,
    title: "Service Account Governance",
    category: "Governance",
    complexity: "Intermediate",
    businessRequirement:
      "Service accounts must have a designated Human Owner. If the owner leaves the company, a Mover event should trigger a request to assign a new owner.",
    technicalSpecifications: [
      "Account Attributes: serviceAccountOwner linked to an Identity.",
      "Account Certification: Targeted at accounts where isServiceAccount = true.",
    ],
    keywords: ["service account", "governance", "owner", "certification", "compliance"],
  },
  {
    id: 14,
    title: "Contractor Lifecycle with Sponsor Approval",
    category: "Governance",
    complexity: "Advanced",
    businessRequirement:
      "Contractors are given access for a maximum of 90 days. 10 days before expiry, the internal sponsor must approve an extension, or access is automatically revoked.",
    technicalSpecifications: [
      "Attribute Definition: Add endDate and sponsor (Identity reference) to the Identity model.",
      "Task Definition: Create a Scheduled Task that runs daily, identifying contractors where endDate is 10 days away.",
      "Workflow Launch: The task should launch a custom Contractor Extension workflow.",
      "Approval Step: Route approval to the identity stored in the sponsor attribute.",
      "Escalation: If no response in 5 days, escalate to the Sponsor's Manager.",
    ],
    keywords: ["contractor", "lifecycle", "sponsor", "approval", "expiry"],
  },
  {
    id: 15,
    title: "Self-Service Access Request with Risk Scoring",
    category: "Governance",
    complexity: "Advanced",
    businessRequirement:
      "When a user requests access, SailPoint should display a Risk Score. If the risk is High, the workflow should require an additional executive approval level.",
    technicalSpecifications: [
      "Identity Risk Model: Configuration of risk factors (Composite Risk Score).",
      "Workflow Branching: Based on plan.getRiskScore().",
    ],
    keywords: ["risk scoring", "self-service", "approval", "governance", "workflow"],
  },
  {
    id: 16,
    title: "Custom Reporting for Audit Compliance",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "Generate a weekly report showing all Out-of-Band changes (access granted directly in the target system, not through SailPoint).",
    technicalSpecifications: [
      "Uncorrelated Account Report: Standard report.",
      "Custom Task: Task to compare AccountRequest logs with current account state.",
    ],
    keywords: ["reporting", "audit", "compliance", "out-of-band", "changes"],
  },
  {
    id: 17,
    title: "Multi-Threaded Aggregation Tuning",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "A lab environment simulating 100,000 users needs optimized aggregation from a flat file.",
    technicalSpecifications: [
      "Task Definition: Partitioning and multi-threading settings.",
      "Connector Rules: Optimization of BeanShell rules to reduce memory footprint.",
    ],
    keywords: ["aggregation", "performance", "tuning", "infrastructure", "optimization"],
  },
  {
    id: 18,
    title: "API-Based Identity Creation (Headless)",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "A custom external portal needs to trigger identity creation in SailPoint via REST API.",
    technicalSpecifications: [
      "IdentityIQ REST API: Use of /identities or custom SCIM endpoints.",
      "OAuth2 Authentication: Securing the API calls.",
    ],
    keywords: ["API", "REST", "identity creation", "headless", "integration"],
  },
  {
    id: 19,
    title: "Plugin Development for Custom UI",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "Create a custom dashboard widget that shows the Top 5 Users with Most Entitlements for the Security Team.",
    technicalSpecifications: [
      "Plugin Framework: Java classes for the backend and Angular/Snippet for the frontend.",
      "Custom SQL Query: To fetch data from the IIQ database efficiently.",
    ],
    keywords: ["plugin", "custom UI", "dashboard", "development", "Java"],
  },
  {
    id: 20,
    title: "Disaster Recovery - IdentityIQ Sandbox Sync",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "Synchronize configuration (Rules, Workflows, Task Definitions) from the Lab environment to a Backup environment using the Console.",
    technicalSpecifications: [
      "IIQ Console: import and export commands.",
      "XML Object Models: Understanding the structure of IIQ objects.",
    ],
    keywords: ["disaster recovery", "backup", "sync", "configuration", "console"],
  },
];

export const categories = [
  { id: "JML", label: "Identity Lifecycle Management", color: "bg-blue-600" },
  { id: "Compliance", label: "Access Certification & Compliance", color: "bg-purple-600" },
  { id: "RBAC", label: "Role-Based Access Control", color: "bg-indigo-600" },
  { id: "Workflows", label: "Custom Workflows & Integrations", color: "bg-cyan-600" },
  { id: "Governance", label: "Advanced Governance & Intelligence", color: "bg-teal-600" },
  { id: "Infrastructure", label: "Infrastructure & Troubleshooting", color: "bg-slate-600" },
];

export const complexityLevels = [
  { id: "Beginner", label: "Beginner", color: "text-green-500" },
  { id: "Intermediate", label: "Intermediate", color: "text-yellow-500" },
  { id: "Advanced", label: "Advanced", color: "text-red-500" },
];
