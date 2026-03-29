# BJs EquipTrack — Architecture Walkthrough

## TL;DR

**Monolithic** — Not API-driven. This is a **Next.js 16 full-stack monolith** where the database, business logic, and UI all live inside a single application process. There is no separate API service. Data mutations flow via **Next.js Server Actions** and reads are performed directly in **React Server Components (RSCs)** using **Prisma ORM**.

---

## Architecture Pattern: Full-Stack Monolith (Next.js App Router)

```mermaid
graph TD
    Browser["🌐 Browser (Client)"]
    RSC["React Server Components\n(Server-side rendering)"]
    SA["Server Actions\n(src/app/actions.ts)"]
    DAL["Data Access Layer\n(src/lib/data.ts)"]
    Prisma["Prisma ORM\n(@prisma/client)"]
    DB["SQLite Database\n(prisma/dev.db)"]

    Browser -->|"HTTP GET (page load)"| RSC
    RSC -->|"Direct DB call"| DAL
    DAL --> Prisma --> DB

    Browser -->|"Form submit / button click"| SA
    SA -->|"prisma.$transaction()"| Prisma
    SA -->|"revalidatePath() → re-renders"| RSC
```

> [!IMPORTANT]
> There are **no REST or GraphQL API controllers**. The single API route (`/api/export/history`) is only for CSV file downloads. All mutations go through Server Actions, which are RPC-style functions that run on the server only.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) with Turbopack |
| Language | TypeScript 5 |
| UI | React 19 + Radix UI + Tailwind CSS v3 |
| Forms | `react-hook-form` + Zod validation |
| ORM | Prisma 6.x |
| Database | SQLite (file: [prisma/dev.db](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/prisma/dev.db)) |
| Icons | `lucide-react` |
| Containerization | Docker (multi-stage) + Docker Compose |
| Runtime | Node.js 22 Alpine |

---

## Database Schema (3 Models)

Defined in [prisma/schema.prisma](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/prisma/schema.prisma).

```mermaid
erDiagram
    TeamMember {
        Int id PK
        String name
    }

    InventoryItem {
        Int id PK
        String name
        String status
        String checkedOutBy
        Int checkedOutById FK
        String checkedOutDate
        String checkedInDate
    }

    InventoryLog {
        Int id PK
        Int itemId
        String itemName
        String action
        Int teamMemberId
        String teamMemberName
        DateTime timestamp
    }

    TeamMember ||--o{ InventoryItem : "holds (checked out)"
```

### Key Design Notes
- **`InventoryItem.status`** is a `String` (not an enum) — values are `"Available"` or `"Checked Out"`.
- **`InventoryLog`** is an **immutable append-only ledger**. Every `CHECKOUT` and `CHECKIN` event writes a new row. Team member name and item name are **denormalized** into the log row (so history survives deletions).
- **No auth model** — the system is currently open/un-authenticated.
- **No soft-delete** — items are hard deleted.
- Dates (`checkedOutDate`, `checkedInDate`) are stored as `String` (ISO 8601), not native `DateTime`.

---

## Application Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | RSC | Home dashboard — nav cards to all sections |
| `/checkout` | RSC + Client | Select team member → select items → checkout |
| `/checkin` | RSC + Client | Select items to return to inventory |
| `/inventory` | RSC + Client | Browse all items, filter Available / Checked Out |
| `/history` | RSC | View last 100 checkout/checkin events |
| `/audit` | RSC + Client | Audit view (per-member equipment) |
| `/api/export/history` | Route Handler | CSV download of transaction history |

All routes under `/(app)/` share a layout wrapper ([layout.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/layout.tsx)).

---

## Feature Breakdown

### 1. Equipment Checkout
**Files**: [/checkout/page.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/(app)/checkout/page.tsx), [actions.ts#checkOutEquipment](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/actions.ts)

- User selects a team member from a dropdown (RSC pre-fetches all [TeamMember](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/lib/types.ts#1-5) records).
- Multi-select checkboxes for available items.
- On submit → Server Action [checkOutEquipment(teamMemberId, itemIds[])](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/actions.ts#41-101):
  1. Validates all items are still `"Available"`.
  2. Runs a `prisma.$transaction()` that:
     - Updates each [InventoryItem](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/lib/types.ts#6-15) status → `"Checked Out"` and records who/when.
     - Inserts an `InventoryLog` row per item with action `"CHECKOUT"`.
  3. Calls `revalidatePath()` on all affected routes to purge Next.js cache.

### 2. Equipment Check-In
**Files**: [/checkin/page.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/(app)/checkin/page.tsx), [actions.ts#checkInEquipment](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/actions.ts)

- Shows only items with `status = "Checked Out"`.
- On submit → [checkInEquipment(itemIds[])](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/actions.ts#102-162):
  1. Validates items are not already available.
  2. Atomic transaction: resets item status, clears checkout fields, logs `"CHECKIN"` event (preserving the original holder's name in the log).

### 3. Inventory View
**File**: [/inventory/page.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/(app)/inventory/page.tsx)

- Displays all inventory items with their live status.
- Filterable by [Available](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/lib/data.ts#46-59) / `Checked Out`.
- Uses [getInventoryItems()](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/lib/data.ts#17-28) from the DAL.

### 4. Transaction History
**File**: [/history/page.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/(app)/history/page.tsx)

- Renders last **100** `InventoryLog` rows, ordered by `timestamp DESC`.
- Color-coded badges: blue for CHECKOUT, green for CHECKIN.
- **Export to CSV** button → hits `/api/export/history` which streams a CSV response.

### 5. Audit View
**File**: [/audit/page.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/(app)/audit/page.tsx)

- Per-member view: shows which items each team member currently holds.
- Useful for accountability / damage tracking.

### 6. Data Management (Home Page Controls)
**Files**: [home-management-controls.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/_components/home-management-controls.tsx), [management-sheets.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/_components/management-sheets.tsx), [bulk-import-sheet.tsx](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/src/app/_components/bulk-import-sheet.tsx)

Three slide-in Sheet panels available from the home screen:

| Sheet | Function |
|---|---|
| **Add Member** | Single team member entry. Supports a "continuous mode" (keep open after submit) for rapid barcode-scanner-driven entry. |
| **Add Item** | Single inventory item entry. Same continuous mode for scanner workflows. |
| **Bulk Import** | Paste raw CSV text → auto-parses header detection, imports many items or members at once. Deduplicates by name. |

---

## Data Flow: Full Mutation Lifecycle

```
User clicks "Checkout" button
        ↓
Client component calls: checkOutEquipment(memberId, [item1, item2])
        ↓
[Server Action - runs on Node.js server]
  → getTeamMemberById(memberId)   ← DAL call
  → getInventoryItems()           ← DAL call
  → validate availability         ← In-memory check
  → prisma.$transaction([
        inventoryItem.update × N,   ← atomic writes
        inventoryLog.create × N     ← audit trail
    ])
  → revalidatePath('/inventory')   ← bust cache
  → revalidatePath('/history')
  → return { success: true }
        ↓
Next.js re-renders affected RSC pages (server-side)
        ↓
Browser receives updated HTML
```

---

## Component Architecture

```
src/
├── app/
│   ├── page.tsx                      ← Home (RSC)
│   ├── actions.ts                    ← All Server Actions (mutations)
│   ├── layout.tsx                    ← Root layout
│   ├── globals.css
│   ├── _components/                  ← Home-specific client components
│   │   ├── home-management-controls.tsx
│   │   ├── management-sheets.tsx     ← Add Member / Add Item sheets
│   │   ├── bulk-import-sheet.tsx     ← CSV import UI
│   │   └── management-section.tsx
│   ├── (app)/                        ← Route group (shared layout)
│   │   ├── layout.tsx
│   │   ├── checkout/_components/
│   │   ├── checkin/_components/
│   │   ├── inventory/_components/
│   │   ├── audit/_components/
│   │   └── history/page.tsx
│   └── api/export/history/           ← CSV export route handler
├── components/
│   ├── app-header.tsx                ← Shared page header
│   ├── inventory-card.tsx            ← Reusable item card
│   └── ui/                           ← Radix UI / shadcn primitives
│       ├── button, card, dialog,
│       ├── sheet, select, checkbox,
│       ├── tabs, toast, input, etc.
├── lib/
│   ├── prisma.ts                     ← Singleton Prisma client
│   ├── data.ts                       ← Data Access Layer (DAL)
│   ├── types.ts                      ← TeamMember, InventoryItem types
│   └── utils.ts                      ← cn() classname helper
└── hooks/
    └── use-toast.ts
```

---

## Docker / Deployment

The app ships as a **single Docker container** with a **3-stage build**:

```mermaid
graph LR
    A["Stage 1: deps\nnode:22-alpine\nnpm ci + prisma files"] --> B["Stage 2: builder\nPrisma generate\nDB push\nnpm run build\nCompile TS scripts"]
    B --> C["Stage 3: runner\nProduction Node.js\nStandalone Next.js\nEntrypoint script"]
```

- **Port**: `9002`
- **Database**: SQLite file mounted via Docker volume at `./prisma:/app/prisma`
- **Entrypoint** ([docker-entrypoint.sh](file:///home/tt/Desktop/Development/BJs-EquipTrack-1/docker-entrypoint.sh)): Initializes DB if missing, then runs `node server.js`
- **Timezone**: `America/New_York`
- **Image**: `teamturnersolutions/equiptrack:2.0`

> [!NOTE]
> Because the DB is a **volume-mounted SQLite file**, data persists across container restarts. This is an important operational dependency — if the volume is lost, so is all data.

---

## Strengths & Current Limitations

| ✅ Strengths | ⚠️ Limitations |
|---|---|
| Zero-overhead, no API layer needed | SQLite is single-writer; no concurrent writes from multiple processes |
| Server Actions make mutations type-safe | No authentication/authorization layer |
| Atomic transactions prevent partial state | History capped at 100 rows in UI (DB stores all) |
| Full audit trail via `InventoryLog` | Dates stored as strings, not `DateTime` (minor) |
| Barcode scanner–optimized UX (continuous mode) | No NFC support yet (planned) |
| Portable Docker image, single container | No role-based access control |
| CSV bulk import for rapid onboarding | No item categories or equipment types at DB level |

---

## Follow-Up Questions

To help evolve this architecture, I'd love to know:

1. **Multi-user concurrency**: Will multiple staff members use this simultaneously? If yes, SQLite's single-writer model could become a bottleneck worth addressing (e.g., PostgreSQL migration).
2. **Authentication**: Is there a plan to add login/roles (e.g., admin vs. floor staff)? This would significantly change the architecture.
3. **Equipment categories**: The DB stores items by name only. Is there a plan to add item types (e.g., `iPad`, `Zebra RF`, `Radio`) as structured fields?
4. **Android APK / NFC**: The README mentions future plans for an Android app and NFC. Is the intent to build a React Native wrapper or a separate native app? This would determine whether a real REST/GraphQL API is needed.
5. **History purging**: The Prisma log grows unboundedly. Is there a retention policy planned?
