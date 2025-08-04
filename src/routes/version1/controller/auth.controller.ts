import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request } from 'express'
import { AuthService } from '@/domain/auth/repository/authRepository'
import HttpResponse from '@/lib/http/HttpResponse'
import { RoleId } from '@/lib/constant/roleIds'
import { loginSchema, registerSchema } from '@/domain/auth/schema'

const service = new AuthService()

const route = express.Router()

route.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = registerSchema.validateSync(formData)

    const data = await service.register({ ...values, RoleId: RoleId.user })

    const httpResponse = HttpResponse.created({
      message: 'User registered successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = loginSchema.validateSync(formData)

    const data = await service.login(values)

    const httpResponse = HttpResponse.get({
      message: 'Login successfully',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as AuthController }
