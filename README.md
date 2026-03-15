# BuildSpec — Deployment Guide

## What You Need Before Starting
- A computer (Mac, Windows, or Linux)
- Node.js installed (version 18 or higher)
- A GitHub account (free)
- A Vercel account (free) — sign up at vercel.com using your GitHub account

---

## STEP 1: Install Node.js (if you don't have it)

Go to https://nodejs.org and download the LTS version (the big green button).
Install it — just click through the installer, accept defaults.

To verify it worked, open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
```
You should see something like `v20.x.x`. If you see a version number, you're good.

---

## STEP 2: Install Git (if you don't have it)

**Mac:** Open Terminal and type `git --version`. If it's not installed, it'll prompt you to install it.

**Windows:** Download from https://git-scm.com/download/win and install with defaults.

---

## STEP 3: Set Up the Project on Your Computer

1. Open Terminal (Mac) or Command Prompt (Windows)

2. Navigate to where you want the project (e.g., your Desktop):
```
cd ~/Desktop
```

3. Create a new folder and move into it:
```
mkdir buildspec
cd buildspec
```

4. Copy ALL the files from this project folder into that buildspec folder on your Desktop.
   (The files: package.json, next.config.js, .gitignore, and the entire /app folder)

5. Install the dependencies:
```
npm install
```
This will take 1-2 minutes. You'll see a progress bar.

6. Test it locally:
```
npm run dev
```
Open your browser and go to http://localhost:3000
You should see BuildSpec running! This is your site running on your own computer.

Press Ctrl+C in the terminal to stop the local server when done testing.

---

## STEP 4: Push to GitHub

1. Go to https://github.com and sign in (or create an account)

2. Click the "+" button in the top right → "New repository"

3. Name it `buildspec` (or whatever you want)

4. Keep it Public (Vercel free tier works with public repos)

5. Do NOT check "Add a README" — we already have files

6. Click "Create repository"

7. GitHub will show you commands. In your terminal (in the buildspec folder), run:
```
git init
git add .
git commit -m "Initial commit - BuildSpec v7"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/buildspec.git
git push -u origin main
```
(Replace YOUR_USERNAME with your actual GitHub username)

---

## STEP 5: Deploy on Vercel (This Makes It Live on the Internet)

1. Go to https://vercel.com and sign up with your GitHub account

2. Click "Add New..." → "Project"

3. You'll see your GitHub repos listed. Click "Import" next to `buildspec`

4. Vercel will auto-detect it's a Next.js project. Don't change any settings.

5. Click "Deploy"

6. Wait 1-2 minutes. Vercel will build and deploy your site.

7. When it's done, Vercel gives you a URL like: `buildspec-xxxx.vercel.app`

   That's your live website! Anyone with the link can use it.

---

## STEP 6: Custom Domain (Optional but Recommended)

1. Buy a domain (I'd suggest buildspec.io or buildspec.app)
   - Namecheap.com or Google Domains are the easiest
   - A .com/.io/.app domain costs ~$10-15/year

2. In Vercel, go to your project → Settings → Domains

3. Add your custom domain

4. Vercel will give you DNS records to add at your domain registrar

5. Follow the instructions — it takes 5-10 minutes and propagates in about an hour

---

## Making Changes After Deployment

Any time you edit files and push to GitHub, Vercel automatically rebuilds and deploys:

```
git add .
git commit -m "Updated parts catalog"
git push
```

That's it. Vercel picks up the change and your live site updates in ~60 seconds.

---

## Next Steps After Launch
- [ ] Sign up for affiliate programs (Amazon Associates, Summit Racing, FCP Euro, etc.)
- [ ] Replace "#" placeholder URLs with real affiliate tracking links
- [ ] Set up Google Analytics to track traffic
- [ ] Share on Reddit (r/CivicSi, r/WRX, r/BMW, r/cars) with genuine helpful posts
- [ ] Create TikTok/Instagram content showing builds from the site
- [ ] Set up Supabase database to scale beyond the prototype data
