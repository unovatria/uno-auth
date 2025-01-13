"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

const SettingsClientPage = () => {

  const session = useSession();

  //gn* daha sonradan ekledğimiz hook ile her seferinde sessin içini getirmektense kullanımı şöyle kolaylaştırıyoruz:
  const user = useCurrentUser();

  const onClickLogout = () => {
    logout();
  }

  return ( 
    <>
      <div className="bg-white p-4 rounded-xl">
        <form action={onClickLogout}>
          <button type="submit">Logout</button>
        </form>
      </div>

      <div>
        <p className="text-xl">Settings-CLIENT page</p>
        <p className="text-xl">[This is client-side running page]</p>

        <div>
          <br/>
          <p className="text-xs">In client "session.data" will be used.</p>
          <br/>
          <p className="text-xs">session: {JSON.stringify(session)}</p>
          <p className="text-xs">session.data: {JSON.stringify(session.data)}</p>
          <p className="text-xs">session.data.user: {JSON.stringify(session.data?.user)}</p>
          <p className="text-xs">session.data.user.username: {JSON.stringify(session.data?.user?.username)}</p>
          <p className="text-xs">session.data.user.email: {JSON.stringify(session.data?.user?.email)}</p>
          <p className="text-xs">session.data.user.name: {JSON.stringify(session.data?.user?.name)}</p>
          <p className="text-xs">session.data.user.image: {JSON.stringify(session.data?.user?.image)}</p>
          <p className="text-xs">session.data.expires: {JSON.stringify(session.data?.expires)}</p>
          <br/>
        </div>

        <div>
          <br/>
          <p className="text-xs">Using custom hook</p>
          <br/>
          <p className="text-xs">user: {JSON.stringify(user)}</p>
          <p className="text-xs">user.username: {JSON.stringify(user?.username)}</p>
          <p className="text-xs">user.email: {JSON.stringify(user?.email)}</p>
          <p className="text-xs">user.name: {JSON.stringify(user?.name)}</p>
          <p className="text-xs">user.image: {JSON.stringify(user?.image)}</p>
          <br/>
        </div>

        <div>
          <br />
          <button type="button">
            <a href="/settings">(Go to server-side running page)</a>
          </button>
        </div>
      </div>

    </>
  );
}
 
export default SettingsClientPage;