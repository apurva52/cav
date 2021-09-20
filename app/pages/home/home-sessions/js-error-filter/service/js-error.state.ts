import { Store } from '../../../../../core/store/store';
import {JsErrorAggFilterTable } from './js-error.model';

export class JsErrorAggListLoadingErrorState extends Store.AbstractLoadingState<JsErrorAggFilterTable> { }
export class JsErrorAggListLoadingState extends Store.AbstractErrorState<JsErrorAggFilterTable> { }
export class JsErrorAggListLoadedState extends Store.AbstractIdealState<JsErrorAggFilterTable> { }