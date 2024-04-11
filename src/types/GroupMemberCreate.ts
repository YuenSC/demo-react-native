import { User } from "./User";

export type IGroupMemberCreatePayload = Omit<User, "id">;
