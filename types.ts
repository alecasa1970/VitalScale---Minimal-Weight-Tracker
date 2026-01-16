
export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface WaterEntry {
  id: string;
  amount: number; // em ml
  date: string;
}

export interface AerobicEntry {
  id: string;
  distance: number; // em km
  duration: number; // em minutos
  date: string;
}

export interface UserProfile {
  height: number; // em cm
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
  toIdeal: number; // diferença de peso para atingir a faixa normal
}
