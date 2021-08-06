import { supabase } from "utils/supabase";

const Login = () => {
  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  return <button onClick={login}>Login</button>;
};

export default Login;
