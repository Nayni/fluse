import { User } from "./User";

export class Comment {
  constructor(public id: number, public message: string, public author: User) {}
}
