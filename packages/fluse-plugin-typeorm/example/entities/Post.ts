import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column()
  title!: string;

  @ManyToOne(() => User, (user) => user.posts)
  author!: User;
}
