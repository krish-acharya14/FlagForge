# Contributing to FlagForge

First off, thank you for considering contributing to **FlagForge**! 🎉

FlagForge is a free and open-source application built to make solving and documenting Capture The Flag (CTF) challenges easier. Whether you're fixing a bug, improving the documentation, adding a new converter, or implementing an attachment analysis tool, your contributions are greatly appreciated.

## Ways to Contribute

There are many ways you can help improve FlagForge:

* Report bugs
* Suggest new features
* Improve documentation
* Fix typos or UI issues
* Add new converter tools
* Add new attachment analysis tools
* Improve performance
* Refactor existing code
* Write tests
* Review pull requests

No contribution is too small.

---

# Development Setup

## Prerequisites

* Node.js 22 or later
* .NET 10 SDK
* Git

## Clone the Repository

```bash
git clone https://github.com/AaryanKhClasses/FlagForge.git
cd FlagForge
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Run the Frontend

```bash
npm run dev
```

## Run the Desktop Host

Open the `host` project in Visual Studio and start the application.

---

# Project Structure

```text
frontend/     React + TypeScript + Vite
host/         C# WPF desktop application
```

---

# Coding Guidelines

Please follow these guidelines when contributing:

* Write clear and readable code.
* Prefer descriptive variable and function names.
* Keep functions focused on a single responsibility.
* Avoid unnecessary dependencies.
* Maintain consistency with the existing codebase.
* Add comments only when they improve readability.

---

# Formatting Requests

As the owner of the project, I request you to follow certain formatting guidelines when contributing to FlagForge. This ensures that the codebase remains clean, consistent, and easy to maintain.

* Use consistent indentation (4 spaces) and avoid mixing tabs and spaces.
* Follow the existing naming conventions for variables, functions, and classes (camelCase for variables and functions, PascalCase for classes).
* Add a blank line at the end of each file.
* Avoid using semicolons at the end of lines in TypeScript/JavaScript files, unless necessary.
* Avoid using `var` in TypeScript/JavaScript; prefer `let` and `const`.
* Avoid using `any` type in TypeScript; prefer specific types or generics.
* Avoid leaving trailing commas in object literals or arrays.
* In TSX files, avoid using the `()` syntax for fragments; use `<>` instead.

---

# Commit Messages

Please write meaningful commit messages.

Good examples:

```text
Add Base58 converter
Fix markdown rendering
Improve attachment preview
Refactor workspace loading
```

Avoid messages like:

```text
fix
update
changes
misc
```

---

# Pull Requests

Before opening a pull request:

* Ensure the project builds successfully.
* Test your changes.
* Update documentation if necessary.
* Keep pull requests focused on a single feature or fix.
* Write a clear description of what changed.

Large pull requests are harder to review, so smaller PRs are preferred.

---

# Reporting Bugs

When reporting a bug, please include:

* Operating System
* FlagForge version
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots (if applicable)

---

# Suggesting Features

Feature requests should clearly explain:

* The problem being solved
* Your proposed solution
* Possible alternatives
* Additional context

---

# Documentation

Documentation improvements are always welcome.

This includes:

* Tutorials
* CTF techniques
* Tool documentation
* Examples
* Screenshots
* Grammar fixes

---

# Questions

If you're unsure about a feature or implementation, feel free to open an issue before beginning work.

---

# License

By contributing to FlagForge, you agree that your contributions will be licensed under the same license as the project.
