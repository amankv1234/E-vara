# 🤝 Contributing to E-VARA

Thank you for your interest in contributing to **E-VARA**! 🚀

We welcome contributions from developers, security researchers, designers, and open-source enthusiasts. Whether you're fixing a bug, improving documentation, or building a new feature, your contributions help make E-VARA better.

---

# 📋 Table of Contents

* Code of Conduct
* Before You Start
* Prerequisites
* Fork and Clone the Repository
* Install Dependencies
* Environment Setup
* Running the Project
* Create a Branch
* Making Changes
* Testing and Linting
* Commit Guidelines
* Submitting a Pull Request
* Security Contributions

---

# 🌟 Code of Conduct

Please help us maintain a positive and professional community.

* Be respectful and constructive.
* Prioritize security and user privacy.
* Follow existing architectural patterns.
* Welcome and support fellow contributors.

---

# 🚀 Before You Start

Before working on an issue:

1. Check the Issues tab for available tasks.
2. Comment on the issue if required.
3. Wait for assignment if the maintainers request it.
4. Fork the repository.

---

# 📦 Prerequisites

Please install:

* Node.js 20+
* Git
* npm
* A Supabase account

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# 🍴 Fork and Clone the Repository

## Step 1: Fork

Click the **Fork** button on GitHub.

## Step 2: Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/E-vara.git
```

Navigate into the project:

```bash
cd E-vara
```

## Step 3: Add the upstream repository (recommended)

```bash
git remote add upstream https://github.com/SHAURYASANYAL3/E-vara.git
```

Verify remotes:

```bash
git remote -v
```

---

# 📥 Install Dependencies

Install project dependencies:

```bash
npm install
```

---

# 🔐 Environment Setup

E-VARA uses Supabase.

Create a `.env` file in the project root.

Example:

```env
VITE_SUPABASE_URL=your_instance_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Never commit secrets or your `.env` file.

---

# ▶️ Running the Project

## Frontend

Start the development server:

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Database Setup

Execute:

```
schema.sql
```

inside your Supabase SQL Editor.

## Edge Functions

Deploy required functions:

```bash
supabase functions deploy breach-check
```

---

# 🌿 Create a Branch

Always create a separate branch.

Examples:

```bash
git checkout -b docs/update-contributing-guide
```

```bash
git checkout -b fix/login-bug
```

```bash
git checkout -b feat/new-dashboard-widget
```

---

# 💻 Make Your Changes

While contributing:

* Follow the existing project structure.
* Keep changes focused.
* Maintain readability.
* Follow TypeScript best practices.

## Strict Typing

E-VARA enforces strict typing.

❌ Avoid:

```ts
let data: any;
```

✅ Prefer:

```ts
let data: UserProfile;
```

---

# ✅ Testing and Linting

Before submitting a PR:

## Run linting

```bash
npm run lint
```

## Unit Testing

Use Vitest for logic testing.

## End-to-End Testing

Use Playwright for UI flows.

Please ensure all tests pass before submitting your contribution.

---

# 📝 Commit Your Changes

Stage changes:

```bash
git add .
```

Commit with a meaningful message:

```bash
git commit -m "docs: improve contributing guide"
```

Examples:

* feat: add dashboard component
* fix: resolve authentication bug
* docs: update README
* refactor: simplify API logic

---

# ☁️ Push Your Branch

Push your work:

```bash
git push origin your-branch-name
```

---

# 🔄 Submit a Pull Request

1. Open your fork on GitHub.
2. Click **Compare & Pull Request**.
3. Write a clear title.
4. Describe your changes.
5. Reference related issues.
6. Add screenshots for UI changes if applicable.
7. Submit your PR.

Before submitting, make sure:

* Code builds successfully.
* Linting passes.
* Tests pass.
* Documentation is updated if needed.
* CI checks pass.

---

# 🔒 Security Contributions

Security is a core principle of E-VARA.

If you discover a security vulnerability:

❌ Do NOT open a public issue.

Please follow the responsible disclosure process outlined in:

`SECURITY.md`

---

# 💡 Contribution Tips

Good first contributions include:

* Documentation improvements
* Bug fixes
* UI enhancements
* Accessibility improvements
* Performance optimizations
* Test coverage

---

# ❤️ Thank You

Thank you for helping build E-VARA.

Every contribution—whether it's code, documentation, testing, or feedback—helps strengthen the platform and the open-source community.

Happy coding! 🚀
