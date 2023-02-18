import AWS from "aws-sdk";

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData, AssetDownloadData } from "lib/typeDefinitions";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "lib/s3-client";

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
  const assetKey: string = req.body.assetKey;

  const signedUrlExpireSeconds = 60 * 300; // your expiry time in seconds.

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
}
