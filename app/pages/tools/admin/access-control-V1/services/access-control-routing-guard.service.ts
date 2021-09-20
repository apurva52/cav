import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ModelWinDataInfo } from '../containers/model-win-data-info';
import {  MODEL_ACTION_OK, MODEL_ACTION_CANCEL } from '../constants/access-control-constants'
import { Subject } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;

}

@Injectable()
export class AccessControlRoutingGuardService implements CanDeactivate<CanComponentDeactivate> {


  /*Observable string sources.*/
  private modelService = new Subject<ModelWinDataInfo>();

  /*Observable string sources for model action.*/
  private modelActionService = new Subject<ModelWinDataInfo>();

  /*Service Observable for getting Progress Bar Toggle Action.*/
  modelActionProvider$ = this.modelActionService.asObservable();

  /*Service Observable for identifying model type Action.*/
  modelServiceProvider$ = this.modelService.asObservable();

  constructor() {
  }

  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }


  /** Show confirm Dialog */

  /**Method is used for handling model action. */
  handleModelAction(modelInfo: ModelWinDataInfo) {
    try {
      console.log('Handling model action.', modelInfo);
      this.modelActionService.next(modelInfo);
    } catch (e) {
      console.error('Error while handling model action.', e);
    }
  }
}
