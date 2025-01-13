"use client";

import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";

const ClientPage = () => {
  const user = useCurrentUser();


  return (
    <div>
      <UserInfo user={user} label="Client Component" />

      <form action={logout} className="bg-white p-4 rounded-xl mt-4">
        <button type="submit">Logout (Client page form &gt; button calling logout action)</button>
      </form>
    </div>
  );
};

export default ClientPage;
