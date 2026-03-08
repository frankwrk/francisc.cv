---
id: "writing:documentation-as-product-surface"
title: "Documentation as a product surface"
sourceType: "writing"
canonicalUrl: "/thinking/documentation-as-product-surface"
priority: 2
topics: ["Documentation", "Product", "DevEx"]
audiences: ["technical-peer", "hiring-manager"]
---
## The hidden product surface

The same issue appears across industries: teams invest heavily in build quality and almost nothing in transfer quality. Then the original builders become permanent support.

## Documentation should answer four questions

Every project handover should make these explicit:

1. What was built, and why?
2. What are the known constraints and trade-offs?
3. How do I run and update this system safely?
4. What should I check first during an incident?

## Treat docs as requirements infrastructure

I now write documentation alongside user stories and acceptance criteria, not after launch. This keeps scope decisions visible and reduces surprises near release.

```ts
type HandoverPackage = {
  systemOverview: string;
  setupGuide: string[];
  maintenanceChecklist: string[];
  knownRisks: string[];
};
```

## Practical rule

If a non-technical owner cannot perform routine updates using your docs, the product is not fully delivered.
