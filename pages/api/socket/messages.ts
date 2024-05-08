"use server";

import { db } from "@/lib/db";
import { getUserData } from "@/lib/jwt";
import { NextApiResponseServerIO } from "@/types";

import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const token = req.cookies.token!;
  try {
    const user = await getUserData(token);

    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(401).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(401).json({ error: "Content missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        members: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    const member = conversation.members.find((member) => member.id === user.id);
    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: user.id,
      },
      include: {
        member: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    const conversationKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(conversationKey, message);

    for (let mem of conversation.members) {
      const messageKey = `user:${mem.id}:received:message`;
      res?.socket?.server?.io?.emit(messageKey);
    }

    return res.status(200).json({ msg: "Message sent" });
  } catch (error) {
    console.log("[MESSAGE_POST]", error);
    return res.status(500).json({ msg: "Internal Error" });
  }
}
