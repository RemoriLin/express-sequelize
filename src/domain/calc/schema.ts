import * as yup from 'yup'

export const dailyNutritionSchema = yup.object().shape({
  weight: yup.number().required('Weight is required'),
  height: yup.number().required('Height is required'),
  age: yup
    .number()
    .positive('Age must a positive number')
    .required('Height is required'),
  ageUnit: yup.string().oneOf(['month', 'year']).required(),
  gender: yup
    .string()
    .oneOf(['f', 'm'], "Gender must be one of 'f' or 'm'")
    .required('Gender is required'),
  activityLevel: yup
    .string()
    .oneOf(['sedentary', 'light', 'moderate', 'heavy'])
    .required('Activity level is required'),
})

export const childGrowSchema = yup.object().shape({
  weight: yup.number().positive().required('Weight is required'),
  height: yup.number().positive().required('Height is required'),
  age: yup
    .number()
    .positive('Age must be a possitive number')
    .required('Age is required'),
  ageUnit: yup
    .string()
    .oneOf(['month', 'year'], "Age unit must be one of 'month' or 'year'")
    .required('Age unit is required'),
  gender: yup
    .string()
    .oneOf(['f', 'm'], "Gender must be one of 'f' or 'm'")
    .required('Gender harus diisi'),
})
