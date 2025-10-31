# Jungian Cognitive Stack Typologist - Repository Setup

Complete project structure for deploying to GitHub Pages with Bun and GitHub Actions.

## Project Structure

```
jungian-cognitive-typologist/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── (empty for now)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── bun.lockb (generated)
```

---

## File Contents

### `package.json`
```json
{
  "name": "jungian-cognitive-typologist",
  "version": "1.0.0",
  "type": "module",
  "description": "AI-powered Jungian cognitive stack typologist using Claude API",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/jungian-cognitive-typologist/', // Replace with your repo name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/brain-icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI-powered Jungian cognitive stack typologist. Discover your cognitive function stack through natural conversation with Jung-AI-n." />
    <title>Jungian Cognitive Stack Typologist</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  height: 100vh;
}
```

### `src/App.jsx`
```javascript
// Copy the entire React component code from the artifact here
// (The full CognitiveTypologist component)
```

### `.gitignore`
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Bun
bun.lockb
```

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### `README.md`
```markdown
# Jungian Cognitive Stack Typologist

AI-powered cognitive function analysis using Claude's API. Jung-AI-n conducts natural conversations to identify your Jungian cognitive stack through strategic questioning.

## Features

- 🤖 **AI-Powered Analysis** - Uses Claude Sonnet 4 API for dynamic, adaptive conversations
- 🧠 **Comprehensive Profiles** - Detailed 8-function analysis with 4-dimensional framework
- 📊 **Export Options** - Download full session transcripts (MD) or cognitive stack reports (PDF)
- 👥 **Multiple Assessments** - Type multiple people in one session
- 🎯 **Scientific Approach** - Based on Carl Jung's cognitive function theory, not MBTI

## Live Demo

Visit: [https://YOUR-USERNAME.github.io/jungian-cognitive-typologist/](https://YOUR-USERNAME.github.io/jungian-cognitive-typologist/)

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/jungian-cognitive-typologist.git
cd jungian-cognitive-typologist
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

## Deployment

This project automatically deploys to GitHub Pages via GitHub Actions when you push to the `main` branch.

### Initial Setup

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to `main` branch to trigger the deployment

## How It Works

Jung-AI-n conducts assessments through three dimensions:

1. **Information Processing** - Abstract vs Concrete thinking patterns
2. **Decision Making** - Logical vs Values-based reasoning
3. **Function Dominance** - Which cognitive patterns are most natural

The AI uses contextual follow-up questions based on your responses to accurately identify your cognitive stack (e.g., Ti-Ne-Si-Fe).

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Bun** - JavaScript runtime and package manager
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **Claude API** - AI conversation engine

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

Based on Carl Jung's theory of cognitive functions and psychological types.
```

---

## Setup Instructions

### 1. Create the Repository on GitHub

```bash
# Create a new directory
mkdir jungian-cognitive-typologist
cd jungian-cognitive-typologist

# Initialize git
git init

# Create all the files above
# (copy contents from this guide)

# Install Tailwind CSS
bun install -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### 2. Configure Tailwind

Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Update package.json with Tailwind

```json
{
  "name": "jungian-cognitive-typologist",
  "version": "1.0.0",
  "type": "module",
  "description": "AI-powered Jungian cognitive stack typologist using Claude API",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.2"
  }
}
```

### 4. First Commit and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Jungian Cognitive Stack Typologist"

# Add remote (replace with your GitHub username/repo)
git remote add origin https://github.com/YOUR-USERNAME/jungian-cognitive-typologist.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment will automatically trigger on your next push

### 6. Update vite.config.js

Make sure the `base` matches your repository name:
```javascript
base: '/jungian-cognitive-typologist/', // Must match your repo name
```

---

## Post-Deployment

After successful deployment, your app will be available at:
```
https://YOUR-USERNAME.github.io/jungian-cognitive-typologist/
```

## Development Workflow

```bash
# Start dev server
bun run dev

# Build for production (test locally)
bun run build
bun run preview

# Deploy (push to main)
git add .
git commit -m "Your changes"
git push
```

That's it! Your Jungian Cognitive Stack Typologist is now deployed! 🎉
