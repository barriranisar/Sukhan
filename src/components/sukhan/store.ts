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
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  // Small delay prevents Chrome from instantly dropping utterances after cancel()
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(t);
    const voices = window.speechSynthesis.getVoices();

    // Look for an Urdu voice or fallback
    const urduVoice =
      voices.find((v) => v.lang.startsWith("ur") || v.lang.includes("Urdu")) ||
      voices.find((v) => v.lang.startsWith("hi")) ||
      null;

    if (urduVoice) {
      u.voice = urduVoice;
      u.lang = urduVoice.lang;
    } else {
      u.lang = "ur-PK";
    }

    u.rate = 0.8;
    u.pitch = 1.0;

    // Fallback web audio if browser fails to synthesize
    u.onerror = () => {
      try {
        const fallback = new Audio(
          `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(t)}&tl=ur&client=tw-ob`
        );
        fallback.play().catch(() => {});
      } catch (_) {}
    };

    window.speechSynthesis.speak(u);
  }, 50);
};
