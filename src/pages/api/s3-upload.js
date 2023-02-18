import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  accessKeyId: process.env.DIGITAL_OCEAN_SPACES_KEY,
  secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET,
  bucket: process.env.DIGITAL_OCEAN_BUCKET_NAME,
  region: process.env.DIGITAL_OCEAN_SPACES_REGION,
  endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
  key(req, filename) {
    const { assetName, assetVersion, assetEngine, engineVersion } = req.body;
    return `assets/${assetEngine}/${engineVersion}/${assetName}/${assetVersion}/${filename}`;
  },
});
