import React from 'react';
import { Plus, UploadCloud, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { createId } from '../../data/defaultResume';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Input, Select, Textarea, Toggle } from '../ui/Field';
import { BulletEditor, ItemCard, TagInput, TwoCols } from './EditorHelpers';

const levels = ['beginner', 'intermediate', 'expert'];
const fluencies = ['basic', 'intermediate', 'fluent', 'native'];

function PersonalEditor() {
  const { activeResume, updateDataPath } = useResume();
  const p = activeResume.data.personal;
  const field = (key) => ({ value: p[key] || '', onChange: (e) => updateDataPath(`personal.${key}`, e.target.value) });
  const upload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateDataPath('personal.photo', reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-3">
      <TwoCols><Input label="Full name" {...field('name')} /><Input label="Job title" {...field('title')} /></TwoCols>
      <TwoCols><Input label="Email" type="email" {...field('email')} /><Input label="Phone" {...field('phone')} /></TwoCols>
      <Input label="Location" {...field('location')} />
      <TwoCols><Input label="Website label" {...field('websiteLabel')} /><Input label="Website URL" {...field('website')} /></TwoCols>
      <TwoCols><Input label="LinkedIn label" {...field('linkedinLabel')} /><Input label="LinkedIn URL" {...field('linkedin')} /></TwoCols>
      <TwoCols><Input label="GitHub label" {...field('githubLabel')} /><Input label="GitHub URL" {...field('github')} /></TwoCols>
      <div className="rounded-2xl border border-[var(--border)] p-3 transition-theme">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-[var(--accent-soft)] text-xs text-[var(--muted)]">
            {p.photo ? <img src={p.photo} alt="Profile preview" className="h-full w-full object-cover" /> : 'Photo'}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium transition-theme hover:bg-[var(--accent-soft)]">
            <UploadCloud className="h-4 w-4" /> Upload photo
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          {p.photo ? <Button variant="ghost" size="sm" onClick={() => updateDataPath('personal.photo', '')}><X className="h-4 w-4" /> Remove</Button> : null}
        </div>
      </div>
    </div>
  );
}

function SummaryEditor() {
  const { activeResume, updateDataPath } = useResume();
  const value = activeResume.data.summary || '';
  return <Textarea label="Professional summary" rows={8} value={value} hint={`${value.length}/900`} onChange={(e) => updateDataPath('summary', e.target.value.slice(0, 900))} />;
}

function ExperienceEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.experience;
  return <ArraySection empty="Add work history to establish credibility." onAdd={() => addArrayItem('experience', { id: createId('exp'), company: '', role: '', location: '', start: '', end: '', current: false, bullets: [''] })}>{items.map((item) => <ItemCard key={item.id} title={item.role || item.company} onDelete={() => deleteArrayItem('experience', item.id)}><TwoCols><Input label="Company" value={item.company} onChange={(e) => updateArrayItem('experience', item.id, { company: e.target.value })} /><Input label="Role" value={item.role} onChange={(e) => updateArrayItem('experience', item.id, { role: e.target.value })} /></TwoCols><Input label="Location" value={item.location} onChange={(e) => updateArrayItem('experience', item.id, { location: e.target.value })} /><TwoCols><Input label="Start date" type="month" value={item.start} onChange={(e) => updateArrayItem('experience', item.id, { start: e.target.value })} /><Input label="End date" type="month" disabled={item.current} value={item.end} onChange={(e) => updateArrayItem('experience', item.id, { end: e.target.value })} /></TwoCols><Toggle label="Currently working here" checked={item.current} onChange={(checked) => updateArrayItem('experience', item.id, { current: checked, end: checked ? '' : item.end })} /><BulletEditor bullets={item.bullets || []} onChange={(bullets) => updateArrayItem('experience', item.id, { bullets })} /></ItemCard>)}</ArraySection>;
}

function EducationEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.education;
  return <ArraySection empty="Add your schools, degrees, and honors." onAdd={() => addArrayItem('education', { id: createId('edu'), institution: '', degree: '', field: '', gpa: '', start: '', end: '', honors: '' })}>{items.map((item) => <ItemCard key={item.id} title={item.institution || item.degree} onDelete={() => deleteArrayItem('education', item.id)}><Input label="Institution" value={item.institution} onChange={(e) => updateArrayItem('education', item.id, { institution: e.target.value })} /><TwoCols><Input label="Degree" value={item.degree} onChange={(e) => updateArrayItem('education', item.id, { degree: e.target.value })} /><Input label="Field" value={item.field} onChange={(e) => updateArrayItem('education', item.id, { field: e.target.value })} /></TwoCols><TwoCols><Input label="GPA" value={item.gpa} onChange={(e) => updateArrayItem('education', item.id, { gpa: e.target.value })} /><Input label="Honors" value={item.honors} onChange={(e) => updateArrayItem('education', item.id, { honors: e.target.value })} /></TwoCols><TwoCols><Input label="Start" value={item.start} onChange={(e) => updateArrayItem('education', item.id, { start: e.target.value })} /><Input label="End" value={item.end} onChange={(e) => updateArrayItem('education', item.id, { end: e.target.value })} /></TwoCols></ItemCard>)}</ArraySection>;
}

function SkillsEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.skills;
  return <ArraySection empty="Add grouped tags with proficiency levels." onAdd={() => addArrayItem('skills', { id: createId('skill'), name: '', level: 'intermediate', category: 'General' })}>{items.map((item) => <ItemCard key={item.id} title={item.name || 'Skill'} onDelete={() => deleteArrayItem('skills', item.id)}><TwoCols><Input label="Skill" value={item.name} onChange={(e) => updateArrayItem('skills', item.id, { name: e.target.value })} /><Input label="Category" value={item.category} onChange={(e) => updateArrayItem('skills', item.id, { category: e.target.value })} /></TwoCols><Select label="Proficiency" value={item.level} onChange={(e) => updateArrayItem('skills', item.id, { level: e.target.value })}>{levels.map((level) => <option key={level} value={level}>{level}</option>)}</Select></ItemCard>)}</ArraySection>;
}

function ProjectsEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.projects;
  return <ArraySection empty="Showcase projects, stack tags, and URLs." onAdd={() => addArrayItem('projects', { id: createId('project'), title: '', description: '', tech: [], liveUrl: '', liveLabel: 'Project', githubUrl: '', githubLabel: 'GitHub' })}>{items.map((item) => <ItemCard key={item.id} title={item.title || 'Project'} onDelete={() => deleteArrayItem('projects', item.id)}><Input label="Title" value={item.title} onChange={(e) => updateArrayItem('projects', item.id, { title: e.target.value })} /><Textarea label="Description" rows={3} value={item.description} onChange={(e) => updateArrayItem('projects', item.id, { description: e.target.value })} /><TagInput label="Tech stack" tags={item.tech || []} onChange={(tech) => updateArrayItem('projects', item.id, { tech })} /><TwoCols><Input label="Project link text" value={item.liveLabel || 'Project'} onChange={(e) => updateArrayItem('projects', item.id, { liveLabel: e.target.value })} /><Input label="Project URL" value={item.liveUrl} onChange={(e) => updateArrayItem('projects', item.id, { liveUrl: e.target.value })} /></TwoCols><TwoCols><Input label="GitHub link text" value={item.githubLabel || 'GitHub'} onChange={(e) => updateArrayItem('projects', item.id, { githubLabel: e.target.value })} /><Input label="GitHub URL" value={item.githubUrl} onChange={(e) => updateArrayItem('projects', item.id, { githubUrl: e.target.value })} /></TwoCols></ItemCard>)}</ArraySection>;
}

function CertificationsEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.certifications;
  return <ArraySection empty="Add credentials and links." onAdd={() => addArrayItem('certifications', { id: createId('cert'), name: '', issuer: '', date: '', url: '' })}>{items.map((item) => <ItemCard key={item.id} title={item.name || 'Certification'} onDelete={() => deleteArrayItem('certifications', item.id)}><Input label="Name" value={item.name} onChange={(e) => updateArrayItem('certifications', item.id, { name: e.target.value })} /><TwoCols><Input label="Issuer" value={item.issuer} onChange={(e) => updateArrayItem('certifications', item.id, { issuer: e.target.value })} /><Input label="Date" value={item.date} onChange={(e) => updateArrayItem('certifications', item.id, { date: e.target.value })} /></TwoCols><Input label="Credential URL" value={item.url} onChange={(e) => updateArrayItem('certifications', item.id, { url: e.target.value })} /></ItemCard>)}</ArraySection>;
}

function LanguagesEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.languages;
  return <ArraySection empty="Add languages and fluency." onAdd={() => addArrayItem('languages', { id: createId('lang'), name: '', fluency: 'intermediate' })}>{items.map((item) => <ItemCard key={item.id} title={item.name || 'Language'} onDelete={() => deleteArrayItem('languages', item.id)}><TwoCols><Input label="Language" value={item.name} onChange={(e) => updateArrayItem('languages', item.id, { name: e.target.value })} /><Select label="Fluency" value={item.fluency} onChange={(e) => updateArrayItem('languages', item.id, { fluency: e.target.value })}>{fluencies.map((level) => <option key={level} value={level}>{level}</option>)}</Select></TwoCols></ItemCard>)}</ArraySection>;
}

function VolunteerEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.volunteer;
  return <ArraySection empty="Community and volunteer work goes here." onAdd={() => addArrayItem('volunteer', { id: createId('vol'), role: '', org: '', start: '', end: '', description: '' })}>{items.map((item) => <ItemCard key={item.id} title={item.role || item.org} onDelete={() => deleteArrayItem('volunteer', item.id)}><TwoCols><Input label="Role" value={item.role} onChange={(e) => updateArrayItem('volunteer', item.id, { role: e.target.value })} /><Input label="Organization" value={item.org} onChange={(e) => updateArrayItem('volunteer', item.id, { org: e.target.value })} /></TwoCols><TwoCols><Input label="Start" value={item.start} onChange={(e) => updateArrayItem('volunteer', item.id, { start: e.target.value })} /><Input label="End" value={item.end} onChange={(e) => updateArrayItem('volunteer', item.id, { end: e.target.value })} /></TwoCols><Textarea label="Description" rows={3} value={item.description} onChange={(e) => updateArrayItem('volunteer', item.id, { description: e.target.value })} /></ItemCard>)}</ArraySection>;
}

function AwardsEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.awards;
  return <ArraySection empty="Add awards, achievements, and honors." onAdd={() => addArrayItem('awards', { id: createId('award'), title: '', issuer: '', date: '', description: '' })}>{items.map((item) => <ItemCard key={item.id} title={item.title || 'Award'} onDelete={() => deleteArrayItem('awards', item.id)}><Input label="Title" value={item.title} onChange={(e) => updateArrayItem('awards', item.id, { title: e.target.value })} /><TwoCols><Input label="Issuer" value={item.issuer} onChange={(e) => updateArrayItem('awards', item.id, { issuer: e.target.value })} /><Input label="Date" value={item.date} onChange={(e) => updateArrayItem('awards', item.id, { date: e.target.value })} /></TwoCols><Textarea label="Description" rows={3} value={item.description} onChange={(e) => updateArrayItem('awards', item.id, { description: e.target.value })} /></ItemCard>)}</ArraySection>;
}

function PublicationsEditor() {
  const { activeResume, addArrayItem, updateArrayItem, deleteArrayItem } = useResume();
  const items = activeResume.data.publications;
  return <ArraySection empty="Add publications and article links." onAdd={() => addArrayItem('publications', { id: createId('pub'), title: '', journal: '', date: '', url: '' })}>{items.map((item) => <ItemCard key={item.id} title={item.title || 'Publication'} onDelete={() => deleteArrayItem('publications', item.id)}><Input label="Title" value={item.title} onChange={(e) => updateArrayItem('publications', item.id, { title: e.target.value })} /><TwoCols><Input label="Journal" value={item.journal} onChange={(e) => updateArrayItem('publications', item.id, { journal: e.target.value })} /><Input label="Date" value={item.date} onChange={(e) => updateArrayItem('publications', item.id, { date: e.target.value })} /></TwoCols><Input label="URL" value={item.url} onChange={(e) => updateArrayItem('publications', item.id, { url: e.target.value })} /></ItemCard>)}</ArraySection>;
}

function ReferencesEditor() {
  const { activeResume, updateActiveResume } = useResume();
  const refs = activeResume.data.references;
  const add = () => updateActiveResume((resume) => { resume.data.references.items.push({ id: createId('ref'), name: '', company: '', role: '', email: '', phone: '' }); });
  const update = (id, patch) => updateActiveResume((resume) => { Object.assign(resume.data.references.items.find((r) => r.id === id), patch); });
  const remove = (id) => updateActiveResume((resume) => { resume.data.references.items = resume.data.references.items.filter((r) => r.id !== id); });
  return <div className="space-y-3"><Toggle label="Show “Available upon request”" checked={refs.availableOnRequest} onChange={(checked) => updateActiveResume((resume) => { resume.data.references.availableOnRequest = checked; })} />{!refs.availableOnRequest ? <ArraySection empty="Add professional references." onAdd={add}>{refs.items.map((item) => <ItemCard key={item.id} title={item.name || 'Reference'} onDelete={() => remove(item.id)}><TwoCols><Input label="Name" value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} /><Input label="Company" value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} /></TwoCols><TwoCols><Input label="Role" value={item.role} onChange={(e) => update(item.id, { role: e.target.value })} /><Input label="Email" value={item.email} onChange={(e) => update(item.id, { email: e.target.value })} /></TwoCols><Input label="Phone" value={item.phone} onChange={(e) => update(item.id, { phone: e.target.value })} /></ItemCard>)}</ArraySection> : null}</div>;
}

function CustomEditor() {
  const { activeResume, updateDataPath } = useResume();
  const custom = activeResume.data.custom;
  return <div className="space-y-3"><Input label="Section title" value={custom.title} onChange={(e) => updateDataPath('custom.title', e.target.value)} /><Textarea label="Free-form content" rows={8} value={custom.content} onChange={(e) => updateDataPath('custom.content', e.target.value)} /></div>;
}

function ArraySection({ children, onAdd, empty }) {
  const hasChildren = React.Children.count(children) > 0;
  return <div className="space-y-3"><Button variant="primary" size="sm" onClick={onAdd}><Plus className="h-4 w-4" /> Add item</Button>{hasChildren ? children : <EmptyState description={empty} />}</div>;
}

export const editors = {
  personal: PersonalEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  volunteer: VolunteerEditor,
  awards: AwardsEditor,
  publications: PublicationsEditor,
  references: ReferencesEditor,
  custom: CustomEditor,
};

export function SectionEditor({ type }) {
  const Editor = editors[type] || CustomEditor;
  return <Editor />;
}
