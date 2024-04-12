"use client";

interface IParams {
  conversationId: string;
}

const Conversation = ({ params }: { params: IParams }) => {
  const { conversationId } = params;

  return <p>Current id: {conversationId}</p>;
};

export default Conversation;
