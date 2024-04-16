import Image from "next/image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ConvItemProps {
  id: string;
  name?: string;
  isGroup: boolean;
  memberId: string;
  members: Array<UserItemProps>;
  lastMessage?: MessageItem | undefined;
}

interface UserItemProps {
  id: string;
  username: string;
  imageUrl: string;
}

interface MessageItem {
  id: string;
  content: string;
  fileUrl: string;
  createdAt: Date;
  member: UserItemProps;
}

const createInfoText = (memberId: string, lastMessage?: MessageItem) => {
  if (!lastMessage) {
    return "Start a conversation!";
  }

  let info =
    lastMessage.member.id === memberId ? "You" : lastMessage.member.username;
  info += ` - ${lastMessage.content}`;

  if (info.length > 31) {
    info = `${info.slice(0, 28)}...\n`;
  }

  return info;
};

const ConversationItem = ({
  id,
  name,
  isGroup,
  memberId,
  members,
  lastMessage,
}: ConvItemProps) => {
  const router = useRouter();
  const info = createInfoText(memberId, lastMessage);
  const otherUsers = members.filter((member) => member.id !== memberId);

  return (
    <div
      className="cursor-pointer flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md px-3 py-2"
      onClick={() => router.push(`/conversations/${id}`)}
    >
      <div className="flex items-center gap-3">
        {isGroup ? (
          <Image
            className="rounded-lg"
            src="https://ui-avatars.com/api/?background=random&color=fff&name=user"
            placeholder="empty"
            alt="Avatar"
            width="32"
            height="32"
            unoptimized
          />
        ) : (
          <Image
            className="rounded-lg"
            src={otherUsers[0]?.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="32"
            height="32"
            unoptimized
          />
        )}
        <div className="pb-1 font-semibold">
          {name ? (
            <p className="text-background-50 text-sm">{name}</p>
          ) : (
            <p className="text-background-50 text-sm">
              {otherUsers[0]?.username}
            </p>
          )}
          <div className="text-xs text-background-500">
            <div className="text-[12px]">{info}</div>
            {lastMessage && (
              <p className="text-background-600 text-[10px]">
                {format(new Date(lastMessage.createdAt), DATE_FORMAT)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
