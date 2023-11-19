import { AppSuggestion } from "@/data/appSuggestions";
import { memo } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface IAppSuggestionDisplayProps {
  appSuggestion: AppSuggestion;
  open: boolean;
}

const AppSuggestionDisplay = memo<IAppSuggestionDisplayProps>(
  ({ appSuggestion: { description, id, imageUrl, title }, open }) => (
    <ImageBackground source={{ uri: imageUrl }} style={styles.container}>
      <Text style={[styles.text, styles.title]}>{title}</Text>
      <Text style={[styles.text, styles.description]}>{description}</Text>
    </ImageBackground>
  )
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: "lightgray",
    overflow: "hidden",
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  text: {
    color: "white",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    marginTop: 16,
  },
  description: {
    fontSize: 20,
  },
});

AppSuggestionDisplay.displayName = "AppSuggestionDisplay";
export default AppSuggestionDisplay;
