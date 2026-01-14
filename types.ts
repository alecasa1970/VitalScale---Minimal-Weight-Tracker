
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface UserProfile {
  height: number; // in cm
  targetWeight?: number;
  name?: string;
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese' | 'Unknown';

export interface BMIResult {
  value: number;
  category: BMICategory;
  color: string;
}
