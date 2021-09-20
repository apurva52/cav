import { Store } from 'src/app/core/store/store';
import { FileDownload } from './generic-import-export.model';


export class ImportExportLoadingState extends Store.AbstractLoadingState<FileDownload> {}
export class ImportExportLoadingErrorState extends Store.AbstractErrorState<FileDownload> {}
export class ImportExportLoadedState extends Store.AbstractIdealState<FileDownload> {}