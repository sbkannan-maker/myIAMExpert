# SailPoint IIQ Use Cases Reference Site - Design Philosophy

## Design Approach: Professional Technical Documentation with Interactive Discovery

**Design Movement:** Modern Enterprise Documentation Design
- Clean, professional interface optimized for technical teams
- Information-dense but scannable layouts
- Dark mode for reduced eye strain during extended research
- Emphasis on clarity, hierarchy, and rapid information retrieval

**Core Principles:**
1. **Discoverability:** Multi-faceted search and filtering (by category, keywords, complexity level)
2. **Scanability:** Clear visual hierarchy with consistent typography and spacing
3. **Accessibility:** High contrast, readable fonts, keyboard navigation
4. **Depth:** Subtle shadows and layering to create visual separation between sections

**Color Philosophy:**
- **Primary:** Deep blue (`oklch(0.35 0.12 260)`) - Trust, technical authority
- **Accent:** Cyan/Teal (`oklch(0.65 0.15 200)`) - Highlights, interactive elements, code blocks
- **Background:** Dark slate (`oklch(0.12 0.01 260)`) - Reduced eye strain for long reading sessions
- **Text:** Off-white (`oklch(0.92 0.01 260)`) - High contrast, readable
- **Secondary:** Muted purple (`oklch(0.50 0.08 280)`) - Category badges, secondary information

**Layout Paradigm:**
- **Header:** Fixed navigation with logo, search bar, and category filters
- **Main Content:** Two-column layout (sidebar filter + main content area)
- **Cards:** Use-case cards with visual category indicators, expandable details
- **Typography:** Serif headlines (Merriweather) for authority, sans-serif body (Poppins) for clarity

**Signature Elements:**
1. **Category Badges:** Color-coded badges (JML, Compliance, RBAC, Workflows, Governance, Infrastructure)
2. **Technical Callouts:** Highlighted code snippets and technical terms with inline definitions
3. **Complexity Indicators:** Visual badges showing difficulty level (Beginner, Intermediate, Advanced)

**Interaction Philosophy:**
- Smooth transitions between states (150-250ms)
- Instant search feedback with debouncing
- Expandable use-case cards reveal full details without page navigation
- Hover effects on interactive elements (slight lift, color shift)

**Animation Guidelines:**
- Search results fade in with staggered timing (50ms per item)
- Card expansions use smooth height transitions
- Hover states: 150ms ease-out for color/shadow changes
- No animations on page load (instant, snappy feel)

**Typography System:**
- **Headlines (H1, H2):** Merriweather Bold, 2.5rem / 1.875rem - Authority and clarity
- **Subheadings (H3, H4):** Poppins SemiBold, 1.5rem / 1.25rem - Section organization
- **Body Text:** Poppins Regular, 1rem - Readable, professional
- **Code/Technical:** Fira Code Monospace, 0.875rem - Technical accuracy
- **Labels/Badges:** Poppins Medium, 0.875rem - Scannable metadata

**Brand Essence:**
- **Positioning:** The definitive reference guide for advanced SailPoint IIQ implementations in lab environments
- **For:** Identity and Access Management professionals, architects, and engineers
- **Why Different:** Combines business context with technical specifications in one searchable interface
- **Personality:** Authoritative, precise, helpful, professional

**Brand Voice:**
- Headlines: Direct, technical, outcome-focused (e.g., "Multi-Tier Approval with Dynamic Routing" not "Approval Systems")
- CTAs: Action-oriented, specific (e.g., "View Implementation Steps" not "Learn More")
- Microcopy: Clear, jargon-appropriate for the audience
- Example: "Implement a 7-day grace period for department transitions" (not "Handle employee moves")

**Logo & Visual Identity:**
- **Logo:** Stylized identity node/network icon (interconnected circles) in cyan on transparent background
- **Favicon:** Simplified version of the logo
- **Visual Accent:** Subtle grid pattern in background (very faint, 5% opacity)

**Signature Brand Color:** Deep Blue (`oklch(0.35 0.12 260)`) - Technical trust and authority

## Implementation Details

### Page Structure
1. **Header:** Fixed, dark background with search and category filter
2. **Sidebar:** Collapsible on mobile, sticky on desktop - category navigation
3. **Main Area:** Use-case cards in grid layout, expandable for details
4. **Footer:** Quick links, version info, last updated timestamp

### Component Hierarchy
- Search bar (prominent, top-center)
- Category filters (horizontal tabs or sidebar)
- Use-case cards (grid, 1-2 columns responsive)
- Expandable details panel (modal or inline expansion)
- Code snippets (syntax highlighted, copyable)

### Search & Filter Strategy
- Real-time search across use case titles, descriptions, and technical terms
- Filter by category (6 categories)
- Filter by complexity level (Beginner, Intermediate, Advanced)
- Filter by technology (Workflow, RBAC, SoD, etc.)
- Saved searches/favorites for quick access

### Visual Indicators
- **Category Colors:** Each category has a unique color for quick visual scanning
- **Complexity Badges:** Star ratings or level indicators (1-3 stars)
- **Status Indicators:** New, Updated, Popular tags if applicable

### Responsive Design
- **Desktop:** Two-column (sidebar + content)
- **Tablet:** Collapsible sidebar, full-width content
- **Mobile:** Stacked layout, search-first experience

## Style Decisions
- Use Merriweather for headlines to convey authority and professionalism
- Implement dark mode as default for reduced eye strain
- Cyan accents for interactive elements to create visual hierarchy
- Card-based layout for scannable information presentation
- Subtle animations (150-250ms) for smooth state transitions
- The identity-node icon is the signature motif. Repeat it subtly in header lockups, reference metadata, release stages, and delivery sequences.
- Use a search-first catalog hero: query, taxonomy, count, and active filters remain the primary first-view experience.
- Keep category colors fixed by domain across filters, badges, cards, and detail reference panels. Express complexity with a consistent one-to-three dot meter.
