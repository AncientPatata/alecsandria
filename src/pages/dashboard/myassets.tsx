import { useEffect, useState } from "react";

import {
  Box,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Center,
  Flex,
} from "@chakra-ui/react";
import { getUserAssets } from "lib/user";
import AssetPreviewModal from "../../../components/assetPreviewModal";
import { AssetData } from "lib/typeDefinitions";
import DashboardLayout from "components/dashboardLayout";
import { getAssets } from "lib/asset";
// @ts-ignore
function MyAssets(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [downloadedAssets, setDownloadedAssets] = useState<AssetData[]>([]);
  const [uploadedAssets, setUploadedAssets] = useState([]);
  //@ts-ignore
  let updater: (v: AssetData) => void = undefined;
  const setUpdater = (newUpdater: (v: AssetData) => void) => {
    // HACKY REACT BS PLEASE KILL ME FUCK MAN IM CRINGING
    updater = newUpdater;
  };
  const openAssetModal = (newAssetData: AssetData) => {
    if (updater) {
      updater(newAssetData);
    }
    onOpen();
  };

  useEffect(() => {
    getUserAssets()?.then((res) => {
      setDownloadedAssets(res.downloads);
      console.log(res);
      getAssets()?.then((assets) => {
        let augUploads = res.uploads.map((upload) => {
          const asset = assets.find((asset) => asset.id === upload.assetId);
          return {
            ...upload,
            ...asset,
          };
        });
        console.log(augUploads);
        setUploadedAssets(augUploads);
      });
    });
  }, []);
  return (
    <Box {...props} height="95vh">
      <Flex flexDir="column">
        <Box mt="20px" mb="20px">
          <Center height="20px" width="100%" mb="10px">
            <Text fontWeight="bold" fontSize="xl">
              Downloads
            </Text>
          </Center>
          <TableContainer width="100%" height="100%">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Asset Name</Th>
                  <Th>Asset Engine</Th>
                  <Th>Asset Tags</Th>
                </Tr>
              </Thead>
              <Tbody>
                {downloadedAssets.map((assetData) => (
                  <Tr
                    //@ts-ignore
                    key={assetData.id}
                    _hover={{
                      backgroundColor: "gray.50",
                    }}
                    onClick={() => {
                      openAssetModal(assetData);
                    }}
                  >
                    <Td>{assetData.assetName}</Td>
                    <Td>{assetData.assetEngine}</Td>
                    <Td>{assetData.assetTags.join(", ")}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Asset Name</Th>
                  <Th>Asset Engine</Th>
                  <Th>Asset Tags</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
        <Box>
          <Center height="20px" width="100%">
            <Text>Uploads</Text>
          </Center>
          <TableContainer width="100%" height="100%">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Asset Name</Th>
                  <Th>Asset Engine</Th>
                  <Th>Engine Version</Th>
                  <Th>Asset Tags</Th>
                  <Th>Asset Version</Th>
                  <Th>Download Origin</Th>
                </Tr>
              </Thead>
              <Tbody>
                {uploadedAssets.map((assetData) => (
                  <Tr
                    //@ts-ignore
                    key={assetData.id}
                    _hover={{
                      backgroundColor: "gray.50",
                    }}
                    onClick={() => {
                      openAssetModal(assetData);
                    }}
                  >
                    <Td>{assetData.assetName}</Td>
                    <Td>{assetData.assetEngine}</Td>
                    <Td>{assetData.assetEngineVersion}</Td>
                    <Td>{assetData.assetTags.join(", ")}</Td>
                    <Td>{assetData.assetVersion}</Td>
                    <Td>{assetData.downloadOrigin}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>

      <AssetPreviewModal
        isOpen={isOpen}
        onClose={onClose}
        setUpdater={setUpdater}
      />
    </Box>
  );
}

MyAssets.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyAssets;
