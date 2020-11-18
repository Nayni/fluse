import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  title!: string;

  @Column("text")
  body!: string;

  @ManyToOne(() => User, (author) => author.posts)
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];
}
