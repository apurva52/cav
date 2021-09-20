import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { ConfigSettingLoadedState, SetConfigSettingLoadedState } from './configuration-settings.state';
import { ActionInfo } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';

@Injectable({
    providedIn: 'root',
  })
  export class ConfigurationSettingService extends Store.AbstractService{

    public _configSettings = new Subject<ActionInfo>();
  _configSettingsProviders$ = this._configSettings.asObservable();
    thresholdForScaling: number = 10;
      constructor(private sessionService: SessionService){  super();}

      load(){
        const me = this;
        const output = new Subject<Store.State>();

        const path = environment.api.configSettings.load.endpoint;

        const payload = {
            "tr" : me.sessionService.session.testRun.id,
            "cctx": me.sessionService.session.cctx
        }

        me.controller.post(path, payload).subscribe(
            (data) => {
             output.next(new ConfigSettingLoadedState(data))
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

      saveConfigSetting(payload){
        const me = this;
        const output = new Subject<Store.State>();

        const path = environment.api.setConfigSettings.load.endpoint+ "?cck=" + me.sessionService.session.cctx.cck;

        me.controller.post(path, payload).subscribe(
            (data) => {
                output.next(new SetConfigSettingLoadedState(data))
                output.complete();
            },
            (e: any) => {
              output.error(e);
              output.complete();
        
              me.logger.error('Error in saving Dashboard Configuration settings', e);
            }
        )
        return output;
      }
  }

