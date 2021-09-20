import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {
  RelatedMetricsLoadingState,
  RelatedMetricsLoadedState,
  RelatedMetricsLoadingErrorState,
  saveCatalogueLoadingState,
  saveCatalogueLoadingErrorState,
  saveCatalogueLoadedState,
} from './relatedmetrics.state';
import {RelatedMetricsTable} from './relatedmetrics.model';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from '../../../../shared/pattern-matching/catalogue-management/service/catalogue-management.model';

import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RelatedMetricsService extends Store.AbstractService  {
  stateID: string;
  subjectsTags:any;
  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
  ) { 
    super();
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state']
    });
  }
  /**---------------------------------DevCode-------------------------------------------------------------*/

  loadHierarchical(Hierarchicalpayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new RelatedMetricsLoadingState());
    }, 0);
   
    const Hierarchicalpath = environment.api.dashboard.hierarchical.endpoint;
    me.controller.post(Hierarchicalpath, Hierarchicalpayload).subscribe(
      (data: RelatedMetricsTable) => {
        output.next(new RelatedMetricsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new RelatedMetricsLoadingErrorState(e));
        output.complete();

        me.logger.error('Hierarchicalpath Data loading failed', e);
      }
    );
    return output;
  }

  loadgroup(grouppayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new RelatedMetricsLoadingState());
    }, 0);
   
    const grouppath = environment.api.dashboard.group.endpoint;
    me.controller.post(grouppath, grouppayload).subscribe(
      (data: RelatedMetricsTable) => {
        output.next(new RelatedMetricsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new RelatedMetricsLoadingErrorState(e));
        output.complete();

        me.logger.error('loadgroup Data loading failed', e);
      }
    );
    return output;
  }

  loadgraph(graphpayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new RelatedMetricsLoadingState());
    }, 0);
   
    const graphpath = environment.api.dashboard.graph.endpoint;
    me.controller.post(graphpath, graphpayload).subscribe(
      (data: RelatedMetricsTable) => {
        output.next(new RelatedMetricsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new RelatedMetricsLoadingErrorState(e));
        output.complete();

        me.logger.error('loadgraph Data loading failed', e);
      }
    );

    return output;
  }

  saveCatalogue(payload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new saveCatalogueLoadingState());
    }, 0);
   
  //const graphpath = environment.api.dashboard.openRelatedCatalouge.endpoint;
  const graphpath = environment.api.saveCatalogue.load.endpoint;
    me.controller.post(graphpath, payload).subscribe(
      (data: SaveCatlogueResponse) => {  
        output.next(new saveCatalogueLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new saveCatalogueLoadingErrorState(e));
        output.complete();

        me.logger.error('saveCatalogue Data loading failed', e);
      }
    );

    return output;
  }

/*This service is for OpenRelated*/ 
loadopenRelated(openRelatedPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new RelatedMetricsLoadingState());
    }, 0);
   
    const metaDatapath = environment.api.dashboard.metaData.endpoint;
    me.controller.post(metaDatapath, openRelatedPayload).subscribe(
      (data: RelatedMetricsTable) => {
        output.next(new RelatedMetricsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new RelatedMetricsLoadingErrorState(e));
        output.complete();

        me.logger.error('loadgraph Data loading failed', e);
      }
    );

    return output;
  }

     /**For subjectTags----------------*/
    public getOpenRelatedsubjectsTags() {
      return this.subjectsTags;
      }
      
      public setOpenRelatedsubjectsTags(subjectsTags) {
      this.subjectsTags = subjectsTags;
      }
}
