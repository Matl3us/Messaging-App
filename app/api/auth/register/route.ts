import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import ShortUniqueId from "short-unique-id";

import { db } from "@/lib/db";
import { registerSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  let reqData;
  try {
    reqData = await req.json();
  } catch (err) {
    return new NextResponse("Invalid body data.", {
      status: 400,
    });
  }

  const result = registerSchema.safeParse(reqData);
  if (!result.success) {
    return NextResponse.json(result.error.formErrors.fieldErrors, {
      status: 400,
    });
  }

  const { email, username, password, confPassword } = reqData;
  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user) {
      return new NextResponse("Username and email must be unique.", {
        status: 400,
      });
    }

    if (password !== confPassword) {
      return new NextResponse("Passwords must match.", {
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal server error.", {
      status: 500,
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const uid = new ShortUniqueId({ length: 10 });

  await db.user.create({
    data: {
      username,
      email,
      password: passwordHash,
      imageUrl: `https://ui-avatars.com/api/?background=random&color=fff&name=${username}`,
      friendCode: uid.rnd(),
    },
  });

  return NextResponse.json({ msg: "Success" });
}
