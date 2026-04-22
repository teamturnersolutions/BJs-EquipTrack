# BJ's EquipTrack 🛠️

**Professional Equipment & Inventory Management System**

> [!IMPORTANT]
> **Work in Progress (WIP)**: This application is currently under active development and is intended for **Internal Use Only** within the BJ's organization.

BJ's EquipTrack is a streamlined, high-performance inventory management solution designed to simplify the daily routine of checking equipment in and out. By focusing on a "less is more" UI philosophy, the app relieves the operational burden on end-users while maintaining rigorous tracking and accountability.

---

## ✨ Core Features

### 📋 Versatile Inventory Management
EquipTrack is designed to manage a diverse range of critical operational equipment, including:
- **Zebra Handheld RF Units** (Tagged: `RF`)
- **Personnel Mobile Devices** (Tagged: `iPad`)
- **Handheld Walkie Talkies** (Tagged: `Radio`)
- **Digital Cameras** (Tagged: `Camera`)
- **Rechargeable Power Tools**:
  - **Banders** (Tagged: `Bander`)
  - **Grinders** (Tagged: `Grinder`)

### ⚡ Rapid Execution & Scanning
- **Barcode Support**: Optimized for lightning-fast processing using **Code128** barcode scanning.
- **Simplified UI**: A minimal interface that allows any user to quickly understand and execute check-in/check-out tasks without extensive training.

### 📥 Effortless Data Entry
- **Bulk Imports**: Easily onboard hundreds of users or inventory items via CSV upload.
- **Manual Entry**: Quick individual entry forms for on-the-fly updates.
- **Reference Data**: See [team-members.csv](team-members.csv) and [inventory.csv](inventory.csv) for current data structures.

### 🔍 Accountability & History
- **Transaction Logs**: Full visibility into the history of every device. 
- **Damage Tracking**: Easily identify the last user of a piece of equipment in the event of physical damage or loss.

---

## 🏗️ Architecture & Deployment

The system is built as a fully self-contained Docker environment, ensuring "zero-dependency" deployment on any host machine.

- **Stack**: Next.js 15 (App Router), SQLite, Prisma ORM.
- **Deployment**: Single-service architecture via Docker Compose.

### Quick Start (Ubuntu Linux)

1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/teamturnersolutions/BJs-EquipTrack.git
   cd BJs-EquipTrack
   ```

2. **Launch**:
   ```bash
   chmod +x Docker.sh
   ./Docker.sh
   docker compose up --build
   ```

3. **Access**:
   Open **[http://localhost:9002](http://localhost:9002)** in your browser.

---

## 🚀 Future Roadmap

We are constantly evolving to make equipment tracking even faster and more integrated:
- **NFC Integration**: Support for NFC tags to enable "tap-and-go" check-ins.
- **Android APK**: Mobile-native version for dedicated handheld devices.
- **AI Agent Integration**: An intelligent assistant to provide proactive instructions and resolve anomalous inventory issues.

---

## 🔐 Support & Internal Use
Project managed by **Team Turner Solutions**. For support or feature requests, please contact the internal dev team.
