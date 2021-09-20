import { Store } from 'src/app/core/store/store';
import { TransactionFlowpathDetailsTable } from './transaction-flowpath-details.model';

export class TransactionFlowpathDetailsLoadingState extends Store.AbstractLoadingState<TransactionFlowpathDetailsTable> { }
export class TransactionFlowpathDetailsLoadingErrorState extends Store.AbstractErrorState<TransactionFlowpathDetailsTable> { }
export class TransactionFlowpathDetailsLoadedState extends Store.AbstractIdealState<TransactionFlowpathDetailsTable> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
