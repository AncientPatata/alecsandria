import {
  Box,
  Text,
  Button,
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tag,
  Wrap,
  WrapItem,
  Center,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Slider from "react-slick";

import { useEffect, useState } from "react";
import { AssetData } from "lib/typeDefinitions";
import AssetDownloadsComponent from "./assetDownloads";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

// @ts-ignore
function AssetPreviewComponent(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const { assetData, ...otherProps } = props;
  return (
    <Box {...otherProps}>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Flex flexDirection="row">
        <Box width="37%">
          <Slider {...settings}>
            {assetData.assetPreviews.map((el: string) => (
              <Box
                key={el}
                boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                color="gray.300"
                bg="base.d100"
                rounded={5}
              >
                <Image src={el} alt="" />
              </Box>
            ))}
          </Slider>
        </Box>
        <Spacer />
        <Box width="58%">
          <Box padding="15px">
            <Wrap>
              {assetData.assetTags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag size="lg" variant="outline" colorScheme="blue">
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
          <Box maxHeight="80%" overflowY="auto">
            <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
              {assetData.assetDescription}
            </ReactMarkdown>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

// @ts-ignore
function AssetPreviewModal(props) {
  const { isOpen, onClose, setUpdater, ...otherProps } = props;
  const emptyAssetData = {
    id: "",
    assetName: "",
    assetEngine: "",
    assetDescription: "",
    assetTags: [],
    assetPreviews: [],
    assetDownloads: {},
  };
  const [assetData, setAssetData] = useState(emptyAssetData);
  setUpdater((newData: AssetData) => {
    if (newData) {
      // @ts-ignore
      setAssetData(newData);
    }
  });
  console.log(assetData);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>{assetData.assetName}</Center>
          </ModalHeader>
          <ModalCloseButton />
          <Box
            paddingRight="30px"
            paddingLeft="30px"
            paddingBottom="20px"
            width="100%"
            height="100%"
          >
            <AssetPreviewComponent assetData={assetData} height="60%" />
            <AssetDownloadsComponent assetData={assetData} paddingTop="50px" />
          </Box>

          <ModalFooter>
            <Button colorScheme="red" variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AssetPreviewModal;
