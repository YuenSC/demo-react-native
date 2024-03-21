import { createTheme } from "@rneui/themed";

import Button from "./components/Button";

const theme = createTheme({
  lightColors: {
    black: "#000",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  darkColors: {
    black: "#fff",
    backdrop: "rgba(255, 255, 255, 0.5)",
  },
  mode: "light",
  components: {
    Button,
  },
});

export default theme;
