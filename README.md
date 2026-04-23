# DevOps Attendance App

A production-grade attendance monitoring web application built with Next.js, demonstrating a rigorous adherence to the complete DevOps lifecycle.

## 🚀 DevOps Stages Implemented

This project is structured around the core principles of DevOps. Here is a breakdown of the stages currently utilized and where they are applied:

| Stage | Implementation Details | Location in Project |
| :--- | :--- | :--- |
| **1. Planning & Design** | Structured architecture and modular design planning before writing code. Tracking tasks via documentation. | Local `task.md` & `implementation_plan.md` |
| **2. Source Code Management** | Version control using Git. Codebase is securely stored and versioned on GitHub. | `.git/` folder & [GitHub Repository](https://github.com/arrebhumi/devopsapp) |
| **3. Continuous Integration (CI)** | Automated pipelines utilizing GitHub Actions. Code is linted and built on every push and pull request to ensure stability. | `.github/workflows/ci.yml` |
| *4. Containerization (Upcoming)* | Dockerizing the application for consistency across environments. | *Pending* |
| *5. Continuous Deployment (CD) (Upcoming)* | Automated deployments to a cloud provider. | *Pending* |
| *6. Monitoring (Upcoming)* | Tracking application health, performance, and user logs. | *Pending* |

## 🛠️ Setup & Initialization History

The following steps and commands were used to reach the current state of the repository. This serves as an audit trail for the project's foundation.

### 1. Initializing the Application
The core framework was scaffolded using the Next.js CLI with modern defaults (TypeScript, Tailwind CSS, ESLint, App Router).
```bash
npx -y create-next-app@latest devopsapp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

### 2. Setting Up Continuous Integration
A GitHub Actions workflow was created at `.github/workflows/ci.yml` to automatically verify the build and enforce code quality (linting) on every push.
```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build Next.js app
      run: npm run build
      
    - name: Run tests
      run: npm test --if-present
      
    - name: Lint code
      run: npm run lint
```

### 3. Setting Up Source Code Management & Pushing to Remote
The local folder was initialized as a Git repository, the files were committed, mapped to the remote GitHub account, and pushed to the `main` branch. This push triggered the first CI pipeline run.
```bash
cd devopsapp
git init
git add .
git commit -m "Initial commit with Next.js and CI setup"
git branch -M main
git remote add origin https://github.com/arrebhumi/devopsapp.git
git push -u origin main
```

## 💻 Running the Application Locally

Follow these instructions to run the application on your local machine for development.

### Prerequisites
- Node.js (v18.x or newer)
- npm (Node Package Manager)

### Commands

1. **Install Dependencies:**
   Ensure all packages are installed correctly. (This was done automatically during setup, but is good practice when pulling fresh code).
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   Run the local server with hot-reloading.
   ```bash
   npm run dev
   ```

3. **View the App:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

4. **Build for Production:**
   To verify the production build locally.
   ```bash
   npm run build
   npm run start
   ```
