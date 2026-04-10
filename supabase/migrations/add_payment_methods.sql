-- Migration: Add payment method fields to profiles table
-- Run this in your Supabase SQL editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS upi_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_link TEXT,
  ADD COLUMN IF NOT EXISTS stripe_link TEXT,
  ADD COLUMN IF NOT EXISTS custom_payment_link TEXT,
  ADD COLUMN IF NOT EXISTS custom_payment_label TEXT;
