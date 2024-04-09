import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getJwtPayload } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;
  const user = await getJwtPayload(token);

  if (!user) {
    return new NextResponse("Invalid request.", {
      status: 400,
    });
  }

  try {
    const invitesList = await db.friendRequest.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
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

    return NextResponse.json(invitesList);
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
        status: "REJECTED",
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
