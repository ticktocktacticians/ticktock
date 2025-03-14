import { redirect } from "next/navigation";
import { getBrowserClient } from "../../utils/supabase/client";
import { CLIENT_URL } from "./common";

export async function login(data: { email: string; password: string }) {
  const supabase = getBrowserClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO: Handle error
    console.error("Error logging in: ", error);
    redirect("/error");
  }

  redirect("/");
}

export async function signup(data: { email: string; password: string }) {
  const supabase = getBrowserClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // TODO: Handle error
    console.error("Error signing up: ", error);
    redirect("/error");
  }

  redirect("/");
}

export async function loginWithOAuth() {
  const supabase = getBrowserClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${CLIENT_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    // TODO: Handle error
    redirect("/error");
  }
}
