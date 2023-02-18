import {
  Box,
  Text,
  Button,
  Flex,
  Spacer,
  useDisclosure,
  Center,
} from "@chakra-ui/react";

import { signOut } from "next-auth/react";
import NewAssetModal from "./newAssetModal";

// @ts-ignore
function TopNavigationBar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box backgroundColor="electricBlue.100" {...props}>
      <Center width="100%" height="100%">
        <Flex flexDirection="row" width="100%">
          <Spacer width="70%" />
          <Button
            onClick={onOpen}
            rounded="none"
            minHeight="5vh"
            backgroundColor="whiteAlpha.50"
            _hover={{
              backgroundColor: "mustard.100",
            }}
          >
            New Asset
          </Button>
          <Button
            onClick={() => signOut()}
            rounded="none"
            minHeight="5vh"
            backgroundColor="whiteAlpha.50"
            _hover={{
              backgroundColor: "mustard.100",
            }}
            mr="3"
          >
            {" "}
            Sign out
          </Button>
          <NewAssetModal isOpen={isOpen} onClose={onClose} />
        </Flex>
      </Center>
    </Box>
  );
}

export default TopNavigationBar;
