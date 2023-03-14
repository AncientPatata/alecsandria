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
  const {
    isOpen: isSubMenuOpen,
    onOpen: onSubMenuOpen,
    onClose: onSubMenuClose,
  } = useDisclosure();
  const router = useRouter();

  const { status, data } = useSession();
  return (
    <Box {...props}>
      <Box backgroundColor="white.100">
        <Center width="100%" height="100%">
          <Flex flexDirection="row" width="100%">
            <Button
              ml="10"
              rounded="none"
              minHeight="6vh"
              minWidth="5vw"
              backgroundColor="whiteAlpha.50"
              _hover={{
                backgroundColor: "mustard.100",
              }}
              fontFamily="opensans"
            >
              Showcase
            </Button>
            <Button
              rounded="none"
              minHeight="6vh"
              minWidth="5vw"
              backgroundColor="whiteAlpha.50"
              _hover={{
                backgroundColor: "mustard.100",
              }}
              fontFamily="opensans"
              onMouseEnter={onSubMenuOpen}
            >
              Browse
            </Button>
            <Spacer width="70%" />

            <Menu>
              <MenuButton
                as={Button}
                mr="10"
                minHeight="6vh"
                rounded="none"
                backgroundColor="whiteAlpha.50"
                _hover={{
                  backgroundColor: "mustard.100",
                }}
                fontFamily="opensans"
              >
                {data?.user?.username ? data?.user?.username : "Profile"}
              </MenuButton>
              <MenuList>
                <MenuGroup title="Profile">
                  <MenuItem fontFamily="opensans">My Account</MenuItem>
                  {data?.user?.roles?.includes("Mod") ? (
                    <MenuItem
                      fontFamily="opensans"
                      onClick={() =>
                        router.push(
                          process.env.NEXT_PUBLIC_WEBURL + "dashboard/moderate"
                        )
                      }
                    >
                      Moderate
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  <MenuItem
                    fontFamily="opensans"
                    onClick={() =>
                      router.push(
                        process.env.NEXT_PUBLIC_WEBURL + "dashboard/myassets"
                      )
                    }
                  >
                    My Assets{" "}
                  </MenuItem>
                  <MenuItem fontFamily="opensans" onClick={() => signOut()}>
                    Sign out
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Help">
                  <MenuItem fontFamily="opensans">Docs</MenuItem>
                  <MenuItem fontFamily="opensans">FAQ</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Center>
      </Box>
      <Box backgroundColor="mustard.100" height="5%" />
      <Box
        position="absolute"
        zIndex="popover"
        visibility={isSubMenuOpen ? "visible" : "hidden"}
        height="8vh"
        onMouseLeave={onSubMenuClose}
      >
        <Box height="100%" width="100vw" backgroundColor="gray.100">
          <SubNavigationMenu height="100%" />
        </Box>
      </Box>
    </Box>
  );
}

function SubNavigationMenuElement(props) {
  const { children, ...otherProps } = props;
  return (
    <Box
      {...otherProps}
      width="25%"
      height="100%"
      _hover={{ backgroundColor: "mustard.100" }}
    >
      <Center
        height="100%"
        width="100%"
        fontFamily="opensans"
        userSelect="none"
      >
        {children}
      </Center>
    </Box>
  );
}

function SubNavigationMenu(props) {
  const router = useRouter();

  return (
    <Box {...props}>
      <Flex flexDirection="row" height="100%">
        <SubNavigationMenuElement
          ml="5px"
          onClick={() =>
            router.push(
              process.env.NEXT_PUBLIC_WEBURL + "/dashboard/browse/assets"
            )
          }
        >
          Assets
        </SubNavigationMenuElement>
        <SubNavigationMenuElement>Projects</SubNavigationMenuElement>
        <SubNavigationMenuElement>Talent</SubNavigationMenuElement>
        <SubNavigationMenuElement mr="5px">
          Knowledge Base
        </SubNavigationMenuElement>
      </Flex>
    </Box>
  );
}

export default TopNavigationBar;
