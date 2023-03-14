import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import AccessDenied from "../../components/accessDenied";
import {
  Box,
  Text,
  Button,
  Flex,
  Spacer,
  useDisclosure,
  Center,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

import AssetBrowser from "components/assetBrowser";
import TopNavigationBar from "components/topNavigationBar";

function Dashboard() {
  const { data, status } = useSession();
  const router = useRouter();

  // If no session exists, display access denied message
  if (status == "unauthenticated") {
    return <AccessDenied />;
  }

  // If session exists, display content
  return (
    <>
      <Box>
        <TopNavigationBar height="5vh" width="100vw" />
        <Center height="93vh" width="100%">
          <Text
            fontFamily="opensans"
            fontSize="2xl"
            color="smokyBlack.100"
            userSelect="none"
          >
            Welcome to AleCSandria
          </Text>
        </Center>
      </Box>
    </>
  );
}

export default Dashboard;
