"use client";

import { Input } from "@/components/ui/input";

import { Smile } from "lucide-react";
import { SendHorizonal } from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState } from "react";

interface IParams {
  conversationId: string;
}

const Conversation = ({ params }: { params: IParams }) => {
  const { conversationId } = params;
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState("");

  const changeInputState = () => {
    if (opened) {
      setOpened(false);
    } else {
      setOpened(true);
    }
  };

  const addEmote = (emote: any) => {
    setMessage(message + emote.native);
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-end p-6 h-screen bg-background-950">
      {opened && (
        <Picker
          data={data}
          perLine="8"
          skinTonePosition="none"
          previewPosition="none"
          onEmojiSelect={addEmote}
        />
      )}
      <div className="flex items-center">
        <Input
          className="w-[550px] text-base dark:bg-background-800"
          placeholder={`Write to @user`}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <div className="relative right-[72px] flex gap-3">
          <button className="hover:text-primary-700 text-primary-600 rounded-lg ">
            <Smile size="24" onClick={() => changeInputState()} />
          </button>
          <button className="hover:text-primary-700 text-primary-600 rounded-lg">
            <SendHorizonal size="24" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
