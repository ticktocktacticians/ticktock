"use client";

import CreateUserForm from "@/components/auth/create-user-form";
import { createUser } from "./actions";
import { User as AuthUser } from "@supabase/supabase-js";
import { invalidateUser, useGetUser } from "../lib/queries/user";
import { Button } from "../components/ui/button";
import { useGetEvents } from "../lib/queries/events";
import { Card } from "../components/ui/card";
import { truncate } from "../utils/string";
import { redirect } from "next/navigation";
import { Badge } from "../components/ui/badge";
import { EVENT_STATUS } from "../lib/apis/getEvents";
import { PlusCircle } from "lucide-react";

export interface LoggedInPage {
  authUser: AuthUser;
}

export default function Home() {
  const { data: user } = useGetUser();

  const events = useGetEvents().data;

  if (!user) {
    return (
      <CreateUserForm
        createUser={async (formData) => {
          await createUser(formData);
          await invalidateUser();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col place-self-center w-[720px] overflow-y-hidden">
      <h1 className="text-2xl font-semibold mb-5 text-slate-400">Hi, {user.email}!</h1>
      <Button className="bg-indigo-600 mb-6 w-1/2 h-16" onClick={() => redirect("/meeting/create")}><PlusCircle /> Create new meeting</Button>
      <h1 className="text-xl font-semibold mb-5">Your meetings</h1>
      <div className="flex flex-col gap-2 h-[420px] overflow-y-scroll">
        {events?.length ? events
          .sort((e1, e2) => e1.id - e2.id)
          .map((event) => {
            return (
              <Card
                className="flex h-14 items-center justify-between px-6 py-4 rounded-none"
                key={event.id}
              >
                <h2>{event.title ? truncate(event.title) : "-"}</h2>
                <div>
                  <Badge variant="secondary" className="mr-4">{EVENT_STATUS[event.status]}</Badge>
                  <Button
                    onClick={() => redirect(`/meeting/${event.id}`)}
                    className="bg-indigo-600 text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          }) : <span>Wow, you have no meetings scheduled. Such great work-life balance!</span>}
      </div>
    </div>
  );
}
