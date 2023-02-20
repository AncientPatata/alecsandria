import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { SessionProvider } from "next-auth/react";

import LoginButton from "../../components/loginButton";
import theme from "lib/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </SessionProvider>
  );
}
