# Cloudflare Deployment Setup Guide

This guide will help you deploy the Jungian Cognitive Typologist to Cloudflare Pages and Workers.

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
2. A [Claude API key](https://console.anthropic.com/) from Anthropic
3. Access to your GitHub repository settings

## Step 1: Get Your Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your profile icon (top right) → **My Profile**
3. Go to **API Tokens** tab
4. Click **Create Token**
5. Use the **Edit Cloudflare Workers** template or create a custom token with these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Workers Scripts** → **Edit**
   - **Account** → **Account Settings** → **Read**
6. Click **Continue to summary** → **Create Token**
7. **Copy the token** (you won't see it again!)

## Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: The token you copied from Step 1

   **Secret 2:**
   - Name: `CLAUDE_API_KEY`
   - Value: Your Claude API key (starts with `sk-ant-`)

## Step 3: First Deployment

1. Push to the `main` branch (or trigger workflow manually):
   ```bash
   git push origin main
   ```

2. Go to **Actions** tab in your GitHub repository
3. Watch the workflow run - it will:
   - Build the React frontend
   - Deploy the Cloudflare Worker
   - Deploy to Cloudflare Pages

4. After deployment completes, find your URLs:
   - **Worker**: Check the Actions logs for the Worker URL (something like `https://jungian-typologist-api.YOUR-SUBDOMAIN.workers.dev`)
   - **Pages**: Check Cloudflare dashboard or Actions logs (something like `https://jungian-typologist.pages.dev`)

## Step 4: Configure Worker URL

1. Copy your Worker URL from the deployment logs (something like `https://jungian-typologist-api.YOUR-SUBDOMAIN.workers.dev`)

2. Go to your GitHub repository
3. Navigate to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab
4. Click **New repository variable**
5. Add:
   - Name: `WORKER_URL`
   - Value: Your Worker URL from step 1

6. Re-run the deployment workflow to rebuild with the correct Worker URL:
   - Go to **Actions** tab
   - Select the latest workflow run
   - Click **Re-run jobs**

## Step 5: Verify Deployment

1. Visit your Cloudflare Pages URL
2. Click **Start Assessment**
3. Test the conversation - if it works, you're all set! 🎉

## Troubleshooting

### Worker not responding
- Check that `CLAUDE_API_KEY` is set correctly in GitHub secrets
- Verify the Worker deployed successfully in Cloudflare dashboard → Workers & Pages

### CORS errors
- Make sure you're using the correct Worker URL in the workflow
- Check browser console for specific CORS errors

### Build failures
- Ensure both secrets are properly configured
- Check the Actions logs for specific error messages

## Local Development with Worker

To test the Worker locally:

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Set your Claude API key:
   ```bash
   wrangler secret put CLAUDE_API_KEY
   ```

4. Run the Worker locally:
   ```bash
   wrangler dev worker/index.js
   ```

5. Update your `.env` file:
   ```
   VITE_API_URL=http://localhost:8787
   ```

6. Start the frontend:
   ```bash
   bun run dev
   ```

## Custom Domain (Optional)

To use a custom domain:

1. Go to Cloudflare Dashboard → Pages → Your project
2. Click **Custom domains**
3. Add your domain and follow the DNS setup instructions

## Cost Considerations

- **Cloudflare Pages**: Free tier includes 500 builds/month, unlimited requests
- **Cloudflare Workers**: Free tier includes 100,000 requests/day
- **Claude API**: Check [Anthropic pricing](https://www.anthropic.com/pricing) for usage costs

For a personal project, you should stay well within free tier limits.
