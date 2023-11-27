import { faker } from "@faker-js/faker";

import { users } from "./users";

const createStory = () => {
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.avatar(),
    userId: users[Math.floor(Math.random() * users.length)].id,
  };
};

export const stories = Array.from({ length: 10 }, createStory);

export type Story = ReturnType<typeof createStory>;
