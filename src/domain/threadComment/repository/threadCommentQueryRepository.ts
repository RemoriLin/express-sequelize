import { Request } from 'express'
import { ThreadCommentQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class ThreadCommentQueryRepository extends BaseQueryRequest {
  public message?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as ThreadCommentQueryFilterDto

    this.message = query.message
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<ThreadCommentQueryFilterDto>[] = []

    if (this.message) {
      whereCondition.push({
        message: {
          [Op.like]: `%${this.message}%`,
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
