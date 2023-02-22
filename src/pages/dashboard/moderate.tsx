import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Spacer,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import AssetBrowser from "components/assetBrowser";
import DashboardLayout from "components/dashboardLayout";
import SearchBar from "components/searchBar";
import { getAssets } from "lib/asset";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

function Browse(props) {
  const router = useRouter();
  const { data, status } = useSession();
  const [tokenAmount, setTokenAmount] = useState(1);
  const [tokenDate, setTokenDate] = useState(Date());
  const [tokens, setTokens] = useState([]);
  const generateAT = (e) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_WEBURL}/api/moderate/genAT`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAmount: tokenAmount,
        tokenDate: tokenDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => setTokens(res.generatedTokens));
  };
  if (status === "unauthenticated") {
    router.push("../signin");
    return (
      <Box {...props} height="95vh">
        unauthenticated !
      </Box>
    );
  }
  if (status === "loading") {
    return <Skeleton {...props} height="95vh" />;
  }
  console.log(data);
  if (data?.user?.roles?.includes("Mod")) {
    return (
      <Box {...props} height="95vh">
        <Flex flexDirection="row">
          <Box width="46%" height="100%" ml="2">
            <Box shadow="md" margin="10px" p="10px">
              <Center pt="25px" pb="25px">
                <Text fontSize="xl" fontWeight="bold">
                  Generate Access Token
                </Text>
              </Center>
              <Box m="30px">
                <form onSubmit={generateAT}>
                  <FormControl>
                    <FormLabel>Amount of tokens</FormLabel>
                    <NumberInput
                      defaultValue={1}
                      min={1}
                      max={20}
                      value={tokenAmount}
                      onChange={(_, vn) => setTokenAmount(vn)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Token expiration date</FormLabel>
                    <Input
                      placeholder="Expiration date"
                      size="md"
                      type="datetime-local"
                      value={tokenDate}
                      onChange={(e) => setTokenDate(e.target.value)}
                    />
                  </FormControl>
                  <Button mt="10px" w="100%" type="submit">
                    Generate
                  </Button>
                </form>
                <Box>
                  {tokens.length === 0 ? (
                    ""
                  ) : (
                    <Box>
                      <Text mt="20px" mb="20px">
                        Generated Tokens :
                      </Text>
                      <List p="5px">
                        {tokens.map((token) => (
                          <ListItem key="token" mb="15px">
                            {token}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Spacer />
          <Box width="46%" height="100%" mr="2">
            <Box>Manage Engines and Tags</Box>
          </Box>
        </Flex>
      </Box>
    );
  }
  return (
    <Box {...props} height="95vh">
      Not a moderator
    </Box>
  );
}

Browse.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Browse;
