import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";

import { omit } from "lodash";
import { AssetData } from "lib/typeDefinitions";
import { Session } from "next-auth";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  // TODO : MESS CLEAN UP PERMISSIONS !!
  if (req.method === "POST") {
    if (session) {
      if (session.user?.roles?.includes("Mod")) {
        await handlePOST(res, req, session);
      } else {
        res.status(401).json({ error: "Not Authorized" });
      }
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } else if (req.method === "GET") {
    await handleGET(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

async function handleGET(res: NextApiResponse, req: NextApiRequest) {
  try {
    prisma.engine.findMany().then((engines) => {
      res.status(200);
      res.json(engines);
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: "Asset already exists",
    });
    return;
  }
}

// POST /api/user
async function handlePOST(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  const { engineName } = req.body;
  try {
    prisma.engine
      .create({
        data: {
          assetEngine: engineName,
          engineAssetTags: [],
        },
      })
      .then((engine) => res.status(200).json(engine));
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: e,
    });
    return;
  }
}
