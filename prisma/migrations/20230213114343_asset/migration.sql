-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "assetEngine" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetDescription" TEXT NOT NULL,
    "assetTags" TEXT[],
    "assetPreviews" TEXT[],

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetDownload" (
    "id" TEXT NOT NULL,
    "downloadOrigin" TEXT NOT NULL,
    "assetEngineVersion" TEXT NOT NULL,
    "assetVersion" TEXT NOT NULL,
    "downloadLink" TEXT NOT NULL,
    "assetId" TEXT,

    CONSTRAINT "AssetDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetName_key" ON "Asset"("assetName");

-- AddForeignKey
ALTER TABLE "AssetDownload" ADD CONSTRAINT "AssetDownload_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
