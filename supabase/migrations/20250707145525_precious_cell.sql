/*
  # Add password column to user_profiles table

  1. Changes
    - Add `password` column to `user_profiles` table
    - Update authentication to use direct email/password matching

  2. Security
    - Password column added for email authentication
    - Maintain existing RLS policies
*/

-- Add password column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS password text;

-- Update the constraint to allow password for email auth method
-- (No additional constraints needed as password will be required for email auth)