import { faker } from "@faker-js/faker";

import { users } from "./users";

const createStory = () => {
  const user = users[Math.floor(Math.random() * users.length)];
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.avatar(),
    userId: user.id,
    userName: user.name,
  };
};

export const stories = Array.from({ length: 10 }, createStory);

export type Story = ReturnType<typeof createStory>;
