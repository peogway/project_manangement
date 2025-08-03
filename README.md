# Project Manangement Application

- [Watch Demo Video](https://youtu.be/qc2q3VYmWDQ)
- [Live Application](https://project-management-application.fly.dev/)

A project management web app built with React, Express, and MongoDB. Users can create and categorize projects, manage tasks with priorities, sort by name, time, or priority, view recent completions, and track overall progress.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/peogway/project_manangement.git
cd project_manangement/backend
npm install
```

### Environment Setup

Create a `.env` file in the `./backend` directory with the required variables: `PORT`, `MONGODB_URI`, and `SECRET`.
<br/>
For how to get your MongoDB URI, visit: [MongoDB Connection String Reference](https://www.mongodb.com/docs/manual/reference/connection-string/)

### Build for Production

Run the UI build command based on your system:

- **Windows PowerShell:**
  ```bash
  npm run build:ui:powershell
  ```
- **Windows CMD:**
  ```bash
  npm run build:ui:windows-cmd
  ```
- **WSL (Windows Subsystem for Linux):**
  ```bash
  npm run build:ui:wsl
  ```
- **macOS/Linux:**
  ```bash
  npm run build:ui:mac
  ```

## Development

To start the app in development mode, go to root folder and run:

```bash
cd backend
npm run dev
```

To deploy the app to the internet, run:

```bash
npm run deploy
```

> [!NOTE]
> To run `npm run deploy`, you must have [Fly CLI](https://fly.io/docs/getting-started/launch/) installed.

To both build the production and deploy to the internet, run:

```bash
npm run deploy:full
```

> [!WARNING]
> It only works when you are using PowerShell from Windows; otherwise, build the production based on you system (instructions above) and then run `npm run deploy`

