import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({ name: 'users' })
export class PostgresUser extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ nullable: true })
    facebookId?: string

  @Column({ nullable: true })
    pictureUrl?: string

  @Column({ nullable: true })
    initials?: string
}
