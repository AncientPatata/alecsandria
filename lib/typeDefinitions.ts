export type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

export type SigninFormData = {
  username: string;
  password: string;
};

export type AssetData = {
  assetName: string;
  assetDescription: string;
  assetEngine: string;
  assetTags: string[];
  assetPreviews: string[];
  assetDownloads: AssetDownloadData[];
};

export type AssetDownloadData = {
  downloadOrigin: string;
  assetEngineVersion: string;
  assetVersion: string;
  downloadLink: string;
};
