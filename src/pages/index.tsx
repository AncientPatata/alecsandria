import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

function Home() {
  const router = useRouter();
  const { data, status } = useSession();

  // When rendering client side don't display anything until loading is complete

  if (status == "authenticated") {
    router.push("dashboard/browse");
  }
  const goto = (page: string) => {
    router.push("auth/" + page);
  };
  return (
    <>
      <Box width="100vw" height="100vh">
        <Box width="100vw" height="35vh">
          <Center
            height="100%"
            width="100%"
            padding="50px"
            backgroundColor="jet.100"
          >
            <Text fontFamily="playfair_display" fontSize="6xl" color="white">
              Welcome to AleCSandria
            </Text>
          </Center>
          <Box backgroundColor="jet.200" height="9px" width="100%" />
          <Flex flexDirection="row" width="100%" height="100%">
            <Box
              width="50%"
              onClick={() => goto("signup")}
              _hover={{
                backgroundColor: "electricBlue.100",
              }}
            >
              <Center width="100%" height="100%">
                <Text fontSize="2xl">Create an account</Text>
              </Center>
            </Box>
            <Box
              width="50%"
              onClick={() => goto("signin")}
              _hover={{
                backgroundColor: "mustard.100",
              }}
            >
              <Center width="100%" height="100%">
                <Text fontSize="2xl">Login</Text>
              </Center>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default Home;
