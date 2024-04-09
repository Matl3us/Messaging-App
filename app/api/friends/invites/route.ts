import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getJwtPayload } from "@/lib/jwt";
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

  const { friendCode } = reqData;
  if (!friendCode) {
    return NextResponse.json("Invalid body data.", {
      status: 400,
    });
  }

  try {
    const sender = await getJwtPayload(token);
    const receiver = await db.user.findUnique({
      where: {
        friendCode,
      },
    });
    if (!sender || !receiver || receiver.id == sender.id) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    await db.friendRequest.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        status: "PENDING",
      },
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

export async function PUT(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Invalid request.", {
      status: 400,
    });
  }

  try {
    const receiver = await getJwtPayload(token);
    if (!receiver) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    const request = await db.friendRequest.findUnique({
      where: {
        id,
        receiverId: receiver.id,
      },
    });
    if (!request) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    await db.friendRequest.update({
      data: {
        status: "ACCEPTED",
      },
      where: {
        id,
      },
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
