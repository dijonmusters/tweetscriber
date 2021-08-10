import { supabase } from "utils/supabase";
import cookie from "cookie";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const QueryId = ({ query: { id, title, content, tweet } }) => {
  const [tweets, setTweets] = useState([...tweet]);

  const handleNewTweet = ({ new: newTweet }) => {
    if (newTweet.query_id === id) {
      setTweets((current) => [...current, newTweet]);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .from("tweet")
      .on("INSERT", handleNewTweet)
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-3xl w-full">
      <Link href="/">
        <a className="mt-12 flex">
          <Image
            src="/arrow-left.svg"
            width="16"
            height="16"
            className="mr-1"
          />
          All subscriptions
        </a>
      </Link>
      <h1 className="text-5xl mt-6">{title}</h1>
      <p className="text-gray-500 text-2xl px-2">{content}</p>
      <div className="py-2 w-full flex flex-col mb-4">
        {tweets.length > 0 ? (
          tweets.map((t) => (
            <a
              key={t.id}
              className="py-8 px-4 w-full border-b-2"
              href={t.tweet_url}
            >
              {t.content}
              <a
                className="text-gray-500 text-sm block px-2 py-2"
                href={`https://twitter.com/${t.handle}`}
              >
                @{t.handle}
              </a>
            </a>
          ))
        ) : (
          <p>No tweets to display</p>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req, params }) => {
  const { id } = params;
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  const token = cookie.parse(req.headers.cookie)["sb:token"];

  supabase.auth.session = () => ({
    access_token: token,
  });

  const { data: query } = await supabase
    .from("query")
    .select("*, tweet(*)")
    .eq("id", id)
    .single();

  return { props: { query } };
};

export default QueryId;
