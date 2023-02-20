import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData, AssetDownloadData } from "lib/typeDefinitions";
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";
import { Session } from "next-auth";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    if (req.method === "POST") {
      await handlePOST(res, req, session);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// POST /api/user
async function handlePOST(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  const assetId: string = req.body;
  let asset;

  try {
    asset = await prisma.asset.findUnique({
      where: {
        id: assetId,
      },
      include: {
        assetDownloads: {
          include: {
            uploader: {
              select: {
                username: true,
              },
            },
          },
        },
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
