# Dorkly — Google Dork Intelligence Platform

A professional, terminal-aesthetic OSINT platform that makes Google dorking accessible to security researchers, journalists, and analysts — without needing to memorise syntax.

---

## What it does

- **Visual query builder** — pick operators, fill values, build dork queries without memorising syntax
- **Template library** — 100+ curated dorks organised by category (security, OSINT, research, recon)
- **Personal library** — save, organise, and reuse your own dorks
- **Multi-engine search** — launch queries directly in Google or DuckDuckGo
- **One-click load** — load any template straight into the builder to customise it

---

## Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React + TypeScript + Tailwind CSS |
| Backend   | Node.js + Express + TypeScript    |
| ORM       | Drizzle ORM                       |
| Database  | PostgreSQL                        |
| State     | TanStack Query                    |
| Routing   | React Router v6                   |

---

## Project structure

```txt
apps/
  web/        # React frontend
  api/        # Node.js backend

packages/
  shared/     # Shared types, utilities, constants