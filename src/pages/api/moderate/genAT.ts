import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";

import { AssetData, AssetDownloadData } from "lib/typeDefinitions";
import { Session } from "next-auth";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    if (session.user?.roles?.includes("Mod")) {
      if (req.method === "POST") {
        await handlePOST(res, req, session);
      } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
      }
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } else {
    res.status(401).json({ error: "Not Authorized" });
  }
}

// POST /api/user
async function handlePOST(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  const { tokenAmount, tokenDate } = req.body;
  let tokens = [];
  try {
    for (let i = 0; i < tokenAmount; i++) {
      let token = Math.random().toString(36).substring(2, 7);
      tokens.push(token);
      await prisma.accessKey.create({
        data: {
          keyValue: token,
          expiresOn: new Date(tokenDate),
        },
      });
    }
    console.log(tokens);
    res.status(200).json({ generatedTokens: tokens });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
