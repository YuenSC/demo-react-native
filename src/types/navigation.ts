import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { CurrencyCode } from "./Currency";
import { PaymentRecordCreate } from "./PaymentRecord";

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
  GroupCreateSuccessBottomSheet: {
    isOnboarding: boolean;
  };
  EditMember: { id: string; groupId: string; isDeleteDisabled?: boolean };
  AddPayment: {
    groupId: string;
    recordId?: string;
    defaultValue?: PaymentRecordCreate;
  };
  EditPayment: {
    groupId: string;
    recordId: string;
    defaultValue?: PaymentRecordCreate;
  };
  EditPaymentModal: {
    groupId: string;
    recordId: string;
    defaultValue?: PaymentRecordCreate;
  };
  MemberList: undefined;
  GroupUserList: { groupId: string };
  PaymentRecordFilter: {
    selectedCurrency: CurrencyCode | null;
    setSelectedCurrency: React.Dispatch<
      React.SetStateAction<CurrencyCode | null>
    >;
  };
  PaymentFormDatePickerBottomSheet: {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
  };
  PaymentFormCurrencySelectBottomSheet: {
    currencyCode: CurrencyCode;
    setCurrencyCode: React.Dispatch<React.SetStateAction<CurrencyCode>>;
  };
  GroupDeleteUserBottomSheet: {
    groupId: string;
    userId: string;
  };
  GroupDeletePaymentRecordBottomSheet: {
    groupId: string;
    recordId: string;
  };
  GroupSummary: {
    groupId: string;
  };
  GroupForm: {
    groupId?: string;
    step: number;
  };
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
  PaymentRecordList: undefined; // TODO: Update params
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

export type IAddPaymentTabParamList = {
  Bill: undefined;
  PayeeSelect: undefined;
  PayerSelect: undefined;
};

export type IAddPaymentTabScreenProps<
  Screen extends keyof IAddPaymentTabParamList,
> = CompositeScreenProps<
  MaterialTopTabScreenProps<IAddPaymentTabParamList, Screen>,
  CompositeScreenProps<
    DrawerScreenProps<IDrawerParamList>,
    StackScreenProps<IStackParamList>
  >
>;
