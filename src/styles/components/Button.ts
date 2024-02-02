import { ButtonProps, Colors, Theme } from "@rneui/themed";

const Button: (
  props: Partial<ButtonProps>,
  theme: Theme & {
    colors: Colors;
  }
) => Partial<ButtonProps> = (props, theme) => {
  let padding = 12;
  let paddingHorizontal = 14;
  switch (props.size) {
    case "sm":
      padding = 8;
      paddingHorizontal = 10;
      break;
    case "lg":
      padding = 14;
      paddingHorizontal = 16;
      break;
  }
  return {
    containerStyle: {
      borderRadius: 8,
    },
    buttonStyle: {
      padding,
      paddingHorizontal,
    },
    titleStyle: {
      fontWeight: "bold",
      fontSize: 16,
    },
  };
};

export default Button;
