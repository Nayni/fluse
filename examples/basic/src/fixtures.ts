import faker from "faker";
import { fluse } from "fluse";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

// Initialize fluse and get access to the main API's
export const { fixture, scenario } = fluse();

// Next up we define some basic fixtures.
// Some of them require input parameters to allow for some flexbility.
export const userFixture = fixture<User>({
  create() {
    return new User(faker.random.number(), faker.internet.userName());
  },
});

type CommentArgs = Pick<Comment, "author">;

export const commentFixture = fixture<Comment, CommentArgs>({
  create(ctx, args) {
    return new Comment(faker.random.number(), faker.lorem.slug(), args.author);
  },
});

type PostArgs = Pick<Post, "author" | "comments">;

export const postFixture = fixture<Post, PostArgs>({
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
