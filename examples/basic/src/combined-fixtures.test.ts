import { commentFixture, postFixture, scenario, userFixture } from "./fixtures";

it("should create a scenario", async () => {
  // Combine fixtures to create real world scenario's which you can refer to in tests.
  // In this scenario we'll create two users: Bob and Alice, and give them 5 posts respectively with some random comments.
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
  expect(bobsPosts[0].author).toBe(bob);
  expect(alice).toBeDefined();
  expect(alicesPosts.length).toBe(5);
  expect(alicesPosts[0].author).toBe(alice);
});
