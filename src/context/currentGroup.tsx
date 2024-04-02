import {
  ReactNode,
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
} from "react";

import { useAppSelector } from "@/hooks/reduxHook";
import { Group } from "@/store/reducers/groups";

type CurrentGroupContextType = {
  currentGroup: Group | null;
  setCurrentGroup: (group: Group) => void;
};

const currentGroupContext = createContext<CurrentGroupContextType>({
  currentGroup: null,
  setCurrentGroup: () => {},
});

export const CurrentGroupProvider = memo(
  ({ children }: { children: ReactNode }) => {
    const firstGroup = useAppSelector(
      (state) => state.groups?.groups?.[0] ?? null,
    );

    const [currentGroup, setCurrentGroup] = useState(firstGroup);

    const value = useMemo(
      () => ({
        currentGroup,
        setCurrentGroup,
      }),
      [currentGroup],
    );

    return (
      <currentGroupContext.Provider value={value}>
        {children}
      </currentGroupContext.Provider>
    );
  },
);

export const useCurrentGroup = () => {
  const context = useContext(currentGroupContext);

  if (!context)
    throw new Error(
      "useCurrentGroup must be used within a CurrentGroupProvider",
    );

  return context;
};
