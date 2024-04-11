import { IGroupCreatePayload } from "./GroupCreate";

export type IGroupEditPayload = Omit<IGroupCreatePayload, "id"> & {
  id: string;
};
