-- Enable realtime for tables used by the dashboard and posts page
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table analytics_events;
