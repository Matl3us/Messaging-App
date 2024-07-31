import { useRouter } from "next/navigation";

import { format } from "date-fns";
import GroupIcon from "../ui/group-icon";
import UserAvatar from "./user-avatar";

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
  status: "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";
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
      className="cursor-pointer flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md px-4 py-2"
      onClick={() => router.push(`/conversations/${id}`)}
    >
      <div className="flex items-center gap-4">
        {isGroup ? (
          <GroupIcon members={members} size="small" />
        ) : (
          <UserAvatar
            imageUrl={otherUsers[0]?.imageUrl}
            status={otherUsers[0]?.status}
            size="small"
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
