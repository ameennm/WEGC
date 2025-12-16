-- ==========================================
-- WOMEN'S EDUCATION AND GUIDANCE COUNCIL
-- Supabase Database Schema (INITIAL SETUP ONLY)
-- ⚠️ WARNING: This will DELETE existing data!
-- Use supabase-schema-safe.sql if you have existing data
-- ==========================================

-- ⚠️ WARNING: This will drop and recreate the table
-- All existing data will be LOST!
DROP TABLE IF EXISTS certificates;

-- Create certificates table
CREATE TABLE certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_student_name ON certificates(student_name);
CREATE INDEX idx_certificates_created_at ON certificates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO certificates (certificate_number, student_name, course_name, duration, institution_name, issue_date)
VALUES
    ('WEGC2025001', 'Priya Sharma', 'Women Leadership Development', '6 Months', 'WEGC Delhi Center', '2025-01-15'),
    ('WEGC2025002', 'Anjali Verma', 'Professional Skill Enhancement', '3 Months', 'WEGC Mumbai Center', '2025-02-20'),
    ('WEGC2025003', 'Kavita Singh', 'Entrepreneurship for Women', '12 Months', 'WEGC Bangalore Center', '2024-12-10'),
    ('WEGC2025004', 'Neha Gupta', 'Digital Marketing Certification', '6 Months', 'WEGC Chennai Center', '2025-01-05'),
    ('WEGC2025005', 'Sunita Patel', 'Financial Literacy Program', '3 Months', 'WEGC Pune Center', '2025-02-01');

-- ==========================================
-- ADDITIONAL HELPFUL QUERIES
-- ==========================================

-- Query to get total certificates count
-- SELECT COUNT(*) as total_certificates FROM certificates;

-- Query to get certificates issued this month
-- SELECT COUNT(*) as this_month_certificates 
-- FROM certificates 
-- WHERE EXTRACT(MONTH FROM issue_date) = EXTRACT(MONTH FROM CURRENT_DATE)
-- AND EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE);

-- Query to get unique students count
-- SELECT COUNT(DISTINCT student_name) as total_students FROM certificates;

-- Query to get unique institutions count
-- SELECT COUNT(DISTINCT institution_name) as total_institutions FROM certificates;

-- Query to search certificates
-- SELECT * FROM certificates 
-- WHERE certificate_number ILIKE '%search%' 
-- OR student_name ILIKE '%search%' 
-- OR course_name ILIKE '%search%'
-- ORDER BY created_at DESC;
