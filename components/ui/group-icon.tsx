import { cn } from "@/lib/utils";
import Image from "next/image";

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

interface GroupIconProps {
  members: Array<UserData>;
  size: "small" | "large";
}

const GroupIcon = ({ members, size }: GroupIconProps) => {
  const imageSize = size === "small" ? 26 : 48;

  if (members.length < 3) {
    return (
      <div className={cn("w-[64px]", size === "small" && "w-[32px]")}>
        <Image
          className={cn(
            "rounded-lg border border-background-700 relative top-2 left-[12px]",
            size === "small" && "top-1 left-[6px]"
          )}
          src={members[0].imageUrl}
          placeholder="empty"
          alt="Avatar"
          width={imageSize}
          height={imageSize}
          unoptimized
        />
        <Image
          className={cn(
            "rounded-lg border border-background-700 relative bottom-2 right-[12px]",
            size === "small" && "bottom-1 right-[6px]"
          )}
          src={members[1].imageUrl}
          placeholder="empty"
          alt="Avatar"
          width={imageSize}
          height={imageSize}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={cn("w-[64px]", size === "small" && "w-[32px] h-[56px]")}>
      <Image
        className={cn(
          "rounded-lg border border-background-700 relative top-2 left-[12px]",
          size === "small" && "top-1 left-[6px]"
        )}
        src={members[0].imageUrl}
        placeholder="empty"
        alt="Avatar"
        width={imageSize}
        height={imageSize}
        unoptimized
      />
      <Image
        className={cn(
          "rounded-lg border border-background-700 relative bottom-2 right-[12px]",
          size === "small" && "bottom-1 right-[6px]"
        )}
        src={members[1].imageUrl}
        placeholder="empty"
        alt="Avatar"
        width={imageSize}
        height={imageSize}
        unoptimized
      />
      <p
        className={cn(
          "text-sm relative w-8 text-center -top-[38px] left-[38px] rounded-lg border-2 border-dashed border-background-200 text-background-200 font-semibold",
          size === "small" && "w-5 text-xs -top-[22px] left-[18px]"
        )}
      >
        +{members.length - 2}
      </p>
    </div>
  );
};

export default GroupIcon;
