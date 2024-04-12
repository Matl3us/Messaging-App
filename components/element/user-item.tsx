import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Menu } from "lucide-react";

interface UserItemProps {
  id: string;
  username: string;
  imageUrl: string;
  type: "friend" | "invitation" | "notification";
  onSubmit: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserItem = ({
  id,
  username,
  imageUrl,
  type,
  onSubmit,
  onDelete,
}: UserItemProps) => {
  return (
    <div className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-4">
      <div className="flex items-center gap-4">
        <Image
          className="rounded-lg"
          src={imageUrl}
          placeholder="empty"
          alt="Avatar"
          width="40"
          height="40"
          unoptimized
        />
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
            <button className="flex items-center p-[1px] hover:bg-background-800 rounded-md">
              <Menu size="24" className="text-primary-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-center">
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
