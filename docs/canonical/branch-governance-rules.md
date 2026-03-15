# Branch Governance Rules

## Purpose

This document defines the governance rules for AI branches inside the development system.

## Core Rule

AI branches must not change repository structure, canonical files, or registry files without explicit user approval.

## Allowed Without Approval

Branches may update their own working memory files in:

/docs/branches

if the change is part of normal branch operation.

## Requires Explicit User Approval

The following changes require explicit user approval before they are made:

- creating new canonical files
- editing canonical files
- changing repository structure
- creating new registry entries
- modifying branch registry
- creating snapshots
- deleting files
- renaming files

## Orchestrator Responsibility

The master orchestrator is responsible for controlling structural consistency across the system.

## Practical Principle

Branches may think locally.

Only approved flows may change shared system memory.
