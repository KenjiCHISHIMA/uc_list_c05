# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on default port
- `npm run build` - Build production version
- `npm run lint` - Run Next.js linting

### Database Testing
- `node scripts/check-db.js` - Test Supabase database connection and view sample data

## Architecture

This is a Next.js 13.5 application using the App Router with TypeScript and Zustand for state management.

### Key Technologies
- **Framework**: Next.js 13.5 with App Router
- **UI Components**: shadcn/ui components (Radix UI + Tailwind CSS)
- **State Management**: Zustand with centralized store in `lib/store.ts`
- **Database**: Supabase with two main tables: `uc` and `wave_cycle`
- **Forms**: React Hook Form with Zod validation

### Data Flow
1. **Supabase Client** (`lib/supabase.ts`): Initialized with environment variables, provides typed interfaces for UC and WaveCycle entities
2. **Zustand Store** (`lib/store.ts`): Manages all CRUD operations for UCs and Wave Cycles, handles loading states, maintains cache
3. **Components**: Use the store directly via `useUCStore()` hook, all data fetching is handled through the store

### Database Schema
- **uc table**: Primary entity with fields: id, name, description, status
- **wave_cycle table**: Related to UC via uc_id foreign key, includes: id, uc_id, description, start, end, cost, takenaka_poc, tcs_poc

### Routing Structure
- `/` - UC list page with search functionality
- `/uc/[id]` - UC detail page showing related wave cycles
- `/uc/[id]/wave-cycle/[waveCycleId]` - Wave cycle detail page

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key