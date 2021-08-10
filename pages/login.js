import { supabase } from "utils/supabase";
import Image from "next/image";

const Login = () => {
  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  return (
    <div className="min-h-screen w-full justify-center items-center flex">
      <button className="text-2xl px-6 py-2 hover:bg-gray-100" onClick={login}>
        <Image
          width="160"
          height="160"
          src="/github-logo.png"
          alt="Github logo"
        />
        <span className="block">Login</span>
      </button>
    </div>
  );
};

export default Login;
