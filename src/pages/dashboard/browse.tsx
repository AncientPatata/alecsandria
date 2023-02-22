import { Box, Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import AssetBrowser from "components/assetBrowser";
import DashboardLayout from "components/dashboardLayout";
import SearchBar from "components/searchBar";
import { getAssets } from "lib/asset";
import { useState } from "react";

function Browse(props) {
  const { data: assets, status, error } = useQuery(["assets"], getAssets);
  const [subdata, setSubdata] = useState(0);
  const updateAssetList = (newSubdata) => {
    console.log(assets.map((item) => item.id));
    setSubdata(
      assets.filter((el) => {
        return newSubdata.some((f) => {
          return f.id === el.id;
        });
      })
    );
    console.log(subdata);
  };
  if (status === "error") {
    return <Box {...props}>{error}</Box>;
  }
  if (status === "loading") {
    return <Skeleton />;
  }
  return (
    <Box {...props} height="95vh">
      <SearchBar data={assets} setSubdata={updateAssetList} />
      <AssetBrowser assets={subdata === 0 ? assets : subdata} status={status} />
    </Box>
  );
}

Browse.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Browse;
