ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS cpc DECIMAL(10,2) DEFAULT 0;
ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS competition DECIMAL(3,2) DEFAULT 0;
ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS competition_level TEXT DEFAULT 'unknown';
ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS impressions BIGINT DEFAULT 0;
ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS ranking_probability INTEGER DEFAULT 0;
ALTER TABLE keyword_articles ADD COLUMN IF NOT EXISTS cluster TEXT;

CREATE INDEX IF NOT EXISTS idx_keyword_articles_cluster ON keyword_articles(cluster);
CREATE INDEX IF NOT EXISTS idx_keyword_articles_competition ON keyword_articles(competition);
CREATE INDEX IF NOT EXISTS idx_keyword_articles_cpc ON keyword_articles(cpc);
