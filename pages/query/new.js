import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "utils/supabase";
import { useRouter } from "next/router";

const NewQuery = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef();
  const contentRef = useRef();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e) => {
      if (title !== "" && content !== "" && e.key === "Enter") {
        const { data } = await supabase.from("query").insert([
          {
            title,
            content,
            user_id: supabase.auth.user().id,
          },
        ]);
        router.push(`/query/${data[0].id}`);
      }
    },
    [title, content]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleSubmit);
    return () => {
      window.removeEventListener("keyup", handleSubmit);
    };
  }, [handleSubmit]);

  useEffect(async () => {
    titleRef.current.focus();
  }, [titleRef]);

  return (
    <>
      <div className="prose mx-auto min-h-screen w-full flex flex-col justify-center items-center">
        <input
          type="text"
          className="w-full text-5xl outline-none"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={titleRef}
        />
        <input
          type="text"
          className={`w-full text-5xl outline-none ${
            title === "" && content === "" ? "invisible" : "visible"
          }`}
          placeholder="Query"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          ref={contentRef}
        />
      </div>
    </>
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

  return { props: {} };
};

export default NewQuery;
