import { faker } from "@faker-js/faker";

import { users } from "./users";

const createPost = () => {
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.url({ width: 640, height: 480 }),
    userId: users[Math.floor(Math.random() * users.length)].id,
  };
};

export const posts = Array.from({ length: 100 }, createPost);

export type Post = ReturnType<typeof createPost>;
