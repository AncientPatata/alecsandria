import { Box, Skeleton, Button, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import AssetBrowser from "components/assetBrowser";
import DashboardLayout from "components/dashboardLayout";
import NewAssetModal from "components/newAssetModal";
import SearchBar from "components/searchBar";
import { getAssets } from "lib/asset";
import { useState } from "react";

function Browse(props) {
  const {
    isOpen: isNewAssetOpen,
    onOpen: onNewAssetOpen,
    onClose: onNewAssetClose,
  } = useDisclosure();
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
    <Box {...props} height="93vh">
      <SearchBar
        data={assets}
        setSubdata={updateAssetList}
        fontFamily="opensans"
        height="50px"
        mt="20px"
        mb="50px"
      >
        <Button
          onClick={onNewAssetOpen}
          ml="5px"
          height="100%"
          rounded="none"
          backgroundColor="gray.100"
          _hover={{
            backgroundColor: "mustard.100",
          }}
        >
          New Asset
        </Button>
      </SearchBar>
      <AssetBrowser
        fontFamily="opensans"
        assets={subdata === 0 ? assets : subdata}
        status={status}
        ml="25px"
        mr="25px"
      />
      <NewAssetModal
        isOpen={isNewAssetOpen}
        onClose={onNewAssetClose}
        size="full"
      />
    </Box>
  );
}

Browse.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Browse;
