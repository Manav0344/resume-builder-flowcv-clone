import React from 'react';
import { AtSign, Globe, Github, Linkedin, Link as LinkIcon, MapPin, Phone } from 'lucide-react';
import { dateRange } from '../../utils/date';

const fontScale = { compact: 0.92, normal: 1, comfortable: 1.08 };
const margins = { narrow: 34, normal: 48, wide: 66 };
const lineSpacing = { tight: 1.25, normal: 1.42, relaxed: 1.62 };

export function ResumeTemplate({ resume, forwardedRef }) {
  const template = resume.settings.template;
  const style = baseStyle(resume.settings);
  const props = { resume, style, forwardedRef };
  if (template === 'classic') return <ClassicTemplate {...props} />;
  if (template === 'minimal') return <MinimalTemplate {...props} />;
  if (template === 'creative') return <CreativeTemplate {...props} />;
  if (template === 'executive') return <ExecutiveTemplate {...props} />;
  if (template === 'ats') return <AtsTemplate {...props} />;
  if (template === 'manav') return <ManavTemplate {...props} />;
  return <ModernTemplate {...props} />;
}

function baseStyle(settings) {
  const defaultSpacing = { beforeGap: 0, sectionGap: 16, itemGap: 12, headingGap: 8, paragraphGap: 6, bulletGap: 2, linkGap: 12, tagGap: 6 };
  return {
    accent: settings.accent || '#6366F1',
    fontFamily: settings.fontFamily,
    fontSize: 14 * (fontScale[settings.fontScale] || 1),
    padding: margins[settings.margins] || 48,
    lineHeight: lineSpacing[settings.lineSpacing] || 1.42,
    headingStyle: settings.headingStyle,
    photoShape: settings.photoShape,
    page: { topMargin: 64, bottomMargin: 64, pageGap: 56, ...(settings.page || {}) },
    spacing: { ...defaultSpacing, ...(settings.spacing || {}) },
  };
}

const normalizeUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

function ResumeLink({ href, children, className = '' }) {
  const url = normalizeUrl(href);
  if (!url) return null;
  return <a href={url} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 underline decoration-current/30 underline-offset-2 ${className}`}>{children}</a>;
}

function contacts(personal, accent, compact = false) {
  const items = [
    { Icon: AtSign, value: personal.email, label: personal.email, href: personal.email ? `mailto:${personal.email}` : '' },
    { Icon: Phone, value: personal.phone, label: personal.phone, href: personal.phone ? `tel:${personal.phone}` : '' },
    { Icon: MapPin, value: personal.location, label: personal.location, href: '' },
    { Icon: Globe, value: personal.website, label: personal.websiteLabel || 'Website', href: personal.website },
    { Icon: Linkedin, value: personal.linkedin, label: personal.linkedinLabel || 'LinkedIn', href: personal.linkedin },
    { Icon: Github, value: personal.github, label: personal.githubLabel || 'GitHub', href: personal.github },
  ].filter((item) => item.value);
  return <div className={compact ? 'flex flex-wrap gap-x-4 gap-y-1' : 'space-y-1.5'}>{items.map(({ Icon, label, href, value }) => <div key={`${label}-${value}`} className="inline-flex items-center gap-1.5 break-all"><Icon size={12} color={accent} aria-hidden="true" />{href ? <ResumeLink href={href}>{label}</ResumeLink> : <span>{label}</span>}</div>)}</div>;
}

function photo(personal, style, className = '') {
  if (!personal.photo || style.photoShape === 'hidden') return null;
  return <img src={personal.photo} alt="Profile" className={className} style={{ borderRadius: style.photoShape === 'round' ? '999px' : '14px', objectFit: 'cover' }} />;
}

function visibleSections(resume) {
  return resume.sections.filter((s) => s.visible && s.type !== 'personal');
}

function personalVisible(resume) {
  return resume.sections.find((s) => s.type === 'personal')?.visible !== false;
}

function sectionAlign(resume, type) {
  return resume.sections.find((s) => s.type === type)?.align || 'left';
}

function hasSectionData(type, data) {
  if (type === 'summary') return Boolean(data.summary?.trim());
  if (type === 'references') return data.references?.availableOnRequest || data.references?.items?.length;
  if (type === 'custom') return Boolean(data.custom?.content || data.custom?.title);
  return Array.isArray(data[type]) && data[type].length > 0;
}

function Section({ title, children, style, align = 'left', className = '' }) {
  return <section className={`resume-section break-inside-avoid ${className}`} data-section-before={style.spacing.beforeGap} style={{ marginTop: style.spacing.beforeGap, marginBottom: style.spacing.sectionGap, textAlign: align, breakInside: 'avoid', pageBreakInside: 'avoid' }}><Heading title={title} style={style} align={align} />{children}</section>;
}


function hexToRgb(color) {
  if (!color || typeof color !== 'string') return null;
  let hex = color.trim();
  if (!hex.startsWith('#')) return null;
  hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
  if (hex.length === 8) hex = hex.slice(0, 6);
  if (hex.length !== 6) return null;
  const value = Number.parseInt(hex, 16);
  if (Number.isNaN(value)) return null;
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function readableTextColor(background, dark = '#111827', light = '#FFFFFF') {
  const rgb = hexToRgb(background);
  if (!rgb) return light;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.62 ? dark : light;
}

function Heading({ title, style, align = 'left' }) {
  const headingColor = style.headingColor || style.titleColor || '#111827';
  const base = { marginBottom: style.spacing.headingGap, textAlign: align, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' };
  const s = style.headingStyle;
  if (s === 'manav') {
    const bg = style.headingBg || '#E9E9E6';
    return <h2 className="rounded px-3 py-1.5 text-center text-[14px] font-black uppercase tracking-[0.12em]" style={{ ...base, backgroundColor: bg, color: style.headingColor || readableTextColor(bg), lineHeight: 1.25 }}>{title}</h2>;
  }
  if (s === 'box') {
    const bg = style.headingBg || style.accent || '#6366F1';
    return <h2 className="inline-block rounded px-2 py-1 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ ...base, backgroundColor: bg, color: style.headingTextColor || readableTextColor(bg), lineHeight: 1.25 }}>{title}</h2>;
  }
  if (s === 'minimal') return <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ ...base, color: style.accent }}>{title}</h2>;
  if (s === 'bold') return <h2 className="text-[15px] font-black uppercase tracking-wide" style={{ ...base, color: headingColor }}>{title}</h2>;
  return <h2 className="border-b pb-1 text-[13px] font-bold uppercase tracking-[0.16em]" style={{ ...base, borderColor: style.accent, color: headingColor }}>{title}</h2>;
}

function sectionStyle(baseStyle, section = {}) {
  return { ...baseStyle, spacing: { ...baseStyle.spacing, ...(section.spacing || {}) } };
}

function personalResumeStyle(resume, style) {
  return sectionStyle(style, resume.sections.find((section) => section.type === 'personal') || {});
}

function RenderSection({ section, resume, style }) {
  const d = resume.data;
  if (!hasSectionData(section.type, d)) return null;
  const align = section.align || 'left';
  const currentStyle = sectionStyle(style, section);
  const title = section.type === 'custom' ? d.custom.title || section.title : section.title;
  if (section.type === 'summary') return <Section title={title} style={currentStyle} align={align}><p className="rich-text" style={{ marginBottom: currentStyle.spacing.paragraphGap }}>{d.summary}</p></Section>;
  if (section.type === 'experience') return <Section title={title} style={currentStyle} align={align}>{d.experience.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.role} subtitle={item.company} meta={`${item.location || ''}${item.location ? ' • ' : ''}${dateRange(item.start, item.end, item.current)}`} bullets={item.bullets} />)}</Section>;
  if (section.type === 'education') return <Section title={title} style={currentStyle} align={align}>{d.education.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.institution} subtitle={[item.degree, item.field].filter(Boolean).join(', ')} meta={[dateRange(item.start, item.end), item.gpa && `GPA ${item.gpa}`, item.honors].filter(Boolean).join(' • ')} />)}</Section>;
  if (section.type === 'skills') return <Section title={title} style={currentStyle} align={align}><SkillGroups skills={d.skills} accent={currentStyle.accent} align={align} style={currentStyle} /></Section>;
  if (section.type === 'projects') return <Section title={title} style={currentStyle} align={align}>{d.projects.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.title} subtitle={(item.tech || []).join(' • ')} description={item.description} links={[{ label: item.liveLabel || 'Project', url: item.liveUrl }, { label: item.githubLabel || 'GitHub', url: item.githubUrl }]} />)}</Section>;
  if (section.type === 'certifications') return <Section title={title} style={currentStyle} align={align}>{d.certifications.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.name} subtitle={item.issuer} meta={item.date} links={[{ label: 'Credential', url: item.url }]} />)}</Section>;
  if (section.type === 'languages') return <Section title={title} style={currentStyle} align={align}><div className="grid grid-cols-2" style={{ gap: currentStyle.spacing.tagGap }}>{d.languages.map((l) => <p key={l.id}><strong>{l.name}</strong> — {l.fluency}</p>)}</div></Section>;
  if (section.type === 'volunteer') return <Section title={title} style={currentStyle} align={align}>{d.volunteer.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.role} subtitle={item.org} meta={dateRange(item.start, item.end)} description={item.description} />)}</Section>;
  if (section.type === 'awards') return <Section title={title} style={currentStyle} align={align}>{d.awards.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.title} subtitle={item.issuer} meta={item.date} description={item.description} />)}</Section>;
  if (section.type === 'publications') return <Section title={title} style={currentStyle} align={align}>{d.publications.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.title} subtitle={item.journal} meta={item.date} links={[{ label: 'Publication', url: item.url }]} />)}</Section>;
  if (section.type === 'references') return <Section title={title} style={currentStyle} align={align}>{d.references.availableOnRequest ? <p>Available upon request.</p> : d.references.items.map((item) => <Entry key={item.id} style={currentStyle} align={align} title={item.name} subtitle={[item.role, item.company].filter(Boolean).join(', ')} meta={[item.email, item.phone].filter(Boolean).join(' • ')} />)}</Section>;
  if (section.type === 'custom') return <Section title={title} style={currentStyle} align={align}><p className="rich-text" style={{ marginBottom: currentStyle.spacing.paragraphGap }}>{d.custom.content}</p></Section>;
  return null;
}

function Entry({ title, subtitle, meta, description, bullets, links = [], style, align = 'left' }) {
  const linkItems = links.filter((link) => link.url);
  const left = align === 'left' || align === 'justify';
  const titleColor = style.titleColor || '#111827';
  const bodyColor = style.bodyColor || '#374151';
  const mutedColor = style.mutedColor || '#64748B';
  return (
    <div style={{ marginBottom: style.spacing.itemGap, textAlign: align, color: bodyColor }}>
      {left ? <div className="flex items-start justify-between gap-4"><div><h3 className="font-bold leading-snug" style={{ color: titleColor }}>{title}</h3>{subtitle ? <p className="font-medium" style={{ color: bodyColor }}>{subtitle}</p> : null}</div>{meta ? <p className="max-w-[42%] text-right text-[12px]" style={{ color: mutedColor }}>{meta}</p> : null}</div> : <div><h3 className="font-bold leading-snug" style={{ color: titleColor }}>{title}</h3>{subtitle ? <p className="font-medium" style={{ color: bodyColor }}>{subtitle}</p> : null}{meta ? <p className="text-[12px]" style={{ color: mutedColor }}>{meta}</p> : null}</div>}
      {description ? <p className="rich-text" style={{ marginTop: style.spacing.paragraphGap, color: bodyColor }}>{description}</p> : null}
      {linkItems.length ? <div className="flex flex-wrap text-[12px]" style={{ gap: style.spacing.linkGap, justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', marginTop: style.spacing.paragraphGap, color: style.linkColor || style.accent }}>{linkItems.map((link) => <ResumeLink key={`${link.label}-${link.url}`} href={link.url} className="font-medium" ><LinkIcon size={11} />{link.label}</ResumeLink>)}</div> : null}
      {bullets?.filter(Boolean).length ? <ul className="list-disc pl-5" style={{ marginTop: style.spacing.paragraphGap, listStylePosition: align === 'left' ? 'outside' : 'inside', color: bodyColor }}>{bullets.filter(Boolean).map((bullet, index) => <li key={`${bullet}-${index}`} style={{ marginBottom: style.spacing.bulletGap }}>{bullet}</li>)}</ul> : null}
    </div>
  );
}

function SkillGroups({ skills, accent, align, style }) {
  const groups = skills.reduce((acc, skill) => { const key = skill.category || 'General'; acc[key] = acc[key] || []; acc[key].push(skill); return acc; }, {});
  return <div>{Object.entries(groups).map(([category, items]) => <div key={category} style={{ marginBottom: style.spacing.itemGap }}><p className="font-bold" style={{ marginBottom: style.spacing.paragraphGap, color: style.titleColor || '#111827' }}>{category}</p><div className="flex flex-wrap" style={{ gap: style.spacing.tagGap, justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>{items.map((skill) => <span key={skill.id} className="rounded-full px-2 py-0.5 text-[12px]" style={{ backgroundColor: style.chipBg || `${accent}18`, color: style.chipColor || '#111827' }}>{skill.name} · {skill.level}</span>)}</div></div>)}</div>;
}

function Page({ children, style, forwardedRef, className = '' }) {
  return <div ref={forwardedRef} className={`resume-page resume-template shadow-paper ${className}`} data-page-top-margin={style.page?.topMargin ?? 64} data-page-bottom-margin={style.page?.bottomMargin ?? 64} data-page-gap={style.page?.pageGap ?? 56} style={{ fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, '--resume-accent': style.accent }}>{children}</div>;
}

function ClassicTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  return <Page style={style} forwardedRef={forwardedRef}><div style={{ padding: style.padding }}>{show ? <header className="mb-5 border-b-2 pb-4" style={{ borderColor: style.accent, textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}>{photo(p, style, `${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''} mb-3 h-24 w-24`)}<h1 className="font-serif text-[34px] font-bold tracking-wide">{p.name || 'Your Name'}</h1><p className="mt-1 text-[15px] uppercase tracking-[0.18em]" style={{ color: style.accent }}>{p.title}</p><div className="mt-3 text-[12px] text-slate-600" style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>{contacts(p, style.accent, true)}</div></header> : null}{visibleSections(resume).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={style} />)}</div></Page>;
}

function ModernTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  const sideTypes = new Set(['skills', 'certifications', 'languages', 'references']);
  const sections = visibleSections(resume);
  return <Page style={style} forwardedRef={forwardedRef}><div className="grid min-h-[1123px] grid-cols-[255px_1fr]"><aside className="p-7 text-white" style={{ backgroundColor: style.accent }}>{show ? <div style={{ textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}>{photo(p, style, `${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''} mb-5 h-28 w-28 border-4 border-white/40`)}<h1 className="text-[28px] font-black leading-tight">{p.name || 'Your Name'}</h1><p className="mt-2 text-[15px] text-white/85">{p.title}</p><div className="mt-6 text-[12px] text-white/90 [&_svg]:!text-white">{contacts(p, '#fff')}</div></div> : null}<div className="mt-6 space-y-4 text-[12px]">{sections.filter((s) => sideTypes.has(s.type)).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={{ ...style, accent: '#fff', headingStyle: 'minimal', titleColor: '#FFFFFF', headingColor: '#FFFFFF', bodyColor: 'rgba(255,255,255,.88)', mutedColor: 'rgba(255,255,255,.72)', linkColor: '#FFFFFF', chipBg: 'rgba(255,255,255,.18)', chipColor: '#FFFFFF' }} />)}</div></aside><main style={{ padding: style.padding - 8 }}>{sections.filter((s) => !sideTypes.has(s.type)).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={style} />)}</main></div></Page>;
}

function MinimalTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  return <Page style={style} forwardedRef={forwardedRef}><div style={{ padding: style.padding + 8 }}>{show ? <header className="mb-8 flex items-start justify-between gap-6" style={{ textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}><div><h1 className="text-[31px] font-light tracking-tight">{p.name || 'Your Name'}</h1><p className="mt-1 text-slate-500">{p.title}</p></div>{photo(p, style, 'h-20 w-20')}<div className="max-w-[280px] text-[12px] text-slate-500" style={{ textAlign: align === 'left' ? 'right' : align }}>{contacts(p, style.accent)}</div></header> : null}{visibleSections(resume).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={{ ...style, headingStyle: 'minimal' }} />)}</div></Page>;
}

function CreativeTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  return <Page style={style} forwardedRef={forwardedRef}><div className="h-3" style={{ backgroundColor: style.accent }} /><div style={{ padding: style.padding }}>{show ? <header className="relative mb-6 overflow-hidden rounded-[28px] p-7 text-white" style={{ background: `linear-gradient(135deg, ${style.accent}, #111827)`, textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" /><div className="relative flex items-center gap-5" style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>{photo(p, style, 'h-28 w-28 border-4 border-white/30')}<div><h1 className="text-[34px] font-black leading-tight">{p.name || 'Your Name'}</h1><p className="mt-1 text-[16px] text-white/85">{p.title}</p><div className="mt-3 text-[12px] text-white/90 [&_svg]:!text-white">{contacts(p, '#fff', true)}</div></div></div></header> : null}{visibleSections(resume).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={{ ...style, headingStyle: section.type === 'summary' ? 'box' : style.headingStyle }} />)}</div></Page>;
}

function ExecutiveTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  return <Page style={style} forwardedRef={forwardedRef}>{show ? <header className="bg-slate-950 px-14 py-10 text-white" style={{ textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}><div className="flex items-center justify-between gap-6"><div><p className="mb-2 text-[12px] uppercase tracking-[0.28em]" style={{ color: style.accent }}>{p.title}</p><h1 className="font-serif text-[36px] font-bold">{p.name || 'Your Name'}</h1></div>{photo(p, style, 'h-24 w-24 border border-white/20')}</div><div className="mt-5 text-[12px] text-slate-300 [&_svg]:!text-slate-300">{contacts(p, style.accent, true)}</div></header> : null}<main style={{ padding: style.padding }}>{visibleSections(resume).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={{ ...style, headingStyle: 'bold' }} />)}</main></Page>;
}


function ManavTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  const sections = visibleSections(resume);
  const leftTypes = new Set(['skills', 'education', 'certifications', 'awards', 'custom']);
  const leftSections = sections.filter((section) => leftTypes.has(section.type));
  const rightSections = sections.filter((section) => !leftTypes.has(section.type));
  const manav = {
    ...style,
    headingStyle: 'manav',
    accent: '#2B2B2B',
    titleColor: '#2A2A2A',
    headingColor: '#2A2A2A',
    headingBg: '#E2E2DF',
    bodyColor: '#2B2B2B',
    mutedColor: '#3F3F46',
    linkColor: '#2A2A2A',
    chipBg: '#E2E2DF',
    chipColor: '#2A2A2A',
    spacing: {
      ...style.spacing,
      sectionGap: Math.max(22, style.spacing.sectionGap),
      headingGap: Math.max(14, style.spacing.headingGap),
      itemGap: Math.max(14, style.spacing.itemGap),
      paragraphGap: Math.max(6, style.spacing.paragraphGap),
      bulletGap: Math.max(3, style.spacing.bulletGap),
      tagGap: Math.max(6, style.spacing.tagGap),
    },
  };
  const leftStyle = {
    ...manav,
    spacing: { ...manav.spacing, sectionGap: Math.max(24, manav.spacing.sectionGap), itemGap: Math.max(16, manav.spacing.itemGap) },
  };
  const rightStyle = {
    ...manav,
    spacing: { ...manav.spacing, sectionGap: Math.max(24, manav.spacing.sectionGap), itemGap: Math.max(16, manav.spacing.itemGap) },
  };
  return (
    <Page style={style} forwardedRef={forwardedRef} className="manav-template">
      <div className="grid min-h-[1123px] grid-cols-[376px_1fr]" style={{ color: '#2B2B2B', fontFamily: style.fontFamily }}>
        <aside className="min-h-[1123px] px-[68px] py-[56px]" style={{ backgroundColor: '#E7E7E4' }}>
          {show ? (
            <header style={{ textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: Math.max(34, pStyle.spacing.sectionGap) }}>
              <h1 className="text-[32px] font-black leading-tight tracking-[-0.02em]" style={{ color: '#282828' }}>{p.name || 'Your Name'}</h1>
              <p className="mt-3 text-[22px] font-normal leading-snug" style={{ color: '#2D2D2D' }}>{p.title}</p>
              {photo(p, style, `${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''} my-7 h-[128px] w-[128px] rounded-full object-cover`)}
              <div className="text-[13px] leading-relaxed" style={{ color: '#2B2B2B' }}>{contacts(p, '#2B2B2B')}</div>
            </header>
          ) : null}
          <div className="manav-left-column text-[13px] leading-snug">
            {leftSections.map((section) => <RenderSection key={section.id} section={section} resume={resume} style={leftStyle} />)}
          </div>
        </aside>
        <main className="px-[56px] py-[64px] text-[13px] leading-snug" style={{ backgroundColor: '#FFFFFF' }}>
          {rightSections.map((section) => <RenderSection key={section.id} section={section} resume={resume} style={rightStyle} />)}
        </main>
      </div>
    </Page>
  );
}

function AtsTemplate({ resume, style, forwardedRef }) {
  const p = resume.data.personal;
  const show = personalVisible(resume);
  const align = sectionAlign(resume, 'personal');
  const pStyle = personalResumeStyle(resume, style);
  return <Page style={{ ...style, accent: '#111827' }} forwardedRef={forwardedRef} className="shadow-paper"><div style={{ padding: 54, fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.35 }}>{show ? <header className="mb-4" style={{ textAlign: align, marginTop: pStyle.spacing.beforeGap, marginBottom: pStyle.spacing.sectionGap }}><h1 className="text-[26px] font-bold">{p.name || 'Your Name'}</h1><p>{p.title}</p><p className="text-[12px]">{[p.email, p.phone, p.location, p.website && (p.websiteLabel || 'Website'), p.linkedin && (p.linkedinLabel || 'LinkedIn'), p.github && (p.githubLabel || 'GitHub')].filter(Boolean).join(' | ')}</p></header> : null}{visibleSections(resume).map((section) => <RenderSection key={section.id} section={section} resume={resume} style={{ ...style, accent: '#111827', headingStyle: 'underline' }} />)}</div></Page>;
}
