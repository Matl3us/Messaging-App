"use client";

import { SocketIndicator } from "@/components/ui/socket-indicator";
import ChatInput from "@/components/element/chat-input";
import ChatMessages from "@/components/element/chat-messages";

interface IParams {
  conversationId: string;
}

const Conversation = ({ params }: { params: IParams }) => {
  const { conversationId } = params;

  return (
    <div className="flex flex-col gap-2 items-center h-full p-6 bg-background-950">
      <div className="self-start">
        <SocketIndicator />
      </div>
      <ChatMessages
        name="Name"
        conversationId={conversationId}
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
      />
      <ChatInput conversationID={conversationId} />
    </div>
  );
};

export default Conversation;
