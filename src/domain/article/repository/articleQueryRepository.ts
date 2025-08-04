import { Request } from 'express'
import { ArticleQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class ArticleQueryRepository extends BaseQueryRequest {
  public title: string
  public description: string
  public status: string
  public publishedDate: Date | null
  public CategoryId: string
  public AuthorId: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as ArticleQueryFilterDto

    this.title = query.title
    this.description = query.description
    this.status = query.status
    this.publishedDate = query.publishedDate
    this.CategoryId = query.CategoryId
    this.AuthorId = query.AuthorId
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<ArticleQueryFilterDto>[] = []

    if (this.title) {
      whereCondition.push({
        title: {
          [Op.like]: `%${this.title}%`,
        },
      })
    }

    if (this.description) {
      whereCondition.push({
        description: {
          [Op.like]: `%${this.description}%`,
        },
      })
    }

    if (this.status) {
      whereCondition.push({
        status: this.status,
      })
    }

    if (this.publishedDate) {
      whereCondition.push({
        publishedDate: this.publishedDate,
      })
    }

    if (this.CategoryId) {
      whereCondition.push({
        CategoryId: this.CategoryId,
      })
    }

    if (this.AuthorId) {
      whereCondition.push({
        AuthorId: this.AuthorId,
      })
    }

    const findCondition = {
      where: {
        [Op.and]: whereCondition,
      },
      limit: this.limit,
      offset: this.offset,
      order: this.order,
    }

    return findCondition
  }
}
