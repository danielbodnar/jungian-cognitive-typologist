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
