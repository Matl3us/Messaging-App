import { Circle, CircleMinus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCheckStatus, useUpdateStatus } from "@/hooks/useProfile";

enum Status {
  Online,
  Away,
  DontDisturb,
  Offline,
}

const convertToEnum = (status: string): Status | null => {
  switch (status) {
    case "ONLINE":
      return Status.Online;
    case "AWAY":
      return Status.Away;
    case "DONTDISTURB":
      return Status.DontDisturb;
    case "OFFLINE":
      return Status.Offline;
    default:
      return null;
  }
};

const UserStatus = () => {
  const changeStatus = useUpdateStatus();
  const { userStatus, setUserStatus, loadingStatus } = useCheckStatus();

  const submitStatus = (status: string) => {
    const enumStatus = convertToEnum(status);
    if (enumStatus !== null) {
      setUserStatus(status as "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE");
      changeStatus(enumStatus);
    }
  };

  if (loadingStatus) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2 hover:bg-background-800 rounded-md cursor-pointer flex items-center gap-1">
          {userStatus === "ONLINE" && (
            <span className="w-3 h-3 rounded-full bg-success" />
          )}
          {userStatus === "AWAY" && (
            <span className="w-3 h-3 rounded-full bg-warning" />
          )}
          {userStatus === "DONTDISTURB" && (
            <CircleMinus className="text-error" size="12" />
          )}
          {userStatus === "OFFLINE" && (
            <Circle className="text-background-600" size="12" />
          )}
          <p className="text-background-200 text-sm font-semibold">Status</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-24 p-2 text-center">
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus("ONLINE")}
          >
            <span className="w-3 h-3 rounded-full bg-success" />
            <p>Online</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus("AWAY")}
          >
            <span className="w-3 h-3 rounded-full bg-warning" />
            <p>Away</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus("DONTDISTURB")}
          >
            <CircleMinus className="text-error" size="12" />
            <p>Do not disturb</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus("OFFLINE")}
          >
            <Circle className="text-background-600" size="12" />
            <p>Offline</p>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserStatus;
