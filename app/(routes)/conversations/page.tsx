"use client";

import { MailSearch } from "lucide-react";

const Conversations = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <MailSearch size="64" className="text-background-500" />
      <p className="text-background-500 font-bold">No conversations opened</p>
    </div>
  );
};

export default Conversations;
