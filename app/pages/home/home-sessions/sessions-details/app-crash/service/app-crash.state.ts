import { Store } from 'src/app/core/store/store';
import { AppCrashDataTable } from './app-crash-data.model';

export class AppCrashLoadingErrorState extends Store.AbstractLoadingState<AppCrashDataTable> { }
export class AppCrashLoadingState extends Store.AbstractErrorState<AppCrashDataTable> { }
export class AppCrashLoadedState extends Store.AbstractIdealState<AppCrashDataTable> { }
