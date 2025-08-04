import { db } from '@/database/databaseConnection'
import ThreadComment from '@/src/database/model/threadComment'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import User from '@/database/model/user'
import Thread from '@/database/model/thread'
import {
  CreateThreadCommentDto,
  ThreadCommentDetailDto,
  ThreadCommentDto,
  UpdateThreadCommentDto,
} from '../dto'
import { ThreadCommentQueryRepository } from './threadCommentQueryRepository'
import { Request } from 'express'
import { createThreadCommentSchema, updateThreadCommentSchema } from '../schema'

export class ThreadCommentRepository {
  async add(formData: CreateThreadCommentDto): Promise<ThreadCommentDto> {
    let data: any

    createThreadCommentSchema.validateSync(formData)

    await db.sequelize!.transaction(async (transaction) => {
      data = await ThreadComment.create({ ...formData }, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<ThreadComment> {
    const data = await ThreadComment.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<ThreadCommentDetailDto> {
    const data = await ThreadComment.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        {
          model: Thread,
          include: [{ model: User, attributes: ['id', 'fullname'] }],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(req: Request): Promise<ThreadCommentDto[]> {
    const query = new ThreadCommentQueryRepository(req)

    const data = await ThreadComment.findAll({
      include: [{ model: User, attributes: ['id', 'fullname'] }],
    })

    return data
  }

  async update(id: string, formData: UpdateThreadCommentDto): Promise<void> {
    updateThreadCommentSchema.validateSync(formData)

    await db.sequelize!.transaction(async (transaction) => {
      const data = await this.getByPk(id)

      await data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
