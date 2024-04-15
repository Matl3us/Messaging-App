"use client";

import { User } from "@prisma/client";

import Image from "next/image";

interface ChatItemProps {
  id: string;
  content: string;
  member: User;
  timestamp: string;
  fileUrl: string | null;
  //currentMember: User;
  socketUrl: string;
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  // currentMember,
  socketUrl,
}: ChatItemProps) => {
  return (
    <div className="relative flex items-center p-2">
      <div className="flex gap-x-2 items-center">
        <Image
          className="rounded-lg relative top-2"
          src={member.imageUrl}
          placeholder="empty"
          alt="Avatar"
          width="26"
          height="26"
          unoptimized
        />
        <div className="flex flex-col w-full">
          <div className="text-xs text-background-500">{member.username}</div>
          <div className="py-1 px-3 rounded-xl text-sm text-background-100 bg-background-800 hover:bg-background-900">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
