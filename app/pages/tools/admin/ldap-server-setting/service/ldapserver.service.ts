import { Injectable } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { ldapServerSettingCreatedState, ldapServerSettingCreatingErrorState, ldapServerSettingCreatingState } from './ldapserver.state';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class LdapServerSettingService extends Store.AbstractService {

  constructor(private sessionService: SessionService) {
    super();
  }

  getLDAPConfig(): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    const session = me.sessionService.session;
    const productKey = session.cctx.pk;

    setTimeout(() => {
      output.next(new ldapServerSettingCreatingState());
    }, 0);

    let path = '/acl/session/ldapserver?productKey=' + productKey;
    const subscription = me.controller.get(path).subscribe(
      (data) => {
        output.next(new ldapServerSettingCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new ldapServerSettingCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }

  authorizeGitConfig(params): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new ldapServerSettingCreatingState());
    }, 0);

    let path = '/web/adminUI/SummaryWebService/getLDAPData';
    const subscription = me.controller.post(path, params).subscribe(
      (data) => {
        output.next(new ldapServerSettingCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new ldapServerSettingCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }

  setGitConfig(params: any, pk: string): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    const session = me.sessionService.session;

    setTimeout(() => {
      output.next(new ldapServerSettingCreatingState());
    }, 0);

    let path = '/acl/session/updateldapserver?productKey=' + pk;
    const subscription = me.controller.post(path, params).subscribe(
      (data) => {
        output.next(new ldapServerSettingCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new ldapServerSettingCreatingErrorState(error));
        output.complete();
      }
    );
    return output;
  }
}