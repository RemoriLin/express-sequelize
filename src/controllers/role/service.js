import roleSchema from './schema'
import models from '@database/models/index'
import ResponseError from '@modules/response/ResponseError'
import PluginSqlizeQuery from '@modules/SqlizeQuery/PluginSqlizeQuery'
import db from '../../database/data-source'

const { Role } = models
class RoleService {
  constructor() {}

  static async findAll(req) {
    const { filtered } = req.query
    const rawIncludes = []

    const includeQueryable = PluginSqlizeQuery.makeIncludeQueryable(
      filtered,
      rawIncludes
    )

    const { includeCount, ...restQuery } = PluginSqlizeQuery.generate(
      req,
      Role,
      includeQueryable
    )

    const data = await Role.findAll({
      ...restQuery,
    })

    const total = await Role.count({
      include: includeCount,
      where: restQuery.where,
    })

    return {
      data,
      total,
    }
  }

  static async findById(id) {
    const data = await Role.findOne({ where: { id } })

    if (!data) {
      throw new ResponseError.NotFound('data not found')
    }

    return data
  }

  static async create(formData) {
    const value = roleSchema.create.validateSync(formData)

    let data

    await db.sequelize.transaction(async (transaction) => {
      data = await Role.create(value, { transaction })
    })

    return data
  }

  static async update(id, formData) {
    let data = await this.findById(id)

    const value = roleSchema.create.validateSync(formData)

    await db.sequelize.transaction(async (transaction) => {
      data = await data.update(value, { transaction })
    })

    return data
  }

  static async delete(id) {
    const data = await this.findById(id)

    await db.sequelize.transaction(async (transaction) => {
      await data.destroy({ transaction })
    })
  }
}

module.exports = RoleService
