-- Add new ad positions for more in-feed slots on homepage
ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'home_infeed_3';
ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'home_infeed_4';
ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'home_infeed_5';
ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'home_infeed_6';
