import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, X } from "lucide-react";
import { Check } from "lucide-react";
import UserAvatar from "./user-avatar";

interface UserItemProps {
  id: string;
  username: string;
  imageUrl: string;
  status: "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";
  type: "friend" | "invitation" | "notification";
  onSubmit: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserItem = ({
  id,
  username,
  imageUrl,
  status,
  type,
  onSubmit,
  onDelete,
}: UserItemProps) => {
  return (
    <div className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-4">
      <div className="flex items-center gap-4">
        <UserAvatar imageUrl={imageUrl} status={status} size="medium" />
        {type === "notification" && (
          <p className="text-background-50 text-base font-semibold">
            {username} has sent you a friend request
          </p>
        )}
        {type !== "notification" && (
          <p className="text-background-50">{username}</p>
        )}
      </div>
      {type === "notification" && (
        <div className="flex gap-3">
          <button className="p-[1px] hover:bg-background-800 rounded-md">
            <Check className="text-success" onClick={() => onSubmit(id)} />
          </button>
          <button className="p-[1px] hover:bg-background-800 rounded-md">
            <X className="text-error" onClick={() => onDelete(id)} />
          </button>
        </div>
      )}
      {type === "invitation" && (
        <button className="p-[1px] hover:bg-background-800 rounded-md">
          <X size="24" className="text-error" onClick={() => onDelete(id)} />
        </button>
      )}
      {type === "friend" && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center py-1 hover:bg-background-800 rounded-md">
              <EllipsisVertical size="24" className="text-primary-700" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-center data-[state=open]:bg-background-900">
            <DropdownMenuLabel>
              <button onClick={() => onSubmit(id)}>Send message</button>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <button className="text-error" onClick={() => onDelete(id)}>
                Delete friend
              </button>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserItem;
