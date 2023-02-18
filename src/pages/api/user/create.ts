import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

import type { SignupFormData } from "../../../../lib/typeDefinitions";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const salt = bcrypt.genSaltSync();
  const { username, email, password }: SignupFormData = req.body;

  let user;

  // Attempt to create a user (and fail if the user/email already exists)
  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: "User already exists",
    });
    return;
  }

  const returnObject = {
    username: user.username,
    email: user.email,
    emailVerified: user?.emailVerified,
  };
  console.log(returnObject);
  res.json(returnObject);
};

export default handle;
