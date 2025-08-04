import * as yup from 'yup'

export const createArticleSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().required('Image is required'),
  publishedDate: yup.date().required('Published date is required').nullable(),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], "status must be one of 'draft' or 'publish'")
    .required('Status is required'),
  CategoryId: yup.string().required('CategoryId is required'),
  AuthorId: yup.string().required('AuthorId is required'),
})
