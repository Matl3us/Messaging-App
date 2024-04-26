import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 15;

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const conversationId = searchParams.get("conversationId");

  try {
    const user = await getUserData(token);

    if (!user) {
      return new NextResponse("Invalid user.", {
        status: 400,
      });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID missing.", {
        status: 400,
      });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal error.", {
      status: 500,
    });
  }
}
