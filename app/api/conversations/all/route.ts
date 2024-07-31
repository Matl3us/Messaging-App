import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

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
    const conversationsList = await db.conversation.findMany({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        isGroup: true,
        adminId: true,
        members: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            status: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
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
        },
      },
    });

    return NextResponse.json(conversationsList);
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
