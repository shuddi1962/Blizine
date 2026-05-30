-- Auto-sync rss_feeds.posts_fetched when posts are inserted or deleted
CREATE OR REPLACE FUNCTION sync_rss_feed_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.source_url IS NOT NULL AND NEW.source_name IS NOT NULL THEN
    UPDATE rss_feeds SET posts_fetched = COALESCE(posts_fetched, 0) + 1 WHERE feed_name = NEW.source_name;
  ELSIF TG_OP = 'DELETE' AND OLD.source_url IS NOT NULL AND OLD.source_name IS NOT NULL THEN
    UPDATE rss_feeds SET posts_fetched = GREATEST(0, COALESCE(posts_fetched, 0) - 1) WHERE feed_name = OLD.source_name;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_rss_feed_count ON posts;
CREATE TRIGGER trg_sync_rss_feed_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW
EXECUTE FUNCTION sync_rss_feed_count();

-- Sync current counts to match actual posts
UPDATE rss_feeds SET posts_fetched = 0;
UPDATE rss_feeds r
SET posts_fetched = (SELECT COUNT(*) FROM posts p WHERE p.source_name = r.feed_name AND p.source_url IS NOT NULL);
