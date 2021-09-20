import { Store } from 'src/app/core/store/store';
import { FileDownload } from './download-file.model';


export class FileDownloadLoadingState extends Store.AbstractLoadingState<FileDownload[]> {}
export class FileDownloadLoadingErrorState extends Store.AbstractErrorState<FileDownload[]> {}
export class FileDownloadLoadedState extends Store.AbstractIdealState<FileDownload[]> {}