import { CategoryRepository } from '@/domain/category/repository/categoryRepository'
import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/lib/http/HttpResponse'
import { categorySchema } from '@/domain/category/schema'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/lib/constant/roleIds'
import _ from 'lodash'

const repository = new CategoryRepository()

const route = express.Router()

route.post(
  '/',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = categorySchema.validateSync(formData)

    const data = await repository.add(values)

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.get(
  '/',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const data = await repository.getAll(req)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await repository.getByPk(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await repository.delete(id)

    const httpResponse = HttpResponse.deleted({
      message: 'Data deleted successfully',
    })

    res.status(200).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = categorySchema.validateSync(formData)

    const id = req.params.id

    const data = await repository.update(id, values)

    const httpResponse = HttpResponse.created({
      message: 'Data updated successfully',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as CategoryController }
