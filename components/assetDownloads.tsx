import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Center,
  Flex,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { usePresignedUpload } from "next-s3-upload";
import { getAssetDownloads, uploadAssetFile } from "lib/asset";
import { AssetDownloadData } from "lib/typeDefinitions";
import { useForm } from "react-hook-form";

function AssetDownloadsPreview(props) {
  const { assetData, ...otherProps } = props;
  const [assetDownloads, setAssetDownloads] = useState<AssetDownloadData[]>([]);

  const downloadAsset = async (key) => {
    const { downloadURL } = await fetch(
      `${process.env.NEXT_PUBLIC_WEBURL}/api/asset/cdnResolve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assetKey: key }),
      }
    ).then((res) => res.json());
    window.open(downloadURL, "_blank");
  };

  useEffect(() => {
    getAssetDownloads(assetData.id).then((res) => setAssetDownloads(res));
  }, []);
  return (
    <Box>
      {" "}
      <TableContainer width="100%" height="100%">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Download Origin</Th>
              <Th>Asset Version</Th>
              <Th>Engine Version</Th>
              <Th>Download</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assetDownloads?.map((assetDownloadData: AssetDownloadData) => (
              <Tr
                //@ts-ignore
                key={assetDownloadData.id}
                _hover={{
                  backgroundColor: "gray.50",
                }}
                onClick={() => {
                  console.log(assetDownloadData);
                }}
              >
                <Td>{assetDownloadData.downloadOrigin}</Td>
                <Td>{assetDownloadData.assetVersion}</Td>
                <Td>{assetDownloadData.assetEngineVersion}</Td>
                <Td>
                  <Box
                    backgroundColor="smokyBlack.100"
                    color="white"
                    width="100px"
                    height="25px"
                    onClick={() =>
                      downloadAsset(assetDownloadData.downloadLink)
                    }
                  >
                    <Center width="100%" height="100%">
                      Download
                    </Center>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Download Origin</Th>
              <Th>Asset Version</Th>
              <Th>Engine Version</Th>
              <Th>Download</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}
function AssetUpload(props) {
  const { assetData, switchView, ...otherProps } = props;
  let { FileInput, openFileDialog, uploadToS3, files } = usePresignedUpload();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [uploadBoxWidth, setUploadBoxWidth] = useState("0%");
  const [uploadFormWidth, setUploadFormWidth] = useState("100%");
  const [engineVersion, setEngineVersion] = useState("");
  const [assetVersion, setAssetVersion] = useState("");

  const onSubmit = (formData) => {
    console.log(formData);
    setEngineVersion(formData.engineVersion);
    setAssetVersion(formData.assetVersion);
    setUploadBoxWidth("50%");
    setUploadFormWidth("45%");
  };

  let handleFileChange = async (file) => {
    let { url, key } = await uploadToS3(file, {
      endpoint: {
        request: {
          headers: {
            "x-amz-acl": "public-read",
          },
          body: {
            assetName: assetData.assetName,
            assetEngine: assetData.assetEngine,
            assetVersion: assetVersion,
            engineVersion: engineVersion,
          },
        },
      },
    });
    const assetUpload = await uploadAssetFile(assetData, {
      assetId: assetData.id,
      assetVersion: assetVersion,
      assetEngineVersion: engineVersion,
      downloadOrigin: "CDN",
      downloadLink: key,
    });
    console.log(assetUpload);
    console.log(files);
  };
  return (
    <Box width="100%" height="100%">
      <FileInput onChange={handleFileChange} />
      <Flex
        flexDirection="row"
        height="200px"
        marginTop="20px"
        mr="5px"
        ml="5px"
      >
        <Box as={motion.div} width="100%" animate={{ width: uploadFormWidth }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt="5px">
              <FormLabel>Engine Version(s)</FormLabel>
              <Input {...register("engineVersion", { required: true })} />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel>Asset Version</FormLabel>
              <Input {...register("assetVersion", { required: true })} />
            </FormControl>
            <Button
              backgroundColor="electricBlue.100"
              type="submit"
              mt="15px"
              width="100%"
            >
              Set
            </Button>
          </form>
        </Box>
        <Spacer />
        <Flex
          flexDirection="column"
          as={motion.div}
          animate={{ width: uploadBoxWidth }}
          height="100%"
        >
          <Box
            as={motion.div}
            bgColor="green.400"
            overflow="hidden"
            height="0%"
            width="100%"
            animate={{
              height:
                ((files[files.length - 1]?.progress
                  ? files[files.length - 1]?.progress
                  : 0) /
                  100) *
                  200 +
                "px",
            }}
          >
            <Center height="100%">
              <Text userSelect="none" fontWeight="bold" fontSize="2xl">
                {files[files.length - 1]?.progress == 100
                  ? "Uploaded !"
                  : "Uploading..."}
              </Text>
            </Center>
          </Box>
          <Box
            as={motion.div}
            width="100%"
            height="100%"
            animate={{
              height:
                (1 -
                  (files[files.length - 1]?.progress
                    ? files[files.length - 1]?.progress
                    : 0) /
                    100) *
                  200 +
                "px",
            }}
          >
            <Box
              backgroundColor="mustard.100"
              height="100%"
              width="100%"
              onClick={openFileDialog}
              overflow="hidden"
            >
              <Center width="100%" height="100%">
                <Text fontWeight="black" fontSize="2xl" userSelect="none">
                  Upload
                </Text>
              </Center>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

function AssetDownloadsComponent(props) {
  const { assetData, ...otherProps } = props;
  const [currentView, setCurrentView] = useState("AssetDownload");
  let viewElement: JSX.Element;
  const cancelButton = (
    <Button
      ml="3"
      onClick={() => setCurrentView("AssetDownload")}
      rounded="none"
      minHeight="5vh"
      backgroundColor="electricBlue.300"
      _hover={{
        backgroundColor: "mustard.100",
      }}
    >
      Back
    </Button>
  );
  if (currentView === "AssetDownload") {
    viewElement = <AssetDownloadsPreview assetData={assetData} />;
  } else if (currentView === "AssetUpload") {
    viewElement = (
      <AssetUpload
        assetData={assetData}
        switchView={() => setCurrentView("AssetDownload")}
      />
    );
  }
  return (
    <Box {...otherProps}>
      <Box width="100%" height="15%" backgroundColor="electricBlue.100">
        <Flex flexDirection="row" width="100%">
          <Button
            ml="3"
            onClick={() => setCurrentView("AssetUpload")}
            rounded="none"
            minHeight="5vh"
            backgroundColor="whiteAlpha.50"
            _hover={{
              backgroundColor: "mustard.100",
            }}
          >
            Upload
          </Button>
          {currentView === "AssetUpload" ? cancelButton : ""}
        </Flex>
      </Box>
      {viewElement}
    </Box>
  );
}

export default AssetDownloadsComponent;
