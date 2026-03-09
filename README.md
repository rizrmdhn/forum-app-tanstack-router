# Forums App

A forum discussion app built as part of the **Dicoding: Menjadi React Web Developer Expert** course.

## Stack

| Category | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Routing | TanStack Router |
| Server State | TanStack Query |
| Client State | Redux Toolkit + React Redux |
| UI Components | shadcn/ui + Base UI |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Notifications | Sonner |
| Font | Geist (variable) |

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component>
```

Components are placed in `src/components/ui/` and imported as:

```tsx
import { Button } from "@/components/ui/button"
```
