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
  const { friendCode } = req.body;

  if (!friendCode) {
    return res.status(400).json({ msg: "Invalid body data" });
  }

  try {
    const sender = await getUserData(token);
    const receiver = await db.user.findUnique({
      where: {
        friendCode,
      },
    });
    if (!sender || !receiver || receiver.id == sender.id) {
      return res.status(400).json({ msg: "Invalid request" });
    }

    await db.friendRequest.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        status: "PENDING",
      },
    });

    const conversationKey = `user:${receiver.id}:notification`;
    console.log("Sent: " + conversationKey);

    res?.socket?.server?.io?.emit(conversationKey);

    return res.status(200).json({ msg: "Invite sent" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ msg: "Internal Error" });
  }
}
