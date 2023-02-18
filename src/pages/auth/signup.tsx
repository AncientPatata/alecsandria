import {
  Box,
  Text,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { createUser } from "lib/user";

import { useForm } from "react-hook-form";

const Auth = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // @ts-ignore
  const onSubmit = (data) => {
    // @ts-ignore
    createUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });
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
                  />
                </FormControl>
                <FormControl marginTop="15px">
                  <FormLabel>Access Key</FormLabel>
                  <Input
                    {...register("accessKey", { required: true })}
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
    </Box>
  );
};

export default Auth;
