-- Schedule the daily-alerts function to run every day at 08:00 UTC
-- Note: This requires the pg_cron extension enabled in Supabase (Database -> Extensions)

select
  cron.schedule(
    'daily-academic-alerts',
    '0 8 * * *', -- Minuto 0, Hora 8, Todos os dias
    $$
    select
      net.http_post(
        url := 'https://kbcpryinseisqxrsvrkl.supabase.co/functions/v1/daily-alerts',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
        body := '{}'::jsonb
      ) as request_id;
    $$
  );
