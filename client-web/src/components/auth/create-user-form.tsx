"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export default function CreateUserForm({
  createUser,
}: {
  createUser: (formData: FormData) => void;
}) {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-[400px] py-10 px-12 flex flex-col justify-center items-center">
        <form
          action={createUser}
          className="flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl font-semibold mb-6">Finish creating user</h1>
          <Input name="alias" placeholder="Please enter your name" />
          <Button type="submit" className="mt-4 bg-indigo-600 w-full">
            Create User
          </Button>
        </form>
      </Card>
    </div>
  );
}
