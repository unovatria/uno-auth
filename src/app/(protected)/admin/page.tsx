"use client";

// Commented (Role function)
//import { FormSuccess } from "@/components/form-success";
//import { Button } from "@/components/ui/button";
//import { Card, CardContent, CardHeader } from "@/components/ui/card";
//import { toast } from "sonner";


const AdminPage = () => {

  // Commented (Role function)
  /*
  const role = useCurrentRole();

  const onApiRouteClick = async () => {
    fetch("/api/admin")
      .then((response) => {
        if (response.ok) {
          console.log("OKAY");
          toast.success("Allowed API Route!");
        } else {
          console.log("FORBIDDEN");
          toast.error("Forbidden API Route!");
        }
      })
  };

  const onServerActionClick = () => {
    admin()
      .then((data) => {
        if (data.success) {
          toast.success("Allowed Server Action!");
        } else {
          toast.error("Forbidden Server Action!");
        }
      })

  };
    */


  return (
    <>
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <div>
        <p>I did not added Role function from demo, If you want to add, add Role Schema to prisma</p>
        <p>and add Role to User Schema</p>
        <p>and add use-current-role.ts to hooks (for client components)</p>
        <p>and add current-role.ts to hooks (for server components) (lib &gt; auth.ts in demo)</p>
        <p>and add "role-gate.tsx" to components &gt; auth</p>
        <p>and add "route.ts" to "admin" (create folder) inside app &gt; api</p>
        <p>and add "admin.ts" to actions folder</p>

        <p className="text-xs mt-4">after you can use things in this page class (page class has all things inside commented)</p>
      </div>
      {/** Commented (Role function)
      <div className="mt-4">
        <Card className="w-[600px]">
          <CardHeader>
            <p className="text-2xl font-semibold text-center">🔑 Admin</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
              <FormSuccess message="Only visible to users with the admin role" />
            </RoleGate>

            <div className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">
                Admin-only API route
              </p>
              <Button onClick={onApiRouteClick}>
                Click to test
              </Button>
            </div>

            <div className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">
                Admin-only Server Action
              </p>
              <Button onClick={onServerActionClick}>
                Click to test
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
       */}
    </>
  );
};

export default AdminPage;
