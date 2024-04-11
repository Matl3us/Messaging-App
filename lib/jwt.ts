import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/lib/db";

const secret = process.env.SECRET!;

export const getUserData = async (token: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;

  const user = await db.user.findFirst({
    where: {
      id: decoded.sub,
      username: decoded.username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      imageUrl: true,
      friendCode: true,
    },
  });

  return user;
};

export const isUserAdmin = async (token: string, conversationId: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;

  const conversation = await db.conversation.findFirst({
    where: {
      admin: {
        id: decoded.sub,
        username: decoded.username,
      },
      id: conversationId,
      isGroup: true,
    },
  });

  if (conversation) {
    return true;
  } else {
    return false;
  }
};
