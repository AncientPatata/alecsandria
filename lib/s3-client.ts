import { S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
  s3ForcePathStyle: false,
  endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
  s3BucketEndpoint: false,
  region: "fra1",
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_SPACES_KEY,
    secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET,
  },
});

export { s3Client };
