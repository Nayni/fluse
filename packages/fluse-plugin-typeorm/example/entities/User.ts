import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column()
  username!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];
}
