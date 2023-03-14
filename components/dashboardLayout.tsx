import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import AccessDenied from "./accessDenied";
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

import TopNavigationBar from "./topNavigationBar";

function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
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
        <TopNavigationBar height="7vh" width="100vw" fontFamily="opensans" />
        {children}
      </Box>
    </>
  );
}

export default DashboardLayout;
