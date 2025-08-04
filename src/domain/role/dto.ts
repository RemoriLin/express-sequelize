export interface RoleDto {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateRoleDto {
  name: string
}

export interface UpdateRoleDto {
  name: string
}

export interface RoleQueryFilterDto {
  name: string
}
