import { cn } from "@/lib/utils";
import { Circle, CircleMinus } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  imageUrl: string;
  status: "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";
  size: "small" | "medium" | "large";
}

const UserAvatar = ({ imageUrl, status, size }: UserAvatarProps) => {
  const imageSize = size === "large" ? 64 : size === "medium" ? 40 : 32;

  return (
    <div className="flex">
      <Image
        className="rounded-lg"
        src={imageUrl}
        placeholder="empty"
        alt="Avatar"
        width={imageSize}
        height={imageSize}
        unoptimized
      />
      {status === "ONLINE" && (
        <span
          className={cn(
            "relative rounded-full bg-success",
            size === "large" && "right-2 top-12 w-5 h-5",
            size === "medium" && "right-2 top-8 w-4 h-4",
            size === "small" && "right-2 top-8 w-4 h-4"
          )}
        />
      )}
      {status === "AWAY" && (
        <span
          className={cn(
            "relative rounded-full bg-warning",
            size === "large" && "right-2 top-12 w-5 h-5",
            size === "medium" && "right-2 top-8 w-4 h-4",
            size === "small" && "right-2 top-8 w-4 h-4"
          )}
        />
      )}
      {status === "DONTDISTURB" && (
        <CircleMinus
          className={cn(
            "relative rounded-full text-error bg-black",
            size === "large" && "right-2 top-12 w-5 h-5",
            size === "medium" && "right-2 top-8 w-4 h-4",
            size === "small" && "right-2 top-8 w-4 h-4"
          )}
          size="20"
        />
      )}
      {status === "OFFLINE" && (
        <Circle
          className={cn(
            "relative rounded-full text-background-600 bg-black",
            size === "large" && "right-2 top-12 w-5 h-5",
            size === "medium" && "right-2 top-8 w-4 h-4",
            size === "small" && "right-2 top-6 w-4 h-4"
          )}
          size="20"
        />
      )}
    </div>
  );
};

export default UserAvatar;
