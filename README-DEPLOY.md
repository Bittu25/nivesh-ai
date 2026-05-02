# Nivesh AI — Deployment Guide
# GitHub: https://github.com/Bittu25/nivesh-ai

## Step 1 — Push to GitHub

Open Terminal in your nivesh-ai folder and run these commands one by one:

git init
git add .
git commit -m "Nivesh AI v1"
git branch -M main
git remote add origin https://github.com/Bittu25/nivesh-ai.git
git push -u origin main

If it asks for password: use your GitHub Personal Access Token
(GitHub → Settings → Developer settings → Personal access tokens → Generate new token)

## Step 2 — Deploy on Railway

1. Go to railway.app
2. Click "Login" → "Login with GitHub" → authorize
3. Click "New Project" → "Deploy from GitHub repo"
4. Select "Bittu25/nivesh-ai"
5. Railway will auto-detect Node.js and start deploying

## Step 3 — Add Environment Variable on Railway

In Railway dashboard → click your project → "Variables" tab → "Add Variable":

Name:  ANTHROPIC_API_KEY
Value: YOUR_ANTHROPIC_API_KEY_HERE

Click "Add" → Railway will redeploy automatically

## Step 4 — Get your live URL

Railway gives you a URL like:
https://nivesh-ai-production.up.railway.app

Your app is live! Share this URL with anyone.

## Step 5 — Install as App on Phone (PWA)

Android:
- Open your Railway URL in Chrome
- Tap 3-dot menu → "Add to Home Screen"
- Done! App icon appears on home screen

iPhone:
- Open your Railway URL in Safari
- Tap Share button → "Add to Home Screen"
- Done!

## APK (Android App File)

Easiest way — no coding needed:
1. Get your Railway URL first
2. Go to webintoapp.com
3. Paste your Railway URL
4. Download APK
5. Send to any Android phone and install

