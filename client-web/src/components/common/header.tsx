import { logout } from "../../app/actions";
import { getServerUserSession } from "../../utils/supabase/server";
import { HeaderLogo } from "./header-logo";

export default async function Header() {
  const session = await getServerUserSession();

  return (
    <div className="w-full bg-indigo-600 text-white rounded-none shadow-md sticky top-0 z-10">
      <div className="flex flex-row justify-between items-center py-6 px-12">
        <HeaderLogo />
        {session && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}
