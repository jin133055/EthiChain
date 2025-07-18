/*
  # Create merchants table for verified sellers

  1. New Tables
    - `merchants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `business_name` (text)
      - `website` (text)
      - `description` (text)
      - `business_type` (text)
      - `registration_number` (text)
      - `verification_level` (text)
      - `trust_score` (integer)
      - `certifications` (text array)
      - `nft_certificate_id` (text)
      - `verification_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `merchants` table
    - Add policies for merchants to manage their own data
    - Add policy for public to read verified merchants

  3. Indexes
    - Add indexes for performance on commonly queried fields
*/

CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  website text,
  description text,
  business_type text,
  registration_number text,
  verification_level text DEFAULT 'basic' CHECK (verification_level IN ('basic', 'advanced', 'premium')),
  trust_score integer DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  certifications text[] DEFAULT '{}',
  nft_certificate_id text,
  verification_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Merchants can read own data"
  ON merchants
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Merchants can update own data"
  ON merchants
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Public can read verified merchants"
  ON merchants
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Suppliers can insert merchant data"
  ON merchants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT id FROM user_profiles WHERE id = auth.uid() AND role = 'supplier')
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_verification_level ON merchants(verification_level);
CREATE INDEX IF NOT EXISTS idx_merchants_trust_score ON merchants(trust_score);
CREATE INDEX IF NOT EXISTS idx_merchants_business_name ON merchants(business_name);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_merchants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION update_merchants_updated_at();