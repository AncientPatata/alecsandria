import { extendTheme } from "@chakra-ui/react";
import { Playfair_Display, Open_Sans } from "@next/font/google";

const playfair_display = Playfair_Display({ subsets: ["latin"] });
const opensans = Open_Sans({ subsets: ["latin"] });
const theme = extendTheme({
  fonts: {
    playfair_display: playfair_display.style.fontFamily,
    opensans: opensans.style.fontFamily,
  },
  colors: {
    mustard: {
      100: "#FCDD45",
    },
    electricBlue: {
      100: "#67E1EE",
      200: "#5ADEED",
      300: "#47DAEB",
    },
    smokyBlack: {
      100: "#14110F",
    },
    jet: {
      100: "#34312D",
      200: "#161513",
    },
    brandGray: {
      100: "#7E7F83",
    },
    brand: {
      100: "#FCDD45",
      200: "#67E1EE",
      300: "#14110F",
      400: "#34312D",
      500: "#7E7F83",
    },
  },
});

export default theme;
