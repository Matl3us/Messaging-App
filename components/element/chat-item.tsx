"use client";
import Image from "next/image";

interface UserItem {
  id: string;
  username: string;
  imageUrl: string;
}

interface ChatItemProps {
  id: string;
  userId: string;
  content: string;
  member: UserItem;
  timestamp: string;
  fileUrl: string | null;
  socketUrl: string;
}

const ChatItem = ({
  id,
  userId,
  content,
  member,
  timestamp,
  fileUrl,
  socketUrl,
}: ChatItemProps) => {
  if (userId === member.id) {
    return (
      <div className="relative flex justify-end p-2 mb-2">
        <div className="flex flex-col">
          <div className="flex flex-row-reverse gap-x-2 items-end">
            <Image
              className="rounded-lg relative -top-1"
              src={member.imageUrl}
              placeholder="empty"
              alt="Avatar"
              width="26"
              height="26"
              unoptimized
            />
            <div className="max-w-[650px]">
              {fileUrl ? (
                <a target="_blank" href={fileUrl} rel="noopener noreferrer">
                  <img
                    src={fileUrl}
                    alt="message image"
                    className="object-fill rounded-md"
                  />
                </a>
              ) : (
                <div className="py-1 px-3 rounded-xl text-sm text-primary-50 bg-primary-600 hover:bg-primary-700">
                  {content}
                </div>
              )}
            </div>
          </div>
          <p className="self-end relative text-[11px] text-background-600">
            {timestamp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center p-2 mb-2">
      <div className="flex flex-col">
        <div className="flex gap-x-2 items-end">
          <Image
            className="rounded-lg relative -top-1"
            src={member.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="26"
            height="26"
            unoptimized
          />
          <div className="max-w-[650px]">
            <div className="text-xs text-background-500 mb-1">
              {member.username}
            </div>
            {fileUrl ? (
              <a target="_blank" href={fileUrl} rel="noopener noreferrer">
                <img
                  src={fileUrl}
                  alt="message image"
                  className="object-fill rounded-md"
                />
              </a>
            ) : (
              <div className="py-1 px-3 rounded-xl text-sm text-background-100 bg-background-800 hover:bg-background-900">
                {content}
              </div>
            )}
          </div>
        </div>
        <p className="self-start relative text-[11px] text-background-600">
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
