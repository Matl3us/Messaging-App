import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
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
    const user = await getUserData(token);
    const friend = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user || !friend || user.id == friend.id) {
      return new NextResponse("Invalid request.", {
        status: 400,
      });
    }

    await db.conversation.create({
      data: {
        isGroup: false,
        adminId: user.id,
        members: {
          connect: [
            {
              id: friend.id,
            },
            { id: user.id },
          ],
        },
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
