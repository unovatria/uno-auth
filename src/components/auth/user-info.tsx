import { ExtendedUser } from "@/types/next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[700px] shadow-md">
      <CardHeader className="text-2xl font-semibold text-center">
        <CardTitle>{label}</CardTitle>
        <CardDescription>This card displays user information.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">ID:</p>
          <p className="truncate text-l max-w-[300px] font-medium bg-zinc-200/80 rounded-md">{user?.id}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Username:</p>
          <p className="truncate text-l max-w-[300px] font-medium bg-zinc-200/80 rounded-md">
            {user?.username}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Email:</p>
          <p className="truncate text-l max-w-[300px] font-medium bg-zinc-200/80 rounded-md">{user?.email}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Image:</p>
          <p className="truncate text-l max-w-[300px] font-medium bg-zinc-200/80 rounded-md">{user?.image}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Name:</p>
          <p className="truncate text-l max-w-[300px] font-medium bg-zinc-200/80 rounded-md">{user?.name}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Two Factor Authentication:</p>
          <Badge variant={user?.twoFactorEnabled ? "success" : "destructive"}>
            {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        <div className="items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="font-semibold">Raw data:</p>
          <br />
          <p className="text-xs font-medium bg-zinc-200/80 rounded-md whitespace-pre overflow-x-auto max-w-[700px]">
            {JSON.stringify(user, null, 2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
