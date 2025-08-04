import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request, NextFunction } from 'express'
import { ArticleRepository } from '@/domain/article/repository/articleRepository'
import HttpResponse from '@/lib/http/HttpResponse'
import authorization from '@/middleware/authorization'
import { FileParams, useMulter } from '@/lib/module/multer'
import _ from 'lodash'
import { CreateArticleDto } from '@/domain/article/dto'
import { createArticleSchema } from '@/domain/article/schema'

const service = new ArticleRepository()

const route = express.Router()

const uploadFile = useMulter({
  dest: 'public/uploads',
}).fields([{ name: 'image', maxCount: 1 }])

const setFileToBody = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const file_upload = req.pickSingleFieldMulter(['image'])
    req.setBody(file_upload)
    next()
  }
)

route.post(
  '/',
  authorization(),
  uploadFile,
  setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    const formData: CreateArticleDto = req.getBody()

    const image = _.get(formData, 'image', {}) as FileParams

    if (image)
      formData.image = `${image.destination.split('/')[1]}/${image.filename}`

    const values = createArticleSchema.validateSync({
      ...formData,
      publishedDate: null,
      AuthorId: req.getState('userLoginState').uid,
    })

    const data = await service.add(values)

    const httpResponse = HttpResponse.created({
      message: 'Article created successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getAll(req)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.getById(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

// route.put(
//   '/:id',
//   authorization(),
//   uploadFile,
//   setFileToBody,
//   asyncHandler(async (req: Request, res: Response) => {
//     const values = req.getBody()

//     values.publishedDate = null

//     const id = req.params.id

//     const image = _.get(values, 'image', {}) as FileParams

//     if (values.status === 'publish') {
//       values.publishedDate = new Date()
//     }

//     const data = await service.update(id, {
//       ...values,
//       image: `${image.destination.split('/')[1]}/${image.filename}`,
//     })

//     const httpResponse = HttpResponse.updated({
//       message: 'Article updated successfully',
//       data,
//     })

//     res.status(200).json(httpResponse)
//   })
// )

route.delete(
  '/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.delete(id)

    const httpResponse = HttpResponse.deleted({
      message: 'Data deleted successfully',
    })

    res.status(200).json(httpResponse)
  })
)

export { route as ArticleController }
