import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class ParserLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class ParserLoadingState extends Store.AbstractErrorState<Table> { }
export class ParserLoadedState extends Store.AbstractIdealState<Table> { }


