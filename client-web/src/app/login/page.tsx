import { login, loginWithOAuth, signup } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "../../components/ui/card";
import { getServerUserSession } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerUserSession();

  if (session) redirect("/");

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[400px] py-10 px-12 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold mb-8">Welcome Back</h1>
        <form className="flex flex-col gap-3 w-full">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            className="w-full"
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <div className="flex flex-col gap-3">
            <Button formAction={login} className="bg-indigo-600">
              Login
            </Button>
            <Button formAction={signup} className="bg-indigo-600">
              Sign up
            </Button>
            <div className="flex justify-center items-center text-xs my-2">
              <span className="w-full border-t border-slate-400 mr-2"></span>OR
              <span className="w-full border-t border-slate-400 ml-2"></span>
            </div>
            <Button
              onClick={loginWithOAuth}
              className="dark text-slate-900 border border-[#747775]"
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="block"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
