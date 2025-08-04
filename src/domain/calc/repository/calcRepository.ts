import { childGrowSchema, dailyNutritionSchema } from '../schema'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import WhoStandardChildGrow from '@/database/model/whoStandardChildGrow'
import {
  CalculateChildGrowDto,
  CalculateDailyNutritionDto,
  ChildGrowResponseDto,
  DailyNutritionResponseDto,
} from '../dto'

export class CalcRepository {
  calculateDailyNutrition(
    formData: CalculateDailyNutritionDto
  ): DailyNutritionResponseDto {
    const ageInYears =
      formData.ageUnit === 'month' ? formData.age / 12 : formData.age

    const basalEnergy = this._calculateBasalEnergy(
      formData.weight,
      formData.height,
      ageInYears,
      formData.gender
    )

    const totalCalories = this._calculateTotalCalories(
      basalEnergy,
      formData.activityLevel,
      ageInYears,
      formData.gender
    )

    const macronutrients = this._calculateMacronutrients(
      totalCalories,
      ageInYears
    )

    const result: DailyNutritionResponseDto = {
      calory: Math.round(totalCalories),
      protein: Math.round(macronutrients.protein),
      carb: Math.round(macronutrients.karbohidrat),
      fat: Math.round(macronutrients.lemak),
    }

    return result
  }

  private _calculateBasalEnergy(
    weight: number,
    height: number,
    ageInYears: number,
    gender: string | 'm' | 'f'
  ) {
    if (ageInYears >= 19) {
      if (gender === 'M') {
        return 10 * weight + 6.25 * height - 5 * ageInYears + 5
      } else {
        return 10 * weight + 6.25 * height - 5 * ageInYears - 161
      }
    } else if (ageInYears >= 10) {
      if (gender === 'M') {
        return 17.5 * weight + 651
      } else {
        return 12.2 * weight + 746
      }
    } else if (ageInYears >= 3) {
      if (gender === 'M') {
        return 22.7 * weight + 495
      } else {
        return 22.5 * weight + 499
      }
    } else {
      if (gender === 'M') {
        return 60.9 * weight - 54
      } else {
        return 61.0 * weight - 51
      }
    }
  }

  private _calculateTotalCalories(
    basalEnergy: number,
    activityLevel: string | 'sedentary' | 'light' | 'moderate' | 'heavy',
    ageInYears: number,
    gender: string | 'f' | 'm'
  ) {
    let pal
    if (ageInYears >= 19) {
      switch (activityLevel) {
        case 'sedentary':
          pal = 1.2
          break
        case 'light':
          pal = 1.375
          break
        case 'moderate':
          pal = 1.55
          break
        case 'heavy':
          pal = 1.725
          break
        default:
          pal = 1.2
      }
    } else if (ageInYears >= 9) {
      if (gender === 'M') {
        if (activityLevel === 'heavy') pal = 2.1
        else if (activityLevel === 'moderate' || activityLevel === 'light')
          pal = 1.8
        else pal = 1.5
      } else {
        if (activityLevel === 'heavy') pal = 2.0
        else if (activityLevel === 'moderate' || activityLevel === 'light')
          pal = 1.7
        else pal = 1.4
      }
    } else {
      if (activityLevel === 'heavy' || activityLevel === 'moderate') pal = 1.6
      else pal = 1.4
    }
    return basalEnergy * pal
  }

  private _calculateMacronutrients(totalCalories: number, ageInYears: number) {
    let proteinPercent, fatPercent, carbPercent

    if (ageInYears >= 19) {
      proteinPercent = 0.2
      fatPercent = 0.3
      carbPercent = 0.5
    } else {
      proteinPercent = 0.15
      fatPercent = 0.3
      carbPercent = 0.55
    }

    const proteinGrams = (totalCalories * proteinPercent) / 4
    const fatGrams = (totalCalories * fatPercent) / 9
    const carbGrams = (totalCalories * carbPercent) / 4

    return {
      protein: proteinGrams,
      lemak: fatGrams,
      karbohidrat: carbGrams,
    }
  }

  async checkChildGrow(
    formData: CalculateChildGrowDto
  ): Promise<ChildGrowResponseDto> {
    const ageInMonths =
      formData.ageUnit === 'year' ? formData.age * 12 : formData.age

    const lmsWfa = await this._getLMSParameters(
      'wfa',
      ageInMonths,
      formData.gender
    )

    const zScoreWfa = this._calculateZScore(
      formData.weight,
      lmsWfa.L,
      lmsWfa.M,
      lmsWfa.S
    )
    const statusWfa = this._getNutritionStatus('wfa', zScoreWfa)

    const lmsHfa = await this._getLMSParameters(
      'hfa',
      ageInMonths,
      formData.gender
    )
    const zScoreHfa = this._calculateZScore(
      formData.height,
      lmsHfa.L,
      lmsHfa.M,
      lmsHfa.S
    )

    const status_hfa = this._getNutritionStatus('hfa', zScoreHfa)

    return {
      wfa: {
        status: statusWfa,
        zScore: zScoreWfa,
      },
      hfa: {
        status: status_hfa,
        zScore: zScoreHfa,
      },
    }
  }

  private async _getLMSParameters(
    indicator: string | 'hfa' | 'wfa',
    ageInMonths: number,
    gender: string | 'f' | 'm'
  ) {
    const roundedAge = Math.round(ageInMonths)

    const params = await WhoStandardChildGrow.findOne({
      where: {
        type: indicator,
        gender,
        month: roundedAge,
      },
      attributes: ['L', 'M', 'S'],
    })

    if (!params) {
      throw new ErrorResponse.NotFound('LMS Parameter not found')
    }

    return params
  }

  private _calculateZScore(value: number, L: number, M: number, S: number) {
    if (L === 0) {
      return Math.log(value / M) / S
    }
    const zScore = (Math.pow(value / M, L) - 1) / (L * S)
    return zScore
  }

  _getNutritionStatus(indicator: string | 'wfa' | 'hfa', zScore: number) {
    if (indicator === 'hfa') {
      if (zScore > 3) return 'Tinggi (Tall)'
      if (zScore < -3) return 'Sangat Pendek (Severely Stunted)'
      if (zScore < -2) return 'Pendek (Stunted)'
      return 'Normal'
    }

    if (indicator === 'wfa') {
      if (zScore < -3) return 'Berat Badan Sangat Kurang (Severely Underweight)'
      if (zScore < -2) return 'Berat Badan Kurang (Underweight)'
      if (zScore > 2) return 'Berat Badan Lebih (Overweight)'
      return 'Normal'
    }

    return 'Indikator tidak dikenali'
  }
}
