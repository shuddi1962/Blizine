-- Add missing public SELECT policies for tables queried by the frontend
-- Uses DROP IF EXISTS to allow re-running safely

DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view series" ON series;
DROP POLICY IF EXISTS "Public can view reactions" ON reactions;
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view RSS feeds" ON rss_feeds;
DROP POLICY IF EXISTS "Public can view affiliate products" ON affiliate_products;
DROP POLICY IF EXISTS "Public can view affiliate programs" ON affiliate_programs;
DROP POLICY IF EXISTS "Public can view social accounts" ON social_accounts;
DROP POLICY IF EXISTS "Public can view indexing queue" ON google_indexing_queue;
DROP POLICY IF EXISTS "Public can view analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Public can view subscribers" ON subscribers;
DROP POLICY IF EXISTS "Public can view push subscriptions" ON push_subscriptions;

CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can view series" ON series FOR SELECT USING (true);
CREATE POLICY "Public can view reactions" ON reactions FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view RSS feeds" ON rss_feeds FOR SELECT USING (true);
CREATE POLICY "Public can view affiliate products" ON affiliate_products FOR SELECT USING (true);
CREATE POLICY "Public can view affiliate programs" ON affiliate_programs FOR SELECT USING (true);
CREATE POLICY "Public can view social accounts" ON social_accounts FOR SELECT USING (true);
CREATE POLICY "Public can view indexing queue" ON google_indexing_queue FOR SELECT USING (true);
CREATE POLICY "Public can view analytics events" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "Public can view subscribers" ON subscribers FOR SELECT USING (true);
CREATE POLICY "Public can view push subscriptions" ON push_subscriptions FOR SELECT USING (true);
