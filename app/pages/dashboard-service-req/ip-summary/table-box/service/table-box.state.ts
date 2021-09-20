import { Store } from 'src/app/core/store/store';
import { TableBoxTable } from './table-box.model';


export class TableBoxLoadingState extends Store.AbstractLoadingState<TableBoxTable> { }
export class TableBoxLoadingErrorState extends Store.AbstractErrorState<TableBoxTable> { }
export class TableBoxLoadedState extends Store.AbstractIdealState<TableBoxTable> { }
