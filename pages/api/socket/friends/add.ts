import { db } from "@/lib/db";
import { getUserData } from "@/lib/jwt";
import { NextApiResponseServerIO } from "@/types";

import { NextApiRequest } from "next";

type FriendItem = {
  id: string;
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const token = req.cookies.token as string;
  const id = req.query.id as string;

  if (!id || !token) {
    return res.status(400).json({ msg: "Invalid request." });
  }

  try {
    const receiver = await getUserData(token);
    if (!receiver) {
      return res.status(400).json({ msg: "Invalid request." });
    }

    const request = await db.friendRequest.findUnique({
      where: {
        id,
        receiverId: receiver.id,
      },
      select: {
        id: true,
        senderId: true,
        receiver: true,
      },
    });
    if (!request) {
      return res.status(400).json({ msg: "Invalid request." });
    }

    await db.friendRequest.update({
      data: {
        status: "ACCEPTED",
      },
      where: {
        id,
      },
    });

    const friendItem = {
      id: id,
      user: {
        id: request.receiver.id,
        username: request.receiver.username,
        imageUrl: request.receiver.imageUrl,
      },
    } as FriendItem;
    const friendAddKey = `user:${request.senderId}:friend:add`;
    res?.socket?.server?.io?.emit(friendAddKey, friendItem);

    return res.status(200).json({
      msg: "Success",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ msg: "Internal Error" });
  }
}
