# Dorkly — Google Dork Intelligence Platform

> A professional OSINT platform that makes Google dorking accessible to security researchers, journalists, and analysts — no syntax memorization required.

**🌐 Live Demo:** [https://dorkly.vercel.app](https://dorkly-web.vercel.app/)

---

# What is Dorkly?

Google Dorking uses advanced search operators to uncover information that traditional searches often miss—exposed files, login portals, sensitive documents, misconfigured servers, and much more. Dorkly transforms this powerful OSINT technique into an intuitive visual workflow that eliminates the need to memorize complex search syntax.

Everything Dorkly discovers is already publicly indexed by search engines. It simply helps you ask better questions.

---

# Features

| Feature                        | Description                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Visual Query Builder**       | Construct Google dorks using visual operator chips—no syntax knowledge required.                                |
| **Template Library**           | Browse 100+ curated dorks organized by category, difficulty, and effectiveness.                                 |
| **Domain Scanner**             | Enter a domain to automatically generate 40+ reconnaissance dorks across multiple attack-surface categories.    |
| **GitHub Dorking**             | Search public repositories for exposed secrets, configuration files, and sensitive code.                        |
| **GHDB Sync**                  | Synchronize the latest Google Hacking Database directly into your local instance.                               |
| **crt.sh Integration**         | Discover subdomains through Certificate Transparency logs and generate targeted dorks automatically.            |
| **Multi-Search Engine Launch** | Execute any dork across Google, Bing, DuckDuckGo, Brave, and Yandex with one click.                             |
| **Pivot Links**                | Pivot directly from a result to GitHub, Pastebin, Shodan, or the Wayback Machine.                               |
| **Effectiveness Ratings**      | Every template includes quality indicators such as **Reliable**, **High Value**, **Noisy**, and **Unreliable**. |
| **Privacy-First Saved Dorks**  | Saved searches remain in your browser using Local Storage—nothing is stored on our servers.                     |
| **Export Support**             | Export saved dorks in JSON, CSV, or TXT formats.                                                                |
| **Keyboard Shortcuts**         | Built-in productivity shortcuts including **Ctrl/Cmd + K**, **/** to search, and **Esc** to close dialogs.      |
| **Crash Course**               | An integrated beginner-to-expert guide covering Google operators, Boolean logic, and reconnaissance workflows.  |

---

# Technology Stack

| Layer                | Technology                                       |
| -------------------- | ------------------------------------------------ |
| **Frontend**         | React + TypeScript + Tailwind CSS + Vite         |
| **Backend**          | Node.js + Express + TypeScript                   |
| **ORM**              | Drizzle ORM                                      |
| **Database**         | PostgreSQL (Neon in production)                  |
| **State Management** | TanStack Query                                   |
| **Routing**          | React Router                                     |
| **Deployment**       | Vercel (Frontend), Render (API), Neon (Database) |

---

# Project Structure

```text
dorkly/
├── apps/
│   ├── api/                # Express API
│   └── web/                # React frontend
├── packages/
│   └── shared/             # Shared types & utilities
├── package.json
└── README.md
```

---


# Pages

| Route        | Description                                         |
| ------------ | --------------------------------------------------- |
| `/`          | Visual Google dork query builder                    |
| `/templates` | Curated dork template library                       |
| `/saved`     | Personal saved dorks (Local Storage)                |
| `/scanner`   | Domain reconnaissance suite                         |
| `/github`    | GitHub code search dorking                          |
| `/ghdb`      | Google Hacking Database browser                     |
| `/crtsh`     | Certificate Transparency reconnaissance             |
| `/help`      | Documentation, operator reference, and crash course |

---



# Disclaimer

Dorkly is intended solely for legitimate security research, OSINT investigations, defensive security, and educational purposes.

The platform **does not interact directly with target systems**. It generates search queries and opens them in publicly available search engines. Users are responsible for ensuring their activities comply with applicable laws, regulations, and the terms of service of the search engines they use.

Always obtain explicit authorization before conducting security assessments or reconnaissance against systems you do not own or manage.

---

# License

This project is licensed under the **MIT License**.
