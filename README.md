# BJ's EquipTrack 🛠️

**Professional Equipment & Inventory Management System**

BJ's EquipTrack is a high-performance, web-based inventory management system optimized for rapid barcode scanning and real-time activity tracking. 

This application is designed to run in a **fully self-contained Docker environment**, requiring zero local dependencies (like Node.js or Prisma) on your host machine.

---

## 🏗️ Architecture Overview

The system is containerized as a single-service architecture using **Next.js 15** and **SQLite**.

### 🧩 Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite via Prisma ORM
- **Runtime**: Node.js 20 (Internal to Container)
- **Deployment**: Docker Engine + Docker Compose

---

## 🚀 Deployment Guide (Lean Docker on Ubuntu Linux)

I recommend using the **Docker Engine** directly instead of the resource-intensive [Docker Desktop](https://www.docker.com/products/docker-desktop/), but if you want to use Docker Desktop just follow this [Link](https://docs.docker.com/desktop/setup/install/windows-install/) for installation instructions. My preferred method for deployment is on Ubuntu Linux. With that said, I put together a quick deployment script to make it easier to deploy, but you can also use the commands below to deploy the application manually on any platform of your choice:

#### Platform with Docker already installed:
```bash
docker pull teamturnersolutions/equiptrack:1.0.0
docker run -d -p 9002:9002 --name equiptrack -v equiptrack-data:/app/data teamturnersolutions/equiptrack:1.0.0
```

#### 🐧 Ubuntu Linux

1. Clone the repo to your machine & change to the repo directory
```bash
git clone https://github.com/teamturnersolutions/BJs-EquipTrack.git
cd EquipTrack
```

2. Make the script executable
```bash
chmod +x Docker.sh
```

3. Run the script to spin up the container
```bash
./Docker.sh
```

4. **Access the App**:
   - URL: **[http://localhost:9002](http://localhost:9002)**

---

## 🗄️ Database & Dev Commands

Since all dependencies are inside the container, use `docker compose exec` to run management tasks:

| Action | Command |
| :--- | :--- |
| **Initial CSV Import** | `docker compose exec app npm run db:import` |
| **View Database (Studio)** | `docker compose exec app npx prisma studio` (Open port 5555) |
| **Rebuild After Change** | `docker compose up -d --build` |

---

## 🔐 Support
Project is Under Development. Intended to be for Internal Use Only for the BJ's Organization.