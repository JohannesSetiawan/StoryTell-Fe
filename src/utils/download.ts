export function extractFilenameFromHeader(headerValue: string | null, fallback: string): string {
  if (!headerValue) {
    return fallback;
  }

  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(headerValue);
  if (match) {
    const filename = decodeURIComponent(match[1] || match[2] || '').trim();
    if (filename) {
      return filename;
    }
  }

  return fallback;
}

export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
