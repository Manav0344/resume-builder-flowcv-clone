import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { A4_PAGE_HEIGHT_PX, A4_PAGE_WIDTH_PX, applyResumePagination } from './pagination';

const MAX_CANVAS_PIXELS = 42_000_000;

function safeFileName(name) {
  return String(name || 'resume')
    .replace(/\.pdf$/i, '')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim() || 'resume';
}

function collectLinks(element) {
  const elementRect = element.getBoundingClientRect();
  return Array.from(element.querySelectorAll('a[href]')).map((anchor) => {
    const rect = anchor.getBoundingClientRect();
    return {
      href: anchor.href,
      x: rect.left - elementRect.left,
      y: rect.top - elementRect.top,
      width: rect.width,
      height: rect.height,
    };
  }).filter((link) => link.href && link.width > 0 && link.height > 0);
}

function addPdfLinks(pdf, links, pageWidth, pageHeight, cssPxToMm) {
  links.forEach((link) => {
    const x = link.x * cssPxToMm;
    const y = link.y * cssPxToMm;
    const width = Math.max(2, link.width * cssPxToMm);
    const height = Math.max(2, link.height * cssPxToMm);
    const startPage = Math.floor(y / pageHeight);
    const endPage = Math.floor((y + height) / pageHeight);

    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex += 1) {
      const pageCount = pdf.getNumberOfPages();
      if (pageIndex + 1 > pageCount) continue;
      const yOnPage = y - pageIndex * pageHeight;
      const clippedTop = Math.max(0, yOnPage);
      const clippedBottom = Math.min(pageHeight, yOnPage + height);
      const clippedHeight = clippedBottom - clippedTop;
      if (clippedHeight <= 0) continue;
      pdf.setPage(pageIndex + 1);
      pdf.link(Math.max(0, x), clippedTop, Math.min(width, pageWidth - x), clippedHeight, { url: link.href });
    }
  });
}

function makeExportClone(element) {
  const clone = element.cloneNode(true);
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.className = 'pdf-export-host';

  Object.assign(container.style, {
    position: 'fixed',
    left: '-12000px',
    top: '0',
    width: `${A4_PAGE_WIDTH_PX}px`,
    minHeight: `${A4_PAGE_HEIGHT_PX}px`,
    background: '#ffffff',
    zIndex: '0',
    pointerEvents: 'none',
    overflow: 'visible',
    opacity: '1',
    visibility: 'visible',
  });

  Object.assign(clone.style, {
    transform: 'none',
    width: `${A4_PAGE_WIDTH_PX}px`,
    minHeight: `${A4_PAGE_HEIGHT_PX}px`,
    height: 'auto',
    boxShadow: 'none',
    margin: '0',
    background: '#ffffff',
    position: 'static',
    left: 'auto',
    top: 'auto',
    opacity: '1',
    visibility: 'visible',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  });

  clone.classList.add('pdf-export-clone');
  clone.querySelectorAll('.page-break-preview, .preview-toolbar').forEach((node) => node.remove());
  container.appendChild(clone);
  document.body.appendChild(container);
  return { container, clone };
}

function removeExportClone(container) {
  if (container?.parentNode) container.parentNode.removeChild(container);
}

async function waitForRender(frames = 2) {
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch { /* ignore font loading issues */ }
  }
  for (let index = 0; index < frames; index += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function getRenderScale(cssWidth, cssHeight) {
  const deviceScale = Math.max(2, Math.min(3, window.devicePixelRatio || 2));
  const maxScale = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, cssWidth * cssHeight));
  return Math.max(1.5, Math.min(deviceScale, maxScale));
}

function addCanvasPage(pdf, canvas, pageWidth, pageHeight, pageIndex, sourceY, pageHeightPx) {
  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = canvas.width;
  pageCanvas.height = pageHeightPx;
  const pageCtx = pageCanvas.getContext('2d', { alpha: false });

  pageCtx.fillStyle = '#ffffff';
  pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  const availableSourceHeight = Math.max(0, Math.min(pageHeightPx, canvas.height - sourceY));
  if (availableSourceHeight > 0) {
    pageCtx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      availableSourceHeight,
      0,
      0,
      canvas.width,
      availableSourceHeight,
    );
  }

  if (pageIndex > 0) pdf.addPage('a4', 'p');

  // PNG keeps resume text, thin lines and color boxes noticeably sharper than JPEG.
  pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
}

async function renderResumeCanvas(clone, cssWidth, cssHeight, scale) {
  return html2canvas(clone, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: cssWidth,
    height: cssHeight,
    windowWidth: cssWidth,
    windowHeight: cssHeight,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    foreignObjectRendering: false,
    removeContainer: true,
    onclone: (doc) => {
      const clonedPage = doc.querySelector('.pdf-export-clone');
      if (clonedPage) {
        clonedPage.style.transform = 'none';
        clonedPage.style.boxShadow = 'none';
        clonedPage.style.background = '#ffffff';
        clonedPage.style.opacity = '1';
        clonedPage.style.visibility = 'visible';
      }
      doc.querySelectorAll('.page-break-preview, .preview-toolbar').forEach((node) => node.remove());
    },
  });
}

export async function exportResumePdf(element, fileName = 'resume.pdf') {
  if (!element) throw new Error('Resume preview element not found');

  const { container, clone } = makeExportClone(element);
  try {
    await waitForRender(3);

    const pageTopMargin = Number(clone.dataset.pageTopMargin) || 64;
    const pageBottomMargin = Number(clone.dataset.pageBottomMargin) || 64;

    // Run pagination more than once because font loading and moved sections can
    // change the final height. This keeps preview and exported PDF aligned.
    applyResumePagination(clone, { newPageTopSpace: pageTopMargin, bottomSafeSpace: pageBottomMargin });
    await waitForRender(2);
    applyResumePagination(clone, { newPageTopSpace: pageTopMargin, bottomSafeSpace: pageBottomMargin });
    await waitForRender(1);

    const links = collectLinks(clone);
    const cssWidth = Math.round(clone.scrollWidth || clone.getBoundingClientRect().width || A4_PAGE_WIDTH_PX);
    const cssHeight = Math.max(A4_PAGE_HEIGHT_PX, Math.ceil(clone.scrollHeight || clone.getBoundingClientRect().height || A4_PAGE_HEIGHT_PX));
    const scale = getRenderScale(cssWidth, cssHeight);

    const canvas = await renderResumeCanvas(clone, cssWidth, cssHeight, scale);
    if (!canvas.width || !canvas.height) throw new Error('PDF canvas render failed');

    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true, precision: 16 });
    pdf.setProperties({
      title: safeFileName(fileName),
      subject: 'Resume',
      creator: 'ResumeFlow Resume Builder',
      producer: 'ResumeFlow Resume Builder',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageHeightPx = Math.round((canvas.width * pageHeight) / pageWidth);
    const cssPxToMm = pageWidth / cssWidth;
    const pageCount = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      addCanvasPage(pdf, canvas, pageWidth, pageHeight, pageIndex, pageIndex * pageHeightPx, pageHeightPx);
    }

    addPdfLinks(pdf, links, pageWidth, pageHeight, cssPxToMm);
    pdf.save(`${safeFileName(fileName)}.pdf`);
  } finally {
    removeExportClone(container);
  }
}
