export interface CalculateDailyNutritionDto {
  weight: number
  height: number
  age: number
  ageUnit: string
  gender: string
  activityLevel: string
}

export interface CalculateChildGrowDto {
  weight: number
  height: number
  age: number
  ageUnit: string
  gender: string
}

export interface ChildGrowResponseDto {
  wfa: {
    status: string
    zScore: number
  }
  hfa: {
    status: string
    zScore: number
  }
}

export interface DailyNutritionResponseDto {
  calory: number
  fat: number
  carb: number
  protein: number
}
