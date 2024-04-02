import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

// Structure of the navigation params
// Tab -> BottomTab -> Stack
// Tab has Chat and BottomTab for switching
// Every Stack Screen is inside the BottomTab

declare global {
  namespace ReactNavigation {
    interface RootParamList extends IStackParamList {}
  }
}

export type IStackParamList = {
  Welcome: undefined;
  Onboarding: { step: number; groupId?: string };
  Drawer: NavigatorScreenParams<IDrawerParamList> | undefined;
  SignUpSuccessBottomSheetModal: undefined;
  EditMember: { id: string; groupId: string };
  AddPayment: { groupId: string };
  MemberList: undefined;
  GroupAddMember: { groupId: string };
};

export type IStackScreenProps<Screen extends keyof IStackParamList> =
  StackScreenProps<IStackParamList, Screen>;

export type IDrawerParamList = {
  BottomTab: { id?: string };
};

export type IDrawerScreenProps<Screen extends keyof IDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<IDrawerParamList, Screen>,
    StackScreenProps<IStackParamList>
  >;

export type IBottomTabParamList = {
  GroupDetail: undefined;
  PaymentRecord: undefined; // TODO: Update params
  Statistic: undefined; // TODO: Update params
  Option: undefined; // TODO: Update params
};

export type IBottomTabScreenProps<Screen extends keyof IBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<IBottomTabParamList, Screen>,
    CompositeScreenProps<
      DrawerScreenProps<IDrawerParamList>,
      StackScreenProps<IStackParamList>
    >
  >;
