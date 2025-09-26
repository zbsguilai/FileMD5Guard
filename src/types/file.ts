export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  md5: string;
  uploadTime: string;
  isDuplicate?: boolean;
  duplicateGroup?: string;
}

export interface DuplicateGroup {
  md5: string;
  files: FileItem[];
}
