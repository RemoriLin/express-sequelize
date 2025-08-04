import { Request } from 'express'
import { ThreadQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class ThreadQueryRepository extends BaseQueryRequest {
  public title?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as ThreadQueryFilterDto

    this.title = query.title
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<ThreadQueryFilterDto>[] = []

    if (this.title) {
      whereCondition.push({
        title: {
          [Op.like]: `%${this.title}%`,
        },
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
