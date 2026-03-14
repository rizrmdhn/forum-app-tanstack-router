import { faker } from '@faker-js/faker';
import type { IUser, IThread, IComment, IDetailThread, ILeaderboard } from '@/types';

export function makeUser(overrides?: Partial<IUser>): IUser {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    ...overrides,
  };
}

export function makeThread(overrides?: Partial<IThread>): IThread {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    category: faker.word.noun(),
    createdAt: faker.date.recent().toISOString(),
    ownerId: faker.string.uuid(),
    upVotesBy: [],
    downVotesBy: [],
    totalComments: faker.number.int({ min: 0, max: 20 }),
    ...overrides,
  };
}

export function makeComment(overrides?: Partial<IComment>): IComment {
  return {
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    createdAt: faker.date.recent().toISOString(),
    upVotesBy: [],
    downVotesBy: [],
    owner: makeUser(),
    ...overrides,
  };
}

export function makeDetailThread(overrides?: Partial<IDetailThread>): IDetailThread {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    category: faker.word.noun(),
    createdAt: faker.date.recent().toISOString(),
    owner: makeUser(),
    upVotesBy: [],
    downVotesBy: [],
    comments: [],
    ...overrides,
  };
}

export function makeLeaderboard(overrides?: Partial<ILeaderboard>): ILeaderboard {
  return {
    user: makeUser(),
    score: faker.number.int({ min: 0, max: 1000 }),
    ...overrides,
  };
}
