# Branch Reload Protocol

## Purpose

This protocol defines how an AI branch safely reloads when the chat context is exhausted.

## When Reload Is Needed

Reload should be performed when:

• the AI context becomes unstable  
• the conversation becomes too long  
• a new branch chat needs to start  
• the system needs a clean context

## Reload Steps

1. Create a snapshot in `/docs/snapshots/`
2. Record current system state
3. Record active branches
4. Start a new AI branch chat
5. Provide snapshot + branch memory files to the new branch

## Principle

Snapshots act as **context checkpoints** that allow the AI system to restart without losing structural knowledge.

## Rule

Branches should never rely on chat history.

They must rely on:

• canonical files  
• branch memory files  
• snapshots
