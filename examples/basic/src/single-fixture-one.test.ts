import { commentFixture, execute, postFixture, userFixture } from "./fixtures";

it("should create a single post", async () => {
  // Using one of our fixtures we can easily create a single instance of a post.
  const { singlePost } = await execute(
    postFixture("singlePost", {
      args: {
        author: userFixture.asArg(), // Instead of providing a full user object, just re-use an existing feature and pass it asArg()
        comments: commentFixture.asArg({
          // This also works for lists!
          list: 3,
          args: { author: userFixture.asArg() },
        }),
      },
    })
  );

  expect(singlePost).toBeDefined();
  expect(singlePost.id).toBeDefined();
  expect(singlePost.title).toEqual(expect.any(String));
  expect(singlePost.body).toEqual(expect.any(String));
  expect(singlePost.author).toBeDefined();
  expect(singlePost.author.id).toBeDefined();
  expect(singlePost.author.username).toEqual(expect.any(String));
  expect(singlePost.comments.length).toBe(3);
});
