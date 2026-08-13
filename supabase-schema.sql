-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  mother_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  customer_number VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
  place_of_birth VARCHAR(255) NOT NULL,
  national_id VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  student_photo_url TEXT,
  more_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for search
CREATE INDEX IF NOT EXISTS idx_admissions_full_name ON admissions(full_name);
CREATE INDEX IF NOT EXISTS idx_admissions_customer_number ON admissions(customer_number);
CREATE INDEX IF NOT EXISTS idx_admissions_national_id ON admissions(national_id);
CREATE INDEX IF NOT EXISTS idx_admissions_place_of_birth ON admissions(place_of_birth);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_admissions_updated_at ON admissions;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_admissions_updated_at
  BEFORE UPDATE ON admissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete student photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view student photos" ON storage.objects;

-- Create storage policy for student photos (public bucket)
CREATE POLICY "Public can view student photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can upload student photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can delete student photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'student-photos');

-- Enable RLS on admissions table
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can view all admissions" ON admissions;
DROP POLICY IF EXISTS "Authenticated users can insert admissions" ON admissions;
DROP POLICY IF EXISTS "Authenticated users can update admissions" ON admissions;
DROP POLICY IF EXISTS "Authenticated users can delete admissions" ON admissions;

-- Create policy for authenticated users to manage admissions
CREATE POLICY "Authenticated users can view all admissions"
  ON admissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admissions"
  ON admissions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admissions"
  ON admissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete admissions"
  ON admissions FOR DELETE
  TO authenticated
  USING (true);
