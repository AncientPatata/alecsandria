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
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Engine } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AssetBrowser from "components/assetBrowser";
import DashboardLayout from "components/dashboardLayout";
import SearchBar from "components/searchBar";
import {
  addNewEngine,
  addNewEngineTag,
  getAssets,
  getEngines,
} from "lib/asset";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

function GenerateAT(props) {
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

  return (
    <Box width="40%" height="100%" ml="2">
      <Box shadow="md" margin="10px" p="10px">
        <Center pt="25px" pb="25px">
          <Text fontSize="2xl" fontWeight="light">
            Generate Access Token
          </Text>
        </Center>
        <Box m="30px">
          <form onSubmit={generateAT}>
            <FormControl>
              <FormLabel mb="15px" fontWeight="normal">
                Amount of tokens
              </FormLabel>
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
              <FormLabel mb="15px" mt="15px" fontWeight="normal">
                Token expiration date
              </FormLabel>
              <Input
                placeholder="Expiration date"
                size="md"
                type="datetime-local"
                value={tokenDate}
                onChange={(e) => setTokenDate(e.target.value)}
              />
            </FormControl>
            <Button mt="25px" w="100%" type="submit">
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
  );
}

function EditEngineModal(props) {
  const { isOpen, onClose, engine, ...otherProps } = props;

  const [newTagName, setNewTagName] = useState("");

  const queryClient = useQueryClient();

  const tagMutation = useMutation({
    mutationFn: ({ engineName, newTag }) => addNewEngineTag(engineName, newTag),
    // When mutate is called:
    onMutate: async ({ engineName, newTag }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["engines"] });

      // Snapshot the previous value
      const previousEngines = queryClient.getQueryData(["engines"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["engines"], (old) =>
        old.map((eng) => {
          if (eng.assetEngine === engineName) {
            eng.engineAssetTags = [...eng.engineAssetTags, newTag];
          }
          return eng;
        })
      );

      // Return a context object with the snapshotted value
      return { previousEngines };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTag, context) => {
      queryClient.setQueryData(["engines"], context.previousEngines);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    },
  });

  if (engine === null) {
    return <Box></Box>;
  }

  return (
    <Box>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {engine.assetEngine}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Input
                rounded="none"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button
                width="100%"
                rounded="none"
                onClick={() =>
                  tagMutation.mutate({
                    engineName: engine.assetEngine,
                    newTag: newTagName,
                  })
                }
              >
                Add Tag
              </Button>
            </Box>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Tag name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {engine.engineAssetTags.map((tag: String) => (
                    <Tr key={tag}>
                      <Td>{tag}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red.200" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function ManageEngines(props) {
  const {
    onClose: onCloseAddEngine,
    isOpen: isOpenAddEngine,
    onToggle: onToggleAddEngine,
  } = useDisclosure();
  const {
    onClose: onCloseEditEngine,
    isOpen: isOpenEditEngine,
    onOpen: onOpenEditEngine,
  } = useDisclosure();
  const [engineName, setEngineName] = useState("");
  const addEngine = () => {
    engineMutation.mutate(engineName);
    onCloseAddEngine();
    setEngineName("");
  };

  const editEngine = (engine) => {
    setEngineToEdit(engine);
    onOpenEditEngine();
  };

  const queryClient = useQueryClient();

  const engineMutation = useMutation({
    mutationFn: addNewEngine,
    // When mutate is called:
    onMutate: async (newEngine) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["engines"] });

      // Snapshot the previous value
      const previousEngines = queryClient.getQueryData(["engines"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["engines"], (old) => [...old, newEngine]);

      // Return a context object with the snapshotted value
      return { previousEngines };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newEngine, context) => {
      queryClient.setQueryData(["engines"], context?.previousEngines);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    },
  });

  // Add error handling
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["engines"],
    queryFn: getEngines,
  });
  const [engineToEdit, setEngineToEdit] = useState(null);

  return (
    <Box height="100%" ml="2">
      <Box shadow="md" margin="10px" p="10px">
        <Center pt="25px" pb="25px">
          <Text fontSize="2xl" fontWeight="light">
            Manage Engines
          </Text>
        </Center>
        <Button width="100%" rounded="none" onClick={onToggleAddEngine}>
          Add New Engine
        </Button>
        <Box hidden={!isOpenAddEngine} mr="10px" ml="10px">
          <Flex flexDirection="row" mt="15px" mb="15px">
            <Input
              width="70%"
              rounded="none"
              mr="10px"
              value={engineName}
              onChange={(e) => setEngineName(e.target.value)}
            />
            <Button width="30%" rounded="none" onClick={addEngine}>
              Add
            </Button>
          </Flex>
        </Box>
        <Box m="30px">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Engine name</Th>
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Skeleton />
                ) : (
                  data.map((engine: Engine) => (
                    <Tr key={engine.id}>
                      <Td>{engine.assetEngine}</Td>
                      <Td>
                        <Button onClick={() => editEngine(engine)}>Edit</Button>
                      </Td>
                      <Td>
                        <Button>Delete</Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <EditEngineModal
        engine={engineToEdit}
        isOpen={isOpenEditEngine}
        onClose={onCloseEditEngine}
      />
    </Box>
  );
}

function Moderate(props) {
  const router = useRouter();
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    router.push("../signin");
    return (
      <Box {...props} height="93vh">
        unauthenticated !
      </Box>
    );
  }

  if (status === "loading") {
    return <Skeleton {...props} height="93vh" />;
  }
  console.log(data);
  if (data?.user?.roles?.includes("Mod")) {
    return (
      <Box {...props} height="93vh" fontFamily="opensans">
        <Flex flexDirection="row">
          <GenerateAT />
          <Spacer />
          <Box width="40%" height="100%" mr="10">
            <ManageEngines />
          </Box>
        </Flex>
      </Box>
    );
  }
  return (
    <Box {...props} height="93vh">
      Not a moderator
    </Box>
  );
}

Moderate.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Moderate;
