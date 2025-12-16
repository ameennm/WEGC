# Supabase Free Tier Keep-Alive System

## 🎯 Purpose

This cron job keeps your Supabase free tier database active by automatically pinging it every 3 days. This prevents the database from pausing due to inactivity, which is a common issue with free tier databases.

## 📋 How It Works

### The Problem
- Supabase free tier databases can become inactive if not accessed regularly
- After a period of inactivity, the database may pause
- This can cause your certificate verification to fail

### The Solution
- A Vercel cron job runs every 3 days
- It sends a simple query to your Supabase database
- This keeps the database active and responsive
- No manual intervention required

## 🔧 Technical Details

### Cron Schedule
```
0 0 */3 * *
```
This means:
- `0 0` - At midnight (00:00)
- `*/3` - Every 3 days
- `* *` - Every month, every day of week

**In plain English**: Runs at midnight UTC every 3 days

### What the Cron Job Does

1. **Connects to Supabase** using environment variables
2. **Executes a simple query**: `SELECT id FROM certificates LIMIT 1`
3. **Logs the result** for monitoring
4. **Returns success/error** status

### Files Involved

1. **`api/keep-alive.js`**
   - Serverless function that pings Supabase
   - Handles the actual database query
   - Returns JSON response

2. **`vercel.json`**
   - Configures the cron job schedule
   - Routes the API endpoint
   - Builds the serverless function

3. **`package.json`**
   - Includes `@supabase/supabase-js` dependency
   - Required for the keep-alive function

## 🚀 Setup Instructions

### 1. Deploy to Vercel
```bash
vercel --prod
```

### 2. Add Environment Variables
In Vercel Dashboard:
- Go to **Settings** > **Environment Variables**
- Add `SUPABASE_URL`
- Add `SUPABASE_ANON_KEY`
- Redeploy the project

### 3. Verify Cron Job
In Vercel Dashboard:
- Go to **Settings** > **Cron Jobs**
- You should see `/api/keep-alive`
- Schedule: `0 0 */3 * *`

## ✅ Testing the Cron Job

### Manual Test
Visit the endpoint directly in your browser:
```
https://your-project.vercel.app/api/keep-alive
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "Database pinged successfully",
  "timestamp": "2025-12-16T16:00:00.000Z",
  "recordsFound": 1
}
```

### Expected Response (Error)
```json
{
  "success": false,
  "message": "Failed to ping database",
  "error": "Connection timeout",
  "timestamp": "2025-12-16T16:00:00.000Z"
}
```

## 📊 Monitoring

### Check Cron Job Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on a deployment
5. Go to **"Functions"** tab
6. Find `/api/keep-alive`
7. View execution logs

### What to Look For
- **Success logs**: Confirm the job is running
- **Error logs**: Identify any connection issues
- **Timestamp**: Verify it runs every 3 days

## 🔍 Troubleshooting

### Issue: Cron Job Not Running
**Solution:**
1. Check Vercel plan - Cron jobs require Hobby plan or higher
2. Verify `vercel.json` is correctly configured
3. Ensure project is deployed to production
4. Check Vercel status page

### Issue: "Supabase not initialized"
**Solution:**
1. Verify environment variables are set in Vercel
2. Check `SUPABASE_URL` format (should include `https://`)
3. Verify `SUPABASE_ANON_KEY` is the anon/public key, not service key
4. Redeploy after adding environment variables

### Issue: "Failed to ping database"
**Solution:**
1. Check Supabase project is active
2. Verify database credentials
3. Check Supabase service status
4. Review Row Level Security policies

### Issue: "Connection timeout"
**Solution:**
1. Check your Supabase region
2. Verify network connectivity
3. Check Supabase project limits
4. Try increasing function timeout in Vercel

## ⚙️ Customization

### Change Frequency
Edit `vercel.json`:
```json
"crons": [
  {
    "path": "/api/keep-alive",
    "schedule": "0 0 */2 * *"  // Every 2 days
  }
]
```

Common schedules:
- `0 0 * * *` - Every day at midnight
- `0 0 */2 * *` - Every 2 days at midnight
- `0 0 */3 * *` - Every 3 days at midnight (current)
- `0 0 */7 * *` - Every 7 days at midnight

### Add Custom Logic
Edit `api/keep-alive.js` to add:
- Email notifications
- Logging to external service
- Database maintenance tasks
- Statistics collection

## 💰 Cost Considerations

### Free Tier Limits

**Vercel Free Tier:**
- ⚠️ **Note**: Cron jobs may require Hobby plan ($20/month)
- Serverless functions: 100 GB-hours/month
- Function invocations: Generous limits
- Our cron job uses minimal resources

**Supabase Free Tier:**
- 500 MB database storage
- 2 GB bandwidth
- 50 MB file storage
- Keep-alive uses < 1 KB per ping

**Total Monthly Cost:**
- Supabase: **$0** (free tier)
- Vercel: **$0-20** (depending on plan)

### Optimization Tips
1. Use 3-day interval instead of daily (reduces invocations)
2. Keep query simple (just SELECT one row)
3. Monitor usage in dashboards
4. Consider upgrading if you exceed limits

## 🔒 Security Best Practices

1. **Use Environment Variables**
   - Never hardcode credentials
   - Use Vercel's environment variables
   - Different values for dev/prod

2. **Use Anon Key**
   - Don't use service role key
   - Anon key has limited permissions
   - Sufficient for SELECT queries

3. **Rate Limiting**
   - 3-day interval prevents abuse
   - Vercel has built-in DDoS protection
   - Monitor for unusual activity

## 📚 Additional Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Supabase Free Tier Limits](https://supabase.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)

## ❓ FAQ

**Q: Do I need to pay for cron jobs?**
A: Cron jobs typically require Vercel's Hobby plan ($20/month).

**Q: What if I miss a ping?**
A: Your database may pause after extended inactivity. Just access it again to wake it up.

**Q: Can I use a different schedule?**
A: Yes! Edit the `schedule` field in `vercel.json`.

**Q: Will this work with Supabase Pro?**
A: Yes, but Pro tier doesn't pause, so it's mainly for Free tier.

**Q: How do I disable the cron job?**
A: Remove the `crons` section from `vercel.json` and redeploy.

---

**Last Updated**: December 2025
