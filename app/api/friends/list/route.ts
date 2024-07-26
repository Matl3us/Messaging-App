import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

interface FriendItem {
  id: string;
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;
  const user = await getUserData(token);

  if (!user) {
    return new NextResponse("Invalid request.", {
      status: 400,
    });
  }

  try {
    const sentPart = await db.friendRequest.findMany({
      where: {
        senderId: user.id,
        status: "ACCEPTED",
      },
      select: {
        id: true,
        receiver: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    const receivedPart = await db.friendRequest.findMany({
      where: {
        receiverId: user.id,
        status: "ACCEPTED",
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    let friendsList: Array<FriendItem> = [];
    friendsList = [
      ...sentPart.map((e) => ({
        id: e.id,
        user: {
          id: e.receiver.id,
          username: e.receiver.username,
          imageUrl: e.receiver.imageUrl,
        },
      })),
      ...receivedPart.map((e) => ({
        id: e.id,
        user: {
          id: e.sender.id,
          username: e.sender.username,
          imageUrl: e.sender.imageUrl,
        },
      })),
    ];
    return NextResponse.json(friendsList);
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
