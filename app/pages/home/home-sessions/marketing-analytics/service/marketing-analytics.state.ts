import { Store } from "src/app/core/store/store";
import { Table } from "src/app/shared/table/table.model";

export class MarketAnalyticsLoadingState extends Store.AbstractLoadingState<Table> {}

export class MarketAnalyticsErrorState extends Store.AbstractErrorState<Table>{}

export class MarketAnalyticsLoadedState extends Store.AbstractIdealState<Table>{}