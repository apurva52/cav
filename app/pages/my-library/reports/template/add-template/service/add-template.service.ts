import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { SaveTemplateLoadedState, SaveTemplateLoadingErrorState, SaveTemplateLoadingState } from './add-template.state';
@Injectable({
  providedIn: 'root'
})
export class AddTemplateService extends Store.AbstractService {
  templateName:any;
  saveTemplateData(payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new SaveTemplateLoadingState());
    }, 0);
    const path = environment.api.report.saveTemplate.endpoint;
    const base = environment.api.core.defaultBase;
    console.log("Path----------",path);
    console.log("base----------",base);
    me.controller.post(path, payload).subscribe(
      (data: any) => {
        console.log("GroupData------------",data);
        output.next(new SaveTemplateLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new SaveTemplateLoadingErrorState(e));
        output.complete();
  
        me.logger.error('Rule Data loading failed', e);
      }
    );
    return output;
  }
}

