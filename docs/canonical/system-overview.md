# AI Development System — Overview

## Purpose

This repository supports an orchestrator/agent model of AI-assisted software development.

The orchestrator (main Claude Code session) receives requirements, breaks them into tasks, and delegates each task to a specialized agent. Agents work in parallel where possible and return results to the orchestrator.

## Core Principles

1. The orchestrator owns task decomposition and sequencing.
2. Agents receive narrow, well-defined tasks with full context needed to complete them.
3. Parallel execution is preferred when tasks have no dependencies.
4. The project layer (docs/project/) is the source of truth for product architecture.
5. Canonical files define stable rules that guide both orchestrator and agents.

## Roles

### Orchestrator
- accepts requirements from the user
- breaks work into tasks and records them in docs/tasks/
- assigns tasks to agents
- collects results and decides next steps
- updates project documentation as architecture evolves

### Agents
- receive one task at a time
- have access to files, bash, search, and web
- operate independently within their task scope
- return a result to the orchestrator

## Key Directories

/docs/canonical — stable rules and principles (given to agents as context)
/docs/project — product architecture (Project → System → Module → Component)
/docs/tasks — task queue managed by the orchestrator
/docs/templates — reusable document templates
