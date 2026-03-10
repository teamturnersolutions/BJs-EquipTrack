# BJ's EquipTrack Systems Flow

This document provides a visual representation and walkthrough of the systems flow for BJ's EquipTrack, a containerized inventory management application built with Next.js 15, SQLite, and Prisma.

## Systems Flow Diagram

The diagram below depicts how users and administrators interact with the application, its internal components, and the underlying data storage within a Docker container.

```mermaid
graph TD
    User([User / Staff]) -->|Interacts with| WebUI[Next.js Frontend]
    WebUI -->|Triggers| Actions[Next.js Server Actions]
    Actions -->|Queries/Updates| Prisma[Prisma ORM]
    Prisma -->|Reads/Writes| SQLite[(SQLite Database)]
    
    subgraph DockerContainer ["Docker Container (EquipTrack)"]
        WebUI
        Actions
        Prisma
        SQLite
        Scripts[Maintenance Scripts]
        ExportAPI[Export API]
    end
    
    Scripts -->|Cleans/Imports| SQLite
    ExportAPI -->|Reads| SQLite
    ExportAPI -->|Downloads CSV| User
    
    Admin([Admin]) -->|Runs| Scripts
```

## Component Breakdown

### 1. **Next.js Frontend (WebUI)**
The user interface, accessible at `http://localhost:9002`, provides dedicated views for checking equipment in/out, viewing inventory, and tracking transaction history.

### 2. **Server Actions**
Next.js Server Actions handle business logic, such as [checkOutEquipment](file:///c:/Users/teamt/Desktop/Project/EquipTrack/src/app/actions.ts#41-101) and [checkInEquipment](file:///c:/Users/teamt/Desktop/Project/EquipTrack/src/app/actions.ts#102-162), providing a secure bridge between the frontend and the database.

### 3. **Prisma ORM & SQLite**
Prisma acts as the data access layer, managing schemas and performing type-safe queries on a local SQLite database file ([dev.db](file:///c:/Users/teamt/Desktop/Project/EquipTrack/prisma/dev.db)). This file is persisted using Docker volumes.

### 4. **Export API**
A dedicated REST endpoint (`/api/export/history`) allows users to download the transaction history as a CSV file directly from the WebUI.

### 5. **Maintenance Scripts**
A collection of utility scripts, such as `migrate-csv.ts` and `cleanup-logs.ts`, are used by administrators to manage the application's data state, typically executed via `docker compose exec`.

## Production Readiness

| Feature | Status |
| :--- | :--- |
| **Containerization** | Fully Dockerized for zero-dependency deployment. |
| **Persistence** | SQLite database persists via host-mounted volumes. |
| **Data Integrity** | Prisma ORM ensures consistent data models for tracking equipment. |
| **Exportability** | Built-in CSV export for all transaction logs. |

---
> [!NOTE]
> This chart represents the current core architecture. While `genkit` and `firebase` dependencies exist in the project, they are currently unused and are not part of the active systems flow.
