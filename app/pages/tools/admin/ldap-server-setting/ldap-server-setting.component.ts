import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from '../../../../shared/page-dialog/page-dialog.component';
import { LdapServerSetting } from './service/ldapserver.model';
import { LdapServerSettingService } from './service/ldapserver.service';
import { ldapServerSettingCreatedState, ldapServerSettingCreatingErrorState, ldapServerSettingCreatingState } from './service/ldapserver.state';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import { ConfirmationService, MessageService } from 'primeng';

@Component({
  selector: 'app-ldap-server-setting',
  templateUrl: './ldap-server-setting.component.html',
  styleUrls: ['./ldap-server-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LDAPServerSettingComponent extends PageDialogComponent implements OnInit {

  showLdapModel: boolean;
  ldapRequest: LdapServerSetting;
  error: boolean;
  empty: boolean;
  loading: boolean;
  selectedHostPort: string = '';
  selectedBaseDomain: string = '';
  selectedBindDomain: string = '';
  selectedPassword: string = '';
  enableSSl: boolean;
  LDAPS: string = "ldaps://";
  LDAP: string = "ldap://";
  disableFields: boolean;
  enableUserAuth: boolean;
  data: any;
  dialogVisible: boolean = false;
  selectedBindUser: string = '';

  constructor(private ldapService: LdapServerSettingService, private sessionService: SessionService, private messageService: MessageService, private ref: ChangeDetectorRef, public confirmation: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
  }

  openLdapServerSettingDialog() {
    const me = this;
    me.showLdapModel = true;
    me.getLDAP();
  }

  getLDAP() {
    const me = this;
    me.ldapService.getLDAPConfig().subscribe(
      (state: Store.State) => {
        if (state instanceof ldapServerSettingCreatingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof ldapServerSettingCreatedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ldapServerSettingCreatingErrorState) => {
        me.onLoadingError(state);
      }
      
    );
    this.disableFields = true;
  }

  private onLoading(state: ldapServerSettingCreatingState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  private onLoaded(state: ldapServerSettingCreatedState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
    me.data = state.data;
    me.selectedHostPort = me.data['hostName'];
    me.selectedBaseDomain = me.data['domainName'];
    me.selectedBindDomain = me.data['bindDomainName'];
    me.selectedPassword = me.data['bindPwd'];
    me.selectedBindUser = me.data['userId'];

    if (me.selectedBindUser)
      me.enableUserAuth = true;

    if (!me.selectedBindDomain && !me.selectedPassword)
      me.enableUserAuth = false;

    if (me.selectedHostPort && me.selectedHostPort.startsWith(this.LDAPS))
      me.enableSSl = true;

    let hostArr = me.selectedHostPort.split("//");
    me.selectedHostPort = hostArr[1];
  }

  private onLoadingError(state: ldapServerSettingCreatingErrorState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  updateLDAPData() {
    const me = this;
    let regexForIPAddressField = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
    let regexForNumberField = /^[0-9]*$/
    if (me.selectedHostPort == ''  ) {
      me.alertMsg("Please enter a valid IP address.", "Error");
      return false;
    }
    if (!regexForIPAddressField.test(me.selectedHostPort)) {
      me.alertMsg("Please enter a valid IP address.", "Error");
      return false;
  }

    if (me.selectedBaseDomain == '') {
      me.alertMsg("Please enter a valid base domain name.", "Error");
      return false;
    }
  //   if (!regexForNumberField.test(me.selectedBaseDomain)) {
  //     me.alertMsg("Please enter a valid base domain name.", "Error");
  //     return false;
  // }

    const session = me.sessionService.session;
    const cctx = {
      cck: session.cctx.cck,
      pk: session.cctx.pk,
      u: session.cctx.u,
      prodType: session.cctx.prodType
    };
    let sessionForKey = JSON.parse(localStorage.getItem('session'));
    let productKey = sessionForKey['cctx']['pk'];
    if (me.enableSSl) {
      if (!me.selectedHostPort.startsWith(me.LDAPS))
        me.selectedHostPort = "ldaps://" + me.selectedHostPort;
    }
    else {
      if (!me.selectedHostPort.startsWith(me.LDAP))
        me.selectedHostPort = "ldap://" + me.selectedHostPort;
    }
    const ldapRequestParams =
    {
      'lDAPHostName': me.selectedHostPort,
      'lDAPDomainName': me.selectedBaseDomain,
      'lDAPBindDName': me.selectedBindDomain,
      'lDAPBindPwd': me.selectedPassword,
      'lDAPBindUserId': me.selectedBindDomain,
      'productKey': productKey,
      'cctx': cctx
    }
    if (me.enableUserAuth) {
      if (!me.selectedBindDomain) {
        me.alertMsg("Please enter bind domain name.", "Error");
        return false;
      }
      else if (!me.selectedBindDomain) {
        me.alertMsg("Please enter user Id.", "Error");
        return false;
      }
      else if (!me.selectedBaseDomain) {
        me.alertMsg("Please enter a valid base domain name.", "Error");
        return false;
      }
    }
    else {
      me.selectedBindDomain = "";
      me.selectedBindDomain = "";
      me.selectedPassword = "";
      ldapRequestParams.lDAPBindDName = "";
      ldapRequestParams.lDAPBindPwd = "";
      ldapRequestParams.lDAPBindUserId = "";
    }

    me.ldapService.setGitConfig(ldapRequestParams, productKey).subscribe(
      (state: Store.State) => {
        if (state instanceof ldapServerSettingCreatingState) {
          me.onLDAPLoading(state);
          return;
        }
        if (state instanceof ldapServerSettingCreatedState) {
          me.onLDAPLoaded(state);
          return;
        }
      },
      (state: ldapServerSettingCreatingErrorState) => {
        me.onLDAPLoadingError(state);
        return;
      }
    );
    me.showLdapModel = false;
  }
  hostValidation() {
    try {
      let ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (this.selectedHostPort.match(ipformat)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      //this.log.error('Error in Host Validation.');
    }
  }
  private onLDAPLoading(state: ldapServerSettingCreatingState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  private onLDAPLoaded(state: ldapServerSettingCreatedState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
    me.data = state.data;
    me.showSuccess("Entry has been saved successfully.")
  }

  private onLDAPLoadingError(state: ldapServerSettingCreatingErrorState) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  close() {
    const me = this;
    me.showLdapModel = false;
  }

  showSuccess(msg) {
    const me = this;
    me.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  editData() {
    try {
      const me = this;
      me.disableFields = false;
    } catch (e) {
      //this.log.error('Error while editing the LDAP setting window ', e);
    }
  }
  alertMsg(msg, header) {
    const me = this;
    me.dialogVisible = true;
    me.confirmation.confirm({
      key: 'LDAP',
      message: msg,
      header: header,
      accept: () => { me.dialogVisible = false; },
      reject: () => { me.dialogVisible = false; },
      rejectVisible: false
    });
    me.ref.detectChanges();
  }
}
