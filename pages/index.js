import { supabase } from "utils/supabase";
import cookie from "cookie";
import Link from "next/link";

const Home = ({ queries }) => {
  console.log(queries);
  return (
    <div className=" mx-auto min-h-screen max-w-xl w-full flex flex-col justify-center items-center">
      {queries.map(({ id, title, content, tweet }) => (
        <Link key={id} href={`/query/${id}`}>
          <a
            className="py-2 px-8 border w-full my-1"
            style={{ textDecoration: "none" }}
          >
            <p className="text-2xl">
              {title}
              <span className="text-gray-500 text-sm"> {tweet.length}</span>
            </p>
            <p className="text-gray-500">{content}</p>
          </a>
        </Link>
      ))}
      <Link href="/query/new">
        <a className="self-start text-xl text-gray-500 ml-4 mt-2">
          Create new query
        </a>
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
