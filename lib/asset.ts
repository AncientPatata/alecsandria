import { AssetData, AssetDownloadData } from "./typeDefinitions";

// @ts-ignore
const createAsset = (assetData) => {
  // @ts-ignore
  const asset = fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/asset/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetData),
  }).then((res) => res.json());

  if (asset) {
    return asset;
  } else {
    return null;
  }
};

// Need filtering
const getAssets = () => {
  const assets = fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/asset/search`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      return null;
    });

  if (assets) {
    return assets;
  } else {
    return null;
  }
};

const uploadAssetFile = (
  assetData: AssetData,
  assetDownloadData: AssetDownloadData
) => {
  // @ts-ignore
  const asset = fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/asset/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assetData: assetData,
      assetDownloadData: assetDownloadData,
    }),
  })
    .then((res) => res.json())
    .then();

  if (asset) {
    return asset;
  } else {
    return null;
  }
};

const getAssetDownloads = (assetId: string) => {
  const assetDownloads = fetch(
    `${process.env.NEXT_PUBLIC_WEBURL}/api/asset/download`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetId),
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return assetDownloads;
};

const addNewEngine = (engineName: string) => {
  const assetDownloads = fetch(
    `${process.env.NEXT_PUBLIC_WEBURL}/api/moderate/engine`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ engineName: engineName }),
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return assetDownloads;
};

const getEngines = () => {
  const assetDownloads = fetch(
    `${process.env.NEXT_PUBLIC_WEBURL}/api/moderate/engine`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return assetDownloads;
};

const addNewEngineTag = (engineName: string, newTag: string) => {
  const res = fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/moderate/addTags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ engineName: engineName, newTag: newTag }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return res;
};

const unrealAssetTags = [
  "2D",
  "3D",
  "Tools",
  "Art",
  "Textures",
  "Materials",
  "Animations",
  "Code Plugins",
  "Blueprints",
];

const unityAssetTags = unrealAssetTags;

const assetTags = {
  "Unreal Engine": unrealAssetTags,
  Unity: unityAssetTags,
};

const engines = ["Unreal Engine", "Unity"];

export {
  createAsset,
  addNewEngine,
  getEngines,
  addNewEngineTag,
  assetTags,
  engines,
  getAssets,
  uploadAssetFile,
  getAssetDownloads,
};
