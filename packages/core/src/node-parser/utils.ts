import type { TextSplitter } from "./base";
import SentenceTokenizer from "./sentence_tokenizer";

export type TextSplitterFn = (text: string) => string[];

export const truncateText = (
  text: string,
  textSplitter: TextSplitter,
): string => {
  const chunks = textSplitter.splitText(text);
  return chunks[0] ?? text;
};

const splitTextKeepSeparator = (text: string, separator: string): string[] => {
  const parts = text.split(separator);
  const result = parts.map((part, index) =>
    index > 0 ? separator + part : part,
  );
  return result.filter((s) => s);
};

export const splitBySep = (
  sep: string,
  keepSep: boolean = true,
): TextSplitterFn => {
  if (keepSep) {
    return (text: string) => splitTextKeepSeparator(text, sep);
  } else {
    return (text: string) => text.split(sep);
  }
};

export const splitByChar = (): TextSplitterFn => {
  return (text: string) => text.split("");
};

let sentenceTokenizer: SentenceTokenizer | null = null;

export const splitBySentenceTokenizer = (): TextSplitterFn => {
  if (!sentenceTokenizer) {
    sentenceTokenizer = new SentenceTokenizer([
      // TODO: This should be improved. Take a look at: https://github.com/run-llama/LlamaIndexTS/issues/2019
      // English
      "i.e.",
      "etc.",
      "vs.",
      "Inc.",
      "A.S.A.P.",
      "Mr.",
      "Mrs.",
      "Ms.",
      "Dr.",
      "Prof.",
      "Sr.",
      "Jr.",
      // Spanish
      "Sr.",
      "Sres.",
      "Srs.",
      "Sra.",
      "Sras.",
      "Srta.",
      "Srtas.",
      "Dr.",
      "Drs.",
      "Dra.",
      "Dras.",
      "Prof.",
      "Profs.",
      "Profa.",
      "Profas.",
      "Ing.",
      "Lic.",
      "Arq.",
      "Ab.",
      "Abs.",
      "Tel.",
      "a.m.",
      "p.m.",
      "Art.",
    ]);
  }
  const tokenizer = sentenceTokenizer;
  return (text: string) => {
    try {
      return tokenizer.tokenize(text);
    } catch {
      return [text];
    }
  };
};

export const splitByRegex = (regex: string): TextSplitterFn => {
  return (text: string) => text.match(new RegExp(regex, "g")) || [];
};

export const splitByPhraseRegex = (): TextSplitterFn => {
  const regex = "[^,.;]+[,.;]?";
  return splitByRegex(regex);
};
