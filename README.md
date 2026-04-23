# 🛡️ DevOps Attendance & Academic Registry Portal

A high-fidelity, production-grade academic management ecosystem built with **Next.js 15+**, meticulously engineered to demonstrate the complete **End-to-End DevOps Lifecycle**. This portal bridges the gap between student self-service and administrative governance with a focus on data integrity, security, and industrial aesthetics.

---

## 🌟 Key Features

### 👨‍🎓 Student Terminal
- **Dynamic Attendance Feed**: Real-time visualization of attendance metrics with "Critical Threshold" alerts (75% university standard).
- **Secure Justification Pipeline**: Integrated multi-part upload system for medical and leave justifications.
- **Coursework Management**: Full lifecycle support for Lab/Assignment submissions, including **Unsubmit & Refine** capabilities.

### 👩‍🏫 Faculty Governance Suite (Admin)
- **Medical Audit Queue**: Secure document verification interface with session-aware binary streaming.
- **Evaluation Terminal**: High-performance grading interface for rapid coursework assessment and feedback synthesis.
- **Student Registry Audit**: Master control hub for student identities, attendance records, and performance tracking.

---

## 🚀 DevOps Lifecycle & "Novelty" Implementation

This project distinguishes itself through advanced implementation of core DevOps stages beyond standard CRUD applications:

| Stage | Implementation & "Novelty" Detail | Tech Leveraged |
| :--- | :--- | :--- |
| **Data Governance** | **IaC (Infrastructure as Code)**: Relational schema management via Prisma, ensuring identical environments across Dev/Prod. | Prisma ORM, PostgreSQL |
| **SecOps** | **Departmental Secure Vault**: Sensitive files are stored in an unexposed, private directory. Retrieval is managed via a dedicated session-aware API that streams raw binary data only to authorized peers. | Node.js fs, Auth.js v5 |
| **Quality Assurance** | **Atomic Persistence Engine**: Use of Server Actions with `revalidatePath` to ensure zero-latency state synchronization between Student submissions and Faculty evaluation queues. | Next.js Server Actions |
| **Industrial UX** | **Brutalist Administrative Aesthetic**: A "No-Placeholders" design language utilizing high-contrast borders and mono-space typography for a professional, "mission-critical" feel. | Tailwind CSS 4.0 |
| **SCM** | **Branch-Ready Architecture**: Decoupled Client/Server logic optimized for parallel development and CI/CD git-flow. | Git, TypeScript |

---

## 🛠️ The Technical Stack

- **Core Framework**: Next.js 15 (App Router) + React 19
- **Database Engine**: Prisma ORM with SQLite (Development) / PostgreSQL (Production)
- **Security Layer**: Auth.js v5 (NextAuth) with Role-Based Access Control (RBAC)
- **Industrial Styling**: Tailwind CSS 4.0 & Lucide Engineering Icons
- **Persistence Layer**: Local Secure Filesystem Storage with Binary Stream APIs

---

## 💻 Technical Excellence: Secure Vault Architecture

Unlike standard apps that expose user uploads in public directories, this system implements a **Secure Virtual Pathing** strategy:

1. **Isolation**: Files are saved in `/storage/uploads/`, outside the public web root.
2. **Obfuscation**: Filenames are sanitized and unique-indexed (`${recordId}-${filename}`).
3. **Session Filtering**: The `/api/docs/[id]` endpoint intercepts all requests, confirming the user's role and identity before streaming fragments of the file buffer to the browser.

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Provision Database & Seed Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Launch Development Environment
```bash
npm run dev
```

---
*Developed as a premium demonstration of the DevOps methodology in modern web engineering.*
