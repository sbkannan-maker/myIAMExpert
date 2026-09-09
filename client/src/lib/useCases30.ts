export interface UseCase {
  id: number;
  title: string;
  category: "JML" | "Compliance" | "RBAC" | "Workflows" | "Governance" | "Infrastructure" | "Security" | "Advanced";
  complexity: "Beginner" | "Intermediate" | "Advanced";
  businessRequirement: string;
  technicalSpecifications: string[];
  implementationSteps: string[];
  keywords: string[];
}

export const useCases30: UseCase[] = [
  {
    id: 1,
    title: "Multi-Source Identity Correlation with Deduplication Engine",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "An enterprise with 15 authoritative sources experiences significant identity duplication issues. Employees exist in multiple systems with inconsistent identifiers, leading to duplicate accounts, incorrect access provisioning, and compliance violations. The organization needs an intelligent correlation engine that can match identities across sources using multiple matching strategies and automatically handle edge cases.",
    technicalSpecifications: [
      "Multi-level correlation rule using BeanShell with primary key, composite key, email, and fuzzy matching",
      "Scheduled deduplication task running post-aggregation to identify and merge duplicate identities",
      "Attribute precedence rules with HR data taking precedence over Contractor data",
      "Detailed audit trail maintaining logs of all correlation decisions and manual overrides",
    ],
    implementationSteps: [
      "Design correlation rule with multi-level matching strategies",
      "Configure application correlation with field mappings",
      "Implement deduplication task with merge logic",
      "Create audit reports for compliance tracking",
    ],
    keywords: ["correlation", "deduplication", "multi-source", "identity", "matching"],
  },
  {
    id: 2,
    title: "Dynamic Role-Based Access Control with Attribute-Based Enforcement",
    category: "RBAC",
    complexity: "Advanced",
    businessRequirement:
      "A financial services organization needs fine-grained access control based on multiple identity attributes (department, cost center, clearance level, geographic location, job level). Access decisions must be made dynamically based on real-time attribute values, and changes in attributes should trigger immediate access re-evaluation.",
    technicalSpecifications: [
      "Complex provisioning rules evaluating multiple identity attributes with AND/OR logic",
      "Scheduled task monitoring attribute changes and triggering re-provisioning",
      "Entitlement mapping based on attribute combinations",
      "SoD policy integration ensuring compliance with attribute-based rules",
    ],
    implementationSteps: [
      "Define attribute schema with custom identity attributes",
      "Create provisioning rules evaluating attribute combinations",
      "Implement attribute change detection with re-evaluation",
      "Configure SoD integration with attribute rules",
    ],
    keywords: ["ABAC", "attributes", "access control", "dynamic", "provisioning"],
  },
  {
    id: 3,
    title: "Complex Multi-Tier Approval Workflow with Dynamic Routing",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "A large enterprise requires sophisticated approval workflows where the approval chain varies based on request characteristics. High-value requests (>$50K) require CFO approval, sensitive system access requires security team approval, and cross-department access requires both department heads' approval.",
    technicalSpecifications: [
      "Dynamic approval chain determination based on request attributes (value, entitlement type, cross-department)",
      "Conditional routing to different approval chains using BeanShell decision logic",
      "Automatic escalation after 3 days without approval",
      "Delegation support allowing approvers to delegate to backup approvers with audit trail",
    ],
    implementationSteps: [
      "Design approval decision tree with conditional logic",
      "Create base workflow with conditional approval steps",
      "Implement escalation logic with 3-day timeout",
      "Configure delegation rules with audit logging",
    ],
    keywords: ["approval", "workflow", "routing", "escalation", "multi-tier"],
  },
  {
    id: 4,
    title: "Intelligent Account Aggregation with Optimization and Delta Processing",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "An organization has 200+ applications with millions of accounts. Full aggregation takes 48 hours and causes performance issues. The organization needs optimized aggregation that only processes changed data, uses delta processing, and intelligently handles new, modified, and deleted accounts.",
    technicalSpecifications: [
      "Delta aggregation processing only changed accounts since last run",
      "Optimization rules filtering unchanged data before processing",
      "Indexed correlation lookups for faster correlation",
      "Performance monitoring and optimization tracking",
    ],
    implementationSteps: [
      "Enable aggregation optimization with delta processing",
      "Create optimization rules filtering unchanged accounts",
      "Implement correlation optimization with indexed queries",
      "Monitor and tune performance with dashboards",
    ],
    keywords: ["aggregation", "delta", "optimization", "performance", "correlation"],
  },
  {
    id: 5,
    title: "Lifecycle Management with Complex Joiner-Mover-Leaver Scenarios",
    category: "JML",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs to handle complex lifecycle scenarios: employees joining with temporary access, moving between departments with access transitions, contractors with expiring access, rehires with identity restoration, and employees on leave with suspended access.",
    technicalSpecifications: [
      "Lifecycle events configured for Joiner, Mover, Leaver, Rehire, Leave, and Return",
      "Conditional provisioning logic for each scenario",
      "Time-bound access retention with grace periods (e.g., 7-day grace for department moves)",
      "Identity preservation and history maintenance for rehires",
    ],
    implementationSteps: [
      "Define lifecycle events with HR attribute monitoring",
      "Create scenario-specific workflows for each event type",
      "Implement grace period logic with scheduled tasks",
      "Configure identity preservation for rehire scenarios",
    ],
    keywords: ["lifecycle", "JML", "joiner", "mover", "leaver", "rehire"],
  },
  {
    id: 6,
    title: "Separation of Duties Policy Enforcement with Automated Remediation",
    category: "Compliance",
    complexity: "Advanced",
    businessRequirement:
      "A regulated financial institution must enforce complex SoD policies. The organization needs to detect SoD violations, automatically remediate violations when possible, and escalate complex violations for manual review.",
    technicalSpecifications: [
      "Detective and preventative SoD policies with violation detection",
      "Real-time violation detection during provisioning",
      "Automated remediation revoking most recently added conflicting entitlements",
      "Escalation workflow for unresolvable violations to compliance team",
    ],
    implementationSteps: [
      "Define SoD policies for conflicting entitlement pairs",
      "Implement preventative enforcement in provisioning",
      "Create detective policies with scheduled violation scanning",
      "Implement automated remediation with audit logging",
    ],
    keywords: ["SoD", "compliance", "violation", "remediation", "enforcement"],
  },
  {
    id: 7,
    title: "Advanced Certification Campaign with Fatigue Reduction",
    category: "Compliance",
    complexity: "Advanced",
    businessRequirement:
      "An organization conducts quarterly certification campaigns with 50,000+ identities and 1M+ access items. Reviewers experience certification fatigue, leading to rubber-stamping approvals. The organization needs intelligent certification strategies that reduce reviewer burden while maintaining governance effectiveness.",
    technicalSpecifications: [
      "Risk-based targeting focusing on high-risk access items",
      "Micro-certifications for specific access types or departments",
      "Reviewer workload limiting to 100-200 items per campaign",
      "AI-driven automatic approval recommendations for low-risk items",
    ],
    implementationSteps: [
      "Implement risk scoring model for access items",
      "Design targeted certifications with risk-based filtering",
      "Implement fatigue reduction with item limiting and pagination",
      "Configure AI recommendations with historical pattern analysis",
    ],
    keywords: ["certification", "fatigue", "risk", "targeted", "micro-certification"],
  },
  {
    id: 8,
    title: "Custom Reporting and Analytics with Real-Time Dashboards",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization needs comprehensive reporting on identity lifecycle, access provisioning, certification campaigns, and compliance metrics. Executives need real-time dashboards showing key metrics, and auditors need detailed reports on all access decisions and changes.",
    technicalSpecifications: [
      "Custom SQL-based reports for identity lifecycle, provisioning, certifications, and compliance",
      "Real-time dashboards with 5-minute refresh intervals",
      "Detailed audit trail reports for regulatory compliance",
      "Performance metrics tracking system optimization opportunities",
    ],
    implementationSteps: [
      "Design report architecture with custom SQL queries",
      "Build custom reports for each business area",
      "Create real-time dashboards with key metrics",
      "Implement audit reports for compliance requirements",
    ],
    keywords: ["reporting", "analytics", "dashboard", "compliance", "metrics"],
  },
  {
    id: 9,
    title: "Service Account Governance and Lifecycle Management",
    category: "Governance",
    complexity: "Advanced",
    businessRequirement:
      "An organization has 5,000+ service accounts across multiple systems with no clear ownership or lifecycle management. Service accounts are created ad-hoc, never reviewed, and often left active after applications are decommissioned.",
    technicalSpecifications: [
      "Service account identification and classification using naming conventions and attributes",
      "Human owner assignment with owner tracking in custom attributes",
      "Quarterly certification campaigns for service accounts",
      "Automated deprovisioning for unused or orphaned service accounts",
    ],
    implementationSteps: [
      "Identify service accounts using classification rules",
      "Assign ownership with workflow-based assignment",
      "Implement targeted certification for service accounts",
      "Create automated deprovisioning for unused accounts",
    ],
    keywords: ["service account", "governance", "ownership", "certification", "deprovisioning"],
  },
  {
    id: 10,
    title: "Contractor and Temporary Access Management with Expiry Enforcement",
    category: "Governance",
    complexity: "Intermediate",
    businessRequirement:
      "An organization contracts with 500+ contractors and temporary workers who need time-limited access. Current processes are manual, leading to expired access remaining active and compliance violations.",
    technicalSpecifications: [
      "Contractor identity type with custom attributes (endDate, sponsor, company, role)",
      "Automatic access expiry on specified date with deprovisioning workflow",
      "Renewal approval workflow triggered 10 days before expiry",
      "Compliance reporting tracking contractor access and expiry dates",
    ],
    implementationSteps: [
      "Create contractor identity type with custom attributes",
      "Implement access expiry with daily scheduled task",
      "Create renewal workflow with sponsor approval",
      "Implement compliance reporting for contractor access",
    ],
    keywords: ["contractor", "temporary", "expiry", "renewal", "access management"],
  },
  {
    id: 11,
    title: "Multi-Connector Aggregation with Conflict Resolution",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "An organization has multiple HR systems (legacy and new), multiple AD forests, and multiple cloud systems. Data conflicts occur when the same user exists in multiple systems with different attributes.",
    technicalSpecifications: [
      "Source priority hierarchy defining authoritative source for each attribute",
      "Conflict detection identifying conflicting attribute values across sources",
      "Conflict resolution rules applying source priority and data quality scoring",
      "Data quality scoring model evaluating completeness, consistency, and recency",
    ],
    implementationSteps: [
      "Define source hierarchy with priority rules",
      "Implement conflict detection during aggregation",
      "Create conflict resolution rules with source priority",
      "Implement data quality scoring for source evaluation",
    ],
    keywords: ["aggregation", "conflict", "resolution", "multi-source", "data quality"],
  },
  {
    id: 12,
    title: "Advanced Workflow with Conditional Logic and Subprocess Management",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs complex provisioning workflows with conditional logic, parallel processing, and subprocess management. Examples include conditional approval based on request type, parallel provisioning to multiple systems, and error handling with retry logic.",
    technicalSpecifications: [
      "Conditional logic with if-then-else decision steps in workflows",
      "Parallel processing for independent provisioning steps",
      "Reusable workflow subprocesses for common operations",
      "Error handling with exponential backoff retry logic and escalation",
    ],
    implementationSteps: [
      "Design workflow architecture with main and subprocess flows",
      "Implement conditional logic using decision steps",
      "Create provisioning subprocesses for each system",
      "Implement error handling with retry and escalation",
    ],
    keywords: ["workflow", "conditional", "subprocess", "parallel", "error handling"],
  },
  {
    id: 13,
    title: "Password Management with Intercept and Sync",
    category: "Workflows",
    complexity: "Intermediate",
    businessRequirement:
      "An organization wants to implement password management where users change their password once in Active Directory, and the password is automatically synchronized to SAP, Oracle, and other systems.",
    technicalSpecifications: [
      "Password intercept agents deployed on domain controllers",
      "Password sync groups configured for system prioritization",
      "Password sync workflow with validation and error handling",
      "Encryption for secure password transmission and storage",
    ],
    implementationSteps: [
      "Deploy password intercept agents on domain controllers",
      "Configure password sync groups with system priority",
      "Create password sync workflow with validation",
      "Implement error handling with retry logic",
    ],
    keywords: ["password", "sync", "intercept", "provisioning", "security"],
  },
  {
    id: 14,
    title: "Entitlement Management with Dynamic Provisioning Rules",
    category: "RBAC",
    complexity: "Advanced",
    businessRequirement:
      "An organization has complex entitlement structures where access is determined by multiple identity attributes and business rules. Entitlements must be dynamically provisioned based on real-time attribute values.",
    technicalSpecifications: [
      "Entitlement definition based on attribute combinations with complex business rules",
      "Dynamic provisioning triggered by attribute changes",
      "Complex rule engine evaluating multiple conditions",
      "Performance optimization supporting 100K+ identities with dynamic evaluation",
    ],
    implementationSteps: [
      "Define entitlement attributes with data types and validation",
      "Create provisioning rules with complex business logic",
      "Implement dynamic re-provisioning on attribute change",
      "Optimize performance with caching and indexing",
    ],
    keywords: ["entitlement", "dynamic", "provisioning", "rules", "attributes"],
  },
  {
    id: 15,
    title: "Risk-Based Access Control with Composite Risk Scoring",
    category: "Governance",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs risk-based access control where access decisions are influenced by user risk profile. High-risk users require additional approval, while low-risk users can be auto-approved.",
    technicalSpecifications: [
      "Composite risk scoring model with multiple weighted factors",
      "Risk factors including user tenure, access change frequency, user type, entitlement sensitivity",
      "Dynamic approval routing based on risk score categories",
      "Continuous risk monitoring with daily score recalculation",
    ],
    implementationSteps: [
      "Define risk factors with weighting algorithm",
      "Implement risk scoring algorithm in BeanShell",
      "Configure risk-based approval routing",
      "Implement continuous risk monitoring",
    ],
    keywords: ["risk", "scoring", "access control", "approval", "governance"],
  },
  {
    id: 16,
    title: "Compliance Reporting and Audit Trail Management",
    category: "Compliance",
    complexity: "Intermediate",
    businessRequirement:
      "An organization must maintain comprehensive audit trails for regulatory compliance (SOX, HIPAA, GDPR). All access decisions, changes, and certifications must be tracked with detailed information.",
    technicalSpecifications: [
      "Comprehensive audit trail capturing all access decisions and changes",
      "Compliance reports for SOX, HIPAA, GDPR, and SoD",
      "7+ year data retention with archival strategy",
      "Immutable audit logs preventing modification",
    ],
    implementationSteps: [
      "Design audit trail architecture with event capture",
      "Implement audit logging in workflows and provisioning",
      "Create compliance reports for regulatory requirements",
      "Implement data retention and archival",
    ],
    keywords: ["audit", "compliance", "reporting", "SOX", "HIPAA", "GDPR"],
  },
  {
    id: 17,
    title: "Identity Warehouse Optimization and Performance Tuning",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "An organization's SailPoint system has grown to 500K identities with 50M+ accounts and entitlements. The identity warehouse is experiencing performance degradation, with queries taking minutes to complete.",
    technicalSpecifications: [
      "Database indexing on frequently queried columns",
      "Query optimization and rewriting for performance",
      "Table partitioning for large tables with archival strategy",
      "Query result caching with TTL",
    ],
    implementationSteps: [
      "Analyze current performance and identify slow queries",
      "Create database indexes on critical columns",
      "Optimize slow queries with rewriting",
      "Implement partitioning and caching",
    ],
    keywords: ["performance", "optimization", "database", "indexing", "tuning"],
  },
  {
    id: 18,
    title: "Custom Plugin Development for Extended Functionality",
    category: "Advanced",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs to extend SailPoint with custom functionality not available in the standard product. Examples include custom dashboard widgets, custom UI components, custom connectors, and custom business logic.",
    technicalSpecifications: [
      "SailPoint plugin framework with Java backend and Angular frontend",
      "Custom UI components and dashboard widgets",
      "Custom business logic implementation",
      "Plugin database tables if needed",
    ],
    implementationSteps: [
      "Set up plugin development environment",
      "Develop plugin components and manifest",
      "Implement custom logic and UI",
      "Test and deploy plugin",
    ],
    keywords: ["plugin", "development", "custom", "UI", "extension"],
  },
  {
    id: 19,
    title: "API Integration and Headless Identity Management",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization has a custom external portal where users can request access, view their access, and manage their profile. The portal needs to integrate with SailPoint via REST APIs.",
    technicalSpecifications: [
      "REST API endpoints for identity operations",
      "OAuth2 authentication with token management",
      "API proxy layer for security and request validation",
      "Rate limiting and error handling",
    ],
    implementationSteps: [
      "Design API architecture with endpoints",
      "Implement OAuth2 authentication",
      "Create API proxy layer",
      "Implement portal integration",
    ],
    keywords: ["API", "REST", "integration", "headless", "portal"],
  },
  {
    id: 20,
    title: "Disaster Recovery and Business Continuity",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization must ensure business continuity in case of SailPoint system failure. The organization needs disaster recovery procedures including backup and recovery, failover to backup system.",
    technicalSpecifications: [
      "Daily full backups with hourly incremental backups",
      "Geographically distributed backup storage",
      "Automatic failover detection and execution",
      "RTO < 4 hours, RPO < 1 hour",
    ],
    implementationSteps: [
      "Design backup strategy with daily and incremental backups",
      "Implement failover with automatic detection",
      "Create recovery procedures and runbooks",
      "Test recovery procedures quarterly",
    ],
    keywords: ["disaster recovery", "backup", "failover", "continuity", "RTO", "RPO"],
  },
  {
    id: 21,
    title: "Advanced Certification Campaign with Micro-Segmentation",
    category: "Compliance",
    complexity: "Advanced",
    businessRequirement:
      "An organization conducts annual access reviews for 100K+ identities. Traditional certification campaigns are overwhelming for reviewers. The organization needs micro-segmented certifications.",
    technicalSpecifications: [
      "Micro-segmented certifications focused on specific access types",
      "Risk-based targeting focusing on high-risk access",
      "Department-based certifications routing to department managers",
      "System-based certifications routing to system owners",
    ],
    implementationSteps: [
      "Design certification strategy with multiple campaigns",
      "Implement risk-based targeting",
      "Create department-based certifications",
      "Implement system-based certifications",
    ],
    keywords: ["certification", "micro-segmentation", "risk", "targeting", "campaign"],
  },
  {
    id: 22,
    title: "Custom Attribute Management and Synchronization",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization needs to manage custom attributes for identities that are not available in standard SailPoint attributes. These attributes must be synchronized from authoritative sources and used in provisioning rules.",
    technicalSpecifications: [
      "Custom attribute definition with data types and validation",
      "Attribute synchronization from authoritative sources",
      "Attribute transformation logic for format conversion",
      "Attribute usage in provisioning rules and workflows",
    ],
    implementationSteps: [
      "Define custom attributes with data types",
      "Configure attribute synchronization",
      "Implement attribute transformation logic",
      "Monitor attribute quality and completeness",
    ],
    keywords: ["attribute", "custom", "synchronization", "mapping", "validation"],
  },
  {
    id: 23,
    title: "Bulk User Import and Migration",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization is migrating from a legacy identity management system to SailPoint. The organization needs to import 200K+ identities and 5M+ accounts from the legacy system.",
    technicalSpecifications: [
      "Bulk import process for identities and accounts",
      "Data mapping rules converting legacy attributes to SailPoint attributes",
      "Data validation ensuring data quality",
      "Deduplication logic handling duplicate identities",
    ],
    implementationSteps: [
      "Design import architecture with data mapping",
      "Create import workflow with validation",
      "Implement data validation and deduplication",
      "Execute import in batches",
    ],
    keywords: ["import", "migration", "bulk", "data mapping", "deduplication"],
  },
  {
    id: 24,
    title: "Entitlement Provisioning with Application-Specific Logic",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "Different applications have different provisioning requirements. SAP requires specific role assignments, Oracle requires specific privilege grants, Active Directory requires specific group memberships.",
    technicalSpecifications: [
      "Application-specific provisioning rules for each system",
      "Connector customization with system-specific logic",
      "Provisioning policies defining field mappings",
      "Application-specific error handling",
    ],
    implementationSteps: [
      "Analyze application requirements",
      "Create application-specific provisioning rules",
      "Customize connectors for each application",
      "Implement provisioning policies",
    ],
    keywords: ["provisioning", "application", "specific", "connector", "rules"],
  },
  {
    id: 25,
    title: "Identity Correlation with Fuzzy Matching",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "An organization has inconsistent data across systems with variations in name formatting, spelling differences, and missing identifiers. Standard exact-match correlation fails to match 15% of accounts.",
    technicalSpecifications: [
      "Fuzzy matching algorithm using Levenshtein distance",
      "Confidence scoring with thresholds (90%+ auto-match, 70%+ manual review)",
      "Manual review workflow for low-confidence matches",
      "Performance optimization supporting 500K+ identities",
    ],
    implementationSteps: [
      "Implement fuzzy matching algorithm",
      "Create correlation rule with fuzzy matching",
      "Implement manual review process",
      "Optimize performance with caching",
    ],
    keywords: ["correlation", "fuzzy", "matching", "confidence", "algorithm"],
  },
  {
    id: 26,
    title: "Role Composition and Role Hierarchy Management",
    category: "RBAC",
    complexity: "Advanced",
    businessRequirement:
      "An organization has complex role hierarchies where business roles are composed of IT roles, which are composed of entitlements. Changes to entitlements should automatically propagate up the role hierarchy.",
    technicalSpecifications: [
      "Multi-level role hierarchy with business, IT, and entitlement levels",
      "Role composition rules defining role relationships",
      "Automatic change propagation when entitlements change",
      "SoD conflict detection in role composition",
    ],
    implementationSteps: [
      "Design role hierarchy with multiple levels",
      "Define role composition rules",
      "Implement change propagation logic",
      "Implement conflict detection",
    ],
    keywords: ["role", "composition", "hierarchy", "propagation", "SoD"],
  },
  {
    id: 27,
    title: "Advanced Workflow with Parallel and Serial Approvals",
    category: "Workflows",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs complex approval workflows where some approvals happen in parallel (all must approve) and others in series (sequential).",
    technicalSpecifications: [
      "Parallel approval mode where all approvers must approve",
      "Serial approval mode where approvers approve sequentially",
      "Conditional routing based on request characteristics",
      "Escalation logic for non-responding approvers",
    ],
    implementationSteps: [
      "Design approval workflow with serial and parallel steps",
      "Implement serial approval with sequential routing",
      "Implement parallel approval with all-approvers requirement",
      "Implement escalation with 3-day timeout",
    ],
    keywords: ["approval", "parallel", "serial", "workflow", "escalation"],
  },
  {
    id: 28,
    title: "Identity Deprovisioning with Grace Periods and Legal Hold",
    category: "JML",
    complexity: "Intermediate",
    businessRequirement:
      "When an employee leaves the organization, their access must be revoked, but in some cases, their data must be preserved for legal or compliance reasons.",
    technicalSpecifications: [
      "Immediate deprovisioning for standard employees",
      "Grace period deprovisioning (configurable, default 7 days)",
      "Legal hold deprovisioning preserving data for 90+ days",
      "Audit trail maintaining all deprovisioning actions",
    ],
    implementationSteps: [
      "Classify deprovisioning scenarios",
      "Create deprovisioning workflows for each scenario",
      "Implement grace period logic",
      "Implement legal hold with data preservation",
    ],
    keywords: ["deprovisioning", "grace period", "legal hold", "leaver", "compliance"],
  },
  {
    id: 29,
    title: "Advanced Reporting with Custom SQL and Data Visualization",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "An organization needs advanced reporting capabilities beyond standard SailPoint reports. Examples include custom dashboards showing real-time metrics, trend analysis reports, and compliance reports with data visualization.",
    technicalSpecifications: [
      "Custom SQL queries for report generation",
      "Data visualization with charts and graphs",
      "Real-time dashboards with 5-minute refresh",
      "Performance optimization for large datasets",
    ],
    implementationSteps: [
      "Design report architecture with SQL queries",
      "Create custom reports for each business area",
      "Implement data visualization",
      "Create real-time dashboards",
    ],
    keywords: ["reporting", "SQL", "visualization", "dashboard", "analytics"],
  },
  {
    id: 30,
    title: "Identity Governance Framework with Policy Enforcement",
    category: "Governance",
    complexity: "Advanced",
    businessRequirement:
      "An organization needs to implement a comprehensive identity governance framework that enforces policies across the entire identity lifecycle including policy definition, enforcement, violation detection, and remediation.",
    technicalSpecifications: [
      "Policy definition for SoD, Least Privilege, Access Review, Ownership, Expiry",
      "Real-time policy enforcement during provisioning",
      "Violation detection with scheduled scanning",
      "Automated and manual violation remediation workflows",
    ],
    implementationSteps: [
      "Define governance policies for organization",
      "Implement policy enforcement in provisioning",
      "Implement violation detection",
      "Create violation remediation workflows",
    ],
    keywords: ["governance", "policy", "enforcement", "violation", "remediation"],
  },
  {
    id: 31,
    title: "Git-Based Configuration Promotion for IdentityIQ Objects",
    category: "Advanced",
    complexity: "Advanced",
    businessRequirement:
      "IdentityIQ configuration changes are currently applied manually in each environment, creating drift and making it difficult to prove what was released. The organization needs a controlled promotion pattern for rules, workflows, roles, forms, and supporting configuration.",
    technicalSpecifications: [
      "Version-controlled source repository organized by object type and environment overlays",
      "Repeatable export, normalization, validation, and import process for IdentityIQ XML objects",
      "Approval gates for non-production and production promotions with deployment evidence",
      "Rollback package strategy using tagged, previously validated releases",
    ],
    implementationSteps: [
      "Define the configuration-as-code repository structure and object ownership model",
      "Create repeatable export and normalization scripts for deployable objects",
      "Add automated validation for XML structure, naming standards, and dependency order",
      "Implement staged promotion with immutable release tags and post-deployment smoke checks",
    ],
    keywords: ["CI/CD", "Git", "promotion", "configuration as code", "release management"],
  },
  {
    id: 32,
    title: "Environment Drift Detection and Configuration Reconciliation",
    category: "Infrastructure",
    complexity: "Advanced",
    businessRequirement:
      "Development, test, and production environments gradually diverge as teams troubleshoot and introduce urgent changes. The program needs an automated way to identify unauthorized differences before they become release or audit problems.",
    technicalSpecifications: [
      "Scheduled extracts of selected IdentityIQ objects from each environment",
      "Normalized comparison that excludes expected environment-specific values",
      "Drift severity classification for missing, modified, and unexpected objects",
      "Exception register with owner, expiry date, and remediation status",
    ],
    implementationSteps: [
      "Identify the configuration object types that must remain aligned",
      "Document environment-specific settings that should be excluded from comparisons",
      "Create a comparison job that produces a reviewable drift report",
      "Route high-severity differences to owners and reconcile through the normal release process",
    ],
    keywords: ["configuration drift", "environment", "reconciliation", "audit", "CI/CD"],
  },
  {
    id: 33,
    title: "Rule Testing Harness with Synthetic Identity Data",
    category: "Advanced",
    complexity: "Advanced",
    businessRequirement:
      "Custom rules influence correlation, provisioning, approvals, and policy decisions, but they are often tested only after deployment. The engineering team needs a repeatable test harness that exercises rules against controlled scenarios before promotion.",
    technicalSpecifications: [
      "Synthetic identity, account, and entitlement fixtures covering normal and edge cases",
      "Unit-level execution of rules with expected-result assertions",
      "Regression suite triggered whenever a rule or dependent object changes",
      "Test report showing pass, fail, skipped, and coverage-by-scenario outcomes",
    ],
    implementationSteps: [
      "Prioritize high-impact rules and document their decision scenarios",
      "Create anonymized test fixtures that represent each scenario safely",
      "Build assertions for expected provisioning plans, correlations, or routes",
      "Require the regression suite to pass before packaging a release artifact",
    ],
    keywords: ["testing", "rules", "BeanShell", "regression", "test data"],
  },
  {
    id: 34,
    title: "Connector Onboarding Factory with Reusable Delivery Templates",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "Application onboarding projects repeatedly recreate discovery documents, connector configuration, account schema mappings, test plans, and operational handover notes. The organization wants a consistent factory model that reduces rework while preserving application-specific controls.",
    technicalSpecifications: [
      "Standard connector onboarding checklist with authoritative-source and ownership decisions",
      "Reusable templates for schema mapping, correlation rules, aggregation, and provisioning policies",
      "Quality gates for connectivity, aggregation, access request, and deprovisioning scenarios",
      "Handover record covering schedules, monitoring, support ownership, and runbooks",
    ],
    implementationSteps: [
      "Define a reusable onboarding blueprint and required evidence for each application",
      "Create templates for the common connector and provisioning components",
      "Run a controlled pilot using an application with representative complexity",
      "Measure cycle time and refine the template library after each completed onboarding",
    ],
    keywords: ["connector", "onboarding", "factory", "templates", "integration"],
  },
  {
    id: 35,
    title: "Privileged Account Ownership and Access Governance",
    category: "Security",
    complexity: "Advanced",
    businessRequirement:
      "Privileged accounts across infrastructure and business applications have inconsistent ownership, elevated access criteria, and review coverage. The security program needs to establish accountable owners and stronger controls around privileged entitlements.",
    technicalSpecifications: [
      "Privileged-account classification using application, account, and entitlement attributes",
      "Named business and technical owner assignment with escalation for orphaned records",
      "Enhanced request approval routing based on privilege sensitivity and target system",
      "Targeted certification campaigns and remediation workflow for high-risk access",
    ],
    implementationSteps: [
      "Define the privileged-account taxonomy and ownership policy",
      "Identify privileged accounts and reconcile them with their accountable owners",
      "Configure request and certification controls for privileged entitlements",
      "Monitor orphaned accounts, overdue decisions, and exception expiry on a fixed cadence",
    ],
    keywords: ["privileged access", "ownership", "PAM", "certification", "risk"],
  },
  {
    id: 36,
    title: "Emergency Access and Break-Glass Governance",
    category: "Security",
    complexity: "Advanced",
    businessRequirement:
      "Critical operations teams need a controlled route to elevated access during incidents, without creating unmanaged standing privileges. The organization needs a time-bound emergency access pattern that preserves evidence for security and audit review.",
    technicalSpecifications: [
      "Emergency request form with incident reference, business justification, and expiry",
      "Expedited approval route with designated emergency approvers and notification",
      "Automatic revocation job at expiry with retry and escalation handling",
      "Post-event review report capturing requester, approver, access scope, and duration",
    ],
    implementationSteps: [
      "Define the allowed break-glass scenarios, entitlements, and accountable approvers",
      "Build a dedicated request workflow with a clear duration and incident reference",
      "Implement automated expiry enforcement and failure escalation",
      "Establish recurring post-event review and evidence retention procedures",
    ],
    keywords: ["break glass", "emergency access", "expiry", "incident", "audit"],
  },
  {
    id: 37,
    title: "Credential and Service Identity Rotation Governance",
    category: "Security",
    complexity: "Advanced",
    businessRequirement:
      "Service identities and technical credentials are often long-lived, lack accountable owners, and are rotated inconsistently. The organization needs visibility, accountability, and renewal workflows before credentials become operational or security risks.",
    technicalSpecifications: [
      "Service identity inventory with owner, application, credential type, and rotation date",
      "Policy-driven reminder and escalation workflow before rotation deadlines",
      "Exception process for systems that cannot meet standard rotation requirements",
      "Certification and reporting focused on overdue, orphaned, and dormant service identities",
    ],
    implementationSteps: [
      "Create the required metadata model for service identities and rotation events",
      "Aggregate available credential and account data from managed systems",
      "Configure reminders, approval routes, and exception ownership for rotation events",
      "Report on completion rates and remediate overdue identity records",
    ],
    keywords: ["credentials", "rotation", "service identity", "ownership", "policy"],
  },
  {
    id: 38,
    title: "Application Decommissioning and Access Retirement",
    category: "JML",
    complexity: "Intermediate",
    businessRequirement:
      "When applications are retired, their accounts, entitlements, access requests, and connected workflows often remain in the identity platform. The organization needs a governed retirement process that removes stale access and preserves essential audit evidence.",
    technicalSpecifications: [
      "Retirement checklist covering account inventory, entitlement mapping, roles, requestable items, and certifications",
      "Controlled deprovisioning waves with exceptions for legal retention or migration dependencies",
      "Removal of obsolete application configuration, schedules, and user-facing request entries",
      "Final evidence pack documenting access disposition and configuration removal",
    ],
    implementationSteps: [
      "Confirm the retirement scope, data retention requirements, and accountable owners",
      "Identify dependent roles, workflows, certifications, and downstream integrations",
      "Execute staged access retirement with reconciliations after each wave",
      "Archive evidence and remove obsolete IdentityIQ configuration through a tracked release",
    ],
    keywords: ["decommission", "retirement", "deprovisioning", "application lifecycle", "audit"],
  },
  {
    id: 39,
    title: "Access Request Catalog with Policy-Driven Fulfilment",
    category: "Workflows",
    complexity: "Intermediate",
    businessRequirement:
      "Users face a large, inconsistent set of access options with unclear ownership and approval routes. The organization wants an access request catalog that presents meaningful business choices while enforcing request policies and fulfilment controls.",
    technicalSpecifications: [
      "Business-friendly catalog items mapped to roles, entitlements, owners, and target applications",
      "Request forms that collect the minimum contextual information needed for routing",
      "Conditional approval and fulfilment logic based on role sensitivity and user context",
      "Lifecycle controls for catalog item review, retirement, and ownership recertification",
    ],
    implementationSteps: [
      "Rationalize existing requestable items into a clear catalog taxonomy",
      "Assign business owners, approvers, and fulfilment accountability to each item",
      "Build and test the request forms, policy checks, and approval routes",
      "Publish a controlled pilot, monitor request outcomes, and iterate with owners",
    ],
    keywords: ["access request", "catalog", "workflow", "approval", "self-service"],
  },
  {
    id: 40,
    title: "Identity Data Quality Observability and Remediation",
    category: "Infrastructure",
    complexity: "Intermediate",
    businessRequirement:
      "Downstream governance controls depend on accurate identity data, yet teams often discover issues only after failed provisioning or certification routing. The organization needs continuous observability for completeness, freshness, validity, and ownership of identity attributes.",
    technicalSpecifications: [
      "Data quality rules for mandatory attributes, valid values, freshness, and correlation confidence",
      "Scorecard grouped by source system, population, and responsible data owner",
      "Remediation workflow for priority defects with source-system feedback",
      "Trend reporting that measures recurring issues and quality improvement over time",
    ],
    implementationSteps: [
      "Agree the critical identity attributes and quality thresholds with data owners",
      "Implement quality rules and reporting for each authoritative source",
      "Route defects to the system best placed to correct the data",
      "Review trends regularly and tune correlation or transformation logic when needed",
    ],
    keywords: ["data quality", "observability", "identity data", "remediation", "metrics"],
  },
  {
    id: 41,
    title: "Merger and Acquisition Identity Integration Playbook",
    category: "JML",
    complexity: "Advanced",
    businessRequirement:
      "A newly acquired organization must be integrated without disrupting its workforce or creating uncontrolled cross-company access. The identity program needs a phased method for discovery, correlation, transitional access, and eventual operating-model alignment.",
    technicalSpecifications: [
      "Identity inventory and source-system assessment for the acquired population",
      "Transitional correlation strategy that preserves legacy identifiers and audit history",
      "Role and entitlement mapping with temporary access controls where needed",
      "Wave-based migration plan with readiness criteria, reconciliation, and rollback decisions",
    ],
    implementationSteps: [
      "Establish the identity data inventory, authoritative-source strategy, and migration scope",
      "Design correlation and attribute mapping rules for legacy and target identities",
      "Pilot the integration with a controlled user population and reconcile outcomes",
      "Execute migration waves, monitor exceptions, and retire transitional controls after stabilization",
    ],
    keywords: ["M&A", "migration", "integration", "correlation", "transformation"],
  },
  {
    id: 42,
    title: "Release Governance with Automated CI/CD Quality Gates",
    category: "Advanced",
    complexity: "Advanced",
    businessRequirement:
      "IdentityIQ changes must move quickly without bypassing controls. The delivery team needs a consistent pipeline that validates change packages, enforces review and test evidence, promotes approved artifacts, and records release outcomes across environments.",
    technicalSpecifications: [
      "Pipeline stages for static validation, tests, package creation, approval, promotion, and post-deployment checks",
      "Immutable versioned release artifact with dependency manifest and deployment order",
      "Environment-specific configuration injected only at deployment time",
      "Automated release evidence including test results, approval record, artifact version, and smoke-check output",
    ],
    implementationSteps: [
      "Define the release policy, required quality gates, and emergency-change exception path",
      "Standardize repository structure, package scripts, test fixtures, and artifact naming",
      "Implement CI checks for object validation, regression tests, and packaging",
      "Configure controlled promotion, verification, and rollback readiness for each target environment",
    ],
    keywords: ["CI/CD", "pipeline", "quality gates", "release", "automation"],
  },
];

export const categories = [
  { id: "JML", label: "Lifecycle", color: "bg-blue-600" },
  { id: "Compliance", label: "Compliance", color: "bg-purple-600" },
  { id: "RBAC", label: "Roles", color: "bg-indigo-600" },
  { id: "Workflows", label: "Workflows", color: "bg-cyan-600" },
  { id: "Governance", label: "Governance", color: "bg-teal-600" },
  { id: "Infrastructure", label: "Platform", color: "bg-slate-600" },
  { id: "Security", label: "Security", color: "bg-rose-600" },
  { id: "Advanced", label: "Advanced", color: "bg-orange-600" },
];

export const complexityLevels = [
  { id: "Beginner", label: "Beginner", color: "text-green-500" },
  { id: "Intermediate", label: "Intermediate", color: "text-yellow-500" },
  { id: "Advanced", label: "Advanced", color: "text-red-500" },
];
