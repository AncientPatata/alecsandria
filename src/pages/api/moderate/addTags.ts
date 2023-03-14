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
  const { engineName, newTag } = req.body;
  try {
    prisma.engine
      .update({
        where: {
          assetEngine: engineName,
        },
        data: {
          engineAssetTags: {
            push: newTag,
          },
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
