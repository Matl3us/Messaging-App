import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isUserAdmin } from "@/lib/jwt";
import { db } from "@/lib/db";

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

  const { conversationId, name } = reqData;
  console.log(conversationId);
  console.log(name);
  
  
  if (!conversationId || !name) {
    return new NextResponse("Invalid body data.", {
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

  try {
    await db.conversation.update({
      data: {
        name
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
