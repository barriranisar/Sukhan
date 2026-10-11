export type SavedWord = {
  key: string; word: string; roman: string; meaningUrdu: string; meaningEnglish: string;
  pronunciation: string; couplet: string; poet: string; coupletId: number;
};
const read = <T,>(k: string): T[] => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; } };
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));
export const VOCAB = "savedVocabulary";
export const COUPLETS = "savedCouplets";
export const getVocab = () => read<SavedWord>(VOCAB);
export const setVocab = (v: SavedWord[]) => write(VOCAB, v);
export const getSavedCouplets = () => read<number>(COUPLETS);
export const setSavedCouplets = (v: number[]) => write(COUPLETS, v);
export const speakUrdu = (t: string) => {
  if (typeof speechSynthesis === "undefined") return;
  const u = new SpeechSynthesisUtterance(t); u.lang = "ur-PK"; u.rate = 0.8;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
};
