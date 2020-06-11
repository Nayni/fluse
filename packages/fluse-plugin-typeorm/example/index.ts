import { combine, fixture, Plugin, Seeder } from "@fluse/core";
import "reflect-metadata";
import { createConnection } from "typeorm";
import typeormPlugin from "../src";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

declare module "@fluse/core" {
  interface FixtureContext {
    other: {
      foo: string;
    };
  }
}

export const otherPlugin: Plugin = () => {
  return {
    name: "other",
    version: "0.0.1",
    onCreateExecutor() {
      return (fixture, next) => {
        return next(fixture, {
          foo: "bar",
        });
      };
    },
  };
};

type UserFixtureArgs = {
  username: string;
};

/** A fixture with arguments, returning an object */
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

/** A fixture with arguments, returning an array */
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

async function testTypeORMPlugin() {
  const seeder = new Seeder({
    plugins: [typeormPlugin, otherPlugin],
  });

  const fixtures = await seeder.seed(
    combine()
      .and(userFixture("foo", { username: "foo" }))
      .and(({ foo }) => postFixture("fooPosts", { author: foo }))
      .toFixture()
  );

  console.log(fixtures);
}

createConnection()
  .then(async (connection) => {
    await connection.synchronize(true);
  })
  .then(testTypeORMPlugin)
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
