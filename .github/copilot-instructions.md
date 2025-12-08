# Copilot Project Technologies Guide

This file describes the core technologies and tools used in this project. Use this as a reference for development, onboarding, and code review.

---

## Frontend

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand (local state), TanStack Query (server state)
- **Forms & Validation:** React Hook Form + Zod
- **Uploads:** Vercel Blob (for images, videos, banners etc...)

## Authentication & Authorization

- **Auth Provider:** BetterAuth (self-hosted email/password)
- **ORM:** Drizzle ORM (user/session storage)
- **Roles:** Role-based access control

## Data Layer

- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Entities:** Products, Orders, Users, Inventory
- **Validation:** Zod and drizzle-zod

## API

- **API Layer:** Next.js Route Handlers (REST)
- **Endpoints:** Products, Orders, Users, Payments

## Deployment

- **Platform:** Vercel
- **Database Hosting:** Neon

## Monitoring

- **Error & Analytics:** Firebase Crashlytics

---

### Notes

- Use TanStack Query for all server data fetching/caching.
- Use Zustand for local UI/cart state.
- Use React Hook Form + Zod + drizzle-zod for all forms and validation.
- All uploads (images, banners) should use Vercel Blob.
- All backend data access should use Drizzle ORM + drizzle-zod.
- Deploy to Vercel, use Neon for PostgreSQL.
- Monitor errors and analytics with Firebase Crashlytics.

---
