import { FileParams } from '@/lib/module/multer'

export interface ArticleDto {
  id: string
  title: string
  description: string
  image: string
  status: string
  publishedDate: Date | null
  CategoryId: string
  AuthorId: string
  category: {
    id: string
    name: string
  }
  author: {
    id: string
    fullname: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateArticleDto {
  title: string
  description: string
  image: string
  status: string
  publishedDate: Date | null
  CategoryId: string
  AuthorId: string
}

export interface UpdateArticleDto {
  title: string
  description: string
  image: string
  status: string
  publishedDate: Date | null
  CategoryId: string
}

export interface ArticleQueryFilterDto {
  title: string
  description: string
  status: string
  publishedDate: Date | null
  CategoryId: string
  AuthorId: string
}
