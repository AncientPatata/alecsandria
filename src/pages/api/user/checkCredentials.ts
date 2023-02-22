import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { omit } from "lodash";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/user
async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      password: true,
      userRoles: true,
    },
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json(omit(user, "password"));
  } else {
    res.status(400).end("Invalid credentials");
  }
}
