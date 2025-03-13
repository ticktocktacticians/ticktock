"use client";

import CreateUserForm from "@/components/auth/create-user-form";
import { createUser } from "./actions";
import { User as AuthUser } from "@supabase/supabase-js";
import { invalidateUser, useGetUser } from "../lib/queries/user";
import { Card } from "../components/ui/card";

export interface LoggedInPage {
  authUser: AuthUser;
}

export default function Home() {
  const { data: user } = useGetUser();

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[400px] py-10 px-12 flex flex-col justify-center items-center">
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
      </Card>
    </div>
  );
}
