import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { logger } from '@/config/httplogger.config'
import asyncHandler from '@/helper/asyncHandler'
import User from '@/database/model/user'
import { UserLoginState } from '@/domain/user/dto'
import { ErrorResponse } from '@/lib/http/ErrorResponse'

export function permissionAccess(roleIds: string[]) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const repo = {
        user: User,
      }

      const { uid: user_id } = req.getState('userLoginState') as UserLoginState
      const getUser = await repo.user.findOne({ where: { id: user_id } })

      const errType = `permitted access error:`
      const errMessage = 'you are not allowed'

      if (getUser && !roleIds.includes(getUser.RoleId)) {
        const msgType = green('permission')
        logger.error(`${msgType} - ${errType} ${errMessage}`)

        throw new ErrorResponse.Forbidden(`${errType} ${errMessage}`)
      }

      next()
    }
  )
}

export function notPermittedAccess(roleIds: string[]) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const repo = {
        user: User,
      }

      const { uid: user_id } = req.getState('userLoginState') as UserLoginState
      const getUser = await repo.user.findOne({ where: { id: user_id } })

      const errType = `not permitted access error:`
      const errMessage = 'you are not allowed'

      if (getUser && roleIds.includes(getUser.RoleId)) {
        const msgType = green('permission')
        logger.error(`${msgType} - ${errType} ${errMessage}`)

        throw new ErrorResponse.Forbidden(`${errType} ${errMessage}`)
      }

      next()
    }
  )
}
