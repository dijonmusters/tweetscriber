import { supabase } from "utils/supabase";
import cookie from "cookie";
import Link from "next/link";

const Home = ({ queries }) => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl w-full">
      <h1 className="text-5xl mt-12">Subscriptions</h1>
      <div className="py-2 w-full flex flex-col mb-4">
        {queries.length > 0 ? (
          queries.map(({ id, title, content, tweet }) => (
            <Link key={id} href={`/query/${id}`}>
              <a
                className="py-8 px-4 border-b-2"
                style={{ textDecoration: "none" }}
              >
                <p className="text-2xl">
                  {title}
                  <span className="text-gray-500 text-sm"> {tweet.length}</span>
                </p>
                <p className="text-gray-500">{content}</p>
              </a>
            </Link>
          ))
        ) : (
          <p className="py-8 px-4 border-b-2">No subscriptions</p>
        )}
      </div>
      <Link href="/query/new">
        <a className="text-xl text-gray-500 px-4">+ Create new subscription</a>
      </Link>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
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

  const { data: queries } = await supabase.from("query").select("*, tweet(id)");

  return { props: { queries } };
};

export default Home;
