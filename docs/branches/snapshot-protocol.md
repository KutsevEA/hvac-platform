# Branch Memory — snapshot-protocol

## Branch Name
snapshot-protocol

## Purpose
This branch defines and maintains the snapshot system used for AI branch reloads.

Its job is to make branch transitions stable, repeatable, and loss-minimized when conversation context becomes too large.

## Scope
This branch is responsible for:

- defining snapshot structure
- defining reload prompt structure
- defining what must be saved before branch migration
- defining snapshot naming and numbering rules
- defining minimal required context for restart
- improving branch-to-branch continuity

## In Scope
- snapshot format
- reload prompt format
- branch migration checklist
- context preservation rules
- snapshot quality rules

## Out of Scope
- repository structural changes
- product architecture
- feature design
- implementation logic

## Current Status
Initialized

## Notes
This branch should help standardize how work is transferred into a new chat without losing critical system state.
