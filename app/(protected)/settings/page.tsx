import { auth } from "@/auth";
import { logout } from "@/actions/logout";

const SettingsPage = async () => {

  const session = await auth();

  return (
    <>
      <div className="bg-white p-4 rounded-xl">
        <form action={logout}>
          <button type="submit">Logout</button>
        </form>
      </div>

      <div>
        <p className="text-xl">Settings page</p>
        <p className="text-xl">[This is server-side running page]</p>

        <div>
          <br/>
          <p className="text-xs">session: {JSON.stringify(session)}</p>
          <p className="text-xs">session.user: {JSON.stringify(session?.user)}</p>
          <p className="text-xs">session.user.username: {JSON.stringify(session?.user?.username)}</p>
          <p className="text-xs">session.user.email: {JSON.stringify(session?.user?.email)}</p>
          <p className="text-xs">session.user.name: {JSON.stringify(session?.user?.name)}</p>
          <p className="text-xs">session.user.image: {JSON.stringify(session?.user?.image)}</p>
          <p className="text-xs">session.expires: {JSON.stringify(session?.expires)}</p>
          <br/>
        </div>

        <div>
          <br />
          <button type="button">
            <a href="/settings-client">(Go to client-side running page)</a>
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
