import { Store } from "src/app/core/store/store";
import { Table } from "src/app/shared/table/table.model";

export class RevenueAnalyticsLoadingState extends Store.AbstractLoadingState<Table> {}

export class RevenueAnalyticsErrorState extends Store.AbstractErrorState<Table>{}

export class RevenueAnalyticsLoadedState extends Store.AbstractIdealState<Table>{}