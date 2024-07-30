import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserData } from "@/lib/jwt";
import { db } from "@/lib/db";

enum Status {
  Online,
  Away,
  DontDisturb,
  Offline,
}

export async function PUT(req: Request) {
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

  const { status } = reqData;
  try {
    const user = await getUserData(token);

    if (!user) {
      return new NextResponse("Invalid user.", {
        status: 400,
      });
    }

    switch (status) {
      case Status.Online:
        await db.user.update({
          data: {
            status: "ONLINE",
          },
          where: {
            id: user.id,
          },
        });
        break;
      case Status.Away:
        await db.user.update({
          data: {
            status: "AWAY",
          },
          where: {
            id: user.id,
          },
        });
        break;
      case Status.DontDisturb:
        await db.user.update({
          data: {
            status: "DONTDISTURB",
          },
          where: {
            id: user.id,
          },
        });
        break;
      case Status.Offline:
        await db.user.update({
          data: {
            status: "OFFLINE",
          },
          where: {
            id: user.id,
          },
        });
        break;
      default:
        return new NextResponse("Invalid status.", {
          status: 400,
        });
    }

    return NextResponse.json(
      { msg: "Changed status" },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Invalid token.", {
      status: 400,
    });
  }
}
