-- ==========================================
-- WOMEN'S EDUCATION AND GUIDANCE COUNCIL
-- Supabase Database Schema (SAFE VERSION)
-- This version does NOT drop existing tables
-- Use this if you already have data you want to keep
-- ==========================================

-- Create certificates table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster searches (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_student_name ON certificates(student_name);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON certificates;
DROP POLICY IF EXISTS "Allow all operations with service role" ON certificates;

-- Create policy to allow read access to everyone (for certificate verification)
CREATE POLICY "Allow public read access"
    ON certificates
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update/delete only with service role
-- (You'll need to use the service role key for admin operations or set up proper auth)
CREATE POLICY "Allow all operations with service role"
    ON certificates
    FOR ALL
    USING (true);

-- Create function to update updated_at timestamp (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- NOTE: Sample data is NOT inserted in this version
-- If you want to add sample data, use the INSERT statements from the main schema file
-- or add certificates through the admin dashboard

-- ==========================================
-- SAMPLE DATA (COMMENTED OUT - UNCOMMENT IF NEEDED)
-- ==========================================

-- ONLY UNCOMMENT THE LINES BELOW IF YOU WANT TO ADD SAMPLE DATA
-- AND YOU ARE SURE IT WON'T CONFLICT WITH EXISTING DATA

/*
INSERT INTO certificates (certificate_number, student_name, course_name, duration, institution_name, issue_date)
VALUES
    ('WEGC2025001', 'Priya Sharma', 'Women Leadership Development', '6 Months', 'WEGC Delhi Center', '2025-01-15'),
    ('WEGC2025002', 'Anjali Verma', 'Professional Skill Enhancement', '3 Months', 'WEGC Mumbai Center', '2025-02-20'),
    ('WEGC2025003', 'Kavita Singh', 'Entrepreneurship for Women', '12 Months', 'WEGC Bangalore Center', '2024-12-10'),
    ('WEGC2025004', 'Neha Gupta', 'Digital Marketing Certification', '6 Months', 'WEGC Chennai Center', '2025-01-05'),
    ('WEGC2025005', 'Sunita Patel', 'Financial Literacy Program', '3 Months', 'WEGC Pune Center', '2025-02-01')
ON CONFLICT (certificate_number) DO NOTHING; -- Skip if certificate number already exists
*/
