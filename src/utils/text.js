const strip = (value) => String(value ?? '').trim();
export const countWords = (resume) => {
  const chunks = [];
  const data = resume?.data || {};
  const walk = (value) => {
    if (!value) return;
    if (typeof value === 'string' || typeof value === 'number') chunks.push(String(value));
    else if (Array.isArray(value)) value.forEach(walk);
    else if (typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(data);
  return chunks.join(' ').split(/\s+/).filter(Boolean).length;
};

export const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some(hasValue);
  return strip(value).length > 0;
};
