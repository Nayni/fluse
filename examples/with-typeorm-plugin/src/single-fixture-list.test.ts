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

it("should create many posts", async () => {
  const posts = await postFixture({
    author: userFixture(),
    comments: commentFixture({ author: userFixture() }).list(3),
  })
    .list(3)
    .execute();

  expect(posts).toBeDefined();
  expect(posts.length).toBe(3);
  expect(posts[0].id).toBeDefined();
  expect(posts[0].title).toEqual(expect.any(String));
  expect(posts[0].body).toEqual(expect.any(String));
  expect(posts[0].author).toBeDefined();
  expect(posts[0].author.id).toBeDefined();
  expect(posts[0].author.username).toEqual(expect.any(String));
  expect(posts[0].comments.length).toBe(3);
});
