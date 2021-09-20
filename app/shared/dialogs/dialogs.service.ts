import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INFO_DIALOG } from '../actions.constants';
import { DialogActionInfo, InfoData } from './informative-dialog/service/info.model';

@Injectable({
  providedIn: 'root',
})

export class DialogsService {

  /*Observable string sources.*/
  private modelService = new Subject<DialogActionInfo>();

  /*Service Observable for identifying model type Action.*/
  modelServiceProvider$ = this.modelService.asObservable();

  showInformativeBox(title?: string, information?: string, button?: string) {
    const me = this;
    const actionInfo = new DialogActionInfo();
    actionInfo.action = INFO_DIALOG;
    actionInfo.data = { title: title, information: information, button: button };
    this.modelService.next(actionInfo);
  }

}
