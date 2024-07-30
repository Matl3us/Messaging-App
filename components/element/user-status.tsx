import { Circle, CircleMinus } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateStatus } from "@/hooks/useProfile";

enum Status {
  Online,
  Away,
  DontDisturb,
  Offline,
}

const UserStatus = () => {
  const [status, setStatus] = useState(Status.Online);
  const changeStatus = useUpdateStatus();

  const submitStatus = (status: number) => {
    setStatus(status);
    changeStatus(status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2 hover:bg-background-800 rounded-md cursor-pointer flex items-center gap-1">
          {status === Status.Online && (
            <span className="w-3 h-3 rounded-full bg-success" />
          )}
          {status === Status.Away && (
            <span className="w-3 h-3 rounded-full bg-warning" />
          )}
          {status === Status.DontDisturb && (
            <CircleMinus className="text-error" size="12" />
          )}
          {status === Status.Offline && (
            <Circle className="text-background-600" size="12" />
          )}
          <p className="text-background-200 text-sm font-semibold">Status</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-24 p-2 text-center">
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus(Status.Online)}
          >
            <span className="w-3 h-3 rounded-full bg-success" />
            <p>Online</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus(Status.Away)}
          >
            <span className="w-3 h-3 rounded-full bg-warning" />
            <p>Away</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus(Status.DontDisturb)}
          >
            <CircleMinus className="text-error" size="12" />
            <p>Do not disturb</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div
            className="flex p-1 items-center gap-1 cursor-pointer"
            onClick={() => submitStatus(Status.Offline)}
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
