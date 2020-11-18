import { commentFixture, execute, postFixture, userFixture } from "./fixtures";

it("should create many posts", async () => {
  const { manyPosts } = await execute(
    postFixture("manyPosts", {
      list: 3,
      args: {
        author: userFixture.asArg(),
        comments: commentFixture.asArg({
          list: 3,
          args: { author: userFixture.asArg() },
        }),
      },
    })
  );

  expect(manyPosts).toBeDefined();
  expect(manyPosts.length).toBe(3);
  expect(manyPosts[0].id).toBeDefined();
  expect(manyPosts[0].title).toEqual(expect.any(String));
  expect(manyPosts[0].body).toEqual(expect.any(String));
  expect(manyPosts[0].author).toBeDefined();
  expect(manyPosts[0].author.id).toBeDefined();
  expect(manyPosts[0].author.username).toEqual(expect.any(String));
  expect(manyPosts[0].comments.length).toBe(3);
});
