import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .email({ message: 'invalid email address' })
    .required("Email can't be empty"),
  password: yup
    .string()
    .min(8, 'Password min 8 characters')
    .required("Password can't be empty"),
})

export const registerSchema = yup.object({
  fullname: yup.string().required("Fullname can't be empty"),
  email: yup
    .string()
    .email({ message: 'Invalid email address' })
    .required("Email can't be empty"),
  newPassword: yup
    .string()
    .min(8, 'New password min 8 characters')
    .required("New password can't be empty"),
  confirmNewPassword: yup
    .string()
    .min(8, 'Confirm new password min 8 characters')
    .required("Confirm new password can't be empty")
    .oneOf(
      [yup.ref('newPassword')],
      "New password and confirm new password don't match"
    ),
  RoleId: yup.string().required("RoleId can't be empty"),
})
