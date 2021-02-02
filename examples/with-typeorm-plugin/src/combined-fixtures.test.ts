import { createConnection } from "typeorm";
import { commentFixture, postFixture, scenario, userFixture } from "./fixtures";
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
  const { bob, alice, bobsPosts, alicesPosts } = await scenario()
    .with("bob", userFixture())
    .with("alice", userFixture())
    .with("bobsPosts", ({ bob }) =>
      postFixture({
        author: bob,
        comments: commentFixture({
          author: userFixture(),
        }).list(3),
      }).list(5)
    )
    .with("alicesPosts", ({ alice }) =>
      postFixture({
        author: alice,
        comments: commentFixture({
          author: userFixture(),
        }).list(3),
      }).list(5)
    )
    .compose()
    .execute();

  expect(bob).toBeDefined();
  expect(bobsPosts.length).toBe(5);
  expect(bobsPosts[0].author.id).toBe(bob.id);
  expect(alice).toBeDefined();
  expect(alicesPosts.length).toBe(5);
  expect(alicesPosts[0].author.id).toBe(alice.id);
});
