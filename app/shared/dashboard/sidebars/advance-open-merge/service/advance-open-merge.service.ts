import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { SelectItem } from 'primeng/public_api';
import {
  GraphOprationLoadedState,
  TireLoadedState,
  ServerLoadedState,
  InstenceLoadedState,
  BusinessTransactionsLoadedState,
  ValuesLoadedState,
  OpenwithWidgetsLoadedState,
  OperatersLoadedState,
  FilterByLoadedState,
  CriteriaLoadedState,
} from './select-item.state';

@Injectable({
  providedIn: 'root',
})
export class SelectItemService extends Store.AbstractService {
  // Action: Load
  loadGraphOpration(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const oprationSampleData: SelectItem[] = [
      {
        label: 'Open All',
        value: 'Open All',
      },
      {
        label: 'Merge All',
        value: 'Merge All',
      },
      {
        label: 'Advanced Open/Merge',
        value: 'Advanced Open/Merge',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new GraphOprationLoadedState(oprationSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadTire(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const tireSampleData: SelectItem[] = [
      {
        label: 'All',
        value: 'All',
      },
      {
        label: 'Same',
        value: 'Same',
      },
      {
        label: 'Pattern',
        value: 'Pattern',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new TireLoadedState(tireSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }
  loadServer(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const serverSampleData: SelectItem[] = [
      {
        label: 'All',
        value: 'All',
      },
      {
        label: 'Same',
        value: 'Same',
      },
      {
        label: 'Pattern',
        value: 'Pattern',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new ServerLoadedState(serverSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadInstence(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const serverSampleData: SelectItem[] = [
      {
        label: 'All',
        value: 'All',
      },
      {
        label: 'Same',
        value: 'Same',
      },
      {
        label: 'Pattern',
        value: 'Pattern',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new InstenceLoadedState(serverSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadBusinessTransactions(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const serverSampleData: SelectItem[] = [
      {
        label: 'All',
        value: 'All',
      },
      {
        label: 'Same',
        value: 'Same',
      },
      {
        label: 'Pattern',
        value: 'Pattern',
      },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new BusinessTransactionsLoadedState(serverSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadValues(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const valueSampleData: SelectItem[] = [
      { label: 'Avg', value: 'Avg' },
      { label: 'Min', value: 'Min' },
      { label: 'Max', value: 'Max' },
      { label: 'Count', value: 'Count' },
      { label: 'SumCount', value: 'SumCount' }
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new ValuesLoadedState(valueSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadOpenwithWidgets(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const openwithSampleData: SelectItem[] = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '9', value: '9' },
      { label: '16', value: '16' },
      { label: '18', value: '18' },
      { label: '20', value: '20' },
      { label: '32', value: '32' },
      { label: 'Default', value: 'Default' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new OpenwithWidgetsLoadedState(openwithSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadOpraters(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const opratersSampleData: SelectItem[] = [
      { label: '=', value: '=' },
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
      { label: 'Top', value: 'Top' },
      { label: 'Bottom', value: 'Bottom' },
      { label: 'In-Between', value: 'In-Between' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new OperatersLoadedState(opratersSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadFilterBy(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const filterBySampleData: SelectItem[] = [
      { label: 'Avg', value: 'Avg' },
      { label: 'Min', value: 'Min' },
      { label: 'Max', value: 'Max' },
      { label: 'Count', value: 'Count'}
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new FilterByLoadedState(filterBySampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }

  loadCriteria(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();

    // output.next(new SelectItemLoadingState());

    // /// DEV CODE ----------------->
    const criteriaSampleData: SelectItem[] = [
      { label: 'Include', value: 'Include' },
      { label: 'Exclude', value: 'Exclude' },
    ];

    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new CriteriaLoadedState(criteriaSampleData));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }
}
