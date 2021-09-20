import { Store } from 'src/app/core/store/store';
import { FileUpload } from './file-upload';


export class FileUploadLoadingState extends Store.AbstractLoadingState<FileUpload[]> {}
export class FileUploadLoadingErrorState extends Store.AbstractErrorState<FileUpload[]> {}
export class FileUploadLoadedState extends Store.AbstractIdealState<FileUpload[]> {}
