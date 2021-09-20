import { Store } from "src/app/core/store/store";
import { AuditLogTable } from "./audit-log.model";


export class AuditLogLoadingState extends Store.AbstractLoadingState<AuditLogTable> { }
export class AuditLoadingErrorState extends Store.AbstractErrorState<AuditLogTable> { }
export class AuditLoadedState extends Store.AbstractIdealState<AuditLogTable> { }