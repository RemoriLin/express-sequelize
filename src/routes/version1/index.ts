import express, { Router } from 'express'
import { RoleController } from './controller/role.controller'
import { AuthController } from './controller/auth.controller'
import { ArticleController } from './controller/article.controller'
import { CategoryController } from './controller/category.controller'
import { CalculatorController } from './controller/calc.controller'
import { ThreadController } from './controller/thread.controller'
import { ThreadCommentController } from './controller/threadComment.controller'

const Route: Router = express.Router()

Route.use('/role', RoleController)
Route.use('/auth', AuthController)
Route.use('/article', ArticleController)
Route.use('/category', CategoryController)
Route.use('/calc', CalculatorController)
Route.use('/thread', ThreadController)
Route.use('/thread-comment', ThreadCommentController)

export { Route as v1Route }
