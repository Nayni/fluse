import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  message!: string;

  @ManyToOne(() => User, (author) => author.comments)
  author!: User;
}
