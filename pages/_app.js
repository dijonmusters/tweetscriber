import "styles/globals.css";
import { supabase } from "utils/supabase";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await axios.post("/api/auth", {
          event,
          session,
        });
        router.push("/");
      }
    );
    return authListener.unsubscribe;
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
