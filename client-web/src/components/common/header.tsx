import { CalendarCheck2 } from "lucide-react";
import { logout } from "../../app/actions";
import { getServerUserSession } from "../../utils/supabase/server";

export default async function Header() {
  const session = await getServerUserSession();

  return (
    <div className="w-full bg-indigo-600 text-white rounded-none shadow-md sticky top-0 z-10">
      <div className="flex flex-row justify-between items-center py-6 px-12">
        <span className="text-lg font-bold">
          schedulr <CalendarCheck2 className="w-4 h-4 inline-block ml-1" />
        </span>
        {session && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}
