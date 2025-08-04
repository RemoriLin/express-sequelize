export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  fullname: string
  email: string
  newPassword: string
  confirmNewPassword: string
  RoleId: string
}

export interface AuthResponseDto {
  fullname: string
  email: string
  uid: string
  accessToken: string
  expiresAt: Date
  expiresIn: number
}
