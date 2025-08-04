import { Request } from 'express'
import Article from '@/database/model/article'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { ArticleQueryRepository } from './articleQueryRepository'
import { CreateArticleDto, ArticleDto, UpdateArticleDto } from '../dto'
import { IncludeOptions } from 'sequelize'
import Category from '@/database/model/category'
import User from '@/database/model/user'

export class ArticleRepository {
  async getAll(req: Request): Promise<ArticleDto[]> {
    const includeOptions: IncludeOptions[] = [
      { model: Category, attributes: ['id', 'name'] },
      { model: User, attributes: ['id', 'fullname'] },
    ]

    const query = new ArticleQueryRepository(req)

    const data: ArticleDto[] = await Article.findAll({
      ...query.queryFilter(),
      include: includeOptions,
    })

    return data
  }

  async getByPk(id: string): Promise<Article> {
    const data = await Article.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<ArticleDto> {
    const includeOptions: IncludeOptions[] = [
      { model: Category, attributes: ['id', 'name'] },
      { model: User, attributes: ['id', 'fullname'] },
    ]

    const data = await Article.findOne({
      where: { id },
      include: includeOptions,
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data as ArticleDto
  }

  async add(formData: CreateArticleDto): Promise<ArticleDto> {
    let data: any

    formData.publishedDate = null

    if (formData.status === 'publish') formData.publishedDate = new Date()

    await db.sequelize!.transaction(async (transaction) => {
      data = await Article.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateArticleDto): Promise<void> {
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
