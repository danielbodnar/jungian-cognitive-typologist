# Jungian Cognitive Stack Typologist

AI-powered cognitive function analysis using Claude's API. Jung-AI-n conducts natural conversations to identify your Jungian cognitive stack through strategic questioning.

## Features

- 🤖 **AI-Powered Analysis** - Uses Claude Sonnet 4 API for dynamic, adaptive conversations
- 🧠 **Comprehensive Profiles** - Detailed 8-function analysis with 4-dimensional framework
- 📊 **Export Options** - Download full session transcripts (MD) or cognitive stack reports (PDF)
- 👥 **Multiple Assessments** - Type multiple people in one session
- 🎯 **Scientific Approach** - Based on Carl Jung's cognitive function theory, not MBTI

## Live Demo

Visit: [https://jungian-typologist.pages.dev](https://jungian-typologist.pages.dev)

## Architecture

This application uses a **secure backend proxy** architecture:
- **Frontend**: React app deployed to Cloudflare Pages
- **Backend**: Cloudflare Worker proxies requests to Claude API
- **Security**: Claude API key is stored securely in Cloudflare Worker environment variables

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for local worker development (optional)

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

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
bun run dev
```

5. Open http://localhost:5173 in your browser

### Testing the Worker Locally (Optional)

```bash
# Set your Claude API key as a secret
wrangler secret put CLAUDE_API_KEY

# Run the worker locally
wrangler dev worker/index.js
```

### Build for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

## Deployment

This project automatically deploys to Cloudflare Pages and Workers via GitHub Actions when you push to the `main` branch.

### Initial Setup

1. **Create Cloudflare Account** and get your API token:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **My Profile** → **API Tokens**
   - Create a token with **Edit Cloudflare Workers** and **Edit Cloudflare Pages** permissions

2. **Configure GitHub Secrets**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLAUDE_API_KEY`: Your Claude API key from [console.anthropic.com](https://console.anthropic.com/)

3. **Update Worker URL**:
   - After first deployment, get your Worker URL from Cloudflare dashboard
   - Update `.github/workflows/deploy.yml` line with your actual Worker URL:
     ```yaml
     VITE_API_URL: https://jungian-typologist-api.YOUR-SUBDOMAIN.workers.dev
     ```

4. **Deploy**:
   - Push to `main` branch to trigger the deployment
   - Your app will be available at `https://jungian-typologist.pages.dev` (or your custom domain)

## How It Works

Jung-AI-n conducts assessments through three dimensions:

1. **Information Processing** - Abstract vs Concrete thinking patterns
2. **Decision Making** - Logical vs Values-based reasoning
3. **Function Dominance** - Which cognitive patterns are most natural

The AI uses contextual follow-up questions based on your responses to accurately identify your cognitive stack (e.g., Ti-Ne-Si-Fe).

## Technology Stack

**Frontend:**
- **React** - UI framework
- **Vite** - Build tool
- **Bun** - JavaScript runtime and package manager
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **Cloudflare Pages** - Static site hosting

**Backend:**
- **Cloudflare Workers** - Serverless edge computing
- **Claude API** - AI conversation engine (Sonnet 4)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

Based on Carl Jung's theory of cognitive functions and psychological types.
