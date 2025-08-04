import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request } from 'express'
import { CalcRepository } from '@/domain/calc/repository/calcRepository'
import HttpResponse from '@/lib/http/HttpResponse'
import { dailyNutritionSchema } from '@/domain/calc/schema'

const service = new CalcRepository()

const route = express.Router()

route.get(
  '/daily-nutrition',
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = dailyNutritionSchema.validateSync(formData)

    const data = service.calculateDailyNutrition(values)

    const httpResponse = HttpResponse.get({
      message: 'Success calculate daily nutrition',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.get(
  '/child-grow',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.checkChildGrow(values)

    const httpResponse = HttpResponse.get({
      message: 'Success check child grow',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as CalculatorController }
