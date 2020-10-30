import { fluse } from "fluse";
import fakerPlugin from "fluse-plugin-faker";
import typeormPlugin from "fluse-plugin-typeorm";
import { Comment } from "./model/Comment";
import { Post } from "./model/Post";
import { User } from "./model/User";

// Initialize fluse and get access to the main API's
export const { fixture, combine, execute } = fluse({
  plugins: {
    orm: typeormPlugin({
      connection: "default",
      synchronize: true,
      dropBeforeSync: true,
      transaction: true,
    }),
    faker: fakerPlugin(),
  },
});

// Next up we define our fixtures.
// Some of them require input parameters to allow for some flexbility.
// We can access the plugins that were configured via the context argument of create(ctx).
export const userFixture = fixture<User>({
  create({ orm, faker }) {
    const user = orm.entityManager.getRepository(User).create({
      username: faker.internet.userName(),
    });

    return orm.entityManager.save(user);
  },
});

type CommentArgs = Pick<Comment, "author">;

export const commentFixture = fixture<Comment, CommentArgs>({
  create({ orm, faker }, args) {
    const comment = orm.entityManager.getRepository(Comment).create({
      message: faker.lorem.slug(),
      author: args.author,
    });

    return orm.entityManager.save(comment);
  },
});

type PostArgs = Pick<Post, "author" | "comments">;

export const postFixture = fixture<Post, PostArgs>({
  create({ orm, faker }, args) {
    const post = orm.entityManager.getRepository(Post).create({
      title: faker.lorem.slug(),
      body: faker.lorem.paragraphs(4),
      author: args.author,
      comments: args.comments,
    });

    return orm.entityManager.save(post);
  },
});
