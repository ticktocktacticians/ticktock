"use client";

import CreateUserForm from "@/components/auth/create-user-form";
import { createUser } from "./actions";
import { User as AuthUser } from "@supabase/supabase-js";
import { invalidateUser, useGetUser } from "../lib/queries/user";

export interface LoggedInPage {
  authUser: AuthUser;
}

export default function Home() {
  const { data: user } = useGetUser();

  return (
    <div>
      {user ? (
        <div>Welcome, {user.alias}</div>
      ) : (
        <CreateUserForm
          createUser={async (formData) => {
            await createUser(formData);
            await invalidateUser();
          }}
        />
      )}
    </div>
  );
}
