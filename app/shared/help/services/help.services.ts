import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HelpContentLoadedState } from './help.state';

@Injectable({
    providedIn: 'root',
    })
export class HelpService extends Store.AbstractService{
getHelpContent(payload){
    const me = this;
  const output = new Subject<Store.State>();
  
  const path = environment.api.help.load.endpoint;
  
  
  
  me.controller.post(path, payload).subscribe(
  (data) => {
  output.next(new HelpContentLoadedState(data))
  output.complete();
  },
  (e: any) => {
  output.error(e);
  output.complete();
  
  me.logger.error('Dashboard Setting loading failed', e);
  }
  )
  
  return output;
  
  }
  
  
} 
  