```
select cron.schedule(
  id,
  '0 6 * * *',
  'select get_tweets(''' || id || '''::TEXT, ''' || content || '''::TEXT);'
);
```

```
select status
  from http((
    'POST',
    'https://tweetscriber.vercel.app/api/get-tweets',
    ARRAY[http_header('secret','supabase-hackathon')],
    'application/json',
    jsonb_build_object('record', jsonb_build_object('id', id, 'content', content))
  )::http_request);
```

```
GRANT USAGE ON SCHEMA net TO "authenticated";
GRANT ALL ON ALL TABLES IN SCHEMA net TO "authenticated";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA net TO "authenticated";

GRANT USAGE ON SCHEMA supabase_functions TO "authenticated";
GRANT ALL ON ALL TABLES IN SCHEMA supabase_functions TO "authenticated";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA supabase_functions TO "authenticated";
```
