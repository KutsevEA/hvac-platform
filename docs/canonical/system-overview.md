# AI Development System — Overview

## Purpose

This repository contains the architecture for an AI-assisted development system.

The goal of the system is to allow complex software projects to be developed using multiple AI branches while avoiding context loss.

The system relies on:

• branch memory files  
• snapshots  
• canonical documentation  
• controlled repository updates  

## Core Principles

1. Canonical files are the source of truth.
2. Branches operate using memory files.
3. Snapshots allow safe context reload.
4. The orchestrator controls structure changes.

## Key Directories

/docs/branches  
Branch memory files.

/docs/canonical  
Stable documentation describing the system.

/docs/registry  
Registry of branches.

/docs/snapshots  
System state checkpoints.

/docs/templates  
Templates used to create new files.

## Governance

Structural changes should be documented via snapshots to maintain system stability.
