import { createContext, useContext, useMemo } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

const TabContext = createContext<{
  scrollY?: SharedValue<number>;
}>({});

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useSharedValue(0);

  return (
    <TabContext.Provider
      value={useMemo(
        () => ({
          scrollY,
        }),
        [scrollY]
      )}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a ProfileProvider");
  }
  return context;
};
