# Project Layer

## Purpose

The Project Layer defines how the HVAC Platform is described and decomposed inside the AI development system.

It defines the structure of the actual product being built — separate from the system rules that govern how agents operate.

---

## Project Structure Model

Projects are decomposed using four levels:

```
Project
└── System
    └── Module
        └── Component
```

This hierarchy lets agents work on isolated parts of the product without losing the overall architecture.

---

## Level Definitions

### Project
The overall product or platform. Contains multiple systems.
Example: HVAC Platform

### System
A large functional area. Contains multiple modules.
Examples: Identity & Access, Billing, Equipment Management

### Module
A functional building block inside a system. Contains multiple components.
Examples: Authentication, User Permissions, Notifications

### Component
The smallest architectural unit. This is what gets implemented.
Examples: API service, database schema, UI form, background worker

---

## Documentation Standard

Every element must be documented using the template at:

/docs/templates/project-definition-template.md

Each element lives in its own file within the /docs/project/ hierarchy.

---

## Role of the Project Layer

- provides a structural map of the product
- gives agents clear ownership boundaries
- defines integration points between systems and modules
- allows parallel agent work without architectural conflicts
