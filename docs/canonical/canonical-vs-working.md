# Canonical vs Working Files

## Purpose

This document defines the difference between canonical files and working files in the AI-assisted development system.

## Canonical Files

Canonical files contain stable, approved, system-level knowledge.

They are used as the trusted reference for:

- system rules
- repository structure
- branch governance
- reload protocol
- long-term project memory

Canonical files should change rarely and only when the system itself evolves.

## Working Files

Working files contain active branch context, temporary decisions, in-progress thinking, and branch-level operational memory.

They are used for:

- active branch tasks
- local branch decisions
- temporary working context
- branch-specific planning

Working files may change frequently as branches progress.

## Core Rule

Canonical files define stable truth.

Working files define current operational context.

If working files conflict with canonical files, canonical files take precedence unless the canonical layer is intentionally updated.

## Practical Principle

Use canonical files for reusable, durable system knowledge.

Use working files for active execution and branch progress.
