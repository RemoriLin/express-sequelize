import { db } from '@/database/databaseConnection'
import Thread from '@/database/model/thread'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { createThreadSchema, updateThreadSchema } from '../schema'
import User from '@/database/model/user'
import ThreadComment from '@/src/database/model/threadComment'
import {
  CreateThreadDto,
  ThreadDetailDto,
  ThreadDto,
  UpdateThreadDto,
} from '../dto'
import { ThreadQueryRepository } from './threadQueryRepository'
import { Request } from 'express'

export class ThreadRepository {
  async add(formData: CreateThreadDto): Promise<ThreadDto> {
    let data: any

    formData.publishedDate = null

    if (formData.status === 'publish') {
      formData.publishedDate = new Date()
    }

    createThreadSchema.validateSync(formData)

    await db.sequelize!.transaction(async (transaction) => {
      data = await Thread.create({ ...formData }, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<Thread> {
    const data = await Thread.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<ThreadDetailDto> {
    const data = await Thread.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        {
          model: ThreadComment,
          include: [{ model: User, attributes: ['id', 'fullname'] }],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(req: Request): Promise<ThreadDto[]> {
    const query = new ThreadQueryRepository(req)

    const data = await Thread.findAll({
      include: [{ model: User, attributes: ['id', 'fullname'] }],
    })

    return data
  }

  async update(id: string, formData: UpdateThreadDto): Promise<void> {
    formData.publishedDate = null

    if (formData.status === 'publish') {
      formData.publishedDate = new Date()
    }

    updateThreadSchema.validateSync(formData)

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
