import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { SessionProvider } from "next-auth/react";

import theme from "lib/theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </SessionProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
