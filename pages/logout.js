import { supabase } from "utils/supabase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Logout = () => {
  const router = useRouter();
  const session = supabase.auth.session();

  const logout = async () => {
    await supabase.auth.signOut();
    await axios.post("/api/auth", { event: "SIGNED_OUT", session });
    router.push("/");
  };

  useEffect(logout, []);

  return null;
};

export default Logout;
