import jwt from 'jsonwebtoken'
import authSchema from './schema'
import env from '@config/env.config'
import { compareSync } from 'bcrypt'
import models from '@database/models'
import sendMail from '@modules/sendMail'
import ResponseError from '@modules/response/ResponseError'
import db from '../../database/data-source'

const { User } = models
class AuthService {
  constructor() {}
  static async login(formData) {
    const value = authSchema.login.validateSync(formData)
    const user = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })
    if (!user) throw new ResponseError.NotFound('User not found')

    const matchPassword = compareSync(value.password, user.password)

    if (!matchPassword)
      throw new ResponseError.Unauthorized('Incorrect email or password')

    const token = jwt.sign(user.dataValues, env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRED,
    })

    return {
      message: 'success',
      token,
      fullname: user.fullname,
      userId: user.id,
    }
  }

  static async register(formData) {
    const value = authSchema.register.validateSync(formData)

    let data

    await db.sequelize.transaction(async (transaction) => {
      data = await User.create({ ...value }, { transaction })
    })

    await sendMail.registerAccount(data.email, data.fullname)

    return data
  }
}

module.exports = AuthService
