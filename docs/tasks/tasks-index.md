# Tasks Index

## Active Tasks

### TASK-001 — Project Foundation
Status: done
Agent: orchestrator
Description: package.json, configs, Prisma schema, lib files

### TASK-002 — API Routes
Status: in_progress
Agent: agent-api
Depends on: TASK-001
Description: /api/products, /api/products/[id], /api/upload

### TASK-003 — Components & Design System
Status: in_progress
Agent: agent-components
Depends on: TASK-001
Description: Header, ProductCard, FilterBar, SkeletonCard, all reusable UI

### TASK-004 — Main Page
Status: pending
Agent: agent-pages
Depends on: TASK-002, TASK-003
Description: /, hero, featured product, product grid with filters

### TASK-005 — Product Detail Page
Status: pending
Agent: agent-pages
Depends on: TASK-002, TASK-003
Description: /products/[id], gallery, info block, back navigation

### TASK-006 — Admin Panel
Status: pending
Agent: agent-admin
Depends on: TASK-002, TASK-003
Description: /admin table + form, image upload, status management

## Completed Tasks

(none yet)
