import { auth } from "@/auth"; 
import { logout } from "@/actions/logout";

const SettingsPage = async () => {

  const session = await auth();

  // Todo session içerisinde name dönmekte bunu username çevirisi "callback" auth.ts ve auth.config.ts kontrol edilecek.

  return ( 
    <div>
      Settings page - 
      {JSON.stringify(session)}

      <form action={logout}>
        <button type="submit">
          Logout
        </button>
      </form>
    </div> 
  );
}
 
export default SettingsPage;