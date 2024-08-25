// src/types.ts
declare module 'regression';
export type Student = {
    Name: string;
    Age: number;
    Height: number;
    Mass: number;
    Flexibility: {
      "Sit & Reach Test": number;
    };
    "Muscular Strength": {
      "Grip Strength": number;
      "Bench Press": number;
      "Leg Press": number;
    };
    "Cardiovascular Endurance": {
      "12-minute Run": number;
    };
  };
  
  export type StudentKey = "Flexibility" | "Muscular Strength" | "Cardiovascular Endurance" | "Age" | "Height" | "Mass";
  