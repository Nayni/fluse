import { Comment } from "./Comment";
import { User } from "./User";

export class Post {
  constructor(
    public id: number,
    public title: string,
    public body: string,
    public author: User,
    public comments: Comment[]
  ) {}
}
