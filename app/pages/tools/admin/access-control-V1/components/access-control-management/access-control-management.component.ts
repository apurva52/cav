import { Component, OnInit } from '@angular/core';
import { AccesControlDataService } from '../../services/acces-control-data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CAPABILITY_MANAGEMENT, GROUP_MANAGEMENT, MODEL_ACTION_CANCEL, USER_MANAGEMENT } from '../../constants/access-control-constants'
import { AccessControlConfigDataServiceService } from '../../services/access-control-config-data-service.service';
import { AccessControlRestDataApiService } from '../../services/access-control-rest-data-api.service';
import { GET_ALL_LDAP_GROUP, REFRESH_CACHE } from '../../constants/rest-api-constant';
import { ConfirmationService, MenuItem } from 'primeng';
import { MessageService } from 'primeng';
@Component({
  selector: 'app-access-control-management',
  templateUrl: './access-control-management.component.html',
  styleUrls: ['./access-control-management.component.css']
})
export class AccessControlManagementComponent implements OnInit {
  accessControlManagement = { 'title': 'User Management' }
  accessControlTabs = [{ 'title': 'User', 'index': 0, icon: 'pi pi-user' },
  { 'title': 'Group', 'index': 1, icon: 'pi pi-users' },
  { 'title': 'Capabilities', 'index': 2, icon: 'icons8 icons8-user-shield-2' }
  ];
  widowheight = (window.innerHeight - 138) + "px";
  /*Data Subscriber of service.*/
  dataSubscription: Subscription;
  datamodelsubscription: Subscription;
  tabIndex = 0
  previousIndex = 0;
  value = true;
  errorMessage = []
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  blocked: boolean = false;
  rejectVisible: boolean = true;
  acceptLable: string = 'Ok';
  isTabClicked: boolean = false;
  constructor(private _dataService: AccesControlDataService,
    private _router: Router,
    private _config: AccessControlConfigDataServiceService,
    private _restAPI: AccessControlRestDataApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    if (window.location.href.includes("/access-control-V1/user")) {
      this.tabIndex = 0;
      this.accessControlManagement.title = "User Management";

    }
    else if (window.location.href.includes("/access-control-V1/group")) {
      this.tabIndex = 1;
      this.accessControlManagement.title = "Group Management";

    }
    else if (window.location.href.includes("/access-control-V1/capabilities")) {
      this.tabIndex = 2;
      this.accessControlManagement.title = "Capabilities";
    }
  }

  ngOnInit() {
    try {
      this.breadcrumb = [
        // { label: 'Home' },
        // { label: 'Admin' },
        // { label: 'Access Control List' },
      ]
    } catch (e) {
      console.error("error in ngOnInit-- ", e);
    }

  }
  setToolBarHeader(event) {
    this.onTabChange(event);
  }

  /** Method to import all ldap groups. */
  importLdapGroups() {
    try {
      let url = this._config.getURLWithBasicParamByRESTAPI(GET_ALL_LDAP_GROUP);
      this._restAPI.getDataByRESTAPI(url, "").subscribe(
        result => {
          if (result) {
            if (result['statusCode'] && result['statusCode'] == '102') {
              alert('LDAP Configuration is not enabled.');
              return;
            }
          }
          this._dataService.loadLdapGroupData(result['data']);
        });

    } catch (e) {
      console.error("error in importing ldap group - ", e);
    }
  }

  refreshDataBase() {
    this.blocked = true;
    this.refreshDatabase(this.accessControlManagement.title);
  }


  ngOnDestroy() {
  }

  refreshDatabase(entity) {
    let url = this._config.getURLWithBasicParamByRESTAPI(REFRESH_CACHE);
    let dataSubscription = this._restAPI.getDataByRESTAPI(url, "").subscribe(result => {

      if (result && result.status && result.status == "success") {
        if (entity === USER_MANAGEMENT) {
          this._dataService.loadSaveDataForUserComponent();
          this.blocked = false;
        } else if (entity == GROUP_MANAGEMENT) {
          this._dataService.loadSaveDataForGroupComp();
          this.blocked = false;
        } else if (entity == CAPABILITY_MANAGEMENT) {
          this._dataService.fetchCapabiltyDatafromService();
          this.blocked = false;
        }
      } else {
        this.showError("Error in refreshing cache");
      }
    })
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  onTabChange(event) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = 'Ok';
    if(this.tabIndex == event)
      return;
    me.confirmationService.confirm({
      message: 'Are you sure you want to navigate away from this tab ?',
      header: 'Warning',
      icon: 'pi pi-info-circle',
      accept: () => {
        
        let index = event
        if (index === 0) {
          this.isTabClicked = true;
          this.previousIndex = this.tabIndex;
          this.tabIndex = 0;
          this.accessControlManagement.title = 'User Management';
          this._router.navigate(['/access-control-V1/user']);
          this.isTabClicked = false;
        } else if (index === 1) {
          this.isTabClicked = true;
          this.previousIndex = this.tabIndex;
          this.tabIndex = 1
          this.accessControlManagement.title = 'Group Management';
          this._router.navigate(['/access-control-V1/group']);
          this.isTabClicked = false;
        } else if (index === 2) {
          this.isTabClicked = true;
          this.previousIndex = this.tabIndex;
          this.tabIndex = 2;
          this.accessControlManagement.title = 'Capabilities';
          this._router.navigate(['/access-control-V1/capabilities']);
          this.isTabClicked = false;
        }

      },
      reject: () => { },
    });
  }
}
