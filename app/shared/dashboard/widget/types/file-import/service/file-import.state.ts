import { Store } from "src/app/core/store/store";
import { FileImport } from "./file-import.model";

export class FileImportLoadingState extends Store.AbstractLoadingState<FileImport> {}
export class FileImportLoadingErrorState extends Store.AbstractErrorState<FileImport> {}
export class FileImportLoadedState extends Store.AbstractIdealState<FileImport> {}