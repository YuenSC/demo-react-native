import { faker } from "@faker-js/faker";

const createAppSuggestion = () => {
  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.url(),
    title: faker.lorem.words(2),
    description: faker.lorem.sentences({ min: 2, max: 4 }),
  };
};

export const appSuggestions = Array.from({ length: 10 }, createAppSuggestion);

export type AppSuggestion = ReturnType<typeof createAppSuggestion>;
