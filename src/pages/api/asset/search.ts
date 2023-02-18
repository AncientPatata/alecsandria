import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData } from "lib/typeDefinitions";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGET(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/user
async function handleGET(res: NextApiResponse, req: NextApiRequest) {
  try {
    prisma.asset.findMany().then((assets) => {
      res.status(200);
      res.json(assets);
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
