import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  username!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];
}
