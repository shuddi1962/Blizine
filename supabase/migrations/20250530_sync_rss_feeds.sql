DELETE FROM rss_feeds;

INSERT INTO rss_feeds (feed_name, feed_url, category_id, is_active, auto_rewrite, auto_publish, fetch_interval_minutes, posts_fetched) VALUES
  -- Tech News
  ('The Verge',       'https://www.theverge.com/rss/index.xml',                                              (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('TechCrunch',      'https://techcrunch.com/feed/',                                                        (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Ars Technica',    'https://feeds.arstechnica.com/arstechnica/index',                                      (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Wired',           'https://www.wired.com/feed/rss',                                                       (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Engadget',        'https://www.engadget.com/rss.xml',                                                     (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('CNET',            'https://www.cnet.com/rss/all/',                                                        (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Gizmodo',         'https://gizmodo.com/feed/rss',                                                         (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('TechRadar',       'https://www.techradar.com/feeds/rss/news.xml',                                         (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('ZDNet',           'https://www.zdnet.com/news/rss.xml',                                                   (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Mashable Tech',   'https://mashable.com/feeds/rss/tech.xml',                                              (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('Tom''s Guide',    'https://www.tomsguide.com/feeds/rss2/news.xml',                                        (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),
  ('MIT Tech Review', 'https://www.technologyreview.com/stories.rss',                                         (SELECT id FROM categories WHERE slug = 'tech-news'), true, false, true, 60, 0),

  -- AI & Automation
  ('VentureBeat AI',  'https://venturebeat.com/category/ai/feed/',                                            (SELECT id FROM categories WHERE slug = 'ai-automation'), true, false, true, 60, 0),
  ('TechCrunch AI',   'https://techcrunch.com/category/artificial-intelligence/feed/',                        (SELECT id FROM categories WHERE slug = 'ai-automation'), true, false, true, 60, 0),
  ('Ars Technica AI', 'https://feeds.arstechnica.com/arstechnica/ai',                                         (SELECT id FROM categories WHERE slug = 'ai-automation'), true, false, true, 60, 0),
  ('MIT Tech Review AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',              (SELECT id FROM categories WHERE slug = 'ai-automation'), true, false, true, 60, 0),

  -- Cybersecurity
  ('BleepingComputer','https://www.bleepingcomputer.com/feed/',                                               (SELECT id FROM categories WHERE slug = 'cybersecurity'), true, false, true, 60, 0),
  ('The Hacker News', 'https://feeds.feedburner.com/TheHackersNews',                                          (SELECT id FROM categories WHERE slug = 'cybersecurity'), true, false, true, 60, 0),
  ('SecurityWeek',    'https://www.securityweek.com/feed/',                                                   (SELECT id FROM categories WHERE slug = 'cybersecurity'), true, false, true, 60, 0),
  ('Krebs on Security','https://krebsonsecurity.com/feed/',                                                   (SELECT id FROM categories WHERE slug = 'cybersecurity'), true, false, true, 60, 0),
  ('Threatpost',      'https://threatpost.com/feed/',                                                         (SELECT id FROM categories WHERE slug = 'cybersecurity'), true, false, true, 60, 0),

  -- Gadgets
  ('9to5Mac',         'https://9to5mac.com/feed/',                                                            (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('9to5Google',      'https://9to5google.com/feed/',                                                         (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('Android Authority','https://www.androidauthority.com/feed/',                                              (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('MacRumors',       'https://feeds.macrumors.com/MacRumors-All',                                            (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('AppleInsider',    'https://appleinsider.com/rss/news/',                                                   (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('GSMArena',        'https://www.gsmarena.com/rss-news-reviews.php3',                                       (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('PCMag Gadgets',   'https://www.pcmag.com/feeds/rss/software',                                             (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),
  ('Tom''s Hardware', 'https://www.tomshardware.com/feeds/all',                                               (SELECT id FROM categories WHERE slug = 'gadgets'), true, false, true, 60, 0),

  -- Programming
  ('Dev.to',          'https://dev.to/feed',                                                                  (SELECT id FROM categories WHERE slug = 'programming'), true, false, true, 60, 0),
  ('GitHub Blog',     'https://github.blog/feed/',                                                            (SELECT id FROM categories WHERE slug = 'programming'), true, false, true, 60, 0),
  ('Stack Overflow',  'https://stackoverflow.blog/feed/',                                                     (SELECT id FROM categories WHERE slug = 'programming'), true, false, true, 60, 0),
  ('Hacker News Best','https://hnrss.org/best',                                                               (SELECT id FROM categories WHERE slug = 'programming'), true, false, true, 60, 0),
  ('freeCodeCamp',    'https://www.freecodecamp.org/news/rss/',                                               (SELECT id FROM categories WHERE slug = 'programming'), true, false, true, 60, 0),

  -- Web Development
  ('Smashing Magazine','https://www.smashingmagazine.com/feed/',                                              (SELECT id FROM categories WHERE slug = 'web-development'), true, false, true, 60, 0),
  ('CSS-Tricks',      'https://css-tricks.com/feed/',                                                         (SELECT id FROM categories WHERE slug = 'web-development'), true, false, true, 60, 0),
  ('web.dev',         'https://web.dev/feed.xml',                                                             (SELECT id FROM categories WHERE slug = 'web-development'), true, false, true, 60, 0),

  -- Tutorials
  ('How-To Geek',     'https://www.howtogeek.com/feed/',                                                      (SELECT id FROM categories WHERE slug = 'tutorials'), true, false, true, 60, 0),
  ('MakeUseOf',       'https://www.makeuseof.com/feed/',                                                      (SELECT id FROM categories WHERE slug = 'tutorials'), true, false, true, 60, 0),

  -- Digital Business
  ('TechCrunch Startups','https://techcrunch.com/category/startups/feed/',                                    (SELECT id FROM categories WHERE slug = 'digital-business'), true, false, true, 60, 0),
  ('VentureBeat',     'https://venturebeat.com/feed/',                                                        (SELECT id FROM categories WHERE slug = 'digital-business'), true, false, true, 60, 0),
  ('Fast Company Tech','https://www.fastcompany.com/technology/rss',                                          (SELECT id FROM categories WHERE slug = 'digital-business'), true, false, true, 60, 0),

  -- Networking & IT
  ('The Register',    'https://www.theregister.com/headlines.atom',                                           (SELECT id FROM categories WHERE slug = 'networking-it'), true, false, true, 60, 0),
  ('AWS Blog',        'https://aws.amazon.com/blogs/aws/feed/',                                               (SELECT id FROM categories WHERE slug = 'networking-it'), true, false, true, 60, 0),
  ('Cloudflare Blog', 'https://blog.cloudflare.com/rss/',                                                     (SELECT id FROM categories WHERE slug = 'networking-it'), true, false, true, 60, 0),

  -- Reviews
  ('PCMag Reviews',   'https://www.pcmag.com/feeds/rss/reviews',                                              (SELECT id FROM categories WHERE slug = 'reviews'), true, false, true, 60, 0),
  ('CNET Reviews',    'https://www.cnet.com/rss/reviews/',                                                    (SELECT id FROM categories WHERE slug = 'reviews'), true, false, true, 60, 0),
  ('Wirecutter',      'https://www.nytimes.com/wirecutter/feed/',                                             (SELECT id FROM categories WHERE slug = 'reviews'), true, false, true, 60, 0),

  -- Desktops
  ('PCWorld',         'https://www.pcworld.com/feed',                                                         (SELECT id FROM categories WHERE slug = 'desktops'), true, false, true, 60, 0);

-- Update posts_fetched to match actual articles
UPDATE rss_feeds SET posts_fetched = 3 WHERE feed_name = 'Ars Technica';
UPDATE rss_feeds SET posts_fetched = 2 WHERE feed_name = 'Dev.to';
UPDATE rss_feeds SET posts_fetched = 2 WHERE feed_name = 'GitHub Blog';
UPDATE rss_feeds SET posts_fetched = 1 WHERE feed_name = '9to5Mac';
UPDATE rss_feeds SET posts_fetched = 1 WHERE feed_name = 'CNET Reviews';
UPDATE rss_feeds SET posts_fetched = 1 WHERE feed_name = 'Android Authority';
