export const A4_PAGE_HEIGHT_PX = 1123;
export const A4_PAGE_WIDTH_PX = 794;
export const NEW_PAGE_TOP_SPACE_PX = 72; // MS Word-like top margin on page 2+
export const PAGE_BOTTOM_SAFE_SPACE_PX = 72; // MS Word-like bottom margin on every page

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function getUnscaledMetrics(root, element) {
  const rootRect = root.getBoundingClientRect();
  const rect = element.getBoundingClientRect();

  // The preview is zoomed with CSS transform: scale(...). getBoundingClientRect()
  // returns scaled values, but A4 math must use real 794x1123 CSS pixels.
  const scaleY = rootRect.height ? (root.scrollHeight || rootRect.height) / rootRect.height : 1;

  return {
    top: (rect.top - rootRect.top) * scaleY,
    height: rect.height * scaleY,
  };
}

export function resetResumePagination(root) {
  if (!root) return;
  root.querySelectorAll('.resume-section').forEach((section) => {
    const baseBefore = toNumber(section.dataset.sectionBefore, 0);
    section.style.marginTop = `${baseBefore}px`;
    section.dataset.pageBreakBefore = 'false';
  });
}

export function applyResumePagination(root, options = {}) {
  if (!root) return 1;
  const pageHeight = options.pageHeight || A4_PAGE_HEIGHT_PX;
  const newPageTopSpace = options.newPageTopSpace ?? NEW_PAGE_TOP_SPACE_PX;
  const bottomSafeSpace = options.bottomSafeSpace ?? PAGE_BOTTOM_SAFE_SPACE_PX;
  const usablePageHeight = pageHeight - newPageTopSpace - bottomSafeSpace;

  const sections = Array.from(root.querySelectorAll('.resume-section'));
  if (!sections.length) return Math.max(1, Math.ceil((root.scrollHeight || pageHeight) / pageHeight));

  resetResumePagination(root);

  // Multiple passes are needed because moving one section changes every section
  // after it. This behaves much closer to MS Word page layout.
  for (let pass = 0; pass < 14; pass += 1) {
    let changed = false;

    sections.forEach((section) => {
      const baseBefore = toNumber(section.dataset.sectionBefore, 0);
      const currentMargin = toNumber(section.style.marginTop, baseBefore);
      const { top, height } = getUnscaledMetrics(root, section);

      // If a section itself is taller than the page content area, it cannot be
      // kept as one piece. The PDF slicer will split only that oversized block.
      if (height > usablePageHeight) return;

      const pageIndex = Math.floor(top / pageHeight);
      const pageStart = pageIndex * pageHeight;
      const pageEnd = pageStart + pageHeight - bottomSafeSpace;
      const offsetInPage = top - pageStart;
      let extraSpace = 0;

      // If section starts on page 2/3/etc. too high, push it below top margin.
      if (pageIndex > 0 && offsetInPage < newPageTopSpace) {
        extraSpace = Math.max(extraSpace, newPageTopSpace - offsetInPage);
      }

      // If full section does not fit before bottom margin, move the whole
      // section to the next page after top margin.
      if (top + height > pageEnd) {
        const nextPageContentStart = (pageIndex + 1) * pageHeight + newPageTopSpace;
        extraSpace = Math.max(extraSpace, nextPageContentStart - top);
      }

      if (extraSpace > 0.5) {
        section.style.marginTop = `${currentMargin + extraSpace}px`;
        section.dataset.pageBreakBefore = 'true';
        changed = true;
      }
    });

    if (!changed) break;
  }

  return Math.max(1, Math.ceil((root.scrollHeight || pageHeight) / pageHeight));
}
