# WEGC - Complete Setup Guide

## 📋 Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [Application Configuration](#application-configuration)
3. [Testing Locally](#testing-locally)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)

---

## 1. Supabase Setup

### Step 1.1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: WEGC Certificate System
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your users
   - **Pricing Plan**: Free tier is sufficient to start
5. Click **"Create new project"**
6. Wait for the project to finish setting up (1-2 minutes)

### Step 1.2: Execute Database Schema

**⚠️ IMPORTANT: Choose the Right Schema File**

You have two options:

**Option A: First-Time Setup (Recommended for new projects)**
- File: `supabase-schema.sql`
- ⚠️ This will DELETE any existing data
- Includes sample data for testing
- Use this for brand new databases

**Option B: Safe Setup (If you have existing data)**
- File: `supabase-schema-safe.sql`
- ✅ Will NOT delete existing data
- Safe for production updates
- No sample data included

**Instructions:**
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Choose ONE of the following:
   - For new setup: Open `supabase-schema.sql`
   - For safe update: Open `supabase-schema-safe.sql`
4. Copy ALL the contents of your chosen file
5. Paste into the SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned"

**📚 For more details, see `DATABASE_SCHEMA_GUIDE.md`**

### Step 1.3: Verify Database Creation
1. Go to **Table Editor** (left sidebar)
2. You should see the `certificates` table
3. Click on it to see the sample data (5 test certificates)

### Step 1.4: Get API Credentials
1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
4. **IMPORTANT**: Keep these safe! You'll need them in the next step

---

## 2. Application Configuration

### Step 2.1: Configure Supabase Connection
1. Open the `app.js` file in your code editor
2. Find these lines at the top (around line 6-7):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Your Project URL
   const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Your anon key
   ```

### Step 2.2: Set Admin Password
1. In the same `app.js` file, find this line (around line 8):
   ```javascript
   const ADMIN_PASSWORD = 'admin123';
   ```
2. Change it to a secure password:
   ```javascript
   const ADMIN_PASSWORD = 'YourSecurePassword123!';
   ```
3. **Remember this password!** You'll use it to log into the admin dashboard

### Step 2.3: Save Your Changes
1. Save the `app.js` file
2. Your application is now configured!

---

## 3. Testing Locally

### Step 3.1: Open in Browser
1. Navigate to your project folder
2. Right-click on `index.html`
3. Choose **"Open with"** > Your web browser (Chrome, Firefox, Edge, etc.)

### Step 3.2: Test Public Features
1. The homepage should load with a hero slider
2. Scroll down to the **"Verify Your Certificate"** section
3. Enter a test certificate number: `WEGC2025001`
4. Click **"Verify Certificate"**
5. You should see a popup with certificate details for "Priya Sharma"

### Step 3.3: Test Admin Access
1. In the browser address bar, add `#admin` to the URL (e.g., `file:///C:/Users/.../index.html#admin`)
2. Press Enter - you'll be redirected to the admin login page
3. Enter the password you set in Step 2.2
4. Click **"Login to Dashboard"**
5. You should see:
   - Dashboard statistics (5 certificates, 5 students, etc.)
   - A form to add new certificates
   - A table showing all certificates

### Step 3.4: Test Admin Functions
1. Try adding a new certificate:
   - Certificate Number: `WEGC2025006`
   - Student Name: Your name
   - Course: Test Course
   - Duration: 3 Months
   - Institution: Test Center
   - Issue Date: Today's date
   - Click **"Save Certificate"**
2. You should see a success message
3. The certificate should appear in the table
4. Test the **Edit** and **Delete** buttons
5. Try the search box to filter certificates

---

## 4. Deploying to Vercel

### Method A: Using Vercel Dashboard (Recommended for beginners)

#### Step 4.1: Push Code to GitHub
1. Create a new repository on GitHub
2. In your project folder, open terminal/command prompt
3. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WEGC Certificate System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

#### Step 4.2: Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up or log in (you can use your GitHub account)
3. Click **"Add New..."** > **"Project"**
4. Click **"Import Git Repository"**
5. Select your GitHub repository
6. Vercel will auto-detect it as a static site
7. Click **"Deploy"**
8. Wait for deployment to complete (30-60 seconds)
9. You'll get a URL like: `https://your-project.vercel.app`

### Method B: Using Vercel CLI

#### Step 4.1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 4.2: Deploy
```bash
# Navigate to your project folder
cd "c:\Users\servi\Desktop\vs code\ladies"

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

---

## 5. Post-Deployment Configuration

### Step 5.1: Test Your Live Site
1. Visit your Vercel URL
2. Test certificate verification with `WEGC2025001`
3. Test admin login with your password
4. Verify all features work

### Step 5.2: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click **"Settings"** > **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to update DNS records

### Step 5.3: Enable HTTPS (Automatic)
- Vercel automatically provides HTTPS
- No configuration needed!

### Step 5.4: Configure Environment Variables in Vercel
1. In your Vercel dashboard, go to your project
2. Click **"Settings"** > **"Environment Variables"**
3. Add the following variables:
   - **Name**: `SUPABASE_URL`
   - **Value**: Your Supabase Project URL
   - Click **"Save"**
4. Add another variable:
   - **Name**: `SUPABASE_ANON_KEY`
   - **Value**: Your Supabase Anon Key
   - Click **"Save"**
5. **Important**: After adding environment variables, redeploy your project

### Step 5.5: Enable Cron Job (Keep Supabase Active)
The project includes a cron job that pings your Supabase database every 3 days to prevent the free tier from going inactive.

1. In Vercel dashboard, go to **"Settings"** > **"Cron Jobs"**
2. You should see: `/api/keep-alive` scheduled for `0 0 */3 * *`
3. This cron job will automatically:
   - Run every 3 days at midnight (UTC)
   - Ping your Supabase database
   - Keep your free tier active
4. **No additional setup needed!** Vercel handles it automatically

**To test the cron job manually:**
- Visit: `https://your-project.vercel.app/api/keep-alive`
- You should see: `{"success": true, "message": "Database pinged successfully"}`

### Step 5.6: Update Supabase Settings (Security)
1. Go to your Supabase project settings
2. Navigate to **"API"** > **"API Settings"**
3. Scroll to **"Site URL"**:
   - Add your Vercel URL: `https://your-project.vercel.app`
4. **CORS Origins**:
   - Add your Vercel URL to allowed origins

---

## 🎉 Congratulations!

Your Women's Education and Guidance Council certificate system is now live!

### Quick Reference

**Test Certificates:**
- WEGC2025001
- WEGC2025002
- WEGC2025003
- WEGC2025004
- WEGC2025005

**Default Admin Password:**
- Whatever you set in Step 2.2

**Your Live URL:**
- Check your Vercel dashboard

---

## 🛠️ Troubleshooting

### Issue: "Supabase not initialized"
- **Solution**: Check that you've correctly set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `app.js`

### Issue: "Certificate not found"
- **Solution**: Verify the certificate number is correct and exists in the database

### Issue: Admin login not working
- **Solution**: Check that you're using the correct password set in `app.js`

### Issue: Can't add/edit/delete certificates
- **Solution**: 
  1. Check browser console for errors
  2. Verify Supabase connection
  3. Check that RLS policies were created properly

### Issue: Changes not reflecting on Vercel
- **Solution**: 
  1. Make sure you've pushed changes to GitHub
  2. Vercel should auto-deploy, or manually redeploy from dashboard
  3. Clear browser cache

---

## 📞 Need More Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)

---

**Last Updated**: December 2025
