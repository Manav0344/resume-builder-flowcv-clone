export const schemaVersion = 1;

export const sectionCatalog = [
  { id: 'personal', type: 'personal', title: 'Personal Info' },
  { id: 'summary', type: 'summary', title: 'Summary / Objective' },
  { id: 'experience', type: 'experience', title: 'Work Experience' },
  { id: 'education', type: 'education', title: 'Education' },
  { id: 'skills', type: 'skills', title: 'Skills' },
  { id: 'projects', type: 'projects', title: 'Projects' },
  { id: 'certifications', type: 'certifications', title: 'Certifications' },
  { id: 'languages', type: 'languages', title: 'Languages' },
  { id: 'volunteer', type: 'volunteer', title: 'Volunteer Work' },
  { id: 'awards', type: 'awards', title: 'Awards & Achievements' },
  { id: 'publications', type: 'publications', title: 'Publications' },
  { id: 'references', type: 'references', title: 'References' },
  { id: 'custom', type: 'custom', title: 'Custom Section' },
];

export const accentSwatches = ['#6366F1', '#2563EB', '#0EA5E9', '#14B8A6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#111827'];

export const fontOptions = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, Georgia, serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'Lato', value: 'Lato, Arial, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, Georgia, serif' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro, Arial, sans-serif' },
];

export const createId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;

export const makeSectionState = () => sectionCatalog.map((section) => ({ ...section, visible: true, collapsed: section.id !== 'personal', align: 'left', spacing: {} }));

export const emptyResumeData = () => ({
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    websiteLabel: 'Website',
    linkedin: '',
    linkedinLabel: 'LinkedIn',
    github: '',
    githubLabel: 'GitHub',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  volunteer: [],
  awards: [],
  publications: [],
  references: { availableOnRequest: true, items: [] },
  custom: { title: 'Additional Information', content: '' },
});

export const defaultResumeData = () => ({
  personal: {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexmorgan.design',
    websiteLabel: 'Portfolio',
    linkedin: 'linkedin.com/in/alexmorgan',
    linkedinLabel: 'LinkedIn',
    github: 'github.com/alexmorgan',
    githubLabel: 'GitHub',
    photo: '',
  },
  summary: 'Strategic product designer with 8+ years creating accessible, data-informed SaaS experiences. Skilled at translating complex customer needs into polished workflows, design systems, and measurable product outcomes.',
  experience: [
    {
      id: createId('exp'),
      company: 'Northstar Labs',
      role: 'Senior Product Designer',
      location: 'Remote',
      start: '2021-03',
      end: '',
      current: true,
      bullets: [
        'Led end-to-end redesign of enterprise analytics suite, increasing task completion by 31%.',
        'Built a tokenized design system adopted by 7 product squads and reduced UI debt by 40%.',
        'Partnered with research, engineering, and PM to ship WCAG AA-compliant workflows for 120k users.',
      ],
    },
    {
      id: createId('exp'),
      company: 'BrightLayer',
      role: 'Product Designer',
      location: 'New York, NY',
      start: '2017-06',
      end: '2021-02',
      current: false,
      bullets: [
        'Designed onboarding experiments that improved activation from 44% to 63%.',
        'Facilitated design sprints and usability testing with 80+ customers across three verticals.',
      ],
    },
  ],
  education: [
    { id: createId('edu'), institution: 'Rhode Island School of Design', degree: 'BFA', field: 'Graphic Design', gpa: '3.8', start: '2012', end: '2016', honors: 'Magna Cum Laude' },
  ],
  skills: [
    { id: createId('skill'), name: 'Product Strategy', level: 'expert', category: 'Design' },
    { id: createId('skill'), name: 'Design Systems', level: 'expert', category: 'Design' },
    { id: createId('skill'), name: 'Figma', level: 'expert', category: 'Tools' },
    { id: createId('skill'), name: 'User Research', level: 'intermediate', category: 'Research' },
    { id: createId('skill'), name: 'HTML/CSS', level: 'intermediate', category: 'Technical' },
  ],
  projects: [
    { id: createId('project'), title: 'Atlas Design System', description: 'Open design system with accessible components, usage guidelines, and contribution workflow.', tech: ['Figma', 'Storybook', 'Tokens'], liveUrl: 'atlas.example.com', liveLabel: 'Case Study', githubUrl: '', githubLabel: 'GitHub' },
  ],
  certifications: [
    { id: createId('cert'), name: 'Certified Design Sprint Facilitator', issuer: 'AJ&Smart', date: '2022', url: 'credential.example.com' },
  ],
  languages: [
    { id: createId('lang'), name: 'English', fluency: 'native' },
    { id: createId('lang'), name: 'Spanish', fluency: 'intermediate' },
  ],
  volunteer: [
    { id: createId('vol'), role: 'Mentor', org: 'Design Buddies', start: '2020', end: 'Present', description: 'Coach early-career designers on portfolio storytelling and interview readiness.' },
  ],
  awards: [
    { id: createId('award'), title: 'UX Excellence Award', issuer: 'SaaS Design Awards', date: '2023', description: 'Recognized for accessible analytics redesign.' },
  ],
  publications: [
    { id: createId('pub'), title: 'Design Tokens at Scale', journal: 'Product Design Weekly', date: '2022', url: 'publication.example.com' },
  ],
  references: {
    availableOnRequest: true,
    items: [
      { id: createId('ref'), name: 'Jamie Chen', company: 'Northstar Labs', role: 'VP Product', email: 'jamie@example.com', phone: '+1 (555) 987-6543' },
    ],
  },
  custom: { title: 'Interests', content: 'Inclusive design, generative research, typography, backpacking.' },
});

export const defaultSettings = () => ({
  template: 'manav',
  accent: '#6366F1',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontScale: 'normal',
  margins: 'normal',
  lineSpacing: 'normal',
  headingStyle: 'underline',
  photoShape: 'round',
  page: {
    topMargin: 64,
    bottomMargin: 64,
    pageGap: 56,
  },
  spacing: {
    beforeGap: 0,
    sectionGap: 16,
    itemGap: 12,
    headingGap: 8,
    paragraphGap: 6,
    bulletGap: 2,
    linkGap: 12,
    tagGap: 6,
  },
});

export const makeResume = (name = 'Untitled Resume', withSample = true) => ({
  id: createId('resume'),
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: withSample ? defaultResumeData() : emptyResumeData(),
  sections: makeSectionState(),
  settings: defaultSettings(),
});

export const makeInitialAppState = () => {
  const resume = makeResume('Alex Morgan Resume', true);
  return {
    version: schemaVersion,
    activeId: resume.id,
    resumes: [resume],
  };
};
