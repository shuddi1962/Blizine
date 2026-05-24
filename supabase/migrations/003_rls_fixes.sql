-- Add missing public SELECT policies for tables queried by the frontend

-- Profiles: needed for post author display
CREATE POLICY "Public can view profiles" ON profiles
  FOR SELECT USING (true);

-- Series: needed for post-series component
CREATE POLICY "Public can view series" ON series
  FOR SELECT USING (true);

-- Reactions: needed for reaction counts
CREATE POLICY "Public can view reactions" ON reactions
  FOR SELECT USING (true);

-- Site settings: needed for ad config, affiliate disclosure
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

-- RSS feeds: needed for admin RSS listing
CREATE POLICY "Public can view RSS feeds" ON rss_feeds
  FOR SELECT USING (true);

-- Affiliate products: needed for affiliate display widgets
CREATE POLICY "Public can view affiliate products" ON affiliate_products
  FOR SELECT USING (true);

-- Affiliate programs: needed for affiliate admin listings
CREATE POLICY "Public can view affiliate programs" ON affiliate_programs
  FOR SELECT USING (true);

-- Social accounts: needed for admin social page
CREATE POLICY "Public can view social accounts" ON social_accounts
  FOR SELECT USING (true);

-- Google indexing queue: needed for admin indexing page
CREATE POLICY "Public can view indexing queue" ON google_indexing_queue
  FOR SELECT USING (true);

-- Analytics events: needed for admin dashboard/analytics counts
CREATE POLICY "Public can view analytics events" ON analytics_events
  FOR SELECT USING (true);

-- Subscribers: needed for admin newsletter page (count + listing)
CREATE POLICY "Public can view subscribers" ON subscribers
  FOR SELECT USING (true);

-- Push subscriptions: needed for admin push page (count)
CREATE POLICY "Public can view push subscriptions" ON push_subscriptions
  FOR SELECT USING (true);
