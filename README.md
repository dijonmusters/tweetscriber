This is a Next.js frontend for the TweetScriber Supabase project: https://erobdnhhjlslevvklpxn.supabase.co

Created for the [hackathon](https://supabase.io/blog/2021/07/30/1-the-supabase-hackathon) in order to win gold tees!

This is a marketing tool that allows you to subscribe to particular streams from Twitter. Ideally, this would be used by a small startup to stay on top of anytime their company is mentioned on Twitter so they can amplify the positive and address the negative.

The plan was to implement Stripe and build this as a SaaS product - where you can subscribe to one stream for free, and pay for additionals - but did not have time to implement 🙁

## Prerequisites

This project uses a private Twitter API key. You can apply for one [here](https://developer.twitter.com/en/apply-for-access).

There are some other environment variables you will need to create in a `.env` file:

NEXT_PUBLIC_SUPABASE_URL - get this from Supabase settings
NEXT_PUBLIC_SUPABASE_ANON_KEY - get this from Supabase settings
TWITTER_TOKEN - get this from Twitter
SECRET - this can be any value you like

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase

This project was basically an excuse to explore all the cool things you can do with Supabase. It uses:

- Databases
- Auth
- Row Level Policies
- Hooks
- Postgres Functions
- Cron job system from Supabase blog post

The basic flow is a user signs in and creates a new `query` that they would like to subscribe to. This triggers a hook on the insert to the `query` table which calls a serverless function to get the last day's worth of tweets from the Twitter API. It also registers a cron job to do this every day for this particular query. This uses the `pg_cron` and `pg_http` extensions.

## Stuff to fix

- inserts from front-end are mysteriously failing as they are pointing to a schema that does not exist?
- there is no validation or error handling anywhere!
- results from twitter are capped at 100 per day
- css seems to be broken on deployed site 🙁
