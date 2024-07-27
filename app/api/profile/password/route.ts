import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/db";

import bcrypt from "bcrypt";

const SECRET = process.env.SECRET!;

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

  const { oldPassword, newPassword } = reqData;

  if (!oldPassword || !newPassword) {
    return new NextResponse("Body data missing.", {
      status: 400,
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    const user = await db.user.findFirst({
      where: {
        id: decoded.sub,
        username: decoded.username,
      },
    });

    if (!user) {
      return new NextResponse("Invalid user.", {
        status: 400,
      });
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return new NextResponse("Invalid password.", {
        status: 401,
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await db.user.update({
      data: {
        password: passwordHash,
      },
      where: {
        id: user.id,
      },
    });

    return NextResponse.json(
      { msg: "Password updated" },
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
