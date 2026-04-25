<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9f8075fa-3d9f-4a72-99f6-c218a316516c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Netlify

This export has been adapted so the AI mentor runs through Netlify Functions instead of a local Express server.

1. Push this project to GitHub
2. Import the repo into Netlify
3. In Netlify, add an environment variable:
   - `GEMINI_API_KEY=your_real_key_here`
4. Build command:
   - `npm run build`
5. Publish directory:
   - `dist`

Netlify will route `/api/chat`, `/api/explain`, and `/api/market-data/:ticker` to serverless functions automatically.
