import {
  Box,
  Text,
  Button,
  Flex,
  Spacer,
  useDisclosure,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";

import { signOut, useSession } from "next-auth/react";
import NewAssetModal from "./newAssetModal";
import { useRouter } from "next/router";

// @ts-ignore
function TopNavigationBar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status, data } = useSession();
  const router = useRouter();
  return (
    <Box backgroundColor="electricBlue.100" {...props}>
      <Center width="100%" height="100%">
        <Flex flexDirection="row" width="100%">
          <Button
            onClick={() => router.push("./browse")}
            ml="10"
            rounded="none"
            minHeight="5vh"
            backgroundColor="whiteAlpha.50"
            _hover={{
              backgroundColor: "mustard.100",
            }}
          >
            Browse
          </Button>
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

          <Menu>
            <MenuButton
              as={Button}
              mr="10"
              minHeight="5vh"
              rounded="none"
              backgroundColor="whiteAlpha.50"
              _hover={{
                backgroundColor: "mustard.100",
              }}
            >
              Profile
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem>My Account</MenuItem>
                <MenuItem onClick={() => router.push("./myassets")}>
                  My Assets{" "}
                </MenuItem>
                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Help">
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <NewAssetModal isOpen={isOpen} onClose={onClose} />
        </Flex>
      </Center>
    </Box>
  );
}

export default TopNavigationBar;
