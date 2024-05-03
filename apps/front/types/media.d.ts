export type File = {
  id: number;
  filePath: string;
  fileName: string;
  mimeType: string;
  folderId: number;
  size: number;
  alt: string;
  caption: string;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IDeleteMediaAndFolder = {
  fileIds: number[];
  folders: number[];
};
