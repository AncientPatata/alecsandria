import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData } from "lib/typeDefinitions";

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
  const assetData: AssetData = req.body;
  let asset;

  try {
    asset = await prisma.asset.create({
      data: {
        assetName: assetData.assetName,
        assetEngine: assetData.assetEngine,
        assetDescription: assetData.assetDescription,
        assetTags: assetData.assetTags,
        assetPreviews: assetData.assetPreviews,
        assetDownloads: assetData.assetDownloads,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: "Asset already exists",
    });
    return;
  }
}
