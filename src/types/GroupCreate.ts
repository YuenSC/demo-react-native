export type ICreateGroupPayload = {
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
};
