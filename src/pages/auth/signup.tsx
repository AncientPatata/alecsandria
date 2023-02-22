import {
  Box,
  Text,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { createUser } from "lib/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { useForm } from "react-hook-form";

const Auth = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { data, status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    // @ts-ignore
    router.push("../dashboard/browse"); // we can do all of this in a middleware later on
  }
  // @ts-ignore
  const onSubmit = async (data) => {
    // @ts-ignore
    const createdUser = await createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      accessKeyValue: data.accessKeyValue,
    });
    if (createdUser.error) {
      console.log(createdUser);
      setErrorMessage(createdUser.error);
    } else {
      router.push(process.env.NEXT_PUBLIC_WEBURL);
    }
  };
  return (
    <Box width="100vw" height="100vh">
      <Center width="100%" height="100%">
        <Box
          backgroundColor="electricBlue.100"
          paddingBottom="20px"
          rounded="xl"
        >
          <Box backgroundColor="electricBlue.300" padding="50px" rounded="xl">
            <Flex>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl marginTop="15px">
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...register("username", { required: true })}
                    variant="filled"
                    _focus={{
                      borderColor: "mustard.100",
                      bgColor: "electricBlue.100",
                    }}
                  />
                </FormControl>
                <FormControl marginTop="15px">
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...register("email", { required: true })}
                    variant="filled"
                    _focus={{
                      borderColor: "mustard.100",
                      bgColor: "electricBlue.100",
                    }}
                  />
                </FormControl>
                <FormControl marginTop="15px">
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...register("password", { required: true })}
                    variant="filled"
                    _focus={{
                      borderColor: "mustard.100",
                      bgColor: "electricBlue.100",
                    }}
                    type="password"
                  />
                </FormControl>
                <FormControl marginTop="15px">
                  <FormLabel>Access Key</FormLabel>
                  <Input
                    {...register("accessKeyValue", { required: true })}
                    variant="filled"
                    _focus={{
                      borderColor: "mustard.100",
                      bgColor: "electricBlue.100",
                    }}
                  />
                </FormControl>
                <Button
                  marginTop="15px"
                  type="submit"
                  backgroundColor="mustard.100"
                  _hover={{
                    bgColor: "white",
                  }}
                >
                  Sign Up
                </Button>
              </form>
            </Flex>
          </Box>
        </Box>
      </Center>
      {errorMessage ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Failed to created account :</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Auth;
