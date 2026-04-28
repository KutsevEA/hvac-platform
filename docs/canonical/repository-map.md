# Repository Map

## Purpose

Defines the structural map of the repository and the role of each folder.

---

## Repository Root Structure

/docs
    /canonical
    /project
    /tasks
    /templates

---

## Folder Definitions

### /docs/canonical

Purpose:
Stores stable system-level rules and principles.

Contents:
- system overview and model description
- repository map (this file)
- governance rules for agents

Rules:
- canonical files are the source of truth
- changes require explicit user approval
- agents may read canonical files but not modify them

---

### /docs/project

Purpose:
Stores the hierarchical architecture of the product being developed.

Contents:
- project root definition
- system definitions (one subfolder per system)
- module definitions (nested inside system folders)
- component definitions (nested inside module folders)
- architecture map and systems index

Rules:
- structure follows the four-level hierarchy: Project → System → Module → Component
- each element is documented using the project-definition-template
- the orchestrator updates this layer as architecture decisions are made
- systems-index.md is the authoritative list of active systems

---

### /docs/tasks

Purpose:
Stores the task queue managed by the orchestrator.

Contents:
- tasks-index.md — master list of all tasks with status

Rules:
- orchestrator creates and updates tasks
- agents do not modify the task index directly
- completed tasks are moved to the Completed section

---

### /docs/templates

Purpose:
Stores reusable templates for system documents.

Contents:
- branch-memory-template.md
- project-definition-template.md
- snapshot-template.md

Rules:
- templates are starting points, not active documents
- agents use templates when creating new project-layer files

---

## Layer Priority

When interpreting any file in the repository:

1. canonical — defines stable rules
2. project — defines current product architecture
3. tasks — defines current work in progress
4. templates — defines document structure

---

## File Creation Rule

Before creating a new file, determine:
- which folder it belongs to
- whether it already exists
- whether it requires orchestrator approval
