import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUserData, isUserAdmin } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  let reqData;
  try {
    reqData = await req.json();
  } catch (err) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  const { name } = reqData;
  try {
    const user = await getUserData(token);
    if (!user) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    const conversation = await db.conversation.create({
      data: {
        isGroup: true,
        name,
        adminId: user.id,
        members: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({
      msg: "Success",
      id: conversation.id,
    });
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  let reqData;
  try {
    reqData = await req.json();
  } catch (err) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  const { conversationId, userIds } = reqData;
  if (
    !conversationId ||
    !userIds ||
    !Array.isArray(userIds) ||
    userIds.length === 0
  ) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  if (userIds.length > 30) {
    return new NextResponse("Too many users added at once.", {
      status: 400,
    });
  }

  try {
    const isAdmin = await isUserAdmin(token, conversationId);
    if (!isAdmin) {
      return new NextResponse("User is not admin.", {
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }

  for (const userId of userIds) {
    if (userId) {
      try {
        await db.user.findUniqueOrThrow({
          where: {
            id: userId,
          },
        });
      } catch (err) {
        return new NextResponse("Invalid user.", {
          status: 400,
        });
      }
    }
  }

  const ids = userIds.map((e) => ({ id: e }));
  try {
    await db.conversation.update({
      data: {
        members: {
          connect: ids,
        },
      },
      where: { id: conversationId },
    });

    return NextResponse.json({
      msg: "Success",
    });
  } catch (err) {
    console.log(err);

    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
