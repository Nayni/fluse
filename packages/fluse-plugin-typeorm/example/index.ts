import { createPlugin, fluse } from "fluse";
import "reflect-metadata";
import { createConnection } from "typeorm";
import typeormPlugin from "../src";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const secondPlugin = createPlugin<{ second: number }>({
  name: "secondPlugin",
  version: "*",
  execute(next) {
    console.log("In second plugin");
    return next({ second: 2 });
  },
});

const { fixture, combine, execute } = fluse({
  plugins: {
    orm: typeormPlugin({
      connection: "default",
      transaction: true,
      synchronize: true,
      dropBeforeSync: true,
    }),
    second: secondPlugin,
  },
});

type UserFixtureArgs = {
  username: string;
};

const userFixture = fixture({
  async create(ctx, args: UserFixtureArgs) {
    console.log("Context: ", ctx);
    const user = new User();
    user.username = args.username;
    return ctx.orm.entityManager.save(user);
  },
});

type PostFixtureArgs = {
  author: User;
};

const postFixture = fixture({
  async create(ctx, args: PostFixtureArgs, info) {
    const post = new Post();
    post.title = "post" + info.list.index;
    post.author = args.author;
    return ctx.orm.entityManager.save(post);
  },
});

async function run() {
  const userWithPosts = combine()
    .and(userFixture("foo", { args: { username: "foo" } }))
    .and(({ foo }) =>
      postFixture("fooPosts", { list: 10, args: { author: foo } })
    )
    .toFixture();

  const result = await execute(userWithPosts);
  console.log(result);
}

createConnection()
  .then(run)
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
