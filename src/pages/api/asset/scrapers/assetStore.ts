import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { omit } from "lodash";
import { AssetData, AssetDownloadData } from "lib/typeDefinitions";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import { Session } from "next-auth";
import * as cheerio from "cheerio";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  if (true) {
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
  const assetStoreLink: string = req.body;
  let assetData;
  try {
    const page = await fetch(assetStoreLink).then((res) => res.text());
    const $ = cheerio.load(page);
    const node = $("head").find('script[type="application/ld+json"]').get(0);
    assetData = { data: JSON.parse(node?.children[0].data) };
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      error: "Asset not found",
    });
    return;
  }

  if (assetData) {
    res.status(200);
    res.json(assetData);
  }
}
