import { db } from "@/lib/db";
import { getUserData } from "@/lib/jwt";
import { NextApiResponseServerIO } from "@/types";

import { NextApiRequest } from "next";

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
    const sender = await getUserData(token);
    if (!sender) {
      return res.status(400).json({ msg: "Invalid request." });
    }

    const request = await db.friendRequest.findUnique({
      where: {
        id,
        senderId: sender.id,
      },
    });
    if (!request) {
      return res.status(400).json({ msg: "Invalid request." });
    }

    await db.friendRequest.update({
      data: {
        status: "CANCELED",
      },
      where: {
        id,
      },
    });

    const notificationRemoveKey = `user:${request.receiverId}:notification:remove`;
    res?.socket?.server?.io?.emit(notificationRemoveKey, id);

    return res.status(200).json({
      msg: "Success",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ msg: "Internal Error" });
  }
}
