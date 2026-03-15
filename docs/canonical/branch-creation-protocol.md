# Branch Creation Protocol

## Purpose

This document defines the standard procedure for creating new AI branches within the AI Development System.

The goal is to ensure that all branches are created in a controlled and transparent way so the repository structure remains stable and understandable.

---

## Core Principle

A branch becomes part of the system only after it is:

1. Registered in the branch registry
2. Assigned a branch memory file
3. Given a clearly defined responsibility

Branches should never exist without being visible in the system structure.

---

## Branch Creation Steps

When creating a new branch, the following steps must be completed.

### 1. Create Branch Memory File

A branch must have a dedicated memory file.

Location:

/docs/branches

File format:

/docs/branches/[branch-name].md

The memory file stores the working context of the branch.

---

### 2. Register the Branch

The branch must be added to the registry:

/docs/registry/branch-registry.md

The registry records:

• branch name  
• branch status  
• memory file location

---

### 3. Assign Branch Status

Every branch must have one of the following statuses:

Active  
Planned  
Paused  
Archived

This allows the system to track the lifecycle of each branch.

---

## Governance Rule

Branches must not be created implicitly.

A branch is considered valid only when:

• its memory file exists  
• it is listed in the branch registry  
• its responsibility is defined

---

## Practical Principle

Branches represent isolated working contexts.

They allow complex projects to be developed by multiple AI processes while maintaining overall system stability.
