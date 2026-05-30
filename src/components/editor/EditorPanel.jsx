import React from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown, Eye, EyeOff, GripVertical, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { SectionEditor } from './SectionEditors';
import { CustomizationPanel } from './CustomizationPanel';

const alignments = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
  { id: 'justify', label: 'Justify', icon: AlignJustify },
];

export function EditorPanel() {
  const { activeResume, reorderSections } = useResume();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  return (
    <aside className="editor-shell h-full overflow-y-auto bg-[var(--sidebar)] px-4 py-4 shadow-sm transition-theme scrollbar-thin" aria-label="Resume content editor">
      <div className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-theme">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Resume Builder</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--text)]">Edit content & design</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">All sections, templates, colors, alignment and spacing are available in this left panel.</p>
      </div>
      <DesignAccordion />
      <div className="mb-4 mt-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">Editable sections</h2>
        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs text-[var(--text)]">{activeResume.sections.filter((s) => s.visible).length}/{activeResume.sections.length} visible</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => { if (event.over && event.active.id !== event.over.id) reorderSections(event.active.id, event.over.id); }}>
        <SortableContext items={activeResume.sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 pb-10">
            {activeResume.sections.map((section) => <SortableSection key={section.id} section={section} />)}
          </div>
        </SortableContext>
      </DndContext>
    </aside>
  );
}

function DesignAccordion() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-theme">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left hover:bg-[var(--accent-soft)]" aria-expanded={open}>
        <span>
          <span className="block text-sm font-bold text-[var(--text)]">Design, colors & spacing</span>
          <span className="block text-xs text-[var(--muted)]">Open to change template, colors, fonts and custom spacing.</span>
        </span>
        <ChevronDown className={cn('h-5 w-5 text-[var(--muted)] transition-transform duration-300', open ? 'rotate-0' : '-rotate-90')} />
      </button>
      <div className={cn('grid transition-all duration-300 ease-in-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="border-t border-[var(--border)] p-3">
            <CustomizationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableSection({ section }) {
  const { updateSection } = useResume();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={cn('rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-theme', isDragging && 'draggable-ghost opacity-70 shadow-xl')}>
      <div className="flex items-center gap-1 px-3 py-2">
        <Tooltip label="Drag to reorder"><button type="button" className="cursor-grab rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--accent-soft)] active:cursor-grabbing" aria-label={`Drag ${section.title}`} {...attributes} {...listeners}><GripVertical className="h-4 w-4" /></button></Tooltip>
        <button type="button" onClick={() => updateSection(section.id, { collapsed: !section.collapsed })} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[var(--accent-soft)]" aria-expanded={!section.collapsed}>
          <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-300', section.collapsed ? '-rotate-90' : 'rotate-0')} />
          <span className="truncate text-sm font-semibold text-[var(--text)]">{section.title}</span>
        </button>
        <Tooltip label={section.visible ? 'Hide on resume' : 'Show on resume'}>
          <Button aria-label={section.visible ? `Hide ${section.title}` : `Show ${section.title}`} variant="ghost" size="icon" onClick={() => updateSection(section.id, { visible: !section.visible })} className="h-8 w-8">
            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </Tooltip>
      </div>
      <div className={cn('grid transition-all duration-300 ease-in-out', section.collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]')}>
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-[var(--border)] p-3">
            <AlignmentControl section={section} />
            <SectionSpacingControl section={section} />
            <SectionEditor type={section.type} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AlignmentControl({ section }) {
  const { updateSection } = useResume();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-2 transition-theme">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Text alignment</p>
        <span className="text-xs capitalize text-[var(--muted)]">{section.align || 'left'}</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {alignments.map(({ id, label, icon: Icon }) => (
          <Tooltip key={id} label={`${label} align`}>
            <Button size="sm" variant={(section.align || 'left') === id ? 'primary' : 'ghost'} onClick={() => updateSection(section.id, { align: id })} aria-label={`${label} align ${section.title}`}>
              <Icon className="h-4 w-4" />
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}


const sectionSpacingControls = [
  { key: 'beforeGap', label: 'Before this section', min: 0, max: 48, fallback: 0 },
  { key: 'sectionGap', label: 'After this section', min: 0, max: 56, fallback: 16 },
  { key: 'headingGap', label: 'Heading to content', min: 0, max: 32, fallback: 8 },
  { key: 'itemGap', label: 'Between entries/items', min: 0, max: 40, fallback: 12 },
  { key: 'paragraphGap', label: 'Description/details gap', min: 0, max: 32, fallback: 6 },
  { key: 'bulletGap', label: 'Between bullet points', min: 0, max: 20, fallback: 2 },
  { key: 'linkGap', label: 'Between links', min: 0, max: 36, fallback: 12 },
  { key: 'tagGap', label: 'Between skill/project tags', min: 0, max: 28, fallback: 6 },
];

function SectionSpacingControl({ section }) {
  const { activeResume, updateSection } = useResume();
  const [open, setOpen] = React.useState(false);
  const globalSpacing = activeResume.settings.spacing || {};
  const spacing = section.spacing || {};
  const setSpacing = (key, value) => updateSection(section.id, { spacing: { ...spacing, [key]: value } });
  const resetSpacing = () => updateSection(section.id, { spacing: {} });
  const hasCustom = Object.keys(spacing).length > 0;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] transition-theme">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 rounded-2xl p-2 text-left hover:bg-[var(--accent-soft)]" aria-expanded={open}>
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Custom section spacing</span>
            <span className="block text-xs text-[var(--muted)]">{hasCustom ? 'This section has custom spacing' : 'Using global spacing defaults'}</span>
          </span>
        </span>
        <ChevronDown className={cn('h-4 w-4 text-[var(--muted)] transition-transform duration-300', open ? 'rotate-0' : '-rotate-90')} />
      </button>
      <div className={cn('grid transition-all duration-300 ease-in-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-[var(--border)] p-3">
            <div className="flex items-start justify-between gap-2 rounded-xl bg-[var(--surface)] p-2 text-xs text-[var(--muted)]">
              <span>Control spacing only for <strong className="text-[var(--text)]">{section.title}</strong>. Empty sliders inherit global defaults.</span>
              <Button size="sm" variant="ghost" onClick={resetSpacing} disabled={!hasCustom} aria-label={`Reset spacing for ${section.title}`}><RotateCcw className="h-3.5 w-3.5" /> Reset</Button>
            </div>
            {sectionSpacingControls.map((control) => {
              const inherited = globalSpacing[control.key] ?? control.fallback;
              const value = spacing[control.key] ?? inherited;
              const custom = spacing[control.key] !== undefined;
              return <SpacingRange key={control.key} {...control} value={value} inherited={inherited} custom={custom} onChange={(next) => setSpacing(control.key, next)} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingRange({ label, value, min, max, inherited, custom, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        <span>{label}</span>
        <span className={custom ? 'text-[var(--accent)]' : ''}>{value}px {custom ? 'custom' : `global ${inherited}px`}</span>
      </div>
      <input aria-label={label} type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[var(--accent)]" />
    </div>
  );
}
