import { createConnection } from "typeorm";
import { commentFixture, postFixture, userFixture } from "./fixtures";
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

it("should create a single post", async () => {
  const post = await postFixture({
    // The arguments of your fixture are automatically augmented so they accept fixtures as input.
    // So instead of passing a fully constructed User as our author, just let Fluse create a random one!
    author: userFixture(),
    // This also works nested, and for lists!
    comments: commentFixture({ author: userFixture() }).list(3),
  }).execute();

  expect(post).toBeDefined();
  expect(post.id).toBeDefined();
  expect(post.title).toEqual(expect.any(String));
  expect(post.body).toEqual(expect.any(String));
  expect(post.author).toBeDefined();
  expect(post.author.id).toBeDefined();
  expect(post.author.username).toEqual(expect.any(String));
  expect(post.comments.length).toBe(3);
});
