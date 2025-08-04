import { Request } from 'express'
import Category from '@/database/model/category'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { CategoryQueryRepository } from './categoryQueryRepository'
import { CreateCategoryDto, CategoryDto, UpdateCategoryDto } from '../dto'

export class CategoryRepository {
  async getAll(req: Request): Promise<CategoryDto[]> {
    const query = new CategoryQueryRepository(req)

    const data = await Category.findAll(query.queryFilter())

    return data
  }

  async getByPk(id: string): Promise<Category> {
    const data = await Category.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateCategoryDto): Promise<CategoryDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Category.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateCategoryDto): Promise<void> {
    const data = await this.getByPk(id)

    await db.sequelize!.transaction(async (transaction) => {
      data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
