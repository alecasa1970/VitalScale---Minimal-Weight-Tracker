
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface AerobicEntry {
  id: string;
  distance: number; // in km
  duration: number; // in minutes
  date: string;
}

export interface UserProfile {
  height: number; // in cm
  age?: number;
  targetWeight?: number;
  name?: string;
  photo?: string; // base64 string
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
