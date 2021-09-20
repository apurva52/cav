import { Store } from 'src/app/core/store/store';
import { FileManager, NewFolder } from './file-manager.model';

export class FileManagerLoadingState extends Store.AbstractLoadingState<
  FileManager[]
> {}
export class FileManagerLoadingErrorState extends Store.AbstractErrorState<
  FileManager[]
> {}
export class FileManagerLoadedState extends Store.AbstractIdealState<
  FileManager[]
> {}

export class NewFolderLoadingState extends Store.AbstractLoadingState<
  NewFolder[]
> {}
export class NewFolderLoadingErrorState extends Store.AbstractErrorState<
  NewFolder[]
> {}
export class NewFolderLoadedState extends Store.AbstractIdealState<
  NewFolder[]
> {}
