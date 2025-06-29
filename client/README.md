# Project Tracker - Client

A modern web application for tracking and managing projects. Built with React, TypeScript, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- View all projects in a responsive grid layout
- Search projects by name, description, or location
- Filter projects by status, category, location, and date range
- Detailed project view with:
  - Progress tracking
  - Location information
  - Budget details
  - Timeline
  - Objectives
  - Milestones
  - Project updates

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - React Router v6
  - Tailwind CSS
- **UI Components**:
  - Headless UI
  - Hero Icons
- **Build Tool**: Vite

## Getting Started

Follow these instructions to get a local development environment up and running.

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MungaiMwangi001/Murang-a_project_tracker
    ```

2.  **Navigate to the client directory and install dependencies:**
    ```bash
    cd client
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be running at `http://localhost:5173`.

## Available Scripts

In the `client` directory, you can run:

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run lint`: Lints the project files.
-   `npm run preview`: Previews the production build locally.

## Project Structure

```
/client
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## Contributing

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone https://github.com/MungaiMwangi001/Murang-a_project_tracker
    ```
3.  **Create a new branch** for your feature:
an example is branch feature
    ```bash
    git checkout -b feature/add-amazing-feature
    ```
4.  **Make your changes**, then stage and commit them:
    ```bash
    git add .
    git commit -m "feat: Add amazing feature"
    ```
5.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/add-amazing-feature
    ```
6.  **Create a Pull Request** from your fork to the original repository's `main` branch.

Go to your fork on GitHub, and GitHub will prompt you to create a Pull Request to MungaiMwangi001/Murang-a_project_tracker

## License

This project is licensed under the MIT License.
# Murang-a_project_tracker