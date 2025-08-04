import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import User from './user'
import ThreadComment from './threadComment'

@Table({ tableName: 'thread' })
export default class Thread extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  title: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  description: string

  @Column({ allowNull: true, type: DataTypes.DATE })
  publishedDate: Date | null

  @Column({ allowNull: false, type: DataTypes.ENUM('draft', 'publish') })
  status: string

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  AuthorId: string

  @BelongsTo(() => User)
  author: User

  @HasMany(() => ThreadComment)
  threadComment: ThreadComment[]
}
