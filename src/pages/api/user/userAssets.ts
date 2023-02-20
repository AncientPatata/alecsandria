import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { options } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);
  if (!session) {
    res.status(401).json({ error: "You must be logged in." });
    return;
  }
  if (req.method === "GET") {
    await handleGET(res, req, session);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/user
async function handleGET(
  res: NextApiResponse,
  req: NextApiRequest,
  session: Session
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      include: {
        uploads: true,
      },
    });

    const downloads = await prisma.userAssetDownloads.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        asset: true,
      },
    });
    const cachedAssoc = {};
    if (user && downloads) {
      res.status(200).json({
        uploads: user.uploads,
        downloads: downloads.map((download) => download.asset),
      });
    } else {
      res.status(401).json({ error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Server error while retrieving the user" });
  }
}
