import * as yup from 'yup'

export const createThreadSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  publishedDate: yup.date().required('Published date is required').nullable(),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], "status must be one of 'draft' or 'publish'")
    .required('Status is required'),
  AuthorId: yup.string().required('AuthorId is required'),
})

export const updateThreadSchema = createThreadSchema.omit(['AuthorId'])
