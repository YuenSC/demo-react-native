import { faker } from "@faker-js/faker";

import { users } from "./users";

const createVideo = () => {
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.url({ width: 640, height: 480 }),
    userId: users[Math.floor(Math.random() * users.length)].id,
  };
};

export const videos = Array.from({ length: 1000 }, createVideo);

export type Video = ReturnType<typeof createVideo>;
