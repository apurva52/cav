import { GraphData, GroupData} from './add-report-settings.model';
import { Store } from 'src/app/core/store/store';


export class ReportGroupLoadingState extends Store.AbstractLoadingState<any> { }
export class ReportGroupLoadingErrorState extends Store.AbstractErrorState<any> { }
export class ReportGroupLoadedState extends Store.AbstractIdealState<any> { }

export class ReportGraphLoadingState extends Store.AbstractLoadingState<any> { }
export class ReportGraphLoadingErrorState extends Store.AbstractErrorState<any> { }
export class ReportGraphLoadedState extends Store.AbstractIdealState<any> { }

export class  DefaultPercentileLoadingState extends Store.AbstractLoadingState<any> { }
export class DefaultPercentileLoadedState extends Store.AbstractIdealState<any> { }
export class DefaultPercentileLoadingErrorState extends Store.AbstractErrorState<any> { }

export class  ReportPresetLoadingState extends Store.AbstractLoadingState<any> { }
export class ReportPresetLoadedState extends Store.AbstractIdealState<any> { }
export class ReportPresetLoadingErrorState extends Store.AbstractErrorState<any> { }