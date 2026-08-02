/** Words per minute used for the reading estimate shown on cards. */
export const WORDS_PER_MINUTE = 200;

export function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function readingMinutesFromWordCount(wordCount: number): number {
  if (wordCount <= 0) return 1;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
