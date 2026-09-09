export type LegacyKnowledgeArticle = {
  slug: string;
  category: "SailPoint" | "IBM Identity" | "Java & J2EE" | "Archive";
  title: string;
  sourceUrl: string;
  summary: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[]; code?: string[] }[];
};

export const legacyKnowledgeArticles: LegacyKnowledgeArticle[] = [
  {
    slug: "innovative-ideas-and-identity-manager-landscape",
    category: "Archive",
    title: "Innovative Ideas and the identity-manager landscape",
    sourceUrl: "https://sbkannan.wordpress.com/",
    summary: "The original landing page introduced a broad identity-management vendor landscape alongside the legacy knowledge-sharing mission.",
    sections: [
      { heading: "Identity manager solutions around", paragraphs: ["The original archive compared a cross-section of identity-management products and vendors from its publishing period. This preserved list includes AccountCourier, Apache Syncope, Avatier Identity Enforcer, CA Identity Manager, Dell One Identity Manager, DirX Identity, Efecte Identity Management, Global Identity Architecture, Hitachi ID Identity Manager, IBM Security Identity Manager, Soffid, NetIQ Identity Manager, SailPoint IdentityIQ, Microsoft Forefront Identity Manager, midPoint, OpenIAM, OpenIDM, OpenPTK, Oracle Identity Manager, Okta Provisioning, RSA Identity Management and Governance, SmartAIM, STEALTHbits, TridentHE, UMRA, Centrify User Provisioning, and WSO2 Identity Server."] },
    ],
  },
  {
    slug: "sailpoint-iiq-informations",
    category: "SailPoint",
    title: "SailPoint IIQ Informations",
    sourceUrl: "https://sbkannan.wordpress.com/sailpoint-iiq/",
    summary: "A historical introduction to SailPoint’s business-oriented identity governance approach, IdentityIQ, and the early IdentityNow cloud offering.",
    sections: [
      { heading: "Identity governance and lifecycle context", paragraphs: ["The original note describes SailPoint’s approach as shifting more identity and access processes toward business users, combining provisioning and compliance capabilities in a single identity-management solution.", "It also records historical product commentary on IdentityNow, cloud-delivered identity governance, provisioning, password management, and access management. Product capabilities and version references should be reviewed against current SailPoint documentation before use in a production design."] },
      { heading: "Historical product topics", bullets: ["Responsive mobile experience for IdentityIQ users.", "IdentityNow as a cloud identity-management offering.", "Compliance, provisioning, password management, and access management as linked identity services."] },
    ],
  },
  {
    slug: "quick-ssd-deployment-steps",
    category: "SailPoint",
    title: "Quick SSD Deployment Steps",
    sourceUrl: "https://sbkannan.wordpress.com/sailpoint-iiq/quick-ssd-deployment-steps/",
    summary: "The original quick-reference deployment sequences for initial, patch, and accelerator-pack IdentityIQ releases.",
    sections: [
      { heading: "Initial IIQ deployment", code: ["build clean", "build or build war", "build createdb", "build import-all", "build dist", "build up"] },
      { heading: "IIQ patch deployment", code: ["build clean", "build or build war", "build patchdb", "build runUpgrade", "build import-all", "build dist", "build up"] },
      { heading: "Deployment with patch and accelerator pack", code: ["build clean", "build or build war", "build createdb", "build patchdb", "build extenddb", "build import-all", "build runUpgrade", "build dist", "build up"] },
    ],
  },
  {
    slug: "ibm-security-version-information",
    category: "IBM Identity",
    title: "How to collect version information for IBM Security products",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/version/",
    summary: "A Windows-oriented command reference for collecting version information from legacy IBM security middleware.",
    sections: [
      { heading: "Version collection locations", code: ["SAM Policy Server, Authorization Server, WebSEAL: D:\\Program Files\\IBM\\tivoli\\Policy Director\\bin\\pdversion", "Tivoli Directory Server: D:\\Program Files\\IBM\\LDAP\\V6.2\\bin\\idsversion.cmd", "DB2: db2level or <Install_Drive>:\\Program Files\\IBM\\SQLLIB\\bin\\db2level.exe", "WebSphere Application Server: D:\\IBM\\WebSphere\\AppServer\\bin\\versionInfo.bat", "Tivoli Directory Integrator: record the build-info string from the editor splash screen", "GSK: <Install_Drive>:\\Program Files\\IBM\\gsk\\idsilist -a"] },
      { heading: "Operational note", paragraphs: ["The source also notes that SIM version information can be checked through its administration console. Paths and utilities are historical and should be validated against the installed release and platform before use."] },
    ],
  },
  {
    slug: "itim-v51-installation-order",
    category: "IBM Identity",
    title: "Installation Order for ITIM v5.1",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/tivoli-idenitity-manager/",
    summary: "A nine-step legacy installation order for IBM Tivoli Identity Manager 5.1 and its middleware dependencies.",
    sections: [
      { heading: "Sequence", bullets: ["Install WebSphere Application Server and its maintenance fixes.", "Install IBM DB2, then configure it with the Middleware Configuration Tool.", "Install IBM Tivoli Directory Server and its maintenance fixes, then configure LDAP.", "Install IBM Tivoli Directory Integrator.", "Install IBM Tivoli Identity Manager 5.1."] },
      { heading: "Archive notice", paragraphs: ["This is retained as historical deployment knowledge. Product versions, support status, maintenance packages, and installation methods must be checked against current IBM documentation."] },
    ],
  },
  {
    slug: "understanding-isim-reconciliations",
    category: "IBM Identity",
    title: "Understanding ISIM Reconciliations",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/isim-reconciliations/",
    summary: "A troubleshooting narrative about an ISIM reconciliation that hung after temporary account objects remained under a service container.",
    sections: [
      { heading: "Observed behavior", paragraphs: ["The source compares two apparently identical ISIM environments, one reconciling successfully and one hanging even though reconcilable objects had reached the system.", "It explains that reconciliation stores supporting data under a service container and may temporarily retain accounts there before moving them into accounts or orphan containers."] },
      { heading: "Troubleshooting insight", paragraphs: ["The non-working environment contained lingering account objects under the service container. Clearing the subordinate service objects allowed the reconciliation to complete. The historical lesson is to inspect the service container and prior reconciliation residue when behavior differs between environments."] },
    ],
  },
  {
    slug: "itim-intro",
    category: "IBM Identity",
    title: "ITIM Intro",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/feels/",
    summary: "A detailed ITIM 5.1 learning outline covering prerequisites, objectives, and fourteen course units.",
    sections: [
      { heading: "Prerequisites", bullets: ["LDAP and TCP/IP fundamentals.", "JavaScript.", "Basic administration of Linux, IBM Tivoli Directory Server, and IBM WebSphere Application Server."] },
      { heading: "Learning objectives", paragraphs: ["The source covers needs assessment, architecture, installation, organization and user management, identity feeds, services and policies, provisioning, workflows, access control, lifecycle management, auditing, reporting, customization, and problem determination."] },
      { heading: "Fourteen-unit course outline", bullets: ["Introduction to ITIM and implementation planning.", "Installing ITIM and middleware, organization management, user management, identity feeds, and role management.", "Services, policies, provisioning resources, workflows, access control, lifecycle management, auditing and reporting, customization, and problem determination."] },
    ],
  },
  {
    slug: "itim-v51-requirements",
    category: "IBM Identity",
    title: "Requirement and Recommended Versions to Install ITIM v5.1",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/itim5-1/",
    summary: "A historical middleware component and configuration reference for an ITIM v5.1 environment.",
    sections: [
      { heading: "Required components", bullets: ["WebSphere Application Server and a maintenance-fix workflow.", "IBM DB2 with Middleware Configuration Tool setup.", "IBM Tivoli Directory Server with maintenance fixes and LDAP configuration.", "IBM Tivoli Directory Integrator and IBM Tivoli Identity Manager 5.1."] },
      { heading: "Configuration notes", paragraphs: ["The source records a TDS and DB2 configuration example, including a directory-server instance, database name, administrator DN, suffix, and non-SSL port. Sensitive values are intentionally not reproduced; use current, secured configuration standards instead."] },
    ],
  },
  {
    slug: "overview-of-sailpoint-identityiq",
    category: "SailPoint",
    title: "Overview of SailPoint IdentityIQ",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/identityiq/",
    summary: "The archive’s extensive foundational explanation of IdentityIQ, covering governance, lifecycle, provisioning, identity cubes, aggregation, and certification concepts.",
    sections: [
      { heading: "Four major components", bullets: ["Compliance Manager: access certification and policy enforcement.", "Lifecycle Manager: business-friendly access requests, password services, and lifecycle events.", "Governance Platform: identity data, policy, roles, and risk context.", "User Provisioning: orchestration of access changes through automated or manual delivery mechanisms."] },
      { heading: "Identity data concepts", paragraphs: ["The source explains Identity Cubes as correlated account and entitlement collections representing a real-world user. Identity attributes describe these cubes and may be mapped from source data or derived through rules and mappings.", "User discovery combines authoritative sources with identity correlation, while account aggregation updates identity information from configured applications using reusable tasks."] },
      { heading: "Provisioning and certification", paragraphs: ["The preserved overview distinguishes automated, self-service, and workflow-based provisioning. It also documents certification types and lifecycle phases: generation, active, challenge, sign-off, remediation or revocation, and end.", "Version-specific terminology and feature behavior should be validated against the deployed SailPoint release before implementation."] },
    ],
  },
  {
    slug: "identityiq-connectors",
    category: "SailPoint",
    title: "IdentityIQ Connectors",
    sourceUrl: "https://sbkannan.wordpress.com/knowledge-transfer/identityiq-connectors/",
    summary: "A legacy overview of how IdentityIQ connectors collect data from applications and apply closed-loop remediation.",
    sections: [
      { heading: "Connector classifications", bullets: ["Read-only governance connectors import information from target applications.", "Read-write connectors import and update data, using gateway, agent, or direct approaches in the historical model.", "The connector featuresString indicates connector capabilities; PROVISIONING denotes write capability in the source explanation."] },
      { heading: "Version context", paragraphs: ["The original page discusses IdentityIQ 5.5, 6.0, and 6.1 and lists example connector changes from that period. Treat these as historical learning notes, not a current connector support matrix."] },
    ],
  },
  {
    slug: "java-oops-concepts",
    category: "Java & J2EE",
    title: "JAVA OOPS Concepts",
    sourceUrl: "https://sbkannan.wordpress.com/interview-qa/java-oops-concepts/",
    summary: "An interview-oriented Java object-oriented programming reference with definitions and simple examples.",
    sections: [
      { heading: "Topics covered", bullets: ["Polymorphism, including overloading and overriding.", "Inheritance and the use of extends.", "Multiple inheritance through interfaces rather than multiple class extension.", "Abstraction and encapsulation.", "Association, aggregation, and composition relationships."] },
      { heading: "Learning intent", paragraphs: ["The source frames the material as concise interview preparation, using basic Java class examples to distinguish object-oriented concepts."] },
    ],
  },
  {
    slug: "jsp-interview-questions",
    category: "Java & J2EE",
    title: "JSP Interview Questions",
    sourceUrl: "https://sbkannan.wordpress.com/interview-qa/jsp/",
    summary: "A question-and-answer reference covering JavaBeans, expressions, forwarding, redirects, implicit objects, caching, thread safety, initialization, sessions, and standard actions.",
    sections: [
      { heading: "Questions 9–17", bullets: ["Custom JSP tags versus JavaBeans.", "Expression tags and expression output.", "Forward versus sendRedirect behavior.", "JSP implicit objects.", "Browser cache prevention headers.", "Thread-safe JSP guidance and SingleThreadModel cautions.", "HttpServlet initialization for one-time expensive operations.", "HttpSession overhead and standard JSP actions."] },
      { heading: "Archive notice", paragraphs: ["The page reflects older JSP practices and terminology. It is preserved for historical interview preparation rather than current framework guidance."] },
    ],
  },
  {
    slug: "j2ee-fundamentals",
    category: "Java & J2EE",
    title: "J2EE",
    sourceUrl: "https://sbkannan.wordpress.com/interview-qa/j2ee/",
    summary: "A foundational five-question J2EE reference about enterprise application components, client types, web components, and JSF.",
    sections: [
      { heading: "Topics covered", bullets: ["J2EE as a multi-tier web application platform.", "Application client, web, business, and resource-adapter components.", "Applet, application, Java Web Start, and wireless client types.", "Servlet and JSP web components.", "JSF as a reusable-component, MVC-oriented Java web UI framework."] },
    ],
  },
  {
    slug: "about-the-original-archive",
    category: "Archive",
    title: "About the original knowledge archive",
    sourceUrl: "https://sbkannan.wordpress.com/about/",
    summary: "The original About page describes the archive as a place to share ideas for daily activities and knowledge, with a separate public contact page.",
    sections: [
      { heading: "Current contact guidance", paragraphs: ["This page preserves the original knowledge-sharing intent. For current professional contact, booking, and inquiry details, use the myIAM Consulting and Talk to an Expert pages rather than legacy contact details from the historical archive."] },
    ],
  },
];

export const legacyKnowledgeCategories = ["All", "SailPoint", "IBM Identity", "Java & J2EE", "Archive"] as const;

export const legacyKnowledgeTopics: Record<string, readonly string[]> = {
  "innovative-ideas-and-identity-manager-landscape": ["Identity management", "Vendor landscape"],
  "sailpoint-iiq-informations": ["SailPoint", "IdentityIQ", "Identity governance"],
  "quick-ssd-deployment-steps": ["SailPoint", "IdentityIQ", "Deployment"],
  "ibm-security-version-information": ["IBM Security", "Version management"],
  "itim-v51-installation-order": ["ITIM", "Deployment"],
  "understanding-isim-reconciliations": ["ISIM", "Reconciliation", "Troubleshooting"],
  "itim-intro": ["ITIM", "Learning path", "Lifecycle management"],
  "itim-v51-requirements": ["ITIM", "Middleware", "Configuration"],
  "overview-of-sailpoint-identityiq": ["SailPoint", "IdentityIQ", "Access governance", "Lifecycle management"],
  "identityiq-connectors": ["SailPoint", "IdentityIQ", "Connectors", "Provisioning"],
  "java-oops-concepts": ["Java", "Object-oriented programming"],
  "jsp-interview-questions": ["Java", "JSP", "Interview preparation"],
  "j2ee-fundamentals": ["Java", "J2EE", "JSF"],
  "about-the-original-archive": ["Knowledge sharing", "Archive context"],
};

export const legacyKnowledgePublishedAt: Record<string, string | null> = {
  "innovative-ideas-and-identity-manager-landscape": null,
  "sailpoint-iiq-informations": "2015-06-07T16:59:07.000Z",
  "quick-ssd-deployment-steps": "2019-10-18T15:07:21.000Z",
  "ibm-security-version-information": "2014-07-28T17:41:28.000Z",
  "itim-v51-installation-order": "2013-08-02T14:36:19.000Z",
  "understanding-isim-reconciliations": "2014-07-28T17:22:40.000Z",
  "itim-intro": "2009-06-02T07:11:17.000Z",
  "itim-v51-requirements": "2014-07-16T07:29:05.000Z",
  "overview-of-sailpoint-identityiq": "2014-07-14T07:07:23.000Z",
  "identityiq-connectors": "2014-07-14T07:28:26.000Z",
  "java-oops-concepts": "2014-07-18T07:06:40.000Z",
  "jsp-interview-questions": "2014-07-18T07:09:13.000Z",
  "j2ee-fundamentals": "2014-07-18T07:18:42.000Z",
  "about-the-original-archive": "2009-06-02T00:00:31.000Z",
};
