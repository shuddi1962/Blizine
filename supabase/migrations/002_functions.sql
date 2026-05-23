-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment feed posts count
CREATE OR REPLACE FUNCTION increment_feed_posts_count(feed_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE rss_feeds SET posts_fetched = posts_fetched + 1 WHERE id = feed_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad impressions
CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET impressions = impressions + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET clicks = clicks + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment affiliate product clicks
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE affiliate_products SET clicks = clicks + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment affiliate product conversions
CREATE OR REPLACE FUNCTION increment_affiliate_conversions(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE affiliate_products SET conversions = conversions + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get ad impressions
CREATE OR REPLACE FUNCTION get_ad_impressions(ad_id UUID)
RETURNS INT AS $$
DECLARE
  result INT;
BEGIN
  SELECT impressions INTO result FROM ads WHERE id = ad_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
