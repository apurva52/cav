import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfigurationMenu, Theme } from './service/color-theme.model';
import { ThemeService } from './service/color-theme.service';
import { Store } from 'src/app/core/store/store';
import {
  ThemeLoadingState,
  ThemeLoadedState,
  ThemeLoadingErrorState,
} from './service/color-theme.state';
import { MenuItem } from 'primeng';
import { DownloadFileComponent } from '../../download-file/download-file.component';
import { GitConfigurationComponent } from 'src/app/pages/tools/admin/git-configuration/git-configuration.component';
// import { CONFIGURATION_TABLE } from './service/color-theme.dummy';
import { LDAPServerSettingComponent } from '../../../pages/tools/admin/ldap-server-setting/ldap-server-setting.component';
import { SecondLevelAuthorizationComponent } from '../../../pages/tools/admin/second-level-authorization/second-level-authorization.component';
import { DBMonitoringService } from 'src/app/pages/db-monitoring/services/db-monitoring.services';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-themes-menu',
  templateUrl: './themes-menu.component.html',
  styleUrls: ['./themes-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThemesMenuComponent implements OnInit {
  selected: Theme;
  data: Theme[];
  error: boolean;
  empty: boolean;
  loading: boolean;
  // items: ConfigurationMenu;
  options: MenuItem[];
  showDownloadModel: boolean = false;
  showGitconfigModel: boolean = false;
  showLdapModel: boolean = false;
  showSecondLevelAuthModel: boolean = false;
  dbServerSubscriber: Subscription;

  @ViewChild('downloadFile', { read: DownloadFileComponent })
  downloadFile: DownloadFileComponent;

  @ViewChild('gitConfig', { read: GitConfigurationComponent })
  gitConfig: GitConfigurationComponent;

  @ViewChild('ldapServerSetting', { read: LDAPServerSettingComponent })
  ldapServerSetting: LDAPServerSettingComponent;

  @ViewChild('secondLevelAuthorization', {
    read: SecondLevelAuthorizationComponent,
  })
  secondLevelAuthorization: SecondLevelAuthorizationComponent;

  constructor(private themeService: ThemeService,
    private dbMonService: DBMonitoringService,
    private sessionService: SessionService,
    private router : Router) { }

  ngOnInit(): void {
    const me = this;
    me.load();


    // me.items = CONFIGURATION_TABLE;

    me.options = [
      {
        label: 'Configuration',
        items: [
          {
            label: 'Topology',
            command: (event: any) => { this.loadTopologyJspUI() },
          },
          // {
          //   label: 'Batch Jobs',
          //   routerLink: '',
          // },
          {
            label: 'Tier Groups',
            routerLink: ['/nd-tier-group'],
          },
          {
            label: 'Agent Config',
            routerLink: ['/nd-agent-config'],
          },
          {
            label: 'Tier Assignment Rule',
            routerLink: ['/nd-tier-assignment'],
          },
          {
            label: 'Settings',
            items: [
              {
                label: 'Dashboard',
                routerLink: ['/configuration-settings'],
              },
              {
                label: 'Cluster',
                routerLink: ['/multi-node-configuration'],
              },
              //  {
              //         label: 'Graph Tree',
              //         items: [
              //           {
              //             label: 'Group At Beginning',
              //             routerLink: '',
              //           },
              //           {
              //             label: 'Group At End',
              //             routerLink: '',
              //           },
              //           {
              //             label: 'Group At N Level',
              //             routerLink: '',
              //           },
              //         ],
              //       },
            ],
          },
          {
            label: 'Color Management',
            routerLink: ['/color-management'],
          },
          {
            label: 'Manage Catalogue',
            routerLink: ['/catalouge-management'],
          },
          {
            label: 'Sessions',
            items: [
              {
                label: 'Overview',
                routerLink: ['/sessions-overview'],
              },
              {
                label: 'Variation',
                routerLink: ['/variation'],
              },
              {
                label: 'NV Agent Settings',
                routerLink: ['/ux-agent-setting'],
              },
              {
                label: 'Resource Setting',
                routerLink: '',
              },
              {
                label: 'System Setting',
                routerLink: ['/system-settings'],
              },
	      {
                label: 'Page-Baseline-Settings',
                routerLink: ['/page-baseline-settings'],
              },
              {
                label: 'Resource-Baseline-Settings',
                routerLink: ['/resource-baseline-settings'],
              },
              {
                label: 'Callback Designer',
                routerLink: ['/callback-designer'],
              },
              {
                label: 'NV Config',
                routerLink: ['/nv-config'],
              },
              {
                label: 'Admin Store Control',
                routerLink: '',
              },
              // {
              //   label: 'Feedback',
              //   routerLink: ['/feedback'],
              // },
              // {
              //   label: 'Page Filter',
              //   routerLink: ['/page-filter'],
              // },
              // {
              //   label: 'HTTPS Filter',
              //   routerLink: ['/http-filter'],

              // },
              //   {
              //     label: 'JS Error Filter',
              //     routerLink: ['/js-error-filter'],
              //  },
              {
                label: 'Session Event',
                routerLink: ['/session-event'],
              },
              // {
              //   label: 'Transaction Filter',
              //   routerLink: ['/transaction-filter'],
              // },
              // {
              //   label: 'App Crash Filter',
              //   routerLink: ['/app-crash-filter'],
              // }
            ],
          },
          {
            label: 'Query Settings',
            routerLink: ['/query-settings'],
          },
        ],
      },
      {
        label: 'Actions',
        items: [
          {
            label: 'Thread Dump',
            routerLink: ['/actions/dumps/thread-dump'],
          },
          {
            label: 'Heap Dump',
            routerLink: ['/actions/dumps/heap-dump'],
          },
          {
            label: 'Process Dump',
            routerLink: ['/actions/dumps/process-dump'],
          },
          {
            label: 'TCP Dump',
            routerLink: ['/actions/dumps/tcp-dump'],
          },
          {
            label: 'Mission Control',
            routerLink: ['/actions/mission-control', 'mission_control'],
          },
          {
            label: 'Java Flight Recording',
            routerLink: ['/actions/flight-recording', 'flight_recording'],
          },
          {
            label: 'GC Viewer',
            routerLink: ['/actions/gc-manager'],
          },
          // {
          //   label: 'Run Command',
          //   routerLink: ['/actions/ac-run-command/new-command'],
          // },
          {
            label: 'Run Command',
            routerLink: ['/run-command-V1'],
          },
          {
            label: 'Download/Upload File',
            command: (event: any) => {
              this.downloadFile.openDownloadFileDialog();
            },
          },
          {
            label: 'Cluster Monitor',
            routerLink: ['/cluster-monitor'],
          },
	  {
           label: 'Memory Profiling',
           routerLink: ['/actions/memory-profiler'],
          },
	  {
            label: 'Mutex Lock',
            routerLink: ['/actions/mutex-lock'],
          },
        ],
      },
      {
        label: 'Advanced',
        items: [
          /* {
             label: 'Current Sessions',
             routerLink: ['/current-sessions'],
           },
           {
             label: 'Design',
             items: [
               {
                 label: 'Scripts',
                 routerLink: '',
               },
               {
                 label: 'Download Script Manager',
                 routerLink: '',
               },
               {
                 label: 'Create Script',
                 routerLink: '',
               },
               {
                 label: 'Scenarios',
                 routerLink: ['/scenarios'],
               },
               {
                 label: 'Scenarios Profiles',
                 routerLink: '',
               },
               {
                 label: 'IP Management',
                 routerLink: ['/ip-management'],
               },
               {
                 label: 'Event Definition',
                 routerLink: ['/event-definition'],
               },
               {
                 label: 'Health Check Monitor',
                 routerLink: ['/health-check-monitor'],
               },
               {
                 label: 'Test Suite',
                 routerLink: ['/test-suite'],
               },
               {
                 label: 'Test Case',
                 routerLink: ['/test-case'],
               },
               {
                 label: 'Test Report',
                 routerLink: ['/test-report'],
               },
             ],
           },
           {
             label: 'Transactions',
             routerLink: ['/transactions'],
           },
           {
             label: 'Health',
             items: [
               {
                 label: 'Appliance Health',
                 routerLink: ['/application-health'],
               },
               {
                 label: 'Cavisson Services',
                 routerLink: ['/cavisson-services'],
               },
             ],
           },
           {
             label: 'System Logs',
             items: [
               {
                 label: 'Kubernetes',
                 routerLink: ['/kubernetes'],
               },
               {
                 label: 'RBU Access Logs',
                 routerLink: ['/rbu-access-logs'],
               },
               {
                 label: 'Peripheral Devices',
                 routerLink: ['/peripheral-devices'],
               },
               {
                 label: 'System Events',
                 routerLink: '',
               },
             ],
           },
           {
             label: 'Infrastructure View',
             routerLink: ['/infrastructure-view'],
           },
           {
             label: 'Postgress Stats',
             routerLink: ['/postgress-stats'],
           },*/
          {
            label: 'Account-Project Management',
            routerLink: ['/project-account-management'],
          },
          {
            label: 'Enterprise Home',
            routerLink: ['/enterprise-node'],
          },
          {
            label: 'End To End',
            routerLink: ['/exec-dashboard'],
          }, 
          {
            label: 'Net-cloud Server manegment',
            routerLink: ['/home/home-nsm'],
          },
        ],
      },
      {
        label: 'Admin',
        disabled:  this.getPermissionforFeature(this.sessionService.session.permissions,"AccessControl") != 7 ? true : false,
        items: [
          // {
          //   label: 'Projects & Servers',
          //   routerLink: ['/net-diagnostics-enterprise'],
          // },
          {
            label: 'LDAP Server Settings',
            command: (event: any) => {
              this.ldapServerSetting.openLdapServerSettingDialog();
            },
          },
          // {
          //   label: 'Module Tab Setting',
          //   items: [
          //     {
          //       label: 'Open in Application Tab',
          //       routerLink: '',
          //     },
          //     {
          //       label: 'Open in Browser Tab',
          //       routerLink: '',
          //     },
          //   ],
          // },
          // {
          //   label: 'Manage Controllers',
          //   routerLink: ['/manage-controller'],
          // },
          {
            label: 'GIT Configuration',
            command: (event: any) => {
              this.gitConfig.openGitConfigDialog();
            },
          },
          {
            label: 'Retention Policy',
            routerLink: ['/retention-policy-V1']
          },
          // {
          //   label: 'Retention Policy',
          //   routerLink: ['/retention-policy'],
          // },
          {
            label: 'Second Level Authentication',
            command: (event: any) => {
              this.secondLevelAuthorization.openSecondLevelAuthDialog();
            },
          },
          {
            label: 'Access Control',
           // routerLink: ['/access-control-V1'],
            command: (event: any) => {
              this.router.navigate(['/access-control-V1']);
            }
          },
          // {
          //   label: 'Access Control',
          //   routerLink: ['/access-control'],
          // },
          {
            label: 'Agent Info',
            routerLink: ['/nd-agent-info'],
          },
          // {
          //   label: 'NetHavoc',
          //   routerLink: ['/home/net-havoc']
          // },
          // {
          //   label: 'Sample Apps',
          //   routerLink: '',
          // },
        ],
      },
    ];

    let accessControlObj = this.findLabelInJSON("Access Control" , me.options);
    if(accessControlObj && this.sessionService.session.permissions) {
      let permission = this.getPermissionforFeature(this.sessionService.session.permissions,"AccessControl");
      if(permission != 7) {
        accessControlObj['disabled'] = true;
        accessControlObj.title = 'Disabled due to no permission granted.';
      }
    }


    me.initDbMonitoring();
  }

  showDownloadModelDetails() {
    this.showDownloadModel = true;
  }

  showLdapModelDetails() {
    this.showLdapModel = true;
  }

  showSecondLevelAuthModelDetails() {
    this.showSecondLevelAuthModel = true;
  }

  showgitConfigModelDetails() {
    this.showGitconfigModel = true;
  }

  changeTheme(theme: Theme) {
    this.selected = theme;
  }

  load() {
    const me = this;

    me.themeService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof ThemeLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof ThemeLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ThemeLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: ThemeLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: ThemeLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: ThemeLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data.length;
    me.error = false;
    me.loading = false;
  }

  changeTheme1(theme, prevTheme) {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove(prevTheme);   //remove the class
    body.classList.add(theme);
  }

  /* FOr DB Monitoring pre-requistis */
  initDbMonitoring() {
    const me = this;
    if (me.dbMonService.$dbMonitorUIJson == undefined || me.dbMonService.$dbMonitorUIJson.length < 1) {
      me.dbMonService.loadUI();
    }
    me.dbServerSubscriber = me.dbMonService.dbListAvailableObservable$.subscribe(
      result => {
        if (result != undefined) {
          if (me.dbMonService.getSqlDbServerList() == undefined || me.dbMonService.getSqlDbServerList()['ErrorCode'] != undefined || me.dbMonService.getSqlDbServerList().dbSourceList.length < 1) {
            // me.options.push({
            //   label: 'DB Monitoring',
            // });

            let msg = {
              severity: 'error',
              summary: 'DB Monitoring not configured.'
            };
          } else {
            // me.data.charts[4].pagelink = '/db-monitoring';
            me.options.push({
              label: 'DB Monitoring',
              routerLink: ['/db-monitoring']
            });
          }
        }
      });
    if (me.dbMonService.getSqlDbServerList() == undefined || me.dbMonService.getSqlDbServerList().dbSourceList.length < 1) {
      me.dbMonService.getDbServerList();
    } else {
      me.options.push({
        label: 'DB Monitoring',
        routerLink: ['/db-monitoring']
      });
    }
  }
  ngOnDestroy(): void {
    const me = this;
    if (me.dbServerSubscriber)
      me.dbServerSubscriber.unsubscribe();
  }

  productName: string
  loadTopologyJspUI() {
    this.productName = this.sessionService.session.cctx.prodType;
    if (this.productName == 'NetDiagnostics')
      this.productName = 'netdiagnostics';

    let url = window.location.protocol + '//' + window.location.host + '/' + this.productName
      + "/analyze/productUIRedirect.jsp?strOprName=Topology&sesLoginName="
      + this.sessionService.session.cctx.u + "&productType=" + this.productName
      + "&productKey=" + this.sessionService.session.cctx.pk + "&sesRole=" + "admin";
    window.open(url);
  }

  /*This method is used for get the permission on the basis of Feature*/
  getPermissionforFeature(featurePermissionList, featureName: string) {
    if (featurePermissionList == undefined || Object.keys(featurePermissionList).length == 0) {
      return 4;
    }

    const keysArr = Object.keys(featurePermissionList);

    for (let i = 0; i < keysArr.length; i++) {

      const perModuleObj = featurePermissionList[keysArr[i]].permissions;
      if(!perModuleObj) {
        return 4;
      }
      const index = perModuleObj.map(function (e) { return e.feature; }).indexOf(featureName);
      if (index > -1) {
        if (perModuleObj[index].permission != undefined) {
          return perModuleObj[index].permission;
        }
      }
    }
    return 4;
  }

  findLabelInJSON(label, json) {
    try {

      if (label == json.label) {
        return json;
      }
      else if (Object.prototype.toString.call(json) === '[object Array]') {

        for (var i = 0; i < json.length; i++) {
          var obj = json[i];
          var output = this.findLabelInJSON(label, obj);
          if (output) {
            return output;
          }

       };

     } else if (json.items) {

      for (var i = 0; i < json.items.length; i++) {
        var obj = json.items[i];
        var output = this.findLabelInJSON(label, obj);
        if (output) {
          return output;
        }
     };
    } else {
      return undefined;
    }

    } catch (e) {

    }
  }
}
