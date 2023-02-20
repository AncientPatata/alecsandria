import AWS from "aws-sdk";

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData, AssetDownloadData } from "lib/typeDefinitions";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "lib/s3-client";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]";

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
  }
}

// POST /api/user
async function handlePOST(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  const assetKey: string = req.body.assetKey;
  const assetId: string = req.body.assetId;

  const signedUrlExpireSeconds = 60 * 500; // your expiry time in seconds.
  try {
    await prisma.userAssetDownloads.create({
      data: {
        user: {
          connect: {
            id: session.user?.id,
          },
        },
        asset: {
          connect: {
            id: assetId,
          },
        },
      },
    });

    const assetURL = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.DIGITAL_OCEAN_BUCKET_NAME,
        Key: assetKey,
      }),
      { expiresIn: signedUrlExpireSeconds }
    );

    res.status(200);
    res.json({
      downloadURL: assetURL,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: "Failed to generate download link",
    });
  }
}
