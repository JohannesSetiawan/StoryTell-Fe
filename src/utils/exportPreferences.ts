export type ExportFormat = 'pdf' | 'epub' | 'html' | 'txt';
export type BackupSection =
  | 'stories'
  | 'chapters'
  | 'bookmarks'
  | 'tags'
  | 'ratings'
  | 'followers'
  | 'following'
  | 'read-history';

const EXPORT_FORMAT_KEY = 'storytell.export.defaultFormat';
const BACKUP_SECTIONS_KEY = 'storytell.backup.sections';

export const ALL_BACKUP_SECTIONS: BackupSection[] = [
  'stories',
  'chapters',
  'bookmarks',
  'tags',
  'ratings',
  'followers',
  'following',
  'read-history',
];

export function getDefaultExportFormat(): ExportFormat | null {
  const stored = localStorage.getItem(EXPORT_FORMAT_KEY);
  if (stored && ['pdf', 'epub', 'html', 'txt'].includes(stored)) {
    return stored as ExportFormat;
  }
  return null;
}

export function setDefaultExportFormat(format: ExportFormat) {
  localStorage.setItem(EXPORT_FORMAT_KEY, format);
}

export function getBackupSections(): BackupSection[] | null {
  const raw = localStorage.getItem(BACKUP_SECTIONS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    const filtered = parsed.filter((item): item is BackupSection =>
      ALL_BACKUP_SECTIONS.includes(item as BackupSection),
    );
    return filtered.length > 0 ? filtered : null;
  } catch (error) {
    return null;
  }
}

export function setBackupSections(sections: BackupSection[]) {
  localStorage.setItem(BACKUP_SECTIONS_KEY, JSON.stringify(sections));
}
