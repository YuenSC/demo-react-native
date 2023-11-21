import { AppSuggestion } from "@/data/appSuggestions";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends IRootStackParamList {}
  }
}

export type IRootStackParamList = {
  Root: NavigatorScreenParams<IRootTabParamList> | undefined;
  AppSuggestionDetail: {
    id: string;
  };
};

export type IRootStackScreenProps<Screen extends keyof IRootStackParamList> =
  StackScreenProps<IRootStackParamList, Screen>;

export type IRootTabParamList = {
  Home: undefined;
  Settings: undefined;
};

export type IRootTabScreenProps<Screen extends keyof IRootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<IRootTabParamList, Screen>,
    StackScreenProps<IRootStackParamList>
  >;
