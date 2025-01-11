import { auth, signOut } from "@/auth"; 

const SettingsPage = async () => {

  const session = await auth();

  // Todo session içerisinde name dönmekte bunu username çevirisi "callback" auth.ts ve auth.config.ts kontrol edilecek.

  return ( 
    <div>
      Settings page - 
      {JSON.stringify(session)}

      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <button type="submit">
          Logout
        </button>
      </form>
    </div> 
  );
}
 
export default SettingsPage;