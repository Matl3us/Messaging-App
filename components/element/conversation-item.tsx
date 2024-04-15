import Image from "next/image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ConvItemProps {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<UserItemProps>;
  lastMessage?: MessageItem;
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
}

const ConversationItem = ({
  id,
  name,
  isGroup,
  members,
  lastMessage,
}: ConvItemProps) => {
  const router = useRouter();

  let info;
  if (!lastMessage) {
    info = "Start a conversation";
  } else {
    if (lastMessage.content.length > 26) {
      const message = `${lastMessage.content.slice(0, 22)}...`;
      info = `User: ${message} - ${format(
        new Date(lastMessage.createdAt),
        DATE_FORMAT
      )}`;
    } else {
      info = `User: ${lastMessage.content} - ${format(
        new Date(lastMessage.createdAt),
        DATE_FORMAT
      )}`;
    }
  }

  return (
    <div
      className="flex items-center justify-between bg-background-800 hover:bg-background-700 rounded-md p-2"
      onClick={() => router.push(`/conversations/${id}`)}
    >
      <div className="flex items-center gap-4">
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
            src={members[0]?.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="32"
            height="32"
            unoptimized
          />
        )}
        <div className="pb-1">
          {name ? (
            <p className="text-background-50 text-sm">{name}</p>
          ) : (
            <p className="text-background-50 text-sm">{members[0]?.username}</p>
          )}
          <div className="text-xs font-semibold text-background-500">
            <div>{info}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;

/*
 ) : (
              <div>
                User: {} -{" "}
                {format(new Date(lastMessage.createdAt), DATE_FORMAT)}
              </div>
            )}
            */
