import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData, AssetDownloadData } from "lib/typeDefinitions";

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
  const assetId: string = req.body;
  let asset;

  try {
    asset = await prisma.asset.findUnique({
      where: {
        id: assetId,
      },
      include: {
        assetDownloads: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: "Asset not found",
    });
    return;
  }

  if (asset) {
    res.status(200);
    res.json(asset.assetDownloads);
  }
}
