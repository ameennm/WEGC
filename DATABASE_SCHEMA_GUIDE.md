# Database Schema Files - Usage Guide

This project includes two SQL schema files for different scenarios. **Please read carefully before executing any SQL!**

## 📁 Available Files

### 1. `supabase-schema.sql` (DESTRUCTIVE - Initial Setup Only)
**⚠️ WARNING: This will DELETE all existing data!**

**When to use:**
- ✅ First time setting up the database
- ✅ Starting fresh in development
- ✅ You want to reset everything and start over
- ❌ **NEVER use this if you have production data you want to keep!**

**What it does:**
- Drops the entire `certificates` table (deletes all data)
- Creates a fresh table with the correct structure
- Sets up indexes for performance
- Configures Row Level Security policies
- Creates triggers for automatic timestamp updates
- Inserts 5 sample certificates for testing

**Use this file ONLY for:**
- Initial project setup
- Development environment resets
- Testing purposes

---

### 2. `supabase-schema-safe.sql` (SAFE - Production Updates)
**✅ SAFE: Will NOT delete existing data**

**When to use:**
- ✅ Updating an existing database
- ✅ Adding the schema to a production database with data
- ✅ You want to keep your existing certificates
- ✅ Making updates or modifications

**What it does:**
- Creates table ONLY if it doesn't already exist
- Creates indexes ONLY if they don't already exist
- Updates/replaces Row Level Security policies safely
- Updates/replaces functions and triggers
- Does NOT insert sample data (commented out)
- Will not affect existing certificate records

**Use this file for:**
- Production deployments
- Database updates
- When you have existing data to preserve

---

## 🚀 Quick Start Guide

### For First-Time Setup (No existing data):

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy contents of `supabase-schema.sql`
5. Paste and execute
6. ✅ Database ready with sample data!

### For Existing Database (Preserving data):

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy contents of `supabase-schema-safe.sql`
5. Paste and execute
6. ✅ Database updated without data loss!

---

## ⚠️ Important Safety Notes

### Before Running ANY SQL:

1. **Backup Your Data**
   - If you have production data, export it first
   - Supabase Dashboard > Table Editor > Export

2. **Read the File First**
   - Open the SQL file and review what it does
   - Look for `DROP TABLE` statements (destructive!)
   - Check for `INSERT` statements (may conflict)

3. **Test in Development**
   - Try in a development database first
   - Verify everything works
   - Then apply to production

4. **Know Which File to Use**
   - First time setup? → `supabase-schema.sql`
   - Have existing data? → `supabase-schema-safe.sql`
   - Not sure? → Use `supabase-schema-safe.sql` (safer)

---

## 🔄 Common Scenarios

### Scenario 1: Brand New Project
**File:** `supabase-schema.sql`
- You've just created a Supabase project
- No data exists yet
- Want sample data for testing
- ✅ Safe to use the destructive version

### Scenario 2: Database Already Has Data
**File:** `supabase-schema-safe.sql`
- You have certificates in the database
- Want to update schema/policies
- Need to keep existing data
- ✅ Use the safe version

### Scenario 3: Development Reset
**File:** `supabase-schema.sql`
- Want to start fresh in development
- Delete test data and start over
- No important data to preserve
- ✅ Destructive version is fine

### Scenario 4: Production Update
**File:** `supabase-schema-safe.sql`
- Need to update triggers or policies
- Have live production data
- Cannot afford data loss
- ✅ MUST use safe version

### Scenario 5: Not Sure What You Have
**File:** `supabase-schema-safe.sql`
- Better safe than sorry!
- This version won't delete anything
- May show errors if table exists (that's okay)
- ✅ Always safe to use

---

## 🛠️ Manual Sample Data Addition

If you used `supabase-schema-safe.sql` and want to add sample data:

### Option 1: Through Admin Dashboard
1. Deploy your website
2. Access admin panel (`#admin`)
3. Add certificates manually through the UI

### Option 2: SQL Insert (If no conflicts)
Go to SQL Editor and run:

```sql
INSERT INTO certificates (certificate_number, student_name, course_name, duration, institution_name, issue_date)
VALUES
    ('WEGC2025001', 'Priya Sharma', 'Women Leadership Development', '6 Months', 'WEGC Delhi Center', '2025-01-15'),
    ('WEGC2025002', 'Anjali Verma', 'Professional Skill Enhancement', '3 Months', 'WEGC Mumbai Center', '2025-02-20'),
    ('WEGC2025003', 'Kavita Singh', 'Entrepreneurship for Women', '12 Months', 'WEGC Bangalore Center', '2024-12-10'),
    ('WEGC2025004', 'Neha Gupta', 'Digital Marketing Certification', '6 Months', 'WEGC Chennai Center', '2025-01-05'),
    ('WEGC2025005', 'Sunita Patel', 'Financial Literacy Program', '3 Months', 'WEGC Pune Center', '2025-02-01')
ON CONFLICT (certificate_number) DO NOTHING;
```

The `ON CONFLICT DO NOTHING` ensures it won't fail if certificates already exist.

---

## 📊 Verification After Running SQL

After executing either file, verify the setup:

### 1. Check Table Exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'certificates';
```
Should return: `certificates`

### 2. Check Sample Data (if using destructive version)
```sql
SELECT COUNT(*) FROM certificates;
```
Should return: `5`

### 3. Check Indexes
```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'certificates';
```
Should show 3 indexes

### 4. Check RLS Policies
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'certificates';
```
Should show 2 policies

---

## 🆘 Troubleshooting

### Error: "relation 'certificates' already exists"
- **Cause**: Table already exists
- **Solution**: Use `supabase-schema-safe.sql` instead
- **Or**: If intentional reset, the DROP TABLE didn't execute

### Error: "duplicate key value violates unique constraint"
- **Cause**: Trying to insert sample data that already exists
- **Solution**: Use safe version or remove INSERT statements
- **Or**: Change certificate numbers in sample data

### Error: "policy already exists"
- **Cause**: Policies weren't dropped/replaced
- **Solution**: `supabase-schema-safe.sql` handles this automatically
- **Or**: Manually drop policies first

### Want to Start Over Completely?
```sql
-- ⚠️ WARNING: This deletes EVERYTHING!
DROP TABLE IF EXISTS certificates CASCADE;
```
Then run `supabase-schema.sql`

---

## ✅ Best Practices

1. **Always backup before running SQL**
2. **Use safe version when in doubt**
3. **Test in development first**
4. **Read the SQL before executing**
5. **Verify results after execution**
6. **Keep both files** (you may need each at different times)

---

## 📞 Need Help?

- Check the main `SETUP_GUIDE.md` for detailed setup instructions
- Review Supabase documentation for SQL editor usage
- Test queries in SQL Editor before running full schema

---

**Remember:** When in doubt, use `supabase-schema-safe.sql` - it's designed to be non-destructive!
