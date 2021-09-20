import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { ChangePasswordLoadedState, ChangePasswordLoadingErrorState, ChangePasswordLoadingState, MailSMSSettingLoadedState, MailSMSSettingLoadingErrorState } from './settings.state';
import { MailSMSConfig, MailSMSConfigRequest, MailSMSConfigResponse } from './settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  load(reqPayload): Observable<Store.State> {

    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ChangePasswordLoadingState());
    }, 0);


    setTimeout(() => {
      output.next(new ChangePasswordLoadedState());
      output.complete();
    }, 2000);

    setTimeout(() => {
      output.error(new ChangePasswordLoadingErrorState(new Error()));
    }, 2000);


    let path = environment.api.session.changePassword.endpoint;
    const payload = {

        cctx: me.sessionService.session.cctx,
        credential: {
          oldPassword: reqPayload.oldPassword,
          newPassword: reqPayload.newPassword,

        },
    };

    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
              output.next(new ChangePasswordLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new ChangePasswordLoadingErrorState(error));
            output.complete();
          }
        );

    return output;
  }

  saveMailSMSSetting(data: MailSMSConfig)
  {
    const me = this;
    const output = new Subject<Store.State>();
    let path = environment.api.alert.mailSmsConfig.update.endpoint;

    const payload: any = {
        cctx: me.sessionService.session.cctx,
        config: data
    };

    const subscription = me.controller.post(path, payload).subscribe(
      (data: MailSMSConfigResponse) => {
              output.next(new MailSMSSettingLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new MailSMSSettingLoadingErrorState(error));
            output.complete();
          }
        );

    return output;
  }

  getMailSMSSetting()
  {
    const me = this;
    const output = new Subject<Store.State>();
    let path = environment.api.alert.mailSmsConfig.all.endpoint;

    const payload: any = {
        cctx: me.sessionService.session.cctx,
    };

    const subscription = me.controller.post(path, payload).subscribe(
      (data: MailSMSConfigResponse) => {
              output.next(new MailSMSSettingLoadedState(data));
              output.complete();
          },
          (error: AppError) => {
            output.error(new MailSMSSettingLoadingErrorState(error));
            output.complete();
          }
        );

    return output;
  }
}
