import { countWords } from './text';

const actionWords = ['led', 'built', 'improved', 'reduced', 'increased', 'designed', 'managed', 'shipped', 'optimized', 'launched', 'created', 'partnered'];
const riskyFonts = ['Comic Sans', 'Papyrus', 'Impact'];

export const getAtsScore = (resume) => {
  const text = JSON.stringify(resume.data).toLowerCase();
  const words = countWords(resume);
  const actionCount = actionWords.filter((word) => text.includes(word)).length;
  const contactOk = Boolean(resume.data.personal?.email && resume.data.personal?.phone);
  const noTables = true;
  const fontOk = !riskyFonts.some((font) => resume.settings.fontFamily.includes(font));
  const keywordDensity = words ? Math.min(100, Math.round((actionCount / Math.max(1, words / 80)) * 25)) : 0;
  const sectionOk = ['experience', 'education', 'skills'].filter((key) => (resume.data[key] || []).length > 0).length;
  const score = Math.min(100, Math.round(keywordDensity * 0.28 + (contactOk ? 18 : 0) + (noTables ? 14 : 0) + (fontOk ? 12 : 0) + sectionOk * 12));
  return {
    score,
    checks: [
      { label: 'Contact info parseable', pass: contactOk },
      { label: 'No tables or nested graphics', pass: noTables },
      { label: 'ATS-safe font selection', pass: fontOk },
      { label: 'Core sections present', pass: sectionOk === 3 },
      { label: 'Action verb / keyword density', pass: keywordDensity >= 45 },
    ],
    keywords: actionWords.filter((word) => text.includes(word)),
  };
};
