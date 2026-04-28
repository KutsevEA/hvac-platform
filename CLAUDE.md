# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is an **AI-assisted development system** for the HVAC Platform project using an **orchestrator/agent model**:

- The **orchestrator** (main Claude Code session) receives requirements from the user, breaks them into tasks, and spawns agents to execute them.
- **Agents** are subagents launched by the orchestrator via the Agent tool. Each agent receives a narrow, well-defined task and works independently.
- Agents run in parallel when tasks have no dependencies.

## Directory Structure

| Directory | Purpose |
|---|---|
| `/docs/canonical/` | Stable rules and principles — read by orchestrator and agents, not modified by agents |
| `/docs/project/` | Product architecture (Project → System → Module → Component) |
| `/docs/tasks/` | Task queue — orchestrator tracks all tasks and statuses here |
| `/docs/templates/` | Reusable document templates |

## Orchestrator Workflow

1. Receive requirements from user
2. Read relevant `docs/project/` files to understand current architecture
3. Decompose into tasks, record in `docs/tasks/tasks-index.md`
4. Launch agents in parallel where possible
5. Collect results, update project docs, continue to next tasks

## Agent Workflow

Each agent receives:
- the specific task description
- relevant canonical and project files as context
- the template to use if creating new documents

Agents may read/write anywhere in the repo except `/docs/canonical/` and `/docs/tasks/tasks-index.md`.

## Product Architecture Model

The HVAC Platform is decomposed using a four-level hierarchy:

```
Project (HVAC Platform)
└── System (e.g. Identity & Access)
    └── Module (e.g. Authentication)
        └── Component (e.g. Login)
```

New elements must follow the template at `/docs/templates/project-definition-template.md`.

## Current Architecture State

- **System:** Identity & Access
- **Module:** Authentication
- **Component:** Login
