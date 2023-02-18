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

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const SigninPage = () => {
  const router = useRouter();
  const { data, status } = useSession();

  if (status === "authenticated") {
    // @ts-ignore
    router.push("http://localhost:3000"); // we can do all of this in a middleware later on
  }

  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // @ts-ignore
  const onSubmit = (data) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res?.error) {
        setError(res.error);
      }
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
                <Button
                  marginTop="15px"
                  type="submit"
                  backgroundColor="mustard.100"
                  _hover={{
                    bgColor: "white",
                  }}
                >
                  Sign In
                </Button>
                {error}
              </form>
            </Flex>
          </Box>
        </Box>
      </Center>
    </Box>
  );
};

export default SigninPage;
