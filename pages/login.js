import { supabase } from "utils/supabase";

const Login = () => {
  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  return (
    <div className="min-h-screen w-full justify-center items-center flex">
      <button className="text-2xl px-6 py-2 hover:bg-gray-100" onClick={login}>
        <img className="w-40" src="/github-logo.png" alt="Github logo" />
        Login
      </button>
    </div>
  );
};

export default Login;
