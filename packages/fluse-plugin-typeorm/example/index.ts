import { combine, createExecutor, fixture } from "fluse";
import "reflect-metadata";
import { createConnection } from "typeorm";
import typeormPlugin from "../src";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

type UserFixtureArgs = {
  username: string;
};

const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    const user = new User();
    user.username = args.username;
    return ctx.typeorm.entityManager.save(user);
  },
});

type PostFixtureArgs = {
  author: User;
};

const postFixture = fixture({
  async create(ctx, args: PostFixtureArgs) {
    const posts = await Promise.all(
      Array(2)
        .fill(0)
        .map((_, index) => {
          const post = new Post();
          post.title = `post ${index}`;
          post.author = args.author;
          return post;
        })
    );
    return ctx.typeorm.entityManager.save(posts);
  },
});

async function run() {
  const execute = createExecutor({
    plugins: [typeormPlugin({ connection: "default", transaction: true })],
  });

  const userWithPosts = combine()
    .and(userFixture("foo", { username: "foo" }))
    .and(({ foo }) => postFixture("fooPosts", { author: foo }))
    .toFixture();

  const result = await execute(userWithPosts);
  console.log(result);
}

createConnection()
  .then(async (connection) => {
    await connection.synchronize(true);
  })
  .then(run)
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
