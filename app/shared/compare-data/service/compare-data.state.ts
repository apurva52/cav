import { Subscription } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {  CompareDataTable } from './compare-data.model';

export class CompareDataLoadingState extends Store.AbstractLoadingState<CompareDataTable> { }
export class CompareDataLoadingErrorState extends Store.AbstractErrorState<CompareDataTable> { }
export class CompareDataLoadedState extends Store.AbstractIdealState<CompareDataTable> { }

