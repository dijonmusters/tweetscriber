import { supabase } from "utils/supabase";
import cookie from "cookie";

const QueryId = ({ query: { id, title, content, tweet } }) => {
  const handleTweetFetch = async () => {
    await supabase.rpc("get_tweets", {
      id: id.toString(),
      content,
    });
  };

  return (
    <div className="prose mx-auto min-h-screen w-full flex flex-col justify-center items-center">
      <div className="py-2 px-8 border w-full my-1">
        <p>
          <span className="text-2xl">{title}</span>
          <span className="text-gray-500"> {content}</span>
        </p>
        {tweet.length > 0 ? (
          tweet.map((t) => (
            <p key={t.id} className="px-2 my-2">
              {t.content}
              <span className="text-gray-500 text-sm"> {t.handle}</span>
            </p>
          ))
        ) : (
          <button onClick={handleTweetFetch}>Get tweets</button>
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
