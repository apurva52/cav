import { Store } from "src/app/core/store/store";
import { Table } from "src/app/shared/table/table.model";

export class PathAnalyticsLoadingState extends Store.AbstractLoadingState<Table> {}

export class PathAnalyticsErrorState extends Store.AbstractErrorState<Table>{}

export class PathAnalyticsLoadedState extends Store.AbstractIdealState<Table>{}