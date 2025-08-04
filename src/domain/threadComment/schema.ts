import * as yup from 'yup'

export const createThreadCommentSchema = yup.object().shape({
  message: yup.string().required('Title is required'),
  UserId: yup.string().required('UserId is required'),
  ThreadId: yup.string().required('ThreadId is required'),
})

export const updateThreadCommentSchema = createThreadCommentSchema.omit([
  'UserId',
  'ThreadId',
])
