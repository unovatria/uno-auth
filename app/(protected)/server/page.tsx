import { UserInfo } from "@/components/auth/user-info";
import { currentUser } from "@/hooks/current-user";

import { logout } from "@/actions/logout";

const ServerPage = async () => {
  const user = await currentUser();

  return (
    <div>
      <UserInfo user={user} label="Server Component" />

      <form action={logout} className="bg-white p-4 rounded-xl mt-4">
        <button type="submit">Logout (Server page form &gt; button calling logout action)</button>
      </form>
    </div>
  );
};

export default ServerPage;
