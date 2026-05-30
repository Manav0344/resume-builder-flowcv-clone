import { sectionCatalog } from '../data/defaultResume';

const checks = {
  personal: (d) => ['name', 'title', 'email', 'phone', 'location'].filter((k) => d.personal?.[k]).length >= 4,
  summary: (d) => (d.summary || '').trim().length >= 80,
  experience: (d) => (d.experience || []).some((e) => e.company && e.role && (e.bullets || []).some(Boolean)),
  education: (d) => (d.education || []).some((e) => e.institution && e.degree),
  skills: (d) => (d.skills || []).length >= 5,
  projects: (d) => (d.projects || []).some((p) => p.title && p.description),
  certifications: (d) => (d.certifications || []).length > 0,
  languages: (d) => (d.languages || []).length > 0,
  volunteer: (d) => (d.volunteer || []).length > 0,
  awards: (d) => (d.awards || []).length > 0,
  publications: (d) => (d.publications || []).length > 0,
  references: (d) => d.references?.availableOnRequest || (d.references?.items || []).length > 0,
  custom: (d) => Boolean(d.custom?.title && d.custom?.content),
};

export const getCompleteness = (resume) => {
  const visible = resume.sections.filter((s) => s.visible);
  const items = visible.map((section) => ({
    id: section.id,
    title: section.title,
    done: checks[section.type]?.(resume.data) ?? false,
  }));
  const requiredWeight = { personal: 18, summary: 12, experience: 18, education: 10, skills: 14, projects: 8 };
  const optionalWeight = 20 / Math.max(1, sectionCatalog.length - Object.keys(requiredWeight).length);
  const total = items.reduce((sum, item) => sum + (requiredWeight[item.id] || optionalWeight), 0);
  const done = items.reduce((sum, item) => sum + (item.done ? requiredWeight[item.id] || optionalWeight : 0), 0);
  return { score: Math.min(100, Math.round((done / total) * 100)), items };
};
