import { extendTheme } from "@chakra-ui/react";

export const newTheme = extendTheme({
    colors: {
      dark:{
        BG: "#121212",
        BGSecondary: "#363636",
        BGAside: "#212121",
        BGHighlighted: "#212121",
        BGAnswered: "#212121",
        TextColor: "#fff",
        TextColorSecondary: "#fff",
      },
      light:{
        BG: "#f8f8f8",
        BGSecondary: "#f6f6f6",
        BGAside: "#835afd",
        BGHighlighted: "#F4F0FF",
        BGAnswered: "#c7c7c7",
        TextColor: "#121212",
        TextColorSecondary: "#fff",
      },
    },
    styles: {
    global: (props) => ({
      "html": {
        transition: "0.2s",
        width: "100%",
        height: "100%",
        fontSize: "62.5%",
        backgroundColor: props.colorMode === "dark" ? "dark.BG" : "light.BG",
      },
      "text":{
        backgroundColor: "red",
      }
    }),
  },
  components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } }, // Fixing Button Blue border on Click
});