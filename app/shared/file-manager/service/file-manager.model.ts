import { InfoData } from '../../dialogs/informative-dialog/service/info.model';

export interface FileManager {
  isDir: boolean;
  isFile: boolean;
  isSelected: boolean;
  mime: string;
  modified: string;
  name: string;
  path: string;
  size: number;
}

export interface FileManagerLoadPayload {
  path: string;
  cctx: Object;
  type: string;
  callFromAlert: boolean;
  multiDc: boolean;
}

export interface UploadFilePayload {
  type: string;
  destination: string;
  isOverwrite: boolean;
  cctx: Object;
}

export interface NewFolder {
  status: Object;
  cctx: Object;
}

export const CONTENT: InfoData = {
  title: 'Error',
  information: 'Not a valid condition.',
  button: 'Ok'
}
