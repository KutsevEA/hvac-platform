# Repository Map

## Purpose

This document defines the structural map of the AI Development System repository.

Its purpose is to provide a stable reference for:

- repository folder roles
- allowed file types by folder
- relationships between system layers
- navigation across the repository

This file is part of the canonical layer.

---

## Repository Root Structure

/docs
    /branches
    /canonical
    /registry
    /snapshots
    /templates

---

## Folder Definitions

### /docs/branches

Purpose:
Stores branch memory files for active and future AI branches.

Contents:
- one memory file per branch
- operational branch state
- branch-local working context
- temporary branch decisions
- branch progress notes

Rules:
- branch files may evolve frequently
- branch files are working memory, not canonical truth
- branch files must stay aligned with canonical documents
- each active branch should have one corresponding branch memory file

---

### /docs/canonical

Purpose:
Stores stable system-level documentation.

Contents:
- system rules
- structural definitions
- governance rules
- reload rules
- branch creation rules
- repository-wide concepts

Rules:
- canonical files define stable truth
- changes to canonical files must be intentional
- canonical files should not contain temporary branch-level notes
- canonical files should change less often than working files

---

### /docs/registry

Purpose:
Stores official branch registration and branch status tracking.

Contents:
- branch registry
- branch lifecycle status
- mapping of branches to memory files
- branch activity tracking

Rules:
- every official branch must appear in the registry
- branch status changes must be reflected here
- registry is the official branch index for the system

---

### /docs/snapshots

Purpose:
Stores repository state snapshots used for context reload.

Contents:
- numbered repository snapshots
- major structural checkpoints
- branch initialization milestones
- reload state summaries

Rules:
- snapshots record important system state transitions
- snapshots must be sequentially numbered
- snapshots should be concise but sufficient for reload
- snapshots do not replace canonical documentation

---

### /docs/templates

Purpose:
Stores reusable templates for system documents.

Contents:
- branch memory template
- snapshot template
- future templates for canonical and governance files

Rules:
- templates define preferred structure
- templates are reusable starting points
- templates do not represent active system state

---

## Layer Mapping

### Canonical Layer
Primary folder:
- /docs/canonical

Role:
Stores stable knowledge about how the AI Development System works.

---

### Governance Layer
Primary folders:
- /docs/canonical
- /docs/registry

Role:
Controls how branches, files, and structural changes are managed.

---

### Architecture Layer
Primary folders:
- /docs/canonical
- /docs/registry

Role:
Defines repository structure, branch roles, and system organization.

---

### Snapshot Layer
Primary folder:
- /docs/snapshots

Role:
Preserves important system states for branch reload and continuity.

---

### Branch Memory Layer
Primary folder:
- /docs/branches

Role:
Stores active operational context for each AI branch.

---

## Relationship Between Folders

### Canonical and Branches
Canonical files define stable truth.
Branch files use that truth for ongoing work.

### Registry and Branches
The registry tracks which branches exist.
Branch memory files store the live state of those branches.

### Snapshots and Canonical
Snapshots reference canonical state at important milestones.
They do not replace canonical documents.

### Templates and All Other Folders
Templates provide reusable structures for creating new documents across the system.

---

## Repository Navigation Rule

When evaluating any file in the repository, priority should be interpreted as:

1. canonical documents define stable rules
2. registry defines official branch status
3. branch memory defines operational branch context
4. snapshots define reload checkpoints
5. templates define reusable starting structures

---

## File Creation Rule

New files should be created only when their role is clear within this repository map.

Before creating a new file, the system should determine:

- which folder it belongs to
- whether it is canonical or working
- whether an existing file already serves that purpose
- whether the new file affects branch governance or reload logic

---

## Status

Repository map initialized.
