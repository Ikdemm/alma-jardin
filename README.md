# Alma Jardín

Digital platform for **Restaurante Alma Jardín** — public website and admin panel, backed by a NestJS API and MongoDB.

## Stack

| Layer | Technology |
|-------|------------|
| Monorepo | [Nx](https://nx.dev) 23 |
| Public / admin UI | Next.js 16, React 19, TypeScript |
| API | NestJS 11, TypeScript |
| Database | MongoDB 7 (Mongoose) |
| Shared types | `libs/shared` |

## Project structure

```
apps/
  web/     Next.js — public site (future admin UI)
  api/     NestJS — REST API
libs/
  shared/  Shared TypeScript types and utilities
```

## Prerequisites

- Node.js 20+
- npm
- Docker (for local MongoDB)

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start MongoDB
npm run docker:up

# Terminal 1 — API (http://localhost:3333/api)
npm run dev:api

# Terminal 2 — Web (http://localhost:4200)
npm run dev:web
```

## Useful commands

```bash
npm run build          # Build web, api, and shared
npm run test           # Run unit tests
npm run lint           # Lint all projects
npm run docker:down    # Stop MongoDB
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service and MongoDB connectivity status |

## Requirements

See `alma-requirements.md` for the full Alma Jardín product specification.
