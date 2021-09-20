import { Store } from 'src/app/core/store/store';
import { hierarchicalData } from './metric-indices.model';

export class hierarchialDataCreatingState extends Store.AbstractLoadingState<hierarchicalData> { }
export class hierarchialDataCreatingErrorState extends Store.AbstractErrorState<hierarchicalData> { }
export class hierarchialDataCreatedState extends Store.AbstractIdealState<hierarchicalData> { }
