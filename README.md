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

## 🚀 Standardized 8-Stage DevOps Lifecycle

This portal is architected to follow the industry-standard "Infinity Loop" lifecycle:

| Stage | Implementation Details | Key Innovation |
| :--- | :--- | :--- |
| **1. Plan** | Architectural design and requirement analysis for academic governance. | User-centric UX mapping. |
| **2. Code** | Developed with **Next.js 16** and **TypeScript** for type-safe records. | Professional industrial design. |
| **3. Build** | Optimized bundling and containerization readiness. | Multi-stage production builds. |
| **4. Test** | Unit and integration testing for security and authentication logic. | Automated security validation. |
| **5. Release** | Managed versioning and secure artifact storage in a protected vault. | ID-based artifact mapping. |
| **6. Deploy** | Automated deployment to cloud environments (Vercel/Docker). | High-availability logic. |
| **7. Operate** | Administrative hub for real-time registry and file management. | Faculty Evaluation Interface. |
| **8. Monitor** | Integrated health-check APIs and security flagging system. | Proactive monitoring metrics. |


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
