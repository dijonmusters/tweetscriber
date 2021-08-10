import { supabase } from "utils/supabase";
import cookie from "cookie";
import { useEffect, useState } from "react";

const QueryId = ({ query: { title, content, tweet } }) => {
  const [tweets, setTweets] = useState([...tweet]);

  const handleNewTweet = ({ new: newTweet }) =>
    setTweets((current) => [...current, newTweet]);

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
    <div className="prose mx-auto min-h-screen w-full flex flex-col justify-center items-center">
      <div className="py-2 px-8 border w-full my-1">
        <p>
          <span className="text-2xl">{title}</span>
          <span className="text-gray-500"> {content}</span>
        </p>
        {tweets.length > 0 ? (
          tweets.map((t) => (
            <p key={t.id} className="px-2 my-2">
              {t.content}
              <span className="text-gray-500 text-sm"> {t.handle}</span>
            </p>
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
