import { Store } from 'src/app/core/store/store';
import { BusinessHealthTable } from './business-health.model';

export class BusinessHealthLoadingState extends Store.AbstractLoadingState<BusinessHealthTable> { }
export class BusinessHealthLoadingErrorState extends Store.AbstractErrorState<BusinessHealthTable> { }
export class BusinessHealthLoadedState extends Store.AbstractIdealState<BusinessHealthTable> { }
