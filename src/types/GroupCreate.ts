export type ICreateGroupPayload = {
  id?: string;
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
};
