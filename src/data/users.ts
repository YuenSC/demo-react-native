import { faker } from "@faker-js/faker";

const createUser = () => {
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.avatar(),
    title: faker.lorem.words(2),
    description: faker.lorem.sentences({ min: 2, max: 4 }),
  };
};

export const users = Array.from({ length: 10 }, createUser);

export type User = ReturnType<typeof createUser>;
