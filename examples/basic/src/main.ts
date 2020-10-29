import faker from "faker";
import { fluse } from "fluse";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

const { fixture, execute } = fluse();

const userFixture = fixture<User>({
  create() {
    return new User(faker.random.number(), faker.internet.userName());
  },
});

type CommentArgs = Pick<Comment, "author">;

const commentFixture = fixture<Comment, CommentArgs>({
  create(ctx, args) {
    return new Comment(faker.random.number(), faker.lorem.slug(), args.author);
  },
});

type PostArgs = Pick<Post, "author" | "comments">;

const postFixture = fixture<Post, PostArgs>({
  create(ctx, args) {
    return new Post(
      faker.random.number(),
      faker.lorem.slug(),
      faker.lorem.paragraphs(4),
      args.author,
      args.comments
    );
  },
});

async function main() {
  const { singlePost } = await execute(
    postFixture("singlePost", {
      args: {
        author: userFixture.asArg(),
        comments: commentFixture.asArg({
          list: 3,
          args: { author: userFixture.asArg() },
        }),
      },
    })
  );

  console.log("**** SINGLE POST ****");
  console.log(JSON.stringify(singlePost, null, 2));
  console.log("********");

  const { manyPosts } = await execute(
    postFixture("manyPosts", {
      list: 3,
      args: {
        author: userFixture.asArg(),
        comments: commentFixture.asArg({
          list: 2,
          args: { author: userFixture.asArg() },
        }),
      },
    })
  );

  console.log("**** MANY POSTS ****");
  console.log(JSON.stringify(manyPosts, null, 2));
  console.log("********");
}

main()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
