# FabXP Admin Dashboard (Next.js App Router)

Complete Next.js conversion of the FabXP operations, revenue analytics, and bookings management admin dashboard.

## Architecture Overview

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom theme variables & Plus Jakarta Sans typography
- **Design System**: 100% pixel-perfect preservation of original designs, responsive mobile navigation drawers, interactive SVG donut charts, cubic Bézier charts, modals, and toasts.
- **Server Components for API Management**:
  - All page routes (`app/page.tsx`, `app/bookings/page.tsx`, `app/approvals/page.tsx`, etc.) are React Server Components (RSC).
  - Server components fetch and manage data via the typed API service layer (`src/lib/api/`) directly on the server without client-side API waterfalls.
- **Next.js Server Actions** (`src/server/actions.ts`):
  - `'use server'` mutations with optimistic UI updates and `revalidatePath` cache revalidation.
- **Next.js Route Handlers** (`src/app/api/...`):
  - Native App Router REST endpoints for `/api/dashboard`, `/api/bookings`, `/api/approvals`, `/api/commission`, `/api/listings`, `/api/payouts`, `/api/users`, `/api/settings`, `/api/notifications`, `/api/analytics`.
  - Built-in Next.js API management without needing an external Express/Node backend server.

## Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # Next.js REST Route Handlers
│   │   ├── analytics/
│   │   ├── approvals/
│   │   ├── bookings/
│   │   ├── commission/
│   │   ├── dashboard/
│   │   ├── listings/
│   │   ├── notifications/
│   │   ├── payouts/
│   │   ├── settings/
│   │   └── users/
│   ├── analytics/            # Analytics Server Component Route
│   ├── approvals/            # Approvals Server Component Route
│   ├── bookings/             # Bookings Server Component Route
│   ├── commission/           # Commission Server Component Route
│   ├── listings/             # Listings Server Component Route
│   ├── payouts/              # Payouts Server Component Route
│   ├── settings/             # Settings Server Component Route
│   ├── users/                # User Management & Add Provider Routes
│   ├── notifications/        # Notifications Server Component Route
│   ├── login/                # Login Route
│   ├── forgot-password/      # Forgot Password Route
│   ├── reset-password/       # Reset Password Route
│   ├── 2fa-verify/           # 2FA Verification Route
│   ├── 2fa-setup/            # 2FA Setup Route
│   ├── layout.tsx            # Root Layout with Font & AppShell
│   └── page.tsx              # Dashboard Server Component
├── components/               # UI Components
│   ├── analytics/
│   ├── approvals/
│   ├── auth/
│   ├── bookings/
│   ├── commission/
│   ├── layout/               # AppShell & Navigation Wrappers
│   ├── listings/
│   ├── notifications/
│   ├── payouts/
│   ├── providers/
│   ├── settings/
│   └── users/
├── context/                  # AdminContext & Client State
├── data/                     # Mock Data Store
├── lib/api/                  # Server-side API Management Layer
├── server/                   # Server Actions
└── types/                    # TypeScript interfaces
```

## Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the admin dashboard.

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```
