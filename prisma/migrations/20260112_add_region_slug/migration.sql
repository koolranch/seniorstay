-- Migration: Add region_slug column for multi-city architecture
-- This migration adds region support to Community and senior_events tables

-- Add region_slug to Community table
ALTER TABLE "Community" ADD COLUMN IF NOT EXISTS "region_slug" TEXT NOT NULL DEFAULT 'cleveland';

-- Create indexes for efficient region-based queries
CREATE INDEX IF NOT EXISTS "Community_region_slug_idx" ON "Community"("region_slug");
CREATE INDEX IF NOT EXISTS "Community_region_slug_city_idx" ON "Community"("region_slug", "city");

-- Add region_slug to senior_events table
ALTER TABLE "senior_events" ADD COLUMN IF NOT EXISTS "region_slug" TEXT NOT NULL DEFAULT 'cleveland';

-- Create index for senior_events region queries
CREATE INDEX IF NOT EXISTS "senior_events_region_slug_idx" ON "senior_events"("region_slug");
