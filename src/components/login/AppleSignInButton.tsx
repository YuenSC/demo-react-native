import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { CodedError } from "@/types/CodedError";

interface IAppleSignInButtonProps {
  foo?: string;
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    aspectRatio: 24 / 9,
  },
});

const AppleSignInButton = memo<IAppleSignInButtonProps>(({ foo }) => (
  <AppleAuthentication.AppleAuthenticationButton
    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
    cornerRadius={5}
    style={styles.button}
    onPress={async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        console.log("credential", credential);
        // signed in
      } catch (e) {
        if ((e as CodedError).code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      }
    }}
  />
));

AppleSignInButton.displayName = "AppleSignInButton";

export default AppleSignInButton;
