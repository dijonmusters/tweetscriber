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
