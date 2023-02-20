import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

import type { SignupFormData } from "../../../../lib/typeDefinitions";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const salt = bcrypt.genSaltSync();
  const { username, email, password, accessKeyValue }: SignupFormData =
    req.body;

  let user;

  // Attempt to create a user (and fail if the user/email already exists)
  try {
    const accessKey = await prisma.accessKey.findUnique({
      where: {
        keyValue: accessKeyValue,
      },
      include: {
        User: true,
      },
    });
    if (accessKey) {
      if (accessKey.expiresOn?.getTime() < new Date().getTime()) {
        res.status(401);
        res.json({
          error:
            "Access Key has already expired on : " +
            accessKey.expiresOn?.toDateString(),
        });
        return;
      } else {
        if (accessKey.User) {
          res.status(401);
          res.json({
            error: "Access Key has already been claimed by another user",
          });
          return;
        } else {
          user = await prisma.user.create({
            data: {
              username,
              email,
              password: bcrypt.hashSync(password, salt),
              accessKey: {
                connect: {
                  id: accessKey.id,
                },
              },
            },
          });
        }
      }
    } else {
      res.status(401);
      res.json({
        error: "Access key doesn't exist",
      });
      return;
    }
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
