/*
  # Create weather_logs table

  1. New Tables
    - `weather_logs`
      - `id` (uuid, primary key) - Unique identifier for each weather log entry
      - `city_name` (text, not null) - Name of the city searched
      - `country` (text) - Country code of the city
      - `description` (text) - Weather description (e.g., "clear sky")
      - `temperature` (numeric) - Temperature in Celsius
      - `humidity` (int) - Humidity percentage
      - `timezone` (int) - Timezone offset in seconds
      - `created_at` (timestamptz, not null) - Timestamp when the search was made
  
  2. Security
    - Enable RLS on `weather_logs` table
    - Add policy for public read access (weather history is public)
    - Add policy for service role to insert records
  
  3. Indexes
    - Add index on city_name for faster history queries
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS weather_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name text NOT NULL,
  country text,
  description text,
  temperature numeric,
  humidity int,
  timezone int,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE weather_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read weather logs"
  ON weather_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert weather logs"
  ON weather_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_weather_logs_city_name ON weather_logs(city_name);
CREATE INDEX IF NOT EXISTS idx_weather_logs_created_at ON weather_logs(created_at DESC);