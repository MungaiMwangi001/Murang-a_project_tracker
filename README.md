#  Murang-a-county-Project-Tracker

A modern web application for tracking and managing projects. Built with React, TypeScript, and Tailwind CSS.

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

- **Frontend:**
  - React 18
  - TypeScript
  - React Router v6
  - Tailwind CSS
  - Headless UI
  - Hero Icons

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MungaiMwangi001/Murang-a_project_tracker
   cd project-tracker
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Contributing

1. Fork the repo on GitHub
Go to: https://github.com/MungaiMwangi001/Murang-a_project_tracker
->  Click Fork (top right)

2. Clone your fork to your machine
bash
Copy code
git clone https://github.com/your-new-account/Murang-a_project_tracker.git

3. Enter the project directory
```bash
Copy code
cd Murang-a_project_tracker
```
4. Set your identity

```bash

git config user.name "Your New Account Name"
git config user.email "youremail@example.com"

```

5. Add the original repo as an upstream remote
So you can fetch changes from the original project if needed

```bash
git remote add upstream https://github.com/MungaiMwangi001/Murang-a_project_tracker.git
```
Check remotes:

```bash

git remote -v
```

6. Create a new branch for your changes
Example:

```bash
Copy code
git checkout -b add-login-feature

```
7. Make your changes

8. Stage and commit them

```bash

git add .
git commit -m "Added login feature"
```
9. Push your branch to your forked repo
```bash

git push origin add-login-feature
```
10. Create a Pull Request

Go to your fork on GitHub, and GitHub will prompt you to create a Pull Request to MungaiMwangi001/Murang-a_project_tracker

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. # Murang-a_project_tracker
