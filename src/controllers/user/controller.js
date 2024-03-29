import router from 'routes/v1'
import userSchema from './schema'
import UserService from './service'
import RoleId from 'constants/ConstRole'
import asyncHandler from 'helpers/asyncHandler'
import permissions from 'middlewares/permission'
import authorization from 'middlewares/authorization'
import HttpResponse from 'modules/response/HttpResponse'

router.get(
  '/user',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const data = await UserService.findAll(req)

    const httpResponse = HttpResponse.get(data)

    res.status(200).json(httpResponse)
  })
)

router.get(
  '/user/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await UserService.findById(id)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

router.post(
  '/user',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const formData = req.body
    const data = await UserService.create(formData)

    const httpResponse = HttpResponse.created({ data })

    res.status(200).json(httpResponse)
  })
)

router.put(
  '/user/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const formData = req.body

    await UserService.update(id, formData)

    const httpResponse = HttpResponse.updated()

    res.status(200).json(httpResponse)
  })
)

router.put(
  '/user/change-password/:id',
  authorization,
  asyncHandler(async (req, res) => {
    const { id } = req.params

    await UserService.changePassword(id, req.body)

    const httpResponse = HttpResponse.updated({})

    res.status(200).json(httpResponse)
  })
)

router.delete(
  '/user/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    await UserService.delete(id)

    const httpResponse = HttpResponse.deleted()

    res.status(200).json(httpResponse)
  })
)

router.get(
  '/user-me',
  authorization,
  asyncHandler(async (req, res) => {
    const user = req.user

    const data = await UserService.findById(user.id)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

router.put(
  '/user/me/update',
  authorization,
  asyncHandler(async (req, res) => {
    const user = req.user

    const data = await UserService.findById(user.id)

    const formData = {
      ...req.body,
      RoleId: data.RoleId,
    }

    const value = userSchema.update.validateSync(formData)

    await data.update({
      ...data,
      ...value,
    })

    const httpResponse = HttpResponse.updated({})

    res.status(200).json(httpResponse)
  })
)

router.put(
  '/user/me/change-password',
  authorization,
  asyncHandler(async (req, res) => {
    const user = req.user

    await UserService.changePassword(user.id, req.body)

    const httpResponse = HttpResponse.updated({})

    res.status(200).json(httpResponse)
  })
)
