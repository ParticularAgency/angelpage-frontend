import DOMPurify from 'isomorphic-dompurify';

/** Sanitize CMS HTML before rendering with dangerouslySetInnerHTML */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  });
}
