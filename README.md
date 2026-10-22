# School Management System — Frontend

A role-based School Management System frontend built with React and Vite. The application provides separate interfaces for administrators, teachers, students, and parents, communicating with a Django REST Framework backend.

## Tech Stack

- **React**
- **Vite**
- **JavaScript**
- **React Router** — Client-side routing
- **CSS** — Styling and responsive layouts
- **Lucide React** — Icons, where used

## User Roles

- **Admin:** School administration and management features.
- **Teacher:** Teaching-related features, attendance, marks, and notices.
- **Student:** Student dashboard, attendance, marks, classes, and notices.
- **Parent:** Parent dashboard, children's information, attendance, marks, and notices.

*Available features depend on the implemented pages and permissions.*

## Features

- Role-based dashboards and navigation.
- Login and authentication flow.
- Protected routes based on authentication and user role.
- API integration with the Django REST Framework backend.
- Reusable React components.
- Shared authentication and application data through React Context.
- School management interfaces for marks, attendance, notices, subjects, sections, and users.
- Separate pages for student and parent experiences.

## Project Structure

```text
React/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── student/
│   │   └── parent/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Prerequisites

- Node.js and npm.
- Git.
- The School Management System backend running locally.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anup12043112/school_management_system_frontend
cd React
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the frontend root directory, alongside `package.json`.

```env
VITE_BASE_URL=http://127.0.0.1:8000
```

`VITE_BASE_URL` specifies the base URL of the backend API. Change it when using another backend environment.

**Important:** Vite exposes variables prefixed with `VITE_` to frontend code. Never store passwords, private API keys, or other secrets in these variables.

Restart the Vite development server after changing environment variables.

### 4. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal, typically:

```text
http://localhost:5173/
```

Open that URL in your browser.

## Backend Integration

The frontend uses the configured API base URL in `src/services/apiClient.js` to communicate with the Django backend.

For local development, ensure that:

1. The Django backend is running.
2. `VITE_BASE_URL` points to the correct backend URL.
3. Django's CORS configuration allows the frontend origin.
4. You have valid credentials for the account and role you want to test.

## Available Scripts

Check `package.json` for the scripts defined in this project. A typical Vite setup includes:

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev` — Starts the development server.
- `npm run build` — Builds the frontend for production.
- `npm run preview` — Previews the production build locally.

## Environment and Security

- Keep `.env` files out of version control.
- Do not commit authentication tokens or credentials.
- Store authentication information according to your application's security design.
- Configure the correct backend URL for each environment.
- Review authentication, authorization, and production settings before deployment.

## Development Status

This repository contains the frontend for the School Management System. The application is being developed alongside a separate Django REST Framework backend.

## License

No license has been specified yet. All rights reserved unless a license is added to this repository.
