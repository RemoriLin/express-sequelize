export interface CategoryDto {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryDto {
  name: string
}

export interface UpdateCategoryDto {
  name: string
}

export interface CategoryQueryFilterDto {
  name: string
}
