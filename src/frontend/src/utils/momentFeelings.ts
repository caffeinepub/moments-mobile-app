// Single source of truth for moment feelings/emotions

export type MomentFeeling = 
  | 'Joyful'
  | 'Grateful'
  | 'Peaceful'
  | 'Excited'
  | 'Loved'
  | 'Content'
  | 'Hopeful'
  | 'Proud'
  | 'Meaningful'
  | 'Good'
  | 'Okay'
  | 'Reflective';

export interface FeelingOption {
  value: MomentFeeling;
  label: string;
  emoji: string;
}

export const FEELING_OPTIONS: FeelingOption[] = [
  { value: 'Joyful', label: 'Joyful', emoji: '😊' },
  { value: 'Grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'Peaceful', label: 'Peaceful', emoji: '😌' },
  { value: 'Excited', label: 'Excited', emoji: '🤩' },
  { value: 'Loved', label: 'Loved', emoji: '❤️' },
  { value: 'Content', label: 'Content', emoji: '😊' },
  { value: 'Hopeful', label: 'Hopeful', emoji: '🌟' },
  { value: 'Proud', label: 'Proud', emoji: '💪' },
  { value: 'Meaningful', label: 'Meaningful', emoji: '✨' },
  { value: 'Good', label: 'Good', emoji: '🙂' },
  { value: 'Okay', label: 'Okay', emoji: '😐' },
  { value: 'Reflective', label: 'Reflective', emoji: '🤔' }
];

/**
 * Get the emoji for a given feeling value
 */
export function getFeelingEmoji(feeling: MomentFeeling): string {
  const option = FEELING_OPTIONS.find(opt => opt.value === feeling);
  return option?.emoji || '😊';
}

/**
 * Get the label for a given feeling value
 */
export function getFeelingLabel(feeling: MomentFeeling): string {
  const option = FEELING_OPTIONS.find(opt => opt.value === feeling);
  return option?.label || feeling;
}

/**
 * Get the full feeling option for a given value
 */
export function getFeelingOption(feeling: MomentFeeling): FeelingOption | undefined {
  return FEELING_OPTIONS.find(opt => opt.value === feeling);
}
