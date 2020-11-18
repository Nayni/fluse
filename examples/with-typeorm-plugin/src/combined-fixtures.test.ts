import { createConnection } from "typeorm";
import {
  combine,
  commentFixture,
  execute,
  postFixture,
  userFixture,
} from "./fixtures";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

beforeAll(async () => {
  await createConnection({
    type: "sqlite",
    database: "database.db",
    entities: [User, Post, Comment],
  });
});

it("should create a fixture scenario", async () => {
  // Combine fixtures to create real world scenario's which you can refer to in tests.
  // In this scenario we'll create two users: Bob and Alice, and give them 5 posts respectively with some comments.
  const postsFromBobAndAlice = combine()
    .and(userFixture("bob"))
    .and(userFixture("alice"))
    .and(({ bob }) =>
      postFixture("bobsPosts", {
        list: 5,
        args: {
          author: bob,
          comments: commentFixture.asArg({
            list: 3,
            args: {
              author: userFixture.asArg(),
            },
          }),
        },
      })
    )
    .and(({ alice }) =>
      postFixture("alicesPosts", {
        list: 5,
        args: {
          author: alice,
          comments: commentFixture.asArg({
            list: 3,
            args: {
              author: userFixture.asArg(),
            },
          }),
        },
      })
    )
    .toFixture();

  const { bob, bobsPosts, alice, alicesPosts } = await execute(
    postsFromBobAndAlice
  );

  expect(bob).toBeDefined();
  expect(bobsPosts.length).toBe(5);
  expect(bobsPosts[0].author.id).toBe(bob.id);
  expect(alice).toBeDefined();
  expect(alicesPosts.length).toBe(5);
  expect(alicesPosts[0].author.id).toBe(alice.id);
});
