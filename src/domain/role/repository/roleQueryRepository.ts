import { Request } from 'express'
import { RoleQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class RoleQueryRepository extends BaseQueryRequest {
  public name?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as RoleQueryFilterDto

    this.name = query.name
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<RoleQueryFilterDto>[] = []

    if (this.name) {
      whereCondition.push({
        name: {
          [Op.like]: `%${this.name}%`,
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
