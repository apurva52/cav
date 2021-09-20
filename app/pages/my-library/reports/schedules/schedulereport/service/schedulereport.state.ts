import { Store } from 'src/app/core/store/store';

export class FavoriteTaskListLoadingState extends Store.AbstractLoadingState<any>{}
export class FavoriteTaskListLoadedState extends Store.AbstractIdealState<any>{}
export class FavoriteTaskListLoadingErrorState extends Store.AbstractErrorState<any>{}
export class FavTaskListLoadingState extends Store.AbstractLoadingState<any>{}
export class FavTaskListLoadedState extends Store.AbstractIdealState<any>{}
export class FavTaskListLoadingErrorState  extends Store.AbstractErrorState<any>{}
export class TemplateTaskListLoadingState extends Store.AbstractLoadingState<any>{}
export class TemplateTaskListLoadedState extends Store.AbstractIdealState<any>{}
export class TemplateTaskListLoadingErrorState  extends Store.AbstractErrorState<any>{}

export class  AlertDigestTaskListLoadingState extends Store.AbstractLoadingState<any>{}
export class AlertDigestTaskListLoadedState extends Store.AbstractIdealState<any>{}
export class AlertDigestListLoadingErrorState  extends Store.AbstractErrorState<any>{}
export class ReportTimebarTimeLoadingState extends Store.AbstractLoadingState<number[]> { }
export class ReportTimebarTimeLoadingErrorState extends Store.AbstractErrorState<number[]> { }
export class ReportTimebarTimeLoadedState extends Store.AbstractIdealState<number[]> { } 

export class AddReportTaskLoadingState extends Store.AbstractLoadingState<any[]> { }
export class AddReportTaskLoadedState extends Store.AbstractErrorState<any[]> { }
export class AddReportTaskLoadingErrorState extends Store.AbstractIdealState<any[]> { } 

export class UpdateReportTaskLoadingState extends Store.AbstractLoadingState<any[]> { }
export class UpdateReportTaskLoadedState extends Store.AbstractErrorState<any[]> { }
export class UpdateReportTaskLoadingErrorState extends Store.AbstractIdealState<any[]> { } 
