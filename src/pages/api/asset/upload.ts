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
}

// POST /api/user
async function handlePOST(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  const assetData: AssetData = req.body.assetData;
  const assetDownloadData: AssetDownloadData = req.body.assetDownloadData;
  try {
    prisma.assetDownload
      .create({
        data: {
          Asset: {
            connect: {
              id: assetData.id,
            },
          },
          assetVersion: assetDownloadData.assetVersion,
          assetEngineVersion: assetDownloadData.assetEngineVersion,
          downloadOrigin: assetDownloadData.downloadOrigin,
          downloadLink: assetDownloadData.downloadLink,
          uploader: {
            connect: {
              id: session.user?.id,
            },
          },
        },
      })
      .then((assetDownload) => {
        prisma.asset.update({
          where: {
            id: assetData.id,
          },
          data: {
            assetDownloads: {
              connect: {
                id: assetDownload.id,
              },
            },
          },
        });
      });
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Failed to create a new asset download" });
  }
}
