# [PROJECT_NAME] Constitution

> **Version:** 1.0.0  
> **Ratification Date:** [RATIFICATION_DATE]  
> **Last Amended Date:** [LAST_AMENDED_DATE]

---

## Core Principles

### Article I: [PRINCIPLE_1_NAME]
[PRINCIPLE_1_DESCRIPTION]
- **Enforcement:** [How this rule is verified or checked]

### Article II: [PRINCIPLE_2_NAME]
[PRINCIPLE_2_DESCRIPTION]
- **Enforcement:** [Enforcement mechanism or standard]

### Article III: Test-First & Quality Gates (Non-Negotiable)
This is **NON-NEGOTIABLE**: All implementation MUST follow strict Test-Driven Development (TDD) or comprehensive test coverage:
1. Unit tests written for core domain logic.
2. Integration tests for critical integration points (OAuth, webhooks, database).
3. Quality gates passing before merge.

### Article IV: [PROJECT_CUSTOMIZABLE_PRINCIPLE_1]
[PRINCIPLE_4_DESCRIPTION]

### Article V: [PROJECT_CUSTOMIZABLE_PRINCIPLE_2]
[PRINCIPLE_5_DESCRIPTION]

### Article VI: Simplicity & Anti-Abstraction
- Use platform and framework features directly rather than wrapping them prematurely.
- Avoid unnecessary architectural layers until demonstrated complexity demands it.

---

## Governance

- **Amendments:** Amendments to this constitution require updating this document and propagating version bumps.
- **Compliance:** All feature plans (`plan.md`) and task breakdowns (`tasks.md`) must explicitly verify compliance against these articles.
