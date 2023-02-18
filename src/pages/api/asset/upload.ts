import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";

import { AssetData, AssetDownloadData } from "lib/typeDefinitions";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    console.log("ALL GOOD");
  } else {
    console.log("NOT AUTH");
  }
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
  const assetData: AssetData = req.body.assetData;
  const assetDownloadData: AssetDownloadData = req.body.assetDownloadData;
  try {
    prisma.assetDownload
      .create({
        data: {
          assetId: assetData.id,
          assetVersion: assetDownloadData.assetVersion,
          assetEngineVersion: assetDownloadData.assetEngineVersion,
          downloadOrigin: assetDownloadData.downloadOrigin,
          downloadLink: assetDownloadData.downloadLink,
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
  }
}
