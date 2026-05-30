import React, { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';
import { produce } from 'immer';
import { defaultSettings, emptyResumeData, makeInitialAppState, makeResume, makeSectionState, schemaVersion } from '../data/defaultResume';

const STORAGE_KEY = 'flowcv-resume-builder:v1';
const ResumeContext = createContext(null);

const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizeData(data = {}) {
  const base = emptyResumeData();
  const merged = { ...base, ...data, personal: { ...base.personal, ...(data.personal || {}) } };
  merged.personal.websiteLabel = merged.personal.websiteLabel || 'Website';
  merged.personal.linkedinLabel = merged.personal.linkedinLabel || 'LinkedIn';
  merged.personal.githubLabel = merged.personal.githubLabel || 'GitHub';
  merged.projects = (merged.projects || []).map((project) => ({ liveLabel: 'Project', githubLabel: 'GitHub', ...project }));
  return merged;
}

function normalizeSettings(settings = {}) {
  const base = defaultSettings();
  return { ...base, ...settings, spacing: { ...base.spacing, ...(settings.spacing || {}) }, page: { ...base.page, ...(settings.page || {}) } };
}

function normalizeResume(resume) {
  return {
    id: resume.id || crypto.randomUUID?.() || `resume_${Date.now()}`,
    name: resume.name || 'Imported Resume',
    createdAt: resume.createdAt || new Date().toISOString(),
    updatedAt: resume.updatedAt || new Date().toISOString(),
    data: normalizeData(resume.data),
    sections: Array.isArray(resume.sections) && resume.sections.length ? resume.sections.map((section) => ({ visible: true, collapsed: true, align: 'left', spacing: {}, ...section, spacing: { ...(section.spacing || {}) } })) : makeSectionState(),
    settings: normalizeSettings(resume.settings),
  };
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return makeInitialAppState();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== schemaVersion || !Array.isArray(parsed.resumes) || parsed.resumes.length === 0) return makeInitialAppState();
    const resumes = parsed.resumes.map(normalizeResume);
    return { version: schemaVersion, activeId: parsed.activeId && resumes.some((r) => r.id === parsed.activeId) ? parsed.activeId : resumes[0].id, resumes };
  } catch {
    return makeInitialAppState();
  }
}

const initialHistory = () => ({ past: [], present: loadInitial(), future: [] });

function reducer(state, action) {
  switch (action.type) {
    case 'COMMIT': {
      const next = produce(state.present, action.recipe);
      if (next === state.present) return state;
      return { past: [...state.past, state.present].slice(-50), present: next, future: [] };
    }
    case 'UNDO': {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future].slice(0, 50) };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      const [next, ...rest] = state.future;
      return { past: [...state.past, state.present].slice(-50), present: next, future: rest };
    }
    case 'IMPORT_APP': {
      return { past: [...state.past, state.present].slice(-50), present: action.payload, future: [] };
    }
    default:
      return state;
  }
}

function setByPath(target, path, value) {
  const keys = Array.isArray(path) ? path : path.split('.');
  let cursor = target;
  keys.slice(0, -1).forEach((key) => {
    if (cursor[key] === undefined) cursor[key] = {};
    cursor = cursor[key];
  });
  cursor[keys[keys.length - 1]] = value;
}

export function ResumeProvider({ children }) {
  const [history, dispatch] = useReducer(reducer, undefined, initialHistory);
  const [saveStatus, setSaveStatus] = useState('Saved just now');
  const activeResume = history.present.resumes.find((resume) => resume.id === history.present.activeId) || history.present.resumes[0];

  const commit = useCallback((recipe) => dispatch({ type: 'COMMIT', recipe }), []);
  const touchActive = (draft) => {
    const resume = draft.resumes.find((item) => item.id === draft.activeId);
    if (resume) resume.updatedAt = new Date().toISOString();
    return resume;
  };

  const updateActiveResume = useCallback((recipe) => commit((draft) => {
    const resume = touchActive(draft);
    if (resume) recipe(resume, draft);
  }), [commit]);

  const updateDataPath = useCallback((path, value) => updateActiveResume((resume) => setByPath(resume.data, path, value)), [updateActiveResume]);
  const updateSettings = useCallback((path, value) => updateActiveResume((resume) => setByPath(resume.settings, path, value)), [updateActiveResume]);
  const updateSection = useCallback((sectionId, patch) => updateActiveResume((resume) => {
    const section = resume.sections.find((item) => item.id === sectionId);
    if (section) Object.assign(section, patch);
  }), [updateActiveResume]);
  const reorderSections = useCallback((activeId, overId) => updateActiveResume((resume) => {
    const oldIndex = resume.sections.findIndex((item) => item.id === activeId);
    const newIndex = resume.sections.findIndex((item) => item.id === overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
    const [moved] = resume.sections.splice(oldIndex, 1);
    resume.sections.splice(newIndex, 0, moved);
  }), [updateActiveResume]);

  const addArrayItem = useCallback((key, item) => updateActiveResume((resume) => { resume.data[key].push(item); }), [updateActiveResume]);
  const updateArrayItem = useCallback((key, id, patchOrRecipe) => updateActiveResume((resume) => {
    const item = resume.data[key].find((entry) => entry.id === id);
    if (!item) return;
    if (typeof patchOrRecipe === 'function') patchOrRecipe(item);
    else Object.assign(item, patchOrRecipe);
  }), [updateActiveResume]);
  const deleteArrayItem = useCallback((key, id) => updateActiveResume((resume) => {
    resume.data[key] = resume.data[key].filter((entry) => entry.id !== id);
  }), [updateActiveResume]);

  const switchResume = useCallback((id) => commit((draft) => { draft.activeId = id; }), [commit]);
  const renameResume = useCallback((id, name) => commit((draft) => {
    const resume = draft.resumes.find((item) => item.id === id);
    if (resume) { resume.name = name || 'Untitled Resume'; resume.updatedAt = new Date().toISOString(); }
  }), [commit]);
  const createResume = useCallback(() => commit((draft) => {
    const resume = makeResume(`Resume ${draft.resumes.length + 1}`, false);
    draft.resumes.push(resume);
    draft.activeId = resume.id;
  }), [commit]);
  const duplicateResume = useCallback((id) => commit((draft) => {
    const source = draft.resumes.find((item) => item.id === id) || draft.resumes[0];
    const copy = clone(source);
    copy.id = crypto.randomUUID?.() || `resume_${Date.now()}`;
    copy.name = `${source.name} Copy`;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    draft.resumes.push(copy);
    draft.activeId = copy.id;
  }), [commit]);
  const deleteResume = useCallback((id) => commit((draft) => {
    if (draft.resumes.length === 1) return;
    const index = draft.resumes.findIndex((item) => item.id === id);
    if (index >= 0) draft.resumes.splice(index, 1);
    if (draft.activeId === id) draft.activeId = draft.resumes[Math.max(0, index - 1)]?.id || draft.resumes[0].id;
  }), [commit]);

  const importResumeJson = useCallback((json) => {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (parsed.version === schemaVersion && Array.isArray(parsed.resumes)) {
      const resumes = parsed.resumes.map(normalizeResume);
      dispatch({ type: 'IMPORT_APP', payload: { version: schemaVersion, activeId: parsed.activeId || resumes[0].id, resumes } });
      return 'workspace';
    }
    const resume = normalizeResume(parsed.data ? parsed : { data: parsed });
    commit((draft) => { draft.resumes.push(resume); draft.activeId = resume.id; });
    return 'resume';
  }, [commit]);

  const saveNow = useCallback(() => {
    setSaveStatus('Saving...');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present));
    window.setTimeout(() => setSaveStatus('Saved just now'), 220);
  }, [history.present]);

  const value = useMemo(() => ({
    appState: history.present,
    activeResume,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    saveStatus,
    setSaveStatus,
    saveNow,
    commit,
    updateActiveResume,
    updateDataPath,
    updateSettings,
    updateSection,
    reorderSections,
    addArrayItem,
    updateArrayItem,
    deleteArrayItem,
    switchResume,
    renameResume,
    createResume,
    duplicateResume,
    deleteResume,
    importResumeJson,
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
  }), [history, activeResume, saveStatus, commit, updateActiveResume, updateDataPath, updateSettings, updateSection, reorderSections, addArrayItem, updateArrayItem, deleteArrayItem, switchResume, renameResume, createResume, duplicateResume, deleteResume, importResumeJson, saveNow]);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used inside ResumeProvider');
  return ctx;
};
