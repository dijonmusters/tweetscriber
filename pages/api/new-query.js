import { supabase } from "utils/supabase";

const handler = async (req, res) => {
  const { title, content } = req.body;
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

  const { data, error } = await supabase
    .from("query")
    .insert([{ title, content, user_id: user.id }]);

  console.log({ data, error });

  res.send("working");
};

export default handler;
