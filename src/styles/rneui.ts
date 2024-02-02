import { createTheme } from "@rneui/themed";

import Button from "./components/Button";

const theme = createTheme({
  lightColors: {
    black: "#000",
  },
  darkColors: {
    black: "#fff",
  },
  mode: "light",
  components: {
    Button,
  },
});

export default theme;
