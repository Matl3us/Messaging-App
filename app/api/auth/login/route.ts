import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "@/lib/db";
import { loginSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  let reqData;
  try {
    reqData = await req.json();
  } catch (err) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  const result = loginSchema.safeParse(reqData);
  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const { email, password } = reqData;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      return new NextResponse("Invalid email or password.", {
        status: 400,
      });
    }

    const secret = process.env.SECRET!;

    const token = jwt.sign({ sub: user.id, username: user.username }, secret, {
      expiresIn: 60 * 60,
    });

    const response = NextResponse.json({
      msg: "Success",
    });

    response.cookies.set({
      name: "token",
      value: token,
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }
}
