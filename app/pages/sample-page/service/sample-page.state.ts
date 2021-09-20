import { Store } from 'src/app/core/store/store';
import { Car, SamplePage } from './sample-page.model';

export class SamplePageLoadingState extends Store.AbstractLoadingState<SamplePage> { }
export class SamplePageLoadingErrorState extends Store.AbstractErrorState<SamplePage> { }
export class SamplePageLoadedState extends Store.AbstractIdealState<SamplePage> { }


export class CarListLoadingState extends Store.AbstractLoadingState<Car> { }
export class CarListLoadingErrorState extends Store.AbstractErrorState<Car> { }
export class CarListLoadedState extends Store.AbstractIdealState<Car> { }
