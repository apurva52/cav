import { Store } from 'src/app/core/store/store';
import { ExceptionData, AggregateExceptionData } from './exception.model';

export class AggregateExceptionLoadingState extends Store.AbstractLoadingState<AggregateExceptionData> { }
export class AggregateExceptionLoadingErrorState extends Store.AbstractErrorState<AggregateExceptionData> { }
export class AggregateExceptionLoadedState extends Store.AbstractIdealState<AggregateExceptionData> { }

export class ExceptionLoadingState extends Store.AbstractLoadingState<ExceptionData> { }
export class ExceptionLoadingErrorState extends Store.AbstractErrorState<ExceptionData> { }
export class ExceptionLoadedState extends Store.AbstractIdealState<ExceptionData> { }

export class SourceCodeLoadingState extends Store.AbstractLoadingState<string> { }
export class SourceCodeLoadingErrorState extends Store.AbstractErrorState<string> { }
export class SourceCodeLoadedState extends Store.AbstractIdealState<string> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }


export class VarArgsLoadingState extends Store.AbstractLoadingState<any> { }
export class VarArgsLoadingErrorState extends Store.AbstractErrorState<any> { }
export class VarArgsLoadedState extends Store.AbstractIdealState<any> { }
