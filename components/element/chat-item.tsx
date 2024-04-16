"use client";

import { User } from "@prisma/client";

import Image from "next/image";

interface ChatItemProps {
  id: string;
  userId: string;
  content: string;
  member: User;
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
      <div className="relative flex justify-end items-center p-2 mb-2">
        <div className="flex flex-row-reverse gap-x-2 items-center">
          <Image
            className="rounded-lg"
            src={member.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="26"
            height="26"
            unoptimized
          />
          <div className="flex flex-col w-full">
            <div className="py-1 px-3 rounded-xl text-sm text-primary-50 bg-primary-600 hover:bg-primary-700">
              {content}
            </div>
            <p className="absolute top-10 right-[42px] text-[10px] text-background-600">
              {timestamp}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center p-2 mb-2">
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
          <p className="absolute top-[52px] text-[10px] text-background-600">
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
