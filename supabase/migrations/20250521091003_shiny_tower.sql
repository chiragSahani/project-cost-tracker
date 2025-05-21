/*
  # Create Project Cost Tracker Schema

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `cost` (numeric, not null)
      - `user_id` (uuid, not null, foreign key to auth.users)
      - `created_at` (timestamptz, default now())
    - `other_costs`
      - `id` (uuid, primary key)
      - `description` (text, not null)
      - `amount` (numeric, not null)
      - `user_id` (uuid, not null, foreign key to auth.users)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations on their own data
*/

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cost NUMERIC NOT NULL CHECK (cost >= 0),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create other_costs table
CREATE TABLE IF NOT EXISTS other_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_costs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for items table
CREATE POLICY "Users can view their own items" 
  ON items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items" 
  ON items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
  ON items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" 
  ON items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for other_costs table
CREATE POLICY "Users can view their own other costs" 
  ON other_costs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own other costs" 
  ON other_costs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own other costs" 
  ON other_costs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own other costs" 
  ON other_costs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS items_user_id_idx ON items(user_id);
CREATE INDEX IF NOT EXISTS other_costs_user_id_idx ON other_costs(user_id);