import { InfoData } from '../../dialogs/informative-dialog/service/info.model';

export interface FileDownload {
    name:string;
    cctx?: Cctx;
    opType?: number;
    clientId?: string;
    appId?: string;
    status?: Status;
    data?: any;
    configStatus?: ConfigStatus;
}

export interface ConfigStatus {
    id?: number;
    name?: string;
    status?: Status;
}

export interface Cctx {
    cck?: string;
    pk?: string;
    prodType?: string;
    u?: string;
}

export interface Status {
    code?: number;
    msg?: string;
    detailedMsg?: string;
}

export interface ConfirmMsg {
    header: string, display: boolean, body: string, ok: boolean, cancel: boolean, apply: boolean, yes: boolean, no: boolean, width: number, height: number
}
