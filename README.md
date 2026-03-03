# HRMS Frontend

Role-based Human Resource Management System frontend built with Angular and Angular Material.

## Overview

This application provides dedicated workspaces for:

- Admin
- HR Manager
- Project Manager
- Employee

It integrates with a backend REST API and supports secure JWT authentication, role-based routing, and operational HR workflows.

## Main Features

- JWT login and authenticated API calls via interceptor
- Role-based route/layout access (Admin, HR, PM, Employee)
- Role-specific dashboards with API-driven metrics
- User management (create, edit, delete, list)
- Project management and project assignments
- Task creation, assignment, and status updates
- Leave request flow (submit, approve, reject)
- Attendance visibility for HR

## Tech Stack

- Angular 18 (standalone components)
- Angular Material
- RxJS
- TypeScript
- SCSS

## Project Structure

- `src/app/admin` Admin pages and routes
- `src/app/hr-manager` HR pages and routes
- `src/app/project-manager` PM pages and routes
- `src/app/employee` Employee pages and routes
- `src/app/services` API service layer
- `src/app/models` Shared interfaces and DTOs
- `src/environments` Environment configuration

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI

### Install

```bash
npm install
```

### Run

```bash
ng serve
```

Open: `http://localhost:4200`

## Environment

Configure API URL in:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Example:

```ts
export const environment = {
	production: false,
	apiUrl: 'http://localhost:8080'
};
```

## Build

```bash
ng build
```

## Notes

- Backend authorization rules determine which actions are allowed per role.
- If an action returns HTTP `403`, confirm role permissions on backend endpoints.
