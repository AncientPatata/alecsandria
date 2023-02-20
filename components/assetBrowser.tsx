import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { getAssets } from "lib/asset";
import AssetPreviewModal from "./assetPreviewModal";
import { AssetData } from "lib/typeDefinitions";
// @ts-ignore
function AssetBrowser(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: assets, status, error } = useQuery("assets", getAssets);
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
  if (status === "loading") {
    return (
      <Box {...props}>
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
              <Skeleton />
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (status === "error") {
    return <Box {...props}>{error}</Box>;
  }
  return (
    <Box {...props}>
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
            {assets.map((assetData) => (
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
      <AssetPreviewModal
        isOpen={isOpen}
        onClose={onClose}
        setUpdater={setUpdater}
      />
    </Box>
  );
}

export default AssetBrowser;
