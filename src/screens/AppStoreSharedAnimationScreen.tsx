import AppSuggestionDisplay from "@/components/appSuggestion/AppSuggestionDisplay";
import { AppSuggestion, appSuggestions } from "@/data/appSuggestions";
import { Position } from "@/types/postions";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

const AppStoreSharedAnimationScreen = () => {
  const [modal, setModal] = useState<{
    appSuggestion: AppSuggestion;
    position: Position;
  } | null>(null);

  const closeModal = useCallback(() => setModal(null), []);
  const openModal = useCallback(
    (appSuggestion: AppSuggestion, position: Position) =>
      setModal({ appSuggestion, position }),
    []
  );

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 32,
        }}
      >
        {appSuggestions.map((appSuggestion) => (
          <Pressable key={appSuggestion.id}>
            <AppSuggestionDisplay appSuggestion={appSuggestion} open />
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

export default AppStoreSharedAnimationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
