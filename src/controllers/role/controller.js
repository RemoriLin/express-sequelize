import routes from '@routes/v1'
import RoleService from './service'
import RoleId from '@constants/ConstRole'
import asyncHandler from '@helpers/asyncHandler'
import permissions from '@middlewares/permission'
import authorization from '@middlewares/authorization'
import HttpResponse from '@modules/response/HttpResponse'

routes.get(
  '/role',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const data = await RoleService.findAll(req)

    const httpResponse = HttpResponse.get(data)

    res.status(200).json(httpResponse)
  })
)

routes.get(
  '/role/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await RoleService.findById(id)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

routes.post(
  '/role',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const formData = req.body

    const txn = await req.transaction

    const data = await RoleService.create(formData, txn)

    const httpResponse = HttpResponse.created({ data })

    res.status(200).json(httpResponse)
  })
)

routes.put(
  '/role/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    const formData = req.body

    await RoleService.update(id, formData, txn)

    const httpResponse = HttpResponse.updated()

    res.status(200).json(httpResponse)
  })
)

routes.delete(
  '/role/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    await RoleService.delete(id, txn)

    const httpResponse = HttpResponse.deleted()

    res.status(200).json(httpResponse)
  })
)
