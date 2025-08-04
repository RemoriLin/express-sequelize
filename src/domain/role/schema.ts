import * as yup from 'yup'

export const roleSchema = yup.object().shape({
  name: yup.string().required('Role name is required'),
})
