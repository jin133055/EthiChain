/*
  # Add DID support to merchants table

  1. New Columns
    - `algorand_did` (text, unique) - Unique DID generated on Algorand
    - `did_transaction_id` (text) - Transaction ID of DID creation on Algorand
    - `did_created_at` (timestamp) - When the DID was created

  2. Security
    - Add unique constraint on algorand_did
    - Add index for performance

  3. Changes
    - Update existing merchants table with new DID columns
*/

-- Add DID columns to merchants table
ALTER TABLE merchants 
ADD COLUMN IF NOT EXISTS algorand_did text UNIQUE,
ADD COLUMN IF NOT EXISTS did_transaction_id text,
ADD COLUMN IF NOT EXISTS did_created_at timestamptz;

-- Add index for DID lookups
CREATE INDEX IF NOT EXISTS idx_merchants_algorand_did ON merchants(algorand_did);

-- Add comment for documentation
COMMENT ON COLUMN merchants.algorand_did IS 'Unique Decentralized Identifier generated on Algorand blockchain';
COMMENT ON COLUMN merchants.did_transaction_id IS 'Algorand transaction ID for DID creation';
COMMENT ON COLUMN merchants.did_created_at IS 'Timestamp when DID was created on Algorand';