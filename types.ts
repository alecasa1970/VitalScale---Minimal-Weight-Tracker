
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface UserProfile {
  height: number; // in cm
  age?: number;
  targetWeight?: number;
  name?: string;
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese' | 'Unknown';

export interface BMIResult {
  value: number;
  category: BMICategory;
  color: string;
  idealRange: {
    min: number;
    max: number;
  };
  toIdeal: number; // weight difference to reach normal range
}
