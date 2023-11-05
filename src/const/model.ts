export const MODEL_NAMES = [
    'multi2_12',
    'multi1_20',
    '1hour4',
    'first2_l'
] as const;

export type ModelName = typeof MODEL_NAMES[number];
