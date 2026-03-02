# BJs EquipTrack - Technical Documentation & Deployment Roadmap
Deep dive into the **BJs EquipTrack** codebase, explaining its architecture, and component organization.

---

## 🏗️ Architecture Overview

BJs EquipTrack is built using **Next.js 15** with **App Router**, utilizing Server Components for rendering and Server Actions for data mutations.
The application follows a modern Full-Stack Next.js architecture, containerized for simplified deployment and scalability.

## 🧩 Technology Stack
Framework: Next.js 15 (App Router)
Database: SQLite via Prisma ORM
Styling: Tailwind CSS + Shadcn UI
Runtime: Node.js 20 (Inside Docker)

### 📁 Project Structure

```text
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, Actions)
│   │   ├── (app)/          # Main application routes (Dashboard, etc.)
│   │   │   ├── audit/      # Equipment audit workflow
│   │   │   ├── checkin/    # Equipment return/check-in workflow
│   │   │   ├── checkout/   # Equipment checkout workflow
│   │   │   └── inventory/  # Gallery view of all equipment
│   │   ├── actions.ts      # Server Actions (Business logic for mutations)
│   │   └── layout.tsx      # Root layout (Navigation, Metadata)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Radix UI / Shadcn based components (Lower level)
│   │   ├── inventory-card.tsx # Visual card for equipment items
│   │   └── app-header.tsx  # Global navigation header
│   ├── lib/                # Shared utilities and data access
│   │   ├── data.ts         # Data Access Layer (Currently CSV-based)
│   │   ├── types.ts        # TypeScript interfaces for Items/Members
│   │   └── utils.ts        # Formatting and Tailwind helpers
├── public/                 # Static assets (Not present, created during build)
├── inventory.csv           # Primary data file for equipment
├── team-members.csv        # Primary data file for team members
├── Dockerfile              # Multi-stage production build configuration
└── docker-compose.yml      # Orchestration for local dev and deployment
```

---
## 🧩 Component Breakdown

### 1. Data Access Layer (`src/lib/data.ts`)
This is the heart of the application's data handling. It currently uses `fs` to read and write to CSV files.
- `getInventoryItems()`: Loads all equipment.
- `updateInventory()`: Merges updates back into the CSV.
- `getTeamMembers()`: Loads the list of personnel.

### 2. Server Actions (`src/app/actions.ts`)
Encapsulates business logic that runs on the server.
- `checkOutEquipment`: Validates status, updates the item with the member's name/ID, and triggers a revalidation of the UI.
- `checkInEquipment`: Resets the item status to 'Available' and clears assignment data.

### 3. UI Components (`src/components/`)
- **Inventory Card**: Responsive card showing item thumbnail, status badge, and assignment details. It uses conditional styling based on the `status` field.
- **UI Directory**: Contains specialized components like Buttons, Dialogs, and Select menus (standard Shadcn-style architecture).


## 🛠️ BJ's EquipTrack 🛠️

### 🚀 Deployment Guide (Docker Only)
The primary and intended way to run BJ's EquipTrack is using Docker Compose. This handles the application setup, database initialization, and networking in a single step.

### 📦 Step 1: Install Docker & Docker Compose
Follow the instructions for your Operating System:

### 🪟 Windows
Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- During installation:
Ensure the "Use the WSL 2 based engine" option is selected.

Once installed, launch Docker Desktop and wait for the **"Engine Running"** status.

**NOTE:** Docker Compose is included automatically. 
### Verify in PowerShell:
```powershell
docker compose version
```

### 🍎 macOS
Download and install [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) (select Apple Silicon or Intel as appropriate).
Launch Docker Desktop from your Applications folder.
Verify in Terminal: 
```
docker compose version.
```

### 🐧 Linux
Install Docker: 
```bash
sudo apt-get update && sudo apt-get install docker.io.
```

Install the Compose plugin: 
```bash
sudo apt-get install docker-compose-v2.
```

Add your user to the docker group: 
```bash
sudo usermod -aG docker $USER (requires logout/login).
```

Verify in Terminal: 
```bash
docker compose version.
```

### 🛠️ Step 2: Launch the Application
*Clone/Download this repository.*
```bash
git clone https://github.com/teamturnersolutions/BJs-EquipTrack.git
```
*Open a Terminal in the project folder.*
```bash
cd BJs-EquipTrack
```
*Run the 1-Step Setup:*
```bash
docker compose up -d --build 
```
### NOTE:
- -d Runs the container in the background (detached).
- --build Ensures the latest source code is cooked into the image.

## Access the Web Interface:
URL:
[http://localhost:9002](http://localhost:9002)

## �️ Database Management
Since the database (SQLite) runs inside the container, management is handled through the container volume.
- Data Persistence: Your database is stored in the ./prisma directory on your host machine. It will survive container restarts and updates.
- Bulk Import: To import your CSV data (if not already done), ensure your .csv files are in the project root and run:
```
docker compose exec app npm run db:import
```

### This is a work in progress
