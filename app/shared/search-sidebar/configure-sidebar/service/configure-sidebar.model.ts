import { TableHeader, TableSearch, TableSort, TablePagination, TableHeaderColumn, Table } from 'src/app/shared/table/table.model';
import { ClientCTX } from 'src/app/core/session/session.model';

// tslint:disable-next-line:no-empty-interface
export interface ConfigureSidebarTableHeaderCols extends TableHeaderColumn {
  }
  
  export interface ConfigureSidebarTableHeader {
    cols: ConfigureSidebarTableHeaderCols[];
  }
  
export interface ConfigureSidebarData {
    tableData: ConfigureSidebarTable;
    values: ConfigureSidebarOptions;
}

export interface ConfigureSidebarTable extends Table{
    headers?: ConfigureSidebarTableHeader[];
   
}

export interface ConfigureSidebarOptions {
    tier?: ConfigureSidebarTier[];
    front_end_tier?: ConfigureSidebarFrontEndTier[];
}
export interface ConfigureSidebarLoadPayload {
    localDataCtx?: LocalDataCtx;
    cctx: ClientCTX;
    duration: Duration;
    dataFilter: number[];
    dc?: string;
    appName: string;
    appTierMap?: AppTierMap;
    isAll?: boolean;
    multiDc?: boolean;
    opType: number;
    storeAlertType: number;
    tr: number;
}

export interface LocalDataCtx {
    fromLocal: boolean;
    path: string;
}

export interface AppTierMap {
    [appName: string]: AppInfo;
}

export interface AddAppForm {
    application: string;
    tier: string;
    frontTier: string;
}

export interface AppInfo {
    tierList: string[];
    frontTier: string;
}

export interface Duration {
    st: number;
    et: number;
    preset: string;
    viewBy: number;
}

export interface ConfigureSidebarTier {

    label: string;
    value: string;
}

export interface ConfigureSidebarFrontEndTier {

    label: string;
    value: string;
}
