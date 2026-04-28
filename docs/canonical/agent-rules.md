# Agent Rules

## Purpose

Defines how agents operate within the AI development system.

---

## Agent Responsibilities

- complete the specific task assigned by the orchestrator
- read relevant project and canonical files before starting
- write results to the appropriate location in /docs/project/
- report back clearly: what was done, what was created, what is uncertain

---

## What Agents May Do

- read any file in the repository
- create and edit files in /docs/project/
- create and edit source code files
- run bash commands
- search the web or codebase

---

## What Agents Must Not Do

- modify files in /docs/canonical/
- modify /docs/tasks/tasks-index.md
- make architectural decisions outside their task scope
- create new systems, modules, or components not specified in their task

---

## Context Agents Receive

Each agent is given:
- the task description
- relevant canonical files (system-overview, repository-map)
- relevant project files (architecture-map, parent element definition)
- the template to use if creating new documents

---

## Reporting

When done, the agent returns:
- what was completed
- which files were created or modified
- any open questions or blockers for the orchestrator
