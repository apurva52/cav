import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem, TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { AwsConfigTable, AwsConfigHeaderCols } from './service/add-monitor.model';
import * as _ from "lodash";
import * as LONG_ARG from './constants/longArguments-constants';
import * as CUST_CONST from './constants/custom-monitor-constants';
import { CmdData } from './containers/cmd-data';
import { DbData } from './containers/db-data';
import { JmxData } from './containers/jmx-data';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import * as COMPONENT from '../add-monitor/constants/monitor-configuration-constants';
import { UtilityService } from '../../service/utility.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AddMonValidationService } from './service/add-mon-validation.service';
import { Location } from '@angular/common';
import { PatternVal } from './containers/adv-settings-data';


@Component({
  selector: 'app-add-monitor',
  templateUrl: './add-monitor.component.html',
  styleUrls: ['./add-monitor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService],
})
export class AddMonitorComponent implements OnInit {

  formData: any[] = [];
  cmdData: CmdData;
  dbData: DbData;
  jmxData: JmxData;
  selectedRadioOption: any;
  configData: AwsConfigTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  isCMD: boolean = false;
  isJMX: boolean = false;
  isDB: boolean = false;
  customCmdMon: any = [];
  customDbMon: any = [];
  customJmxMon: any = [];
  count: number = 0;
  cols: AwsConfigHeaderCols[] = [];
  _selectedColumns: AwsConfigHeaderCols[] = [];
  globalFilterFields: string[] = [];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  files: TreeNode[];
  tierList: any[] = [];
  tierHeadersList: any[];
  serverOptionList: any[];
  serverList: any[] = [];
  selectedServers: string[] = [];
  serverFilter: any[] = [{}];
  rejectVisible: boolean = true;
  acceptLable: string = "Yes";
  deploymentOption: any = {};
  options: any = {}
  monParams: any = {};
  specificMonMap = new Map(); // used to keep map for monName vs options and enable ???? can be send from server side for optimization.
  customMonCols: any[];
  isUseGlobal: boolean = false;
  remoteServerName: string = " ";
  rTFlag: boolean = false; // flag used at cmd deployment for showing remote tier dropdown
  rSFlag: boolean = false; //flag used at cmd deployment for showing remote server dropdown
  oTypeForCmd: string = ""; // output type used in cmd deployment UI.
  dialogHeader: string = ''; //for search pattern dialog 
  showSrchDialog: boolean = false;
  selectedSrchPattern: any[];
  gMonId: string = "-1";
  operation: string = "add";  //check if it add/update mode
  tableCols: any[];
  confTableData: any = [];
  AddEditLabel: string = "Add";    //label for Add/Update Button
  customDepOption: any = {};
  exServerList: any[] = [];   //exclude serverList
  exTierList: any[];    //exclude tierList
  techName: string = "";   //technology Name
  anyTierList: any[];   //for tierName tag
  agentList: SelectItem[]; //added for dropdown list for agent Type tag
  techDisplayName: string = ""; // Technology Display Name
  otherFormData: any[] = [];
  otherSTDMon = new Map();
  isOtherMon: boolean = false;
  custFormData: any[] = [];
  custSTDMon = new Map();
  monCategory: any = []; // categorisation for monitor name
  validateJmxProp: boolean = false; // for sending info for enabling required property in jmx mon data.
  objectId: string = "-1";  // Object ID
  validationObj: any = {};
  monGrpMap = [];
  display: boolean;
  monName: string;
  gdfDetail: any = {}
  selectedMonConf: any[];
  reConfId: string
  monGrpStateArr: any = []; // used to store an array for configured monitor groups for bug 110733
  jmxSp: PatternVal
  index:number = 0;

  constructor(
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private monitorupdownService: MonitorupdownstatusService,
    public router: Router, private route: ActivatedRoute, private _location: Location,
    private messageService: MessageService, private validationServiceObj: AddMonValidationService
  ) { }

  ngOnInit(): void {
    const me = this;
    me.reConfId = me.monitorupdownService.gMonId
    this.route.params.subscribe((params: Params) => {
      this.techName = params['techName'];
      this.techDisplayName = decodeURIComponent(params['techDisplayName']);
    });

    me.monitorupdownService.getTierList().subscribe(res => {
      let id = [];
      let tName = [];
      let tierNameList = [];
      let anytierNameList = [];

      res.map(each => {
        id.push(each['id']);
        tName.push(each['tName']);
      })
      me.tierHeadersList = UtilityService.createListWithKeyValue(tName, id);
      me.tierList = UtilityService.createListWithKeyValue(tName, id);

      me.tierHeadersList.map(function (each) {
        if (each.value !== -1) {
          tierNameList.push(each.label)
        }
        if (each.value > -1) // for skipping tierGroups and All tiers
          anytierNameList.push(each.label)
      })
      me.tierList = UtilityService.createDropdown(tierNameList);
      let data = {};
      data["label"] = "All Tiers";
      data["value"] = "ALLtier";
      if(this.techName != 'Log Metric Monitor')
        this.tierList.unshift(data);
        
      me.anyTierList = UtilityService.createDropdown(anytierNameList);
    })

    this.loading = true;
    //Changes for bug 110942 and 110943
    if (me.monitorupdownService.gMonId == "-1") {
      me.monitorupdownService.getMonitorConfiguration(this.techName).subscribe(res => {
        // me.getDrivenJsonDataNew(res['cmpInfo']);  // CHANGED FOR OPTIMIZATION 
        me.renderUI(res['cmpInfo']);
        me.cd.detectChanges();

      })
    }


    me.monitorupdownService.getConfigInfo(this.techName).subscribe(response => {
      // me.loading = false;
      me.confTableData = response;
      me.cd.detectChanges();
    });

    if (me.monitorupdownService.gMonId !== "-1") {
      let rowData = {
        gMonId: me.monitorupdownService.gMonId,
        _id: "-1"
      }
      me.onRowEditInit(rowData);
    }

    this.agentList = [
      { label: 'All', value: 'ALL' },
      { label: 'BCI', value: 'BCI' },
      { label: 'CMON', value: 'CMON' }
    ];

    me.cmdData = new CmdData();
    me.dbData = new DbData();
    me.jmxData = new JmxData();

    me.customMonCols = [
      { field: "pattern", header: 'Key' },
      { field: "upVal", header: 'Value' },
    ]

    me.tableCols = [
      { field: "gMonId", header: 'gMonId' },
      { field: "monInfo", header: 'Monitor Options' },
      { field: COMPONENT.TIER_INFO, header: 'Tier Information' },
      { field: "_id", header: '_id' }
    ]
    // me.serverOptionList = UtilityService.createListWithKeyValue(COMPONENT.SERVER_OPTION_LIST_LABEL, COMPONENT.SERVER_OPTION_LIST_VALUE)
    me.serverOptionList = [
      {
        value: -1,
        label: 'All'
      },
      {
        value: -2,
        label: 'Any'
      },
      {
        value: 'specified',
        label: 'Specified Server'
      },
    ];
    //Changes for bug 110942 and 110943
    if (me.monitorupdownService.gMonId == "-1") {
      me.serverFilter = [{
        id: 0,
        tier: "",
        actualServer: "",
        server: [],
        exServer: [],
        exTier: [],
        serverList: []
      }];
    }
  }

  public addDisableValidation(node) {
    let me = this;
    node.items.forEach((value, key) => {
      if (value[COMPONENT.DEPENDENT_COMP]) {
        if (node.value === value.value) {
          value[COMPONENT.DEPENDENT_COMP].forEach((v, k) => {
            if (v.validationObj) {
              v.validationObj.disabled = false;
              if (v[COMPONENT.DEPENDENT_COMP]) {
                me.addDepCompValidation(v[COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
              }

              if (v[COMPONENT.DROP_DOWN_LIST_ITEMS]) {
                for (let i = 0; i < v[COMPONENT.DROP_DOWN_LIST_ITEMS].length; i++) {
                  if (v[COMPONENT.DROP_DOWN_LIST_ITEMS][i][COMPONENT.DEPENDENT_COMP] != null)
                    me.addDepCompValidation(v[COMPONENT.DROP_DOWN_LIST_ITEMS][i][COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
                }

              }
            }
          })
        } else {
          value[COMPONENT.DEPENDENT_COMP].forEach((v, k) => {
            if (v.validationObj) {
              v.validationObj.disabled = true;
              if (v[COMPONENT.DEPENDENT_COMP]) {
                me.addDepCompValidation(v[COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
              }

              if (v[COMPONENT.DROP_DOWN_LIST_ITEMS]) {
                for (let i = 0; i < v[COMPONENT.DROP_DOWN_LIST_ITEMS].length; i++) {
                  if (v[COMPONENT.DROP_DOWN_LIST_ITEMS][i][COMPONENT.DEPENDENT_COMP] != null)
                    me.addDepCompValidation(v[COMPONENT.DROP_DOWN_LIST_ITEMS][i][COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
                }
              }
            }
          })
        }
      }
    });
  }

  //adding disble validation for dependent components 
  addDepCompValidation(compData, isDisabled) {
    let me = this;
    compData.forEach((v, k) => {
      if (v.validationObj) {
        v.validationObj.disabled = isDisabled;
        if (v[COMPONENT.DEPENDENT_COMP]) {
          me.addDepCompValidation(v[COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
        }
      }
    })
  }

  @Input() get selectedColumns(): AwsConfigHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: AwsConfigHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  public showChild(node) {
    if (node[COMPONENT.DEPENDENT_COMP] && node[COMPONENT.DEPENDENT_COMP].length > 0) {
      return true;
    }
    return false
  }

  onRowEditInit(rowData: any) {
    let me = this;
    me.AddEditLabel = "Update";
    me.gMonId = rowData.gMonId;
    me.objectId = rowData._id;
    me.operation = "update";
    me.formData = [];
    me.customCmdMon = [];
    me.customDbMon = [];
    me.customJmxMon = [];
    me.serverFilter = [];
    me.monCategory = [];
    me.specificMonMap = new Map();
    //it has been commented for the bug 109514
    // if (me.tierHeadersList) {
    //   me.exTierList = me.tierHeadersList.filter(val => {
    //     return val.value != -1
    //   })
    // }
    me.loading = true;
    me.monitorupdownService.getMonitorConfigurationAtEdit(me.techName, rowData.gMonId, rowData._id).subscribe(res => {
      me.loading = false;
      me.renderUI(res['cmpInfo']);
      me.isUseGlobal = res.useGlobal;
      let count = 0;
      res.tierInfo.map(each => {
        let tierServerObj = {};
        let servers = [];
        let exTier = [];
        let exServer = []
        tierServerObj['tier'] = each['tier'];
        tierServerObj['id'] = count;
        if (each['exTier']) {
          if (each['exTier'].includes(","))
            exTier = each['exTier'].split(",");
          else
            exTier.push(each['exTier'])
        }
        if (each['server'] == "All") {
          tierServerObj['actualServer'] = -1;
          if (each['exServer']) {
            //changes has been done for the bug id:-109471
            if (each['exServer'].includes(",")) {
              exServer = each['exServer'].split(",");
            }
            else {
              exServer.push(each['exServer'])
            }
          }
        }
        else if (each['server'] == "Any") {
          tierServerObj['actualServer'] = -2;
        }
        else {
          tierServerObj['actualServer'] = "specified";
          if (each['server'].includes(","))
            servers = each['server'].split(",");
          else
            servers.push(each['server']);
        }
        tierServerObj['exServer'] = exServer//for bug 109471
        tierServerObj['server'] = servers;
        tierServerObj['exTier'] = exTier;
        this.getServerListAtEdit(tierServerObj)
        this.onServerChange(tierServerObj)
        me.serverFilter.push(tierServerObj);
        count = count + 1;
      })
      me.cd.detectChanges();
      me.exTierList = me.tierList.filter(val => {
        return val.value != "ALLtier"
      })
    })
  }

  removeRowDataConfirmation(rowData) {
    const me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    me.confirmationService.confirm({
      message: 'Do you want to delete this monitor configuration?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.loading = true;
        me.confTableData = me.confTableData.filter(each => {
          return each.gMonId != rowData.gMonId;
        })

        me.monitorupdownService.removeConfigurationInfo(rowData.gMonId, rowData._id, me.techName).subscribe(res => {
          if (res[COMPONENT.RESPONSE_STATUS]) {
            me.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res[COMPONENT.RESPONSE_MSG] });
            me.loading = false;
            me.clearFormFields();
            me.cd.detectChanges();


          }
        })
      },
      reject: () => { },
    });
  }

  // Method called at Add click
  addData() {
    if (!this.isMonConfigurationValid(this.formData)) { return false; }

    if (!this.validateBlankTextField(this.formData)) { return false }

    if (!this.validateTableDropdownComp(this.formData)) { return false; } // for bug 108850
  
    if(!this.validateJmxSearchPattern(this.jmxData)) { return false; } // for bug 112656

    if (!this.allMonEnable()) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Enable atleast one monitor.' });
      return false;
    }

    if (!this.checkDuplicateAppExcludeAppName()) { return false; } // bug - 109517

    // used for adding custom monitors data options
    if (this.customCmdMon.length > 0)
      this.addCustomMonitorData(this.customCmdMon);

    if (this.customDbMon.length > 0)
      this.addCustomMonitorData(this.customDbMon);

    if (this.customJmxMon.length > 0)
      this.addCustomMonitorData(this.customJmxMon);

    if (this.isUseGlobal) {
      this.rejectVisible = true;
      this.acceptLable = "Yes";
      this.confirmationService.confirm({
        message: 'As Use Global Configuration checbox is selected, these changes will be applied to all the monitors using Global configuration. Do you want to continue?',
        header: 'Use Global Configuration Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sendRequestToServer();
        },
        reject: () => { },
      });
    }
    else {
      this.sendRequestToServer();
    }
  }

  //Method to create specific monitor options and deployment options
  createComponentData(CompData: any) {
    let me = this;
    let dep = [];
    if (CompData[COMPONENT.TYPE] === COMPONENT.TEXTFIELD_TYPE || CompData[COMPONENT.TYPE] === COMPONENT.SPINNER_TYPE)
      return me.createTextFieldOptions(CompData)

    if (CompData[COMPONENT.TYPE] === COMPONENT.RADIOBUTTONGROUP_TYPE)
      return me.createRadioButtonOptions(CompData)

    if (CompData[COMPONENT.TYPE] === COMPONENT.ACCORDIAN_TYPE) {
      dep = me.createAccordianOptions(CompData);
      me.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.CHECKBOX_TYPE) {
      dep = me.createCheckBoxOptions(CompData)
      me.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.DROPDOWN_TYPE) {
      dep = me.createDropdownOptions(CompData);
      if (dep[0][COMPONENT.OPTIONS_KEY])
        me.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TABLE_TYPE) {
      dep = me.createTableOptions(CompData);
      me.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TABLESINGLEARG_TYPE) {
      dep = me.createTableSingleArgOptions(CompData);
      me.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.FIELDSETLABEL_TYPE) {
      dep = me.createFieldSetOptions(CompData);
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.AGENT_TYPE || CompData[COMPONENT.TYPE] === COMPONENT.APPNAME ||
      CompData[COMPONENT.TYPE] === COMPONENT.EXCLUDE_APP || CompData[COMPONENT.TYPE] === COMPONENT.JAVAHOME ||
      CompData[COMPONENT.TYPE] === COMPONENT.CLASSPATH || CompData[COMPONENT.TYPE] === COMPONENT.INSTANCE) {
      let key = me.setAppCPJHInstance(CompData[COMPONENT.TYPE], CompData[COMPONENT.MON_GROUP])
      me.createMonParameters(key, CompData[COMPONENT.VALUE])
      me.createDeployementOptions(key, CompData[COMPONENT.USE_AS_OPTION])
    }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.AGENT_TYPE) {
    //   me.monParams[COMPONENT.AGENT_TYPE] = CompData[COMPONENT.VALUE];
    //   me.deploymentOption[COMPONENT.AGENT_TYPE] = "${" + [COMPONENT.AGENT_TYPE] + "}";
    // }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TIER_TYPE) {
      let str = '';
      CompData[COMPONENT.VALUE_OBJ].map(each => {
        str = str + each + COMPONENT.COMMA_SEPARATOR;
      })
      str = str.substring(1, str.length - 1);
      me.monParams[COMPONENT.TIER_TYPE] = str;
    }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.INSTANCE) {
    //   me.monParams[COMPONENT.INSTANCE] = CompData[COMPONENT.VALUE];
    //   if (CompData[COMPONENT.USE_AS_OPTION] != "")
    //   {
    //     me.deploymentOption[COMPONENT.INSTANCE] = CompData[COMPONENT.USE_AS_OPTION] + " ${" + COMPONENT.INSTANCE + "}";
    //   }
    //   else
    //   {
    //     me.deploymentOption[COMPONENT.INSTANCE] = "${" + COMPONENT.INSTANCE + "}";
    //   }
    // }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.APPNAME) {
    //   me.monParams[COMPONENT.APPNAME] = CompData[COMPONENT.VALUE];
    //   me.deploymentOption[COMPONENT.APPNAME] = "${" + COMPONENT.APPNAME + "}";
    // }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.EXCLUDE_APP) {
    //   me.monParams[COMPONENT.EXCLUDE_APP] = CompData[COMPONENT.VALUE];
    //   me.deploymentOption[COMPONENT.EXCLUDE_APP] = "${" + COMPONENT.EXCLUDE_APP + "}";
    // }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.JAVAHOME) {
    //   me.monParams[COMPONENT.JAVAHOME] = CompData[COMPONENT.VALUE];
    //   me.deploymentOption[COMPONENT.JAVAHOME] = "${" + COMPONENT.JAVAHOME + "}";
    // }

    // CAN BE CHANGED.......
    // if (CompData[COMPONENT.TYPE] === COMPONENT.CLASSPATH) {
    //   me.monParams[COMPONENT.CLASSPATH] = CompData[COMPONENT.VALUE];
    //   me.deploymentOption[COMPONENT.CLASSPATH] = "${" + COMPONENT.CLASSPATH + "}";
    // }

    if (CompData[COMPONENT.TYPE] === COMPONENT.ISPROCESS) {
      me.monParams[COMPONENT.RUN_AS_PROCESS] = CompData[COMPONENT.VALUE];
      me.deploymentOption[COMPONENT.ISPROCESS] = "${" + COMPONENT.RUN_AS_PROCESS + "}";
    }

    // for handeling blank type tags
    if (CompData[COMPONENT.TYPE] == "") {
      if (CompData[COMPONENT.ARGS])
        me.deploymentOption[CompData[COMPONENT.ARGS]] = CompData[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + CompData[COMPONENT.VALUE];
      else
        me.deploymentOption[COMPONENT.IS_ENCRYPTED] = CompData[COMPONENT.VALUE];
    }
  }

  // Method called when iterating per component
  getMonData(arr: any, key: any, monType: any, monGrp?: string, grpDisplayName?: string) {
    let me = this;
    if (arr.length != 0) {
      arr.map(function (item: any) {
        if ((item[COMPONENT.TYPE] === COMPONENT.ACCORDIAN_TYPE ||
          item[COMPONENT.TYPE] === COMPONENT.FIELDSETLABEL_TYPE ||
          item[COMPONENT.TYPE] === COMPONENT.DEPENDENT_COMP) && item[COMPONENT.DEPENDENT_COMP]) {
          item[COMPONENT.DEPENDENT_COMP].map(function (depComp) {

            if (depComp[COMPONENT.TYPE] == COMPONENT.RADIOBUTTONGROUP_TYPE) {
              me.addDisableValidation(depComp);
            }

            if (depComp[COMPONENT.TYPE] == COMPONENT.CHECKBOX_TYPE) {
              me.addDisableProperty(depComp)
            }
          })
        }

        if (item[COMPONENT.TYPE] == COMPONENT.RADIOBUTTONGROUP_TYPE) {
          me.addDisableValidation(item);
        }

        // for enable/disable checkbox at global component level.
        if (item[COMPONENT.TYPE] == COMPONENT.CHECKBOX_TYPE) {
          me.addDisableProperty(item)
        }

        item[COMPONENT.MON_NAME] = key; // not required so commented.
        item[COMPONENT.MON_CATEGORY] = key;
        item[COMPONENT.MON_TYPE] = monType;
        item[COMPONENT.MON_GRP_DISPLAY_NAME] = grpDisplayName; // for bug 108262
        //added to be used in validations;
        if (monGrp)
          item[COMPONENT.MON_GROUP] = monGrp;

        me.formData.push(item)
      })
    }
  }

  // Method to get specific monitor data.
  getSpecificData(arr: any, key: any, enable: any, specificMonOption: any, monName: any,
    monType: any, monInternalName: any, monGrp?: string, grpDisplayName?: string) {
    let me = this;
    me.getMonData(arr, key, monName, monGrp, grpDisplayName);
    arr.map(function (item: any) {
      if ((item[COMPONENT.TYPE] === COMPONENT.ACCORDIAN_TYPE || item[COMPONENT.TYPE] === COMPONENT.FIELDSETLABEL_TYPE ||
        item[COMPONENT.TYPE] === COMPONENT.DEPENDENT_COMP) && item[COMPONENT.DEPENDENT_COMP]) {
        item[COMPONENT.DEPENDENT_COMP].map(function (checkboxDepComp) {
          if (checkboxDepComp.dependentComp != null) {
            checkboxDepComp.dependentComp.map(function (eachItems) {
              if (eachItems[COMPONENT.TYPE] == COMPONENT.RADIOBUTTONGROUP_TYPE) {
                me.addDisableValidation(eachItems);
              }
              else {
                if (eachItems[COMPONENT.TYPE] == COMPONENT.CHECKBOX_TYPE) {
                  me.addDisableProperty(eachItems)
                }
              }
            })
          }
        })
      }

      if (item[COMPONENT.TYPE] === COMPONENT.DEPENDENT_COMP) {
        item[COMPONENT.DEPENDENT_COMP].map(function (radioItems) {
          if (radioItems[COMPONENT.TYPE] == COMPONENT.RADIOBUTTONGROUP_TYPE) {
            me.addDisableValidation(radioItems);
          }
        })

      }

      item[COMPONENT.MON_NAME] = key;
      item[COMPONENT.MON_CATEGORY] = key;
      item[COMPONENT.IS_SPECIFIC_KEY] = true;
      item[COMPONENT.ENABLED] = enable;
      item[COMPONENT.MON_TYPE] = monName;
      item[COMPONENT.INTERNAL_MON_NAME] = monInternalName;
      item['isShow'] = true;
      if (monGrp)
        item[COMPONENT.MON_GROUP] = monGrp;

      item[COMPONENT.MON_GRP_DISPLAY_NAME] = grpDisplayName; // for bug 108262

      let obj = {
        [COMPONENT.OPTIONS_KEY]: specificMonOption,
        [COMPONENT.ENABLED]: enable,
        [COMPONENT.TYPE]: monType,
        [COMPONENT.DEPENDENT_COMP]: true,
        [COMPONENT.MON_NAME]: monInternalName,
        [COMPONENT.MON_CATEGORY]: key,
        [COMPONENT.MON_DISPLAY_NAME]: monName,
        [COMPONENT.MON_GRP_DISPLAY_NAME]: grpDisplayName // for bug 108262

      }
      if (monGrp)
        obj[COMPONENT.MON_GROUP] = monGrp

      // me.specificMonMap.set(monName, obj);
      me.specificMonMap.set(monInternalName, obj); // changed mon display name to internal monitor name
    })
  }

  // Method to get custom monitor data at Add/edit time.
  getCustomMonData(compData: any, key: any, type: any, custType: any) {
    let me = this;

    if (type === COMPONENT.CMD_TYPE) {
      if (custType === COMPONENT.CUSTOM_MONITOR_KEY) {
        let cmdObj = me.createOtherParams(compData, key, COMPONENT.CMD_TYPE);
        if (cmdObj && cmdObj.length > 0) // for bug 108777
          me.customCmdMon.push(cmdObj);

      }
      if (compData[key][COMPONENT.UI_OPTIONS_KEY] && Object.keys(compData[key][COMPONENT.UI_OPTIONS_KEY]).length > 0) {
        me.setCustomMonUIOptions(compData[key][COMPONENT.UI_OPTIONS_KEY], me.cmdData);
        me.monitorupdownService.fillCustomMonData(me.cmdData);
      }
    }

    if (type === COMPONENT.DB_TYPE) {
      if (custType === COMPONENT.CUSTOM_MONITOR_KEY) {
        let cmdObj = me.createOtherParams(compData, key, COMPONENT.DB_TYPE);
        if (cmdObj && cmdObj.length > 0)
          me.customCmdMon.push(cmdObj);
      }
      if (compData[key][COMPONENT.UI_OPTIONS_KEY] && Object.keys(compData[key][COMPONENT.UI_OPTIONS_KEY]).length > 0) {
        me.setCustomMonUIOptions(compData[key][COMPONENT.UI_OPTIONS_KEY], me.dbData);
        me.monitorupdownService.fillCustomMonData(me.dbData);
      }
    }

    //For JMX deployment
    if (type === COMPONENT.JMX_TYPE) {
      if (custType === COMPONENT.CUSTOM_MONITOR_KEY) {
        let cmdObj = me.createOtherParams(compData, key, COMPONENT.JMX_TYPE);
        if (cmdObj && cmdObj.length > 0)
          me.customCmdMon.push(cmdObj);
      }
      if (compData[key][COMPONENT.UI_OPTIONS_KEY] && Object.keys(compData[key][COMPONENT.UI_OPTIONS_KEY]).length > 0) {
        me.setCustomMonUIOptions(compData[key][COMPONENT.UI_OPTIONS_KEY], me.jmxData);
        me.monitorupdownService.fillCustomMonData(me.jmxData);
      }
    }
  }

  // Used for setting UI options for custom monitors eg. remote tier/server checkbox, db query
  setCustomMonUIOptions(data, monData) {
    let me = this;
    for (var i in data) {
      if (i === "--rTier")
        me.rTFlag = data[i];
      if (i === "--rServer")
        me.rSFlag = data[i];
      if (i === "--oTypeForCmd")
        me.oTypeForCmd = data[i];
      if (i === LONG_ARG.LONG_FORMAT_AUTH_TYPE_ARG) {
        monData.auth = data[i];
        if (data[i] === '0')
          monData.sid = true;
        else
          monData.sid = true;
      }
      if (i === LONG_ARG.LONG_FORMAT_DB_QUERY_ARG)
        monData.query =  decodeURIComponent(data[i]).replace(/\+/g, ' ') // for decoding encoded query
      if (i === LONG_ARG.LONG_FORMAT_VECTOR_PREFIX)
        monData.instance = data[i];
      if (i === "--executeRemote")
        monData.executeRemote = data[i];
      if (i === "--rT")
        monData.rT = data[i];
      if (i === "--rS")
        monData.rS = data[i];
      if (i === "--cT")
        monData.cT = data[i];
      if (i === "--rSDpName")
        monData.rSDpName = data[i];
      if (i === LONG_ARG.LONG_FORMAT_HOST_ARG)
        monData.host = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PORT_ARG)
        monData.port = data[i];
      if (i === LONG_ARG.LONG_FORMAT_USER_ARG)
        monData.user = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PWD_ARG)
        monData.pwd = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PUBLIC_KEY_ARG)
        monData.pubKey = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PRIVATE_KEY_ARG)
        monData.prvKey = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PROXY_HOST_ARG)
        monData.pHost = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PROXY_PORT_ARG)
        monData.pPort = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PROXY_USER_ARG)
        monData.pUser = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PROXY_PWD_ARG)
        monData.proxyPwd = data[i];
      if (i === LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_ARG)
        monData.tsf = data[i];
      if (i === LONG_ARG.LONG_FORMAT_TRUST_STORE_PASSWORD_ARG)
        monData.tsp = data[i];
      if (i == LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_TYPE_ARG)
        monData.sslType = data[i];
      if (i === LONG_ARG.LONG_FORMAT_KEY_STORE_FILE_ARG)
        monData.ksf = data[i];
      if (i === LONG_ARG.LONG_FORMAT_KEY_STORE_PASSWORD_ARG)
        monData.ksp = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PID_ARG)
        monData.pid = data[i];
      if (i === LONG_ARG.LONG_FORMAT_PID_FILE_ARG)
        monData.pidFile = data[i];
      if (i === "--jmxConn")
        monData.jmxConn = data[i];
      if (i === LONG_ARG.LONG_FORMAT_JMX_CONNECTION_URL_ARG)
        monData.connURL = data[i];
      if (i === "--otherConn")
        monData.otherConn = data[i];
      if (i === "--index")
        monData.occCount = data[i];
      if (i === LONG_ARG.LONG_FORMAT_DB_NAME_ARG)
        monData.dbName = data[i];
      if (i === "--sslType")
        monData.sslType = data[i];
      if (i === "--custSSL")
        monData.custSSL = data[i];
      if (i === COMPONENT.AGENT_TYPE)
        monData.agent = data[i];
      if (i === LONG_ARG.LONG_FORMAT_VECTOR_PERSIST_COUNT_ARG)
        monData.adv.delVecCount = +data[i].split('.')[0];;
      if (i === LONG_ARG.LONG_FORMAT_RETRY_ARG)
       monData.adv.rCount = +data[i].split('.')[0];
      if (i === LONG_ARG.LONG_FORMAT_INTERVAL_ARG)
        monData.adv.interval = +data[i].split('.')[0];;
      if (i === LONG_ARG.LONG_FORMAT_IS_REFRESH_ARG)
        monData.adv.dbCon = data[i];
      if (i === LONG_ARG.LONG_FORMAT_SERVICE_ACCOUNT_FILE_ARG)
        monData.adv.jFile = data[i];
      if (i === LONG_ARG.LONG_FORMAT_SERVICE_ACCOUNT_TOKEN_FILE_PATH_ARG)
        monData.adv.tFile = data[i];
      if(i == COMPONENT.CLASSPATH)
        monData.classPath = data[i]
      if(i == COMPONENT.JAVAHOME)
        monData.javaHome = data[i]
      if(i == LONG_ARG.LONG_FORMAT_JMX_CONNECTOR_SEARCH_PATTERN_ARG){
        this.getJmxPatternData(data[i],monData)
      }
    }

  }

  // Method for creating deployment options for textfield component.
  createTextFieldOptions(compItem: any) {
    let option: any = {};
    let finalObj: any = [];
    let value = compItem.value; // holds the current textfield value 
    if (!isNaN(value)) {	    //converting decimal number to string value
      value = String(value)
    }
    if (value) // add when value is not empty
    {
      if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.INPUT_TYPE] != COMPONENT.TYPE_PASSWORD)// case when we get input type as "password" we skip that field and do not show in the argument data(i.e in gui) but send it to the server.
      {
        if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
          value = encodeURIComponent(value);

        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true") //this is used for adding at start end doubleQuotesVal
          value = "\"" + value + "\"";
      }
      else // case when inputType is password and we add that field value to the "options"
      {
        if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.PWD_ENCRYPT_VAL]) {
          value = COMPONENT.PASSWORD_SEPERATOR + value + COMPONENT.PASSWORD_SEPERATOR;
        }
      }

      option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";  // instance: "--vecPrefix  ${instance}
      this.monParams[compItem.key] = value;
      this.deploymentOption[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
    }
    finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  // Method for creating deployment options for RadioButton component.
  createRadioButtonOptions(compItem: any) {
    let dep: any = [];
    // let option: any = {};
    let me = this;
    let value = compItem.value; // holds the current textfield value 
    let selectedObj = _.find(compItem['items'], function (each: any) { return each.value == compItem.value })
    let dependentCompOption = "";

    //If dependent component is present
    if (selectedObj[COMPONENT.DEPENDENT_COMP] != null) {
      selectedObj[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
        // Handling of case - when dependent comp args is blank (apacheflume.json) and type is blank
        if (eachDepenComp.type && !eachDepenComp.args) {
          eachDepenComp.args = selectedObj.args;
        }
        if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
          dep = me.createComponentData(eachDepenComp);
          if (eachDepenComp.type && dep[0][COMPONENT.OPTIONS_KEY]) //handeling when type is blank 
          {
            dependentCompOption = dependentCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
          }
        }
      })
    }
    else // if there is only radiobutton
    {
      // used for creating object in params at body.
      this.monParams[selectedObj.key] = value; //  instance : value;
      dependentCompOption = selectedObj.args + "  ${" + selectedObj.key + "}";
    }
    this.deploymentOption[compItem.key] = dependentCompOption;
  }

  // Method for creating deployment options for Checkbox component added on 1st april
  createCheckBoxOptions(compItem: any) {
    let dep: any = [];
    let option: any = {};
    let finalObj: any = [];
    let me = this;
    let depCompOption = "";
    let value = compItem.value; // holds the current checkbox value 
    option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
    if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
      compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
        if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
          if (!eachDepenComp['args']) {
            eachDepenComp['args'] = compItem.args;
          }
          dep = me.createComponentData(eachDepenComp);
          if (dep && dep[0][COMPONENT.OPTIONS_KEY])
            depCompOption = depCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
        }
      })
    }
    else {
      this.monParams[compItem.key] = value; //  instance : value; 
      depCompOption = compItem.args + "  ${" + compItem.key + "}";
    }
    this.deploymentOption[compItem.key] = depCompOption; //added on 18th May
    finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  sendRequestToServer() {
    let me = this;
    let reqBody: any = {};
    reqBody =
    {
      "useGlobal": me.isUseGlobal,
      "params": me.monParams,
      "mon": {}
    }
    //using Entries
    for (let entry of this.specificMonMap.entries()) {
      reqBody['mon'][entry[1][COMPONENT.MON_NAME]] = me.createSaveData(entry, me.deploymentOption, me.options);
    }

    let arr = me.removeDisableMonGrpParams();
    // added below part for bug 110733
    let msg = "";
    for (let i = 0; i < this.monGrpStateArr.length; i++) {
      if (!this.monGrpMap.includes(this.monGrpStateArr[i]['gn'])) {
        if (this.monGrpStateArr[i]['gdn'])
          msg = msg + this.monGrpStateArr[i]['gdn'] + COMPONENT.COMMA_SEPARATOR
      }
    }

    if (msg)
      this.showConfirmDialogForUpdate(msg, reqBody);
    else
      this.createFinalSaveObj(reqBody);

    for (let i = 0; i < arr.length; i++) {
      delete me.monParams[arr[i]]
    }
    this.monGrpStateArr = [] // clear the array to get update info for each group.
  }

  //creating save data on Add
  createSaveData(compData: any, deploymentOption: any, options: any) {
    let str = compData[1][COMPONENT.OPTIONS_KEY].toString();
    let me = this;
    let arr = str.split(" ")
    let replacedOption = "";
    let replacedCustomOption = "";
    let monInOptions = "";
    let monObj: any = {};
    let javaHome = null;
    let appName = null;
    let instanceName = null;
    let classPath = null;
    let exApp = null;
    let isProcess = null;
    let agentType = null;
    let tierName = null;
    let enable = false;
    let monGrp = compData[1][COMPONENT.MON_GROUP];
    let matchKey = Object.keys(deploymentOption)
    let customKey = Object.keys(options)

    if (compData[1][COMPONENT.ENABLED]) {
      if (this.monGrpMap.indexOf(monGrp) === -1) {
        this.monGrpMap.push(monGrp);
      }
      enable = compData[1][COMPONENT.ENABLED]
    }

    let monGrpKey = monGrp + COMPONENT.MON_GRP_KEY_SEPARATOR;

    matchKey.map(function (item: any) {
      for (let i = 0; i < arr.length; i++) {
        let startIndex = arr[i].indexOf(COMPONENT.KEY_START)
        let newStr = monGrpKey + arr[i].substring(startIndex + 2, arr[i].length - 1);

        //Add monGrp to every item if is not for custom monitors.
        if (item !== COMPONENT.JMX_TYPE && item !== COMPONENT.CMD_TYPE && item !== COMPONENT.DB_TYPE &&
          !item.includes(COMPONENT.MON_GRP_KEY_SEPARATOR)) {
          item = monGrpKey + item;
        }

        if (item === newStr || item === newStr + COMPONENT.UNDERSCORE + compData[0]) {
          if (item === monGrpKey + COMPONENT.JAVAHOME)
            javaHome = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.CLASSPATH)
            classPath = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.APPNAME)
            appName = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.EXCLUDE_APP)
            exApp = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.ISPROCESS)
            isProcess = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.AGENT_TYPE)
            agentType = deploymentOption[item];
          else if (item === monGrpKey + COMPONENT.INSTANCE || item == monGrpKey + COMPONENT.INSTANCE + COMPONENT.UNDERSCORE + compData[0]) {
            if (deploymentOption[item].includes("--") || deploymentOption[item].includes("-")) {   //single "-" is used to handle args having old arguments like "-"
              let val = deploymentOption[item].split(COMPONENT.SPACE_SEPARATOR)
              //Handled case in windowsytem tech in case of TaskSchedular monitor instance name was getting twice in dep-Options.
              if (!replacedOption.includes(val[1]))
                replacedOption = replacedOption + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;

              instanceName = val[1].trim();
            }
            else {
              instanceName = deploymentOption[item];
            }
          }
          else if (deploymentOption[item] && deploymentOption[item].includes(COMPONENT.KEY_START)) {
            replacedOption = replacedOption + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;

          }
          else {
            if (compData[1][COMPONENT.DEPENDENT_COMP]) {
              if (deploymentOption[item] && deploymentOption[item].startsWith(COMPONENT.TIER_TYPE) &&
                deploymentOption[item].includes("||")) {
                let tierVal = deploymentOption[item].split("||");
                monInOptions = monInOptions + tierVal[1] + " %cav_tier_any_server% ";
                tierName = tierVal[2];
              }
              else if (deploymentOption[item] && deploymentOption[item].startsWith(COMPONENT.INSTANCE) && deploymentOption[item].includes("||")) {
                let instanceVal = deploymentOption[item].split("||");

                if (instanceVal.length == 3) {
                  monInOptions = monInOptions + instanceVal[1] + COMPONENT.SPACE_SEPARATOR + instanceVal[2] + COMPONENT.SPACE_SEPARATOR;
                  instanceName = instanceVal[2];
                }
                else {
                  instanceName = instanceVal[1];
                }
              }
              else {
                monInOptions = monInOptions + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
              }
            }
          }
        }
        else if (item.startsWith(COMPONENT.MON_GRP_GLOBAL)) {
          let compArgument = item.split(COMPONENT.MON_GRP_KEY_SEPARATOR);
          let newStrArgument = newStr.split(COMPONENT.MON_GRP_KEY_SEPARATOR);
          if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.JAVAHOME))
            javaHome = deploymentOption[item];
          else if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.CLASSPATH))
            classPath = deploymentOption[item];
          else if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.APPNAME))
            appName = deploymentOption[item];
          else if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.EXCLUDE_APP))
            exApp = deploymentOption[item];
          else if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.ISPROCESS))
            isProcess = deploymentOption[item];
          else if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.AGENT_TYPE))
            agentType = deploymentOption[item];
          else if (compArgument[1] === newStrArgument[1]) {
            // instance name check is added to handle case where instanceName tag is comming without use as options. So in that case it must not get
            // added in depOptions tag (handled for case in apigee monitors)
            if (compArgument[1] === COMPONENT.INSTANCE) {
              // UseAsOption is present for instance name so it need to be replaced in depOptions.
              if (deploymentOption[item].includes("--") || deploymentOption[item].includes("-")) {
                replacedOption = replacedOption + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
              }
            }
            else {
              if (deploymentOption[item] && deploymentOption[item].includes(COMPONENT.KEY_START)) {
                replacedOption = replacedOption + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
              }
            }

          }
          else {
            if (item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.INSTANCE) ||
              item === (COMPONENT.MON_GRP_GLOBAL + COMPONENT.MON_GRP_KEY_SEPARATOR + COMPONENT.INSTANCE + COMPONENT.UNDERSCORE + compData[0])) { // for instance name case in prometheus monitor.
              if (deploymentOption[item].includes("--") || deploymentOption[item].includes("-")) {   //single "-" is used to handle args having old arguments like "-"
                let val = deploymentOption[item].split(COMPONENT.SPACE_SEPARATOR)
                instanceName = val[1].trim();
              }
              else {
                instanceName = deploymentOption[item];
              }
            }
          }
        }
        //Below check is needs to be tested in postgresql.json and windows network json.
        else {
          if (item === monGrpKey + COMPONENT.INSTANCE || item === monGrpKey + COMPONENT.INSTANCE + COMPONENT.UNDERSCORE + compData[0]) {
            if (deploymentOption[item].includes("--") || deploymentOption[item].includes("-") || deploymentOption[item].startsWith("/")) //single "-" is used to handle args having old arguments like "-"
            {
              let val = deploymentOption[item].split(COMPONENT.SPACE_SEPARATOR)

              instanceName = val[1].trim();
              //For bug 109516 and 108314 - it needs to be checked in monInOptions and replacedOptions both to avoid duplicate args to be written - postgresql json and windows network json
              //if val[1] contains ${} that means it is depOptions so it need not to be added in monOptions.
              if (!monInOptions.includes(val[1]) && !val[1].trim().startsWith(COMPONENT.KEY_START)) // need to add for handling case where useAsoption is used for instance name key and it is getting added twice for bug 109142
                monInOptions = monInOptions + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
            }
            else {
              instanceName = deploymentOption[item];
            }
          }
        }
      }

      // For other argument key must start as group#other_<mon Name>
      if (item === monGrpKey + "other_" + compData[0]) {
        monInOptions = monInOptions + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
      }
      else if (item === compData[1][COMPONENT.MON_CATEGORY]) {
        replacedOption = replacedOption + deploymentOption[item] + COMPONENT.SPACE_SEPARATOR;
        if (compData[1][COMPONENT.MON_CATEGORY] === COMPONENT.JMX_TYPE &&
          deploymentOption[item].includes(LONG_ARG.LONG_FORMAT_VECTOR_PREFIX)) {
          instanceName = me.monParams["_jmx#instance"];
          agentType = me.monParams["_jmx#agent"]  // agent type in jmx deployment Options
        }
        else if(compData[1][COMPONENT.MON_CATEGORY] === COMPONENT.DB_TYPE){
          if(me.monParams["_db#classPath"])
            classPath = me.monParams["_db#classPath"] // class path in db deployement
          if(me.monParams["_db#javaHome"])
            javaHome = me.monParams["_db#javaHome"] //java home in db deployement
        }
      }

      if (item.startsWith("--"))	 //handeling for adding tags in options with blank type
      {
        monInOptions = monInOptions + deploymentOption[item] + " ";
      }

      if (compData[0] === item && item != COMPONENT.JAVAHOME && item != COMPONENT.CLASSPATH && item != COMPONENT.APPNAME
        && item != COMPONENT.EXCLUDE_APP && item != COMPONENT.INSTANCE && item != COMPONENT.RUN_AS_PROCESS
        && item != COMPONENT.ISPROCESS) {
        replacedCustomOption = replacedCustomOption + options[item] + " ";
        if (deploymentOption[item].includes("${"))
          replacedOption = replacedOption + deploymentOption[item] + " ";
        else {
          if (compData[1][COMPONENT.DEPENDENT_COMP])
            monInOptions = monInOptions + deploymentOption[item] + " ";
        }
      }

      if (compData[0] === customKey[0] && item != COMPONENT.JAVAHOME && item != COMPONENT.CLASSPATH && item != COMPONENT.APPNAME
        && item != COMPONENT.EXCLUDE_APP && item != COMPONENT.INSTANCE && item != COMPONENT.RUN_AS_PROCESS
        && item != COMPONENT.ISPROCESS) {
        monInOptions = monInOptions + options[customKey[0]];
      }
    })

    let finalDepOptions = this.removeSpaceBtwArgsAndValue(replacedOption.toString().trim())
    let finalMonInOptions = this.removeSpaceBtwArgsAndValue(monInOptions.toString().trim())
    Object.assign(monObj, {
      // [COMPONENT.OPTIONS]: enable || monGrp === COMPONENT.MON_GRP_GLOBAL ? finalMonInOptions.toString().trim() : "", // for bug 110733 added global field check
      [COMPONENT.OPTIONS]: finalMonInOptions.toString().trim(), // for bug 110733  removed enble check. for handling case of windownetwork json
      [COMPONENT.DEP_OPTIONS_KEY]: this.monGrpMap.includes(monGrp) ? finalDepOptions.toString().trim() : "",
      [COMPONENT.ENABLED]: enable,
      [COMPONENT.TYPE]: compData[1][COMPONENT.TYPE],
      [COMPONENT.JAVAHOME]: javaHome,
      [COMPONENT.CLASSPATH]: classPath,
      [COMPONENT.INSTANCE]: instanceName ? this.removeSpaceBtwArgsAndValue(instanceName.toString().trim()) : instanceName,
      [COMPONENT.APPNAME]: appName,
      [COMPONENT.EXCLUDE_APP]: exApp,
      [COMPONENT.ISPROCESS]: isProcess,
      [COMPONENT.AGENT_TYPE]: agentType,
      [COMPONENT.ANY_TIER_SERVER]: tierName,
      [COMPONENT.MON_GROUP]: monGrp,
      [COMPONENT.MON_GRP_DISPLAY_NAME]: compData[1][COMPONENT.MON_GRP_DISPLAY_NAME]
    })
    return monObj
  }

  // Method for creating deployment options for Accordian component added on 31th march
  createAccordianOptions(compItem: any) {
    let me = this;
    let dep: any = [];
    let finalObj: any = [];
    let option: any = {};
    let dependentCompOption = "";

    //If dependent component is present
    if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
      compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
        if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
          dep = me.createComponentData(eachDepenComp);
          dependentCompOption = dependentCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
        }
      })
      option[compItem.key] = dependentCompOption.trim();
    }
    finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  // Method for creating deployment options for dropdown component 
  createDropdownOptions(compItem: any) {
    let dep: any = [];
    let finalObj: any = [];
    let option: any = {};
    let me = this;
    let value = compItem['value'];
    let depCompOption = "";
    compItem[COMPONENT.DROP_DOWN_LIST_ITEMS].map(eachComp => {
      if (value == "") {
        if (eachComp[COMPONENT.DEPENDENT_COMP]) {
          eachComp[COMPONENT.DEPENDENT_COMP].map(each => {
            option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
            me.monParams[compItem.key] = each.value;
          })
        }
      }
      else if (value === eachComp[COMPONENT.VALUE]) {
        if (eachComp[COMPONENT.DEPENDENT_COMP]) {
          eachComp[COMPONENT.DEPENDENT_COMP].map(function (each: any) {
            dep = me.createComponentData(each);
          })
          if (dep[0][COMPONENT.OPTIONS_KEY])
            depCompOption = depCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
        }
        else {
          me.monParams[compItem.key] = value;
          option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
        }
      }
    })
    finalObj.push({ "dep": me.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  //added on 12th april 
  createTableOptions(compItem: any) {
    let me = this;
    let option: any = {};
    let finalObj: any = [];
    if (compItem[COMPONENT.TABLE_DATA]) {
      let tableVal = "";
      let str = "";
      compItem[COMPONENT.TABLE_DATA].map(val => {
        compItem[COMPONENT.COLUMNDATA].map(each => {
          str = str + val[each.label] + ",";
        })
      })
      str = str.substring(0, str.length - 1);
      tableVal = "[" + str + "]";
      me.monParams[compItem.key] = tableVal;
      option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
    }
    finalObj.push({ "dep": me.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  createTableSingleArgOptions(compItem: any) {
    let me = this;
    let value = "";
    let option: any = {};
    let finalObj: any = [];
    if (compItem[COMPONENT.TABLE_DATA]) {
      let rowVal = "";
      compItem[COMPONENT.TABLE_DATA].map(val => {
        let colVal = "";
        compItem[COMPONENT.COLUMNDATA].map(each => {
          if (compItem[COMPONENT.KEY_VALUE_SEPARATOR]) {
            colVal = colVal + each.args + compItem[COMPONENT.KEY_VALUE_SEPARATOR] + val['ui'] + compItem[COMPONENT.COLUMN_SEPERATOR];
          }
          else {
            colVal = colVal + val[each.label] + compItem[COMPONENT.COLUMN_SEPERATOR];
          }

        })
        rowVal = colVal.substring(0, colVal.length - 1);
        value = value + rowVal + compItem[COMPONENT.ROW_SEPERATOR];
      })
      value = value.substring(0, value.length - 1);
      me.monParams[compItem.key] = value;
      option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
      this.deploymentOption[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
    }

    finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  createFieldSetOptions(compItem: any) {
    let me = this;
    let dep: any = [];
    let finalObj: any = [];
    let option: any = {};
    let dependentCompOption = "";
    //If dependent component is present
    if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
      compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
        me.updateConfMonitorArr(eachDepenComp)
        dep = me.getComponentData(eachDepenComp)
        if (!me.isSpecificTag) { // added for handling case for those tags whose value is nt returned in createComponentData() method.
          if (dep[0][COMPONENT.OPTIONS_KEY])
            dependentCompOption = dependentCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";

        }
      })
      option[compItem.key] = dependentCompOption.trim();
    }
    finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
    return finalObj;
  }

  createOptionsForCmdDeployment(formData, monData) {
    let me = this;
    // let val = '-t 1 '; // mandatory argument
    let newVal = '';  //added for new monitor args
    this.remoteServerName = formData.rS;

    if (formData.executeRemote) //if remote checkbox is enable then only below arguments should be added in options.
    {
      if (formData.host) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_HOST_ARG] = formData.host;
        newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_HOST_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_HOST_ARG, monData.type);
      }

      if (formData.port) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_PORT_ARG] = formData.port.toString(); // for bug 110548
        newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_PORT_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_PORT_ARG, monData.type);
      }

      if (formData.user) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_USER_ARG] = formData.user;
        newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_USER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_USER_ARG, monData.type);
      }

      if (formData.auth == '0') // 0 for password and 1 for passphrase
      {
        if (formData.pwd) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_PWD_ARG] = formData.pwd;
          newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_PORT_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_PWD_ARG, monData.type);
        }
      }
      else {
        if (formData.pubKey) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PUBLIC_KEY_ARG] = formData.pubKey;
          newVal = newVal + LONG_ARG.LONG_FORMAT_PUBLIC_KEY_ARG + me.generateOption(CUST_CONST.CMD_PUBLIC_KEY_ARG, monData.type);
        }

        if (formData.prvKey) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PRIVATE_KEY_ARG] = formData.prvKey;
          newVal = newVal + LONG_ARG.LONG_FORMAT_PRIVATE_KEY_ARG + me.generateOption(CUST_CONST.CMD_PRIVATE_KEY_ARG, monData.type);
        }

        if (formData.passphrase) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PASSPHRASE_ARG] = formData.passphrase;
          newVal = newVal + LONG_ARG.LONG_FORMAT_PASSPHRASE_ARG + me.generateOption(CUST_CONST.CMD_PASSPHRASE_ARG, monData.type);
        }
      }

      //if proxy host is provided then, only other proxy arguments are added in options'
      if (formData.pHost) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PROXY_HOST_ARG] = formData.pHost;
        newVal = newVal + LONG_ARG.LONG_FORMAT_PROXY_HOST_ARG + me.generateOption(CUST_CONST.CMD_PROXY_HOST_ARG, monData.type);

        if (formData.pPort) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PROXY_PORT_ARG] = formData.pPort.toString() // for bug 110548
          newVal = newVal + LONG_ARG.LONG_FORMAT_PROXY_PORT_ARG + me.generateOption(CUST_CONST.CMD_PROXY_PORT_ARG, monData.type);
        }

        if (formData.pUser) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PROXY_USER_ARG] = formData.pUser;
          newVal = newVal + LONG_ARG.LONG_FORMAT_PROXY_USER_ARG + me.generateOption(CUST_CONST.CMD_PROXY_USER_ARG, monData.type);
        }

        if (formData.proxyPwd) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_PROXY_PWD_ARG] = formData.proxyPwd;
          newVal = newVal + LONG_ARG.LONG_FORMAT_PROXY_PWD_ARG + me.generateOption(CUST_CONST.CMD_PROXY_PWD_ARG, monData[COMPONENT.MON_CATEGORY]);
        }
      }
    }

    let tierName = formData.rT;
    //if Tier checkbox is checked at configuration time then add -T in options
    // if (this.rTFlag) // if 'Tier' checkbox is checked.
    if (this.rTFlag) // if 'Tier' checkbox is checked.
    {
      /**
      * if tier is to be shown in Hierarchy i.e. -T must be added.
      * case 1: If Agent tier then add ${Tier} 
      * case 2: If remote tier is selected from the tierlist then add that tier value 
      * case 3: If custom tier is added then custom tier value should be shown in UI.
      **/
      let remoteTierValue = "";
      if (formData.executeRemote && formData.rT) // remote tier case
      {
        if (formData.rT == '_at') // if agent tier is selected from tierList
        {
          remoteTierValue = "${Tier}";
          tierName = '_at';
        }
        else if (formData.rT == 'ct') // for custom tier type
        {
          remoteTierValue = formData.cT;
          tierName = 'ct'
        }
        else {
          remoteTierValue = formData.rT;
        }
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_TIER_ARG] = remoteTierValue;
        newVal = newVal + LONG_ARG.LONG_FORMAT_TIER_ARG + me.generateOption(CUST_CONST.CMD_TIER_ARG, monData.type);

        if (tierName == 'ct') {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_TIER_ARG] = formData.cT;
          newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_TIER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_TIER_ARG, monData.type);
        }
        else {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_TIER_ARG] = tierName;
          newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_TIER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_TIER_ARG, monData.type);
        }
      }
      else // in case of agent with no remote settings.
      {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_TIER_ARG] = "${Tier}";
        newVal = newVal + LONG_ARG.LONG_FORMAT_TIER_ARG + " ${Tier}" + LONG_ARG.SPACE_SEPARATOR
      }
    }

    //if Server checkbox is checked at configuration time then add -S in options
    // if (this.rSFlag) {
    if (this.rSFlag) {
      if (formData.executeRemote && this.remoteServerName && this.remoteServerName != '') {
        newVal = newVal + LONG_ARG.LONG_FORMAT_SERVER_ARG + LONG_ARG.SPACE_SEPARATOR + this.remoteServerName + LONG_ARG.SPACE_SEPARATOR
      }
    }

    if (formData.executeRemote) {
      if (formData.rS != 'ct') {
        // if (this.rSFlag && this.remoteServerName.trim() != formData.rS.trim()) {
        if (true && this.remoteServerName.trim() != formData.rS.trim()) {
          newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + LONG_ARG.SPACE_SEPARATOR + formData.rS + LONG_ARG.SPACE_SEPARATOR
        }
        else {
          newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + LONG_ARG.SPACE_SEPARATOR + this.remoteServerName + LONG_ARG.SPACE_SEPARATOR
        }

      }
      else {
        newVal = newVal + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + LONG_ARG.SPACE_SEPARATOR + formData.rS + LONG_ARG.SPACE_SEPARATOR
      }
    }

    else {
      // if (this.rSFlag)
      if (true)
        newVal = newVal + LONG_ARG.LONG_FORMAT_SERVER_ARG + " ${Server}" + LONG_ARG.SPACE_SEPARATOR;
    }

    return newVal;
  }

  createOptionsForJMXDeployment(formData, monData) {
    let me = this;
    let depOptions = '';  //dep-Options

    me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.IS_ENCRYPTED_PWD_ARG] = ""; // for bug 108519
    depOptions = depOptions + LONG_ARG.LONG_FORMAT_IS_ENCRYPTED_PWD_ARG + me.generateOption(CUST_CONST.IS_ENCRYPTED_PWD_ARG, monData[COMPONENT.MON_CATEGORY]);

    if (formData.instance) {
      me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.CMD_INSTANCE_ARG] = formData.instance;
      depOptions = depOptions + LONG_ARG.LONG_FORMAT_VECTOR_PREFIX + me.generateOption(CUST_CONST.CMD_INSTANCE_ARG, monData[COMPONENT.MON_CATEGORY]);
    }
    if (formData.agent) {
      me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.AGENT_TYPE] = formData.agent;
    }
    if (formData.jmxConn === "setting") {
      if (formData.host) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.CMD_HOST_ARG] = formData.host;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_HOST_ARG + me.generateOption(CUST_CONST.CMD_HOST_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      if (formData.port) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.CMD_PORT_ARG] = formData.port.toString(); // for bug 110548
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_PORT_ARG + me.generateOption(CUST_CONST.CMD_PORT_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      if (formData.user) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.CMD_USER_ARG] = formData.user;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_USER_ARG + me.generateOption(CUST_CONST.CMD_USER_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      if (formData.pwd) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.CMD_PWD_ARG] = COMPONENT.PASSWORD_SEPERATOR + formData.pwd + COMPONENT.PASSWORD_SEPERATOR;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_PWD_ARG + me.generateOption(CUST_CONST.CMD_PWD_ARG, monData[COMPONENT.MON_CATEGORY]);
      }


      if (formData.connURL) {
        let connURL = "";
        if (formData.connURL == "Other")
          connURL = formData.otherConn;
        else
          connURL = formData.connURL;
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_URL_ARG] = connURL;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_JMX_CONNECTION_URL_ARG + me.generateOption(CUST_CONST.JMX_URL_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      if (formData.tsf) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_TRUST_STORE_FILE_ARG] = formData.tsf;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_FILE_ARG, monData[COMPONENT.MON_CATEGORY]);

        if (formData.tsp) {
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_TRUST_STORE_PASSWORD_ARG] = COMPONENT.PASSWORD_SEPERATOR + formData.tsp + COMPONENT.PASSWORD_SEPERATOR;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_TRUST_STORE_PASSWORD_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_PASSWORD_ARG, monData[COMPONENT.MON_CATEGORY]);
        }

        if (formData.tst) {
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG] = formData.tst;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_TYPE_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG, monData[COMPONENT.MON_CATEGORY]);
        }

        if (formData.ksf) {
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_KEY_STORE_FILE_ARG] = formData.ksf;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_KEY_STORE_FILE_ARG + me.generateOption(CUST_CONST.JMX_KEY_STORE_FILE_ARG, monData[COMPONENT.MON_CATEGORY]);
        }

        if (formData.ksp) {
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_KEY_STORE_PASSWORD_ARG] = COMPONENT.PASSWORD_SEPERATOR + formData.ksp + COMPONENT.PASSWORD_SEPERATOR;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_KEY_STORE_PASSWORD_ARG + me.generateOption(CUST_CONST.JMX_KEY_STORE_PASSWORD_ARG, monData[COMPONENT.MON_CATEGORY]);
        }

        if (formData.sslEnable) {
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_IS_TWO_WAY_SSL] = formData.sslEnable;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_TWO_SSL_ENABLE_ARG + me.generateOption(CUST_CONST.JMX_IS_TWO_WAY_SSL, monData[COMPONENT.MON_CATEGORY]);
        }
      }
    }

    else {
      if (formData.jmxConnPID === "procId" && formData.pid) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_PID_ARG] = formData.pid.toString(); // for bug 110548;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_PID_ARG + me.generateOption(CUST_CONST.JMX_PID_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      else if (formData.jmxConnPID === "pidFile" && formData.pidFile) {
        me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_PID_FILE_ARG] = formData.pidFile;
        depOptions = depOptions + LONG_ARG.LONG_FORMAT_PID_FILE_ARG + me.generateOption(CUST_CONST.JMX_PID_FILE_ARG, monData[COMPONENT.MON_CATEGORY]);
      }

      else {
        if (formData.adv.oP.length != 0) {
          let searchPatternArr = []
          formData.adv.oP.map(each => {
            searchPatternArr.push(each)
            me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_CONNECTOR_SEARCH_PATTERN_ARG] = searchPatternArr;

          })
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_JMX_CONNECTOR_SEARCH_PATTERN_ARG + me.generateOption(CUST_CONST.JMX_CONNECTOR_SEARCH_PATTERN_ARG, monData[COMPONENT.MON_CATEGORY]);
          me.monParams[COMPONENT.UNDERSCORE + monData[COMPONENT.MON_CATEGORY] + CUST_CONST.JMX_OCCURENCE_COUNT_ARG] = formData.occCount.toString(); // for bug 110548;
          depOptions = depOptions + LONG_ARG.LONG_FORMAT_OCCURENCE_COUNT_ARG + me.generateOption(CUST_CONST.JMX_OCCURENCE_COUNT_ARG, monData[COMPONENT.MON_CATEGORY]);
        }
      }
    }
    return depOptions;
  }

  generateOption(args, type) {
    let option = LONG_ARG.SPACE_SEPARATOR + COMPONENT.KEY_START + COMPONENT.UNDERSCORE +
      type + args + COMPONENT.KEY_END + LONG_ARG.SPACE_SEPARATOR;
    return option;
  }

  //adding custom monitors option deployment options .added on 9th april
  addCustomMonitorData(customData) {
    let me = this;
    customData.map(each => {
      if (each['opData']) {
        let otherParam = ""
        each['opData'].map(value => {
          otherParam = otherParam + "$" + value['pattern'] + "=" + value['upVal'] + ";";
        })
        otherParam = otherParam.substring(0, otherParam.length - 1);
        me.options[each.key] = "--connParams " + otherParam;
      }
    })
  }

  //creating other paramters for custom monitors added on 9th april
  createOtherParams(compData, key, paramType) {
    let cmdObj = [];
    if (compData['op']) {
      cmdObj['key'] = key;
      cmdObj[COMPONENT.TYPE] = paramType;
      cmdObj[COMPONENT.ENABLED] = compData[COMPONENT.ENABLED];
      cmdObj['op'] = Object.entries(compData['op']);
      cmdObj['rows'] = cmdObj['op'].length;
      let arr = [];
      let index = 0;
      cmdObj['op'].map(each => {
        let obj = {};
        obj["pattern"] = each[0];
        obj["upVal"] = each[1];
        obj["id"] = index;
        index++;
        arr.push(obj);
      })
      cmdObj['opData'] = arr;
    }

    return cmdObj;
  }

  //for db monitor options
  createDBConnectionOptions(formData, monData) {
    let me = this;
    let newOpt = "";
    if (formData.executeRemote) {
      if (formData.host) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_HOST_ARG] = formData.host;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_HOST_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_HOST_ARG, monData.type);
      }
    }

    if (formData.port) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_PORT_ARG] = formData.port.toString(); // for 110548
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_PORT_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_PORT_ARG, monData.type);
    }

    if (formData.user) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_USER_ARG] = formData.user;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_USER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_USER_ARG, monData.type);
    }

    if (formData.pwd) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_PWD_ARG] = formData.pwd;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_PWD_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_PWD_ARG, monData.type);
    }

    if (formData.dbName) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_NAME_ARG] = formData.dbName;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_DB_NAME_ARG + me.generateOption(CUST_CONST.DB_NAME_ARG, monData.type);
    }

    if (formData.sid) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_AUTH_TYPE_ARG] = formData.auth;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_AUTH_TYPE_ARG + me.generateOption(CUST_CONST.DB_AUTH_TYPE_ARG, monData.type);

      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_SID_ARG] = formData.sid;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_SID_ARG + me.generateOption(CUST_CONST.DB_SID_ARG, monData.type);
    }

    if (formData.tsf) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_TRUST_STORE_FILE_ARG] = formData.tsf;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_FILE_ARG, monData.type);

      if (formData.tsp) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_TRUST_STORE_PASSWORD_ARG] = formData.tsp;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_TRUST_STORE_PASSWORD_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_PASSWORD_ARG, monData.type);
      }

      if (formData.ksf) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_KEY_STORE_FILE_ARG] = formData.ksf;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_KEY_STORE_FILE_ARG + me.generateOption(CUST_CONST.JMX_KEY_STORE_FILE_ARG, monData.type);
      }

      if (formData.ksp) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_KEY_STORE_PASSWORD_ARG] = formData.ksp;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_KEY_STORE_PASSWORD_ARG + me.generateOption(CUST_CONST.JMX_KEY_STORE_PASSWORD_ARG, monData.type);
      }
    }

    if (formData.sslType != "" && formData.sslType != "Others") {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG] = formData.sslType;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_TYPE_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG, monData.type);
    }
    else if (formData.sslType == "Others") {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG] = formData.sslType;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_TRUST_STORE_FILE_TYPE_ARG + me.generateOption(CUST_CONST.JMX_TRUST_STORE_FILE_TYPE_ARG, monData.type);
    }

    if (formData.adv.delVecCount) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_VECTOR_PERSIST_COUNT_ARG] = formData.adv.delVecCount;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_VECTOR_PERSIST_COUNT_ARG + me.generateOption(CUST_CONST.DB_VECTOR_PERSIST_COUNT_ARG, monData.type);
    }

    if (formData.adv.rCount) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_RETRY_ARG] = formData.adv.rCount;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_RETRY_ARG + me.generateOption(CUST_CONST.CMD_RETRY_ARG, monData.type);
    }

    if (formData.adv.interval) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_INTERVAL_ARG] = formData.adv.interval;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_INTERVAL_ARG + me.generateOption(CUST_CONST.CMD_INTERVAL_ARG, monData.type);
    }

    if (formData.adv.dbCon) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_IS_REFRESH_ARG] = formData.adv.dbCon;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_IS_REFRESH_ARG + me.generateOption(CUST_CONST.DB_IS_REFRESH_ARG, monData.type);
    }

    if (formData.adv.jFile) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_SERVICE_ACCOUNT_FILE_ARG] = formData.adv.jFile;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_SERVICE_ACCOUNT_FILE_ARG + me.generateOption(CUST_CONST.DB_SERVICE_ACCOUNT_FILE_ARG, monData.type);
    }

    if (formData.adv.tFile) {
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.DB_SERVICE_ACCOUNT_TOKEN_FILE_PATH_ARG] = formData.adv.tFile;
      newOpt = newOpt + LONG_ARG.LONG_FORMAT_SERVICE_ACCOUNT_TOKEN_FILE_PATH_ARG + me.generateOption(CUST_CONST.DB_SERVICE_ACCOUNT_TOKEN_FILE_PATH_ARG, monData.type);
    }
    
    if(formData.classPath){
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CLASS_PATH] = formData.classPath;
    }
    if(formData.javaHome){
      me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.JAVA_HOME] = formData.javaHome;
    }
    return newOpt;
  }


  createUseAsHierarchyOptions(formData, monData) {
    let me = this;
    let tierName = formData.rT;
    let newOpt = ''; // for new option

    //if Tier checkbox is checked at configuration time then add -T in options
    if (this.rTFlag) // if 'Tier' checkbox is checked.
    {
      /**
      * if tier is to be shown in Hierarchy i.e. -T must be added.
      * case 1: If Agent tier then add ${Tier} 
      * case 2: If remote tier is selected from the tierlist then add that tier value 
      * case 3: If custom tier is added then custom tier value should be shown in UI.
      **/
      let remoteTierValue = "";
      if (formData.executeRemote && formData.rT && formData.rT != '') // remote tier case
      {
        if (formData.rT == '_at') { // if agent tier is selected from tierList
          remoteTierValue = "${Tier}";
          tierName = '_at';
        }
        else if (formData.rT == 'ct') // for custom tier type
        {
          remoteTierValue = formData.cT;
          tierName = 'ct'
        }
        else {
          remoteTierValue = formData.rT;
        }
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_TIER_ARG] = remoteTierValue;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_TIER_ARG + me.generateOption(CUST_CONST.CMD_TIER_ARG, monData.type);

        if (tierName == 'ct') {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_TIER_ARG] = formData.cT;
          newOpt = newOpt + LONG_ARG.LONG_FORMAT_REMOTE_TIER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_TIER_ARG, monData.type);
        }
        else {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_TIER_ARG] = tierName;
          newOpt = newOpt + LONG_ARG.LONG_FORMAT_REMOTE_TIER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_TIER_ARG, monData.type);
        }
      }
      else // in case of agent with no remote settings.
      {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_TIER_ARG] = "${Tier}";
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_TIER_ARG + "${Tier} ";
      }
    }

    //if Server checkbox is checked at configuration time then add -S in options
    if (this.rSFlag) {
      if (formData.executeRemote && this.remoteServerName && this.remoteServerName != '') {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_SERVER_ARG] = this.remoteServerName;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_SERVER_ARG + me.generateOption(CUST_CONST.CMD_SERVER_ARG, monData.type);
      }
    }

    if (formData.executeRemote) {
      if (formData.rS != 'ct') {
        if (this.rSFlag && this.remoteServerName.trim() != formData.rS.trim()) {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_SERVER_ARG] = formData.rS;
          newOpt = newOpt + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_SERVER_ARG, monData.type);
        }
        else {
          me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_SERVER_ARG] = this.remoteServerName;
          newOpt = newOpt + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_SERVER_ARG, monData.type);
        }
      }
      else {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_HOST_ARG] = formData.rS;
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_REMOTE_SERVER_ARG + me.generateOption(CUST_CONST.CMD_REMOTE_HOST_ARG, monData.type);
      }
    }
    else // in case of agent with no remote settings.
    {
      let dbHostIP = "";
      dbHostIP = LONG_ARG.LONG_FORMAT_HOST_ARG + LONG_ARG.SPACE_SEPARATOR + COMPONENT.LOCAL_HOST + LONG_ARG.SPACE_SEPARATOR

      if (this.rSFlag) {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_HOST_ARG] = "${Server}";
        newOpt = newOpt + LONG_ARG.LONG_FORMAT_SERVER_ARG + " ${Server} " + dbHostIP;
      }
      else {
        me.monParams[COMPONENT.UNDERSCORE + monData.type + CUST_CONST.CMD_REMOTE_HOST_ARG] = formData.host;
        newOpt = newOpt + dbHostIP
      }
    }
    return newOpt;
  }

  createDBParams(options) {
    let dbParam = "";
    for (let i = 0; i < options.length; i++) {
      dbParam = dbParam + "$" + options[i].pattern + "=" + options[i].upVal + ";";
    }
    return dbParam.substring(0, dbParam.length - 1);
  }

  // Method called for creating options and deployment option in case of dependentComp Monitors
  createSpecificMonOptions(compItem: any, monName: any, monGrp?: any) {
    let specificObj = []
    compItem.map(eachComp => {
      let key = this.setAppCPJHInstance(eachComp.type, monGrp)
      let value = eachComp.value; // holds the current textfield value 
      eachComp[COMPONENT.MON_TYPE] = monName;

      if (eachComp.type === COMPONENT.OTHER_TYPE && value) {
        this.deploymentOption[key + COMPONENT.UNDERSCORE + monName] = value;
      }

      else if (eachComp.type === COMPONENT.INSTANCE && value) {

        if (eachComp[COMPONENT.USE_AS_OPTION] != "")
          this.deploymentOption[key + COMPONENT.UNDERSCORE + monName] = eachComp[COMPONENT.USE_AS_OPTION] + COMPONENT.SPACE_SEPARATOR + value;
        else
          this.deploymentOption[key + COMPONENT.UNDERSCORE + monName] = value;
      }
      else if (eachComp.type === COMPONENT.FIELDSETLABEL_TYPE) {
        if (eachComp.args != "" && eachComp.value != "") {
          this.getFieldSetInlineOptions(eachComp, eachComp[COMPONENT.MON_TYPE]) // to handle case where fieldset has own value such as accesslog
        }
        else {
          this.createSpecificMonOptions(eachComp[COMPONENT.DEPENDENT_COMP], eachComp[COMPONENT.MON_TYPE])
        }
      }
      else if (eachComp.type === COMPONENT.DEPENDENT_COMP) {
        this.createSpecificMonOptions(eachComp[COMPONENT.DEPENDENT_COMP], eachComp[COMPONENT.MON_TYPE]);
      }
      else if (eachComp.type === COMPONENT.DROPDOWN_TYPE) {
        specificObj = this.getDropdownOptions(eachComp, eachComp[COMPONENT.MON_TYPE]);
      }
      else if (eachComp.type === COMPONENT.RADIOBUTTONGROUP_TYPE) {
        this.getRadioButtonOptions(eachComp, eachComp[COMPONENT.MON_TYPE]);
      }
      else if (eachComp.type === COMPONENT.TABLE_TYPE) {
        specificObj = this.getTableInlineOptions(eachComp, eachComp[COMPONENT.MON_TYPE])
      }
      else if (eachComp.type === COMPONENT.CHECKBOX_TYPE) {
        specificObj = this.getCheckBoxOptions(eachComp, eachComp[COMPONENT.MON_TYPE])
      }
      else if (eachComp.type === COMPONENT.TEXTFIELD_TYPE) {
        specificObj = this.getTextFieldOptions(eachComp, eachComp[COMPONENT.MON_TYPE])
      }
      else if (eachComp.type === COMPONENT.TABLESINGLEARG_TYPE) {
        specificObj = this.getTableSingleArgOptions(eachComp, eachComp[COMPONENT.MON_TYPE])
      }
      else if (value) // add when is not empty
      {
        this.deploymentOption[eachComp.key + COMPONENT.UNDERSCORE + monName] = eachComp.args + " " + value;
      }
    })
    return specificObj;
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  onTierChange(data) {
    let me = this;
    let tier = data.tier;
    if (data.tier === "ALLtier")
      tier = "All Tiers";

    data.actualServer = "";
    data.exServer = [];
    data.server = [];
    data.exTier = [];

    let tierInfo = _.find(me.tierHeadersList, function (each) { return each['label'] == tier })
    me.loading = true;
    me.monitorupdownService.getServerList(tierInfo.value).subscribe(res => {
      me.loading = false;
      me.cd.detectChanges();
      let dName = [];
      let sName = [];
      res.map(each => {
        if (each['id'] >= 0) {
          sName.push(each['sName']);
          dName.push(each['dName']);
        }
      })
      // for bug 110920 we have added serverList per row so that unique serverlist is maintained.
      data.serverList = UtilityService.createListWithKeyValue(dName, sName);
      if (data.serverList && data.serverList.length > 0)
        data['exServerList'] = [...data.serverList];
    })

    if (data.tier === "ALLtier") {
      me.exTierList = me.tierList.filter(val => {
        return val.value != "ALLtier"
      })
    }

  }

  addServerFilter() {
    if (!this.validateTierServer(this.serverFilter)) { return false; }

    this.serverFilter.push({
      id: this.serverFilter.length,
      tier: "",
      actualServer: "",
      server: [],
      exServer: [],
      exTier: [],
    });
  }

  onServerChange(tierServerInfo) {
    // for bug 110920
    if (tierServerInfo.actualServer === -1)
      tierServerInfo['exServerList'] = tierServerInfo.serverList;
  }

  validateRequired() {
    const me = this;
    let optData = "";
    me.formData.map(function (each: any) {
      // if (each[COMPONENT.MON_TYPE]) {
      //   let obj = me.specificMonMap.get(each[COMPONENT.MON_TYPE])
      //   obj[COMPONENT.ENABLED] = each[COMPONENT.ENABLED];
      //   me.specificMonMap.set(each[COMPONENT.MON_TYPE], obj)
      //   if (each[COMPONENT.DEPENDENT_COMP]) {
      //     me.createSpecificMonOptions(each[COMPONENT.DEPENDENT_COMP], each[COMPONENT.MON_TYPE], each[COMPONENT.MON_GROUP]);
      //   }
      // }
      if (each[COMPONENT.INTERNAL_MON_NAME]) {
        let obj = me.specificMonMap.get(each[COMPONENT.INTERNAL_MON_NAME])
        obj[COMPONENT.ENABLED] = each[COMPONENT.ENABLED];
        me.specificMonMap.set(each[COMPONENT.INTERNAL_MON_NAME], obj)
        if (each[COMPONENT.DEPENDENT_COMP]) {
          me.createSpecificMonOptions(each[COMPONENT.DEPENDENT_COMP], each[COMPONENT.INTERNAL_MON_NAME], each[COMPONENT.MON_GROUP]);
        }
      }
      if (each[COMPONENT.TYPE] != COMPONENT.NEWLINE && each[COMPONENT.TYPE] != COMPONENT.NOTE_TAG) {
        me.getComponentData(each);
      }
    })

    let specificMonValArr = [];
    for (let entry of this.specificMonMap.entries()) {
      if (entry[1][COMPONENT.MON_CATEGORY] == COMPONENT.CMD_TYPE)
        optData = me.createOptionsForCmdDeployment(me.cmdData, entry[1]);

      if (entry[1][COMPONENT.MON_CATEGORY] == COMPONENT.DB_TYPE) {
        let dbConnObj = me.createDBConnectionOptions(me.dbData, entry[1]);
        let useHierObj = me.createUseAsHierarchyOptions(me.dbData, entry[1]);
        optData = dbConnObj + useHierObj;
      }

      if (entry[1][COMPONENT.MON_CATEGORY] == COMPONENT.JMX_TYPE) {
        specificMonValArr.push(entry[1])
        optData = me.createOptionsForJMXDeployment(me.jmxData, entry[1]);
      }

      me.deploymentOption[entry[1][COMPONENT.MON_CATEGORY]] = optData;
    }

    me.setRequiredPropertyForCustMon(specificMonValArr); // added for handling required in case of jmx monitor
    me.setRequiredPropForEnabledMon();
  }


  setRequiredPropertyForCustMon(specificMonVal) {
    let arr = [];
    for (let i = 0; i < specificMonVal.length; i++) {
      if (specificMonVal[i].enabled) {
        arr.push(specificMonVal[i].enabled)
      }
      if (arr.length > 0) {
        this.monitorupdownService.validateAtSaveForRequiredProp(true);
      }
      else {
        this.monitorupdownService.validateAtSaveForRequiredProp(false);
      }
    }
  }

  //Method called to show/hide other arguments on basis of toggle
  toggle(node) {
    node.isShow = !node.isShow; // for bug 111238
    node['dependentComp'].map(function (eachItem: any) {
      if (eachItem['type'] === "other") {
        if (eachItem['type'] === "other") {
          eachItem['validationObj']['hidden'] = node.isShow;
        }
      }
    })
  }

  handleData(useGlobal) {
    let me = this;
    if (useGlobal.checked) {
      this.loading = true;
      this.monitorupdownService.useGloablConfig("-1", "-1", this.techName).subscribe(res => {
        me.formData = [];
        me.monCategory = [];
        me.specificMonMap = new Map();
        // me.getDrivenJsonDataNew(res['cmpInfo']);
        me.renderUI(res['cmpInfo']);
        this.loading = false;
        me.cd.detectChanges();
      })
    }
    else if (me.operation === "update") {
      this.loading = true;
      this.monitorupdownService.useGloablConfig(me.gMonId, "-1", this.techName).subscribe(res => {
        me.formData = [];
        me.monCategory = [];
        me.specificMonMap = new Map();
        // me.getDrivenJsonDataNew(res['cmpInfo']);
        me.renderUI(res['cmpInfo']);
        this.loading = false;
        me.cd.detectChanges();
      })
    }
  }

  //Method to check it is special tag
  isSpecificTag(eachDepenComp) {
    if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.JAVAHOME && eachDepenComp[COMPONENT.TYPE] != COMPONENT.CLASSPATH &&
      eachDepenComp[COMPONENT.TYPE] != COMPONENT.ISPROCESS && eachDepenComp[COMPONENT.TYPE] != COMPONENT.NOTE_TAG &&
      eachDepenComp[COMPONENT.TYPE] != COMPONENT.AGENT_TYPE && eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE &&
      eachDepenComp[COMPONENT.TYPE] != COMPONENT.APPNAME && eachDepenComp[COMPONENT.TYPE] != COMPONENT.EXCLUDE_APP &&
      eachDepenComp[COMPONENT.TYPE] != COMPONENT.TIER_TYPE && eachDepenComp[COMPONENT.TYPE] != COMPONENT.TIER_TYPE &&
      eachDepenComp[COMPONENT.TYPE] != COMPONENT.INSTANCE) {
      return true;
    }
    else
      return false;
  }

  getTierServerInfo() {
    let me = this;
    let tierServerInfo: any[] = [];
    //used for filling tier/server and table data
    me.serverFilter.map(each => {
      let tSObj = {};
      let servers = "";
      let tierStr = "";
      if (each['tier'] == "") {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please select tier." });
        return;
      }
      tSObj['tier'] = each['tier'];
      if (each['tier'] == "All") {
        tSObj['server'] = "All";
        each['exTier'].map(tier => {
          tierStr = tierStr + tier + ",";
        })
        tierStr = tierStr.substring(0, tierStr.length - 1);
        tSObj['exTier'] = tierStr;
        tSObj['server'] = "All Servers";
      }
      else {
        if (each['actualServer'] == -1) {
          tSObj['server'] = "All";
          each['exServer'].map(server => {
            servers = servers + server + ",";
          })
          servers = servers.substring(0, servers.length - 1);
          tSObj['exServer'] = servers;
        }
        else if (each['actualServer'] == -2) {
          tSObj['server'] = "Any";
        }
        else {
          servers = servers.substring(0, servers.length - 1);
          tSObj['server'] = servers;
        }
      }
      tierServerInfo.push(tSObj);
    })

  }

  validateTierServerInfo(tierServerInfo) {
    tierServerInfo.map(each => {
      if (!each.tier) {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please select tier." });
        return false;
      }
      if (each.server.length != 0) {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please select server." });
        return false;
      }
    })
    return true;

  }

  // Method called on checkbox change to handle enable/disable of dependent fields.
  addDisableValidationForCheckbox(node) {
    let me = this;
    if (node[COMPONENT.DEPENDENT_COMP]) {
      node.dependentComp.forEach((value) => {
        if (node.value) {
          if (value.validationObj) {
            value.validationObj.disabled = false;
            me.disableCheckboxData(value, value.validationObj.disabled);
          }
        } else {
          if (value.validationObj) {
            value.validationObj.disabled = true;
            me.disableCheckboxData(value, value.validationObj.disabled);
          }
        }
      });
    }
  }
  //adding disble validation for dependent components of checkbox on click of checkbox
  disableCheckboxData(compData, isDisabled) {
    if (compData.validationObj) {
      compData.validationObj.disabled = isDisabled;
    }
  }

  //Method added for handling enable/disable for checkbox dependent component.
  addDisableProperty(node) {
    let me = this;
    if (node.type === COMPONENT.CHECKBOX_TYPE) {  // commented for disabling all dependent comp data instead of only checkbox used in accesslog monitor - 20th may
      if (node.dependentComp != null) {
        node.dependentComp.forEach((v) => {
          let nodeBoolValue = node.value == 'true';
          if (nodeBoolValue) {
            if (v.validationObj) {
              v.validationObj.disabled = false;
              if (v[COMPONENT.DEPENDENT_COMP]) {
                me.addDepCompValidation(v[COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
              }
            }
          } else {
            if (v.validationObj) {
              v.validationObj.disabled = true;
              if (v[COMPONENT.DEPENDENT_COMP]) {
                me.addDepCompValidation(v[COMPONENT.DEPENDENT_COMP], v.validationObj.disabled);
              }
            }
          }
        });
      }
    }
  }

  //Method called on cancel click in edit mode 
  resetToAdd() {
    this.clearFormFields();
    this.AddEditLabel = "Add";
  }

  // Method called to clear input component fields.
  clearFormFields() {
    this.AddEditLabel = "Add";
    this.loading = true;
    this.formData = [];
    this.specificMonMap = new Map();
    this.monCategory = [];
    this.gMonId = "-1";
    this.objectId = "-1";
    this.operation = "add";
    this.reConfId = "-1"
    this.index = 0
    this.monitorupdownService.getMonitorConfigurationAtEdit(this.techName).subscribe(res => {
      this.renderUI(res['cmpInfo']);
      this.cd.detectChanges();
    })
    this.jmxData = new JmxData();
    this.cmdData = new CmdData();
    this.dbData = new DbData();
    for (let i = 0; i < this.serverFilter.length; i++) {
      this.serverFilter[i]['tier'] = "";
      this.serverFilter[i]['server'] = [];
      this.serverFilter[i]['id'] = 0;
      this.serverFilter[i]['actualServer'] = ""
      this.serverFilter[i]['exTier'] = [];
      this.serverFilter[i]['exServer'] = [];
      this.serverFilter[i]['serverList'] = [];
      this.serverFilter[i]['exServerList'] = [];
    }
    if (this.serverFilter.length > 1) {
      this.serverFilter = this.serverFilter.slice(0, 1);
    }

    this.monitorupdownService.validateAtSaveForRequiredProp(true);
    this.monParams = {};
    this.deploymentOption = {};
    this.monGrpMap = [];
    this.isUseGlobal = false; // reset isUseGlobal flag to default false.
    this.monGrpStateArr = []
  }

  //adding disble validation for dependent components 
  validateRequiredCompValidation(compData, isRequired) {

    let me = this;
    compData.map((v, k) => {

      if (v[COMPONENT.TYPE] !== COMPONENT.OTHER_TYPE && v[COMPONENT.TYPE] !== COMPONENT.NOTE_TAG) {
        if (v[COMPONENT.TYPE] !== COMPONENT.RADIOBUTTONGROUP_TYPE) {
          if (v.validationObj) {
            if (v['validationObj']['defRequired']) {
              v['validationObj']['required'] = isRequired
            }

            if (v[COMPONENT.DEPENDENT_COMP]) {
              me.validateRequiredCompValidation(v[COMPONENT.DEPENDENT_COMP], isRequired);
            }

            if (v[COMPONENT.DROP_DOWN_LIST_ITEMS]) // for bug 108891
            {
              v[COMPONENT.DROP_DOWN_LIST_ITEMS].map(function (eachDropDownItem) {
                if (eachDropDownItem[COMPONENT.DEPENDENT_COMP]) {
                  me.validateRequiredCompValidation(eachDropDownItem[COMPONENT.DEPENDENT_COMP], isRequired);
                }
              })
            }

          }
        }
        else {
          if (v[COMPONENT.ITEMS_KEY]) {
            me.validateRequiredCompValidation(v[COMPONENT.ITEMS_KEY], isRequired);
          }

          if (v[COMPONENT.DROP_DOWN_LIST_ITEMS]) {
            me.validateRequiredCompValidation(v[COMPONENT.DROP_DOWN_LIST_ITEMS], isRequired);
          }
        }
      }
    })
  }

  createCheckBoxDepOptions(compItem: any, monName) {
    let dep: any = [];
    let me = this;
    let depCompOption = "";
    let value = compItem.value; // holds the current checkbox value 

    if (value) {
      if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
        compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
          if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
            if (!eachDepenComp['args']) {
              eachDepenComp['args'] = compItem.args;
            }

            me.createSpecificMonOptions(compItem[COMPONENT.DEPENDENT_COMP], monName)

            // depCompOption = depCompOption + eachDepenComp['args'] + " " +  eachDepenComp['value'] + " ";
          }
        })
      }
      else {
        depCompOption = compItem.args; // --isOverall  
      }
    }
    me.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = depCompOption;
  }

  // ------------------------- NEW METHOD IMPLEMENTATION --------------------------

  // Method for creating deployment options for textfield component.
  getTextFieldOptions(compItem: any, monName?: string) {
    let option: any = {};
    let finalObj: any = [];
    let value = compItem.value; // holds the current textfield value 
    if (!isNaN(value)) {	    //converting decimal number to string value
      value = String(value)
    }
    this.updateConfMonitorArr(compItem);
    if (value) // add when value is not empty
    {
      if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.INPUT_TYPE] != COMPONENT.TYPE_PASSWORD)// case when we get input type as "password" we skip that field and do not show in the argument data(i.e in gui) but send it to the server.
      {
        if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE]) {
          value = encodeURIComponent(value);
        }

        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true") //this is used for adding at start end doubleQuotesVal
          value = "\"" + value + "\"";
      }
      else // case when inputType is password and we add that field value to the "options"
      {
        if (compItem[COMPONENT.VALIDATION_OBJ][COMPONENT.PWD_ENCRYPT_VAL]) {
          value = COMPONENT.PASSWORD_SEPERATOR + value + COMPONENT.PASSWORD_SEPERATOR;
        }
      }

      if (monName) {
        let key = compItem.key;
        this.deploymentOption[key + COMPONENT.UNDERSCORE + monName] = compItem.args + " " + value;
        finalObj.push({ "val": compItem.args + " " + value });
        return finalObj;
      }
      else {
        option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";  // instance: "--vecPrefix  ${instance}
        this.monParams[compItem.key] = value;
        this.deploymentOption[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
        finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
        return finalObj;
      }
    }

  }

  // Method for creating deployment options for RadioButton component.
  getRadioButtonOptions(compItem: any, monName?: string) {
    let dep: any = [];
    let value = compItem.value; // holds the current textfield value 
    let selectedObj = _.find(compItem['items'], function (each: any) { return each.value == compItem.value })
    let dependentCompOption = "";
    let specificMonOption = "";
    let that = this;
    this.updateConfMonitorArr(compItem);
    //If dependent component is present
    if (selectedObj[COMPONENT.DEPENDENT_COMP] != null) {
      selectedObj[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {
        let arr = [];
        arr.push(eachDepenComp);


        if (eachDepenComp.type && !eachDepenComp.args) {
          eachDepenComp.args = selectedObj.args;
        }

        if (monName) {
          let obj: any[] = [];
          obj = that.createSpecificMonOptions(arr, monName);
          if (obj && obj.length > 0) {
            specificMonOption = specificMonOption + obj[0]['val'] + " ";

          }
        }
        else {
          if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
            dep = that.getComponentData(eachDepenComp);
            if (eachDepenComp.type && dep && dep[0][COMPONENT.OPTIONS_KEY]) //handling when type is blank 
            {
              dependentCompOption = dependentCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + COMPONENT.SPACE_SEPARATOR;
            }
          }
        }
      })
    }
    else // if there is only radiobutton
    {
      if (monName) {
        if (selectedObj.args === selectedObj.value) {
          specificMonOption = selectedObj.args;
        }
        else
          specificMonOption = selectedObj.args + " " + selectedObj.value;

        this.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = specificMonOption.trim()
      }
      else {
        this.monParams[selectedObj.key] = value; //  instance : value;
        //Below check is added for endeca.json radio where none is present in first item so that it does add ${} in depOptions
        if (selectedObj.type && selectedObj.key && selectedObj.args)
          dependentCompOption = selectedObj.args + "  ${" + selectedObj.key + "}";
      }
    }

    if (monName) {
      this.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = specificMonOption.trim()
    }
    else {
      if (dependentCompOption) //Below check is added for endeca.json radio where none is present in first item so that it does add ${} in depOptions
        this.deploymentOption[compItem.key] = dependentCompOption;
    }
  }

  // Method for creating deployment options for Checkbox component
  getCheckBoxOptions(compItem: any, monName?: string) {
    let dep: any = [];
    let option: any = {};
    let finalObj: any = [];
    let that = this;
    let depCompOption = "";
    let value = compItem.value; // holds the current checkbox value 

    if (value === "false") // for bug 108633
      value = false;

    this.updateConfMonitorArr(compItem)

    if (value) {
      if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
        compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {

          if (eachDepenComp[COMPONENT.TYPE] != COMPONENT.NEWLINE) {
            if (!eachDepenComp['args']) {
              eachDepenComp['args'] = compItem.args;
            }


            if (monName) {
              let arr = [];
              arr.push(eachDepenComp);

              let obj: any[] = [];
              obj = that.createSpecificMonOptions(arr, monName);
              if (obj && obj.length > 0) {
                depCompOption = depCompOption + obj[0]['val'] + " ";
              }
            }
            else {
              option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
              dep = that.getComponentData(eachDepenComp);
              if (dep && dep[0][COMPONENT.OPTIONS_KEY]) {
                depCompOption = depCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
              }
            }
          }
        })
      }
      else {
        if (monName) {
          depCompOption = compItem.args; // --isOverall  
        }
        else {
          /**
           * If checkbox is only present with no dep comp that means only argument has to send 
           * to db for save so replacing value with blnk.
           */
          this.monParams[compItem.key] = "";
          depCompOption = compItem.args + "  ${" + compItem.key + "}";
        }
      }

      if (monName) {
        that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = depCompOption;
        finalObj.push({ "val": depCompOption });
        return finalObj;
      }
      else {
        this.deploymentOption[compItem.key] = depCompOption;
        option[compItem.key] = compItem.args + "  ${" + compItem.key + "}"; // added for handling case in akmai rest based monitor.
        finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
        return finalObj;
      }
    }
  }

  // Method for creating deployment options for dropdown component 
  getDropdownOptions(compItem: any, monName?: string) {
    let dep: any = [];
    let finalObj: any = [];
    let option: any = {};
    let that = this;
    let value = compItem['value'];
    let depCompOption = "";
    this.updateConfMonitorArr(compItem);

    compItem[COMPONENT.DROP_DOWN_LIST_ITEMS].map(eachComp => {
      if (value == "") {
        if (eachComp[COMPONENT.DEPENDENT_COMP]) {
          eachComp[COMPONENT.DEPENDENT_COMP].map(each => {
            if (compItem.args) // for 111348 - where dropdown is selected as none so it has no arg.To handled from being written in depOptions without args which break code in edit mode.
            {
              option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
              that.monParams[compItem.key] = each.value;
            }
          })
        }
      }
      else if (value === eachComp[COMPONENT.VALUE]) {
        if (eachComp[COMPONENT.DEPENDENT_COMP]) {
          eachComp[COMPONENT.DEPENDENT_COMP].map(function (each: any) {
            if (!each.args) {
              each.args = compItem.args //assigning dropdown argument to depcomp arg if it is blank
            }

            if (monName) {
              if (each[COMPONENT.TYPE] == COMPONENT.TIER_TYPE) {
                that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = COMPONENT.TIER_TYPE + "||" + each[COMPONENT.ARGS] + "||" + each.valObj;
              }
              else if (each[COMPONENT.TYPE] == COMPONENT.INSTANCE) {
                if (each[COMPONENT.USE_AS_OPTION] != "")
                  that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = COMPONENT.INSTANCE + "||" + each[COMPONENT.ARGS] + "||" + each.value;
                else
                  that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = COMPONENT.INSTANCE + "||" + each.value;
              }
              else {
                that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = each[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + each.value;
              }
              finalObj.push({ "val": each[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + each.value })
              return finalObj;
            }
            else {
              dep = that.getComponentData(each);
              if (dep && dep[0][COMPONENT.OPTIONS_KEY])
                depCompOption = depCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + COMPONENT.SPACE_SEPARATOR

              option[compItem.key] = depCompOption.trim();
            }
          })
        }
        else {
          if (monName) {
            that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = compItem[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + value;
            finalObj.push({ "val": compItem[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + value })
            return finalObj;
          }
          else {
            that.monParams[compItem.key] = value;
            option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
          }
        }
      }
    })
    if (!monName) {
      finalObj.push({ "dep": that.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
      return finalObj;
    }
  }

  getTableOptions(compItem: any, monName?: string) {
    let that = this;
    let option: any = {};
    let finalObj: any = [];
    if (compItem[COMPONENT.TABLE_DATA]) {
      let tableVal = "";
      let str = "";

      if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
        str = str + "\"";

      compItem[COMPONENT.TABLE_DATA].map(val => {
        compItem[COMPONENT.COLUMNDATA].map(each => {
          if (each.type != COMPONENT.NOTE_TAG) {
            let uiKeyVal = each.label;
            if (each.type === COMPONENT.DROPDOWN_TYPE) {
              uiKeyVal = "ui-" + each.label;
            }
            let value = val[uiKeyVal];

            if (each[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
              value = encodeURIComponent(value);

            if (each[COMPONENT.IS_QUOTE_REQUIRED] == "true")
              value = "'" + value + "'";

            if (each.args)
              str = str + each.args + ":" + value + ",";
            else
              str = str + value + ",";
          }
        })

      })
      str = str.substring(0, str.length - 1);
      if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
        str = str + "\"";

      tableVal = "[" + str.trim() + "]";

      if (monName) {
        that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = compItem.args + COMPONENT.SPACE_SEPARATOR + tableVal;
        finalObj.push({ "val": compItem.args + COMPONENT.SPACE_SEPARATOR + tableVal })
        return finalObj;
      }
      else {
        that.monParams[compItem.key] = tableVal;
        option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
        finalObj.push({ "dep": that.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
        return finalObj;
      }
    }
  }

  getTableSingleArgOptions(compItem: any, monName?: string) {
    let that = this;
    let value = "";
    let option: any = {};
    let finalObj: any = [];
    if (compItem[COMPONENT.TABLE_DATA]) {
      let rowVal = "";
      compItem[COMPONENT.TABLE_DATA].map(val => {
        let colVal = "";
        compItem[COMPONENT.COLUMNDATA].map(each => {
          if (each._grp) {
            if (each._grp && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(each._grp) === -1) {
              if (each._grp != 'global')
                this.monGrpStateArr.push({ 'gn': each._grp, 'gdn': each._grpDisp });
            }
          }
          else // case comes here when inner specific components are checked.
          {
            let grp;
            grp = this.getMonGrpFromKey(each.key)
            if (grp && grp != 'global' && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(grp) === -1) {
              this.monGrpStateArr.push({ 'gn': grp, 'gdn': this.getMonitorGroupDisplayName(grp) });
            }
          }
          if (each.type != COMPONENT.NOTE_TAG) {
            let uiKeyVal = each.label;
            if (each.type === COMPONENT.DROPDOWN_TYPE) {
              uiKeyVal = "ui-" + each.label;
            }

            if (compItem[COMPONENT.KEY_VALUE_SEPARATOR]) {
              if (each.args)
                colVal = colVal + each.args + compItem[COMPONENT.KEY_VALUE_SEPARATOR] + val[uiKeyVal] + compItem[COMPONENT.COLUMN_SEPERATOR];
              else
                colVal = colVal + val[uiKeyVal] + compItem[COMPONENT.COLUMN_SEPERATOR];
            }
            else {
              colVal = colVal + val[uiKeyVal] + compItem[COMPONENT.COLUMN_SEPERATOR];
            }
          }
        })
        rowVal = colVal.substring(0, colVal.length - 1);
        value = value + rowVal + compItem[COMPONENT.ROW_SEPERATOR];
      })
      value = value.substring(0, value.length - 1);
      if (monName) {
        that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = compItem.args + COMPONENT.SPACE_SEPARATOR + value
        finalObj.push({ "val": compItem.args + COMPONENT.SPACE_SEPARATOR + value })
        return finalObj
      }
      else {
        that.monParams[compItem.key] = value;
        option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
        this.deploymentOption[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
        finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
        return finalObj;
      }

    }
  }

  // Need to remove this as this tag will not be supported.
  getUseMultipleAsSingleValueTagOptions(compItem: any, monName?: string) {
    let that = this;
    let option: any = {};
    let finalObj: any = [];
    let dep: any = [];
    let value = "";
    let depCompOption = "";

    if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
      compItem[COMPONENT.DEPENDENT_COMP].map(function (eachComp) {
        if (eachComp[COMPONENT.IS_QUOTE_REQUIRED] == "true") //this is used for adding at start end doubleQuotesVal
          eachComp.value = "\"" + eachComp.value + "\"";

        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
          value = "\"" + eachComp.args + COMPONENT.SPACE_SEPARATOR + eachComp.value + "\"";

        value = encodeURIComponent(value);

        eachComp[COMPONENT.IS_QUOTE_REQUIRED] = false;
        dep = that.getComponentData(eachComp);
        if (dep[0][COMPONENT.OPTIONS_KEY])
          depCompOption = depCompOption + dep[0][COMPONENT.OPTIONS_KEY].toString() + COMPONENT.SPACE_SEPARATOR
      })
      this.monParams[compItem.key] = value;
      this.deploymentOption[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
    }
  }

  //Method to add validation for instance name, host, port and username.
  isMonConfigurationValid(compData: any[]): boolean {
    try {
      if (!compData)
        compData = [];

      for (let index = 0; index < compData.length; index++) {
        let compArgs: any = compData[index];


        // dependentComp
        if (compArgs['dependentComp'] != null) {
          let flag = this.isMonConfigurationValid(compArgs['dependentComp']);

          if (!flag)
            return flag;
        }
        else if (compArgs[COMPONENT.TYPE] == 'TextField' || compArgs[COMPONENT.TYPE] == 'instanceName') {
          let methodName: string = compArgs['validationObj']['method'] || null;
          let index = -1;
          if (methodName) {
            index = methodName.indexOf("(");
            if (index != -1)
              methodName = methodName.substring(0, index)
          }
          if (methodName && compArgs['value']) {
            let returnMsg = this.validationServiceObj[methodName](compArgs['value']);
            if (returnMsg) {
              this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: returnMsg });
              return false;
            }
          }
        }
      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  renderUI(res) {
    try {
      let me = this;
      Object.keys(res).map(each => {
        if (each != COMPONENT.TIER_INFO) {
          if (each === COMPONENT.MON_GRP_GLOBAL) // for global components
          {
            if (res[each][COMPONENT.COMPONENTS_KEY] && res[each][COMPONENT.COMPONENTS_KEY].length != 0 && res[each][COMPONENT.COMPONENTS_KEY][0][COMPONENT.DRIVEN_KEY][COMPONENT.COMPONENT_KEY]) {
              me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0][COMPONENT.DRIVEN_KEY][COMPONENT.COMPONENT_KEY],
                COMPONENT.COMPONENT_KEY, "", COMPONENT.MON_GRP_GLOBAL, COMPONENT.GRP_DISP_NAME_GLOBAL)
            }

            let grpKeys = Object.keys(res[each]);
            grpKeys.map(noGrpComp => {
              if (noGrpComp != COMPONENT.COMPONENTS_KEY && noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp, key) => {
                  let otherKey = Object.keys(eachComp);

                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], COMPONENT.COMPONENT_KEY,
                    eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY], eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                    noGrpComp, otherKey[0], COMPONENT.MON_GRP_GLOBAL, COMPONENT.GRP_DISP_NAME_GLOBAL);
                })
              }
            })
          }
          else if (each === COMPONENT.MON_GRP_OTHERS)  // for other monitor components
          {
            me.isOtherMon = true;
            let grpKeys = Object.keys(res[each]);
            if (res[each][COMPONENT.COMPONENTS_KEY] != null && res[each][COMPONENT.COMPONENTS_KEY].length != 0 && res[each][COMPONENT.COMPONENTS_KEY][0][COMPONENT.DRIVEN_KEY][COMPONENT.COMPONENT_KEY]) {
              me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0][COMPONENT.DRIVEN_KEY][COMPONENT.COMPONENTS_KEY],
                "other", "", COMPONENT.MON_GRP_OTHERS, COMPONENT.GRP_DISP_NAME_OTHERS)
            }
            grpKeys.map(noGrpComp => {
              if (noGrpComp != COMPONENT.COMPONENTS_KEY && noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp, key) => {
                  let otherKey = Object.keys(eachComp);
                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], "other", eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY], eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                    noGrpComp, otherKey[0], COMPONENT.MON_GRP_OTHERS, COMPONENT.GRP_DISP_NAME_OTHERS);
                })
              }
            })
          }
          else if (each === COMPONENT.MON_GRP_CMD) // for custom monitor components
          {
            me.isCMD = true;
            let grpKeys = Object.keys(res[each]);
            grpKeys.map(noGrpComp => {
              if (noGrpComp === COMPONENT.COMPONENTS_KEY) {
                if (res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY])
                  me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY],
                    "cmd", "", COMPONENT.MON_GRP_CMD, COMPONENT.GRP_DISP_NAME_CMD)
              }
              else if (noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp, key) => {
                  let otherKey = Object.keys(eachComp);
                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], "cmd", eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY], eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                    eachComp[otherKey[0]][COMPONENT.MON_TYPE], otherKey[0], COMPONENT.MON_GRP_CMD,
                    COMPONENT.GRP_DISP_NAME_CMD);

                  me.getCustomMonData(eachComp, otherKey[0], "cmd", noGrpComp);
                })
              }
            })
          }
          else if (each === COMPONENT.MON_GRP_DB) // for custom monitor components
          {
            me.isDB = true;
            let grpKeys = Object.keys(res[each]);
            grpKeys.map(noGrpComp => {
              if (noGrpComp === COMPONENT.COMPONENTS_KEY) {
                if (res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY])
                  me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY],
                    "db", "", COMPONENT.MON_GRP_DB, COMPONENT.GRP_DISP_NAME_DB)
              }
              else if (noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp, key) => {
                  let otherKey = Object.keys(eachComp);
                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], "db", eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY], eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                    eachComp[otherKey[0]][COMPONENT.MON_TYPE], otherKey[0], COMPONENT.MON_GRP_DB, COMPONENT.GRP_DISP_NAME_DB);

                  me.getCustomMonData(eachComp, otherKey[0], "db", noGrpComp);
                })
              }
            })
          }
          else if (each === COMPONENT.MON_GRP_JMX) // for custom monitor components
          {
            me.isJMX = true;
            let grpKeys = Object.keys(res[each]);
            grpKeys.map(noGrpComp => {
              if (noGrpComp === COMPONENT.COMPONENTS_KEY) {
                if (res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY])
                  me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY],
                    "jmx", "", COMPONENT.MON_GRP_JMX, COMPONENT.GRP_DISP_NAME_JMX)
              }
              else if (noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp, key) => {
                  let otherKey = Object.keys(eachComp);
                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], "jmx", eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY],
                    eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                    eachComp[otherKey[0]][COMPONENT.MON_TYPE], otherKey[0],
                    COMPONENT.MON_GRP_JMX, COMPONENT.GRP_DISP_NAME_JMX);

                  me.getCustomMonData(eachComp, otherKey[0], "jmx", noGrpComp);
                })
              }
            })
          }
          else {
            me.monCategory.push(res[each]["label"]);
            let grpKeys = Object.keys(res[each]);
            if (res[each][COMPONENT.COMPONENTS_KEY] != null && res[each][COMPONENT.COMPONENTS_KEY].length != 0) {
              me.getMonData(res[each][COMPONENT.COMPONENTS_KEY][0]["driven"][COMPONENT.COMPONENT_KEY],
                res[each]["label"], "", each, res[each]["label"])
            }

            grpKeys.map(noGrpComp => {
              if (noGrpComp != COMPONENT.COMPONENTS_KEY && noGrpComp != "label" && res[each][noGrpComp]) {
                res[each][noGrpComp].map((eachComp) => {
                  let otherKey = Object.keys(eachComp); // monitor name

                  // me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], 
                  //   res[each]["label"],
                  //   eachComp[otherKey[0]][COMPONENT.ENABLED],
                  //   eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY],
                  //   eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME], 
                  //   eachComp[otherKey[0]][COMPONENT.MON_TYPE],
                  //   eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME],
                  //   each,  
                  //   res[each]["label"]);
                  me.getSpecificData(eachComp[otherKey[0]][COMPONENT.COMPONENT_KEY], res[each]["label"],
                    eachComp[otherKey[0]][COMPONENT.ENABLED],
                    eachComp[otherKey[0]][COMPONENT.OPTIONS_KEY],
                    eachComp[otherKey[0]][COMPONENT.INTERNAL_MON_NAME], eachComp[otherKey[0]][COMPONENT.MON_TYPE],
                    otherKey[0], each, res[each]["label"]);
                })
              }
            })
          }
        }
      })
      this.loading = false;
      console.log("----------------------- At rendering  specificMonMap -------->", me.specificMonMap)
      console.log(" ---------------------- At rendering  formData -------->", me.formData)
    }
    catch (e) {
      this.loading = false;
      console.log("Method renderUI called.Error=", e)

    }
  }

  allMonEnable() {
    let that = this;
    let disableAddFlag = false;
    for (let entry of that.specificMonMap.entries()) {
      if (entry[1]['enabled']) {
        return disableAddFlag = true;
      }
    }
    return disableAddFlag;
  }

  setRequiredPropForEnabledMon() {
    let that = this;
    this.resetRequiredProperty();
    for (let entry of that.specificMonMap.entries()) {
      if (entry[1]['enabled']) {
        let data = [];
        let monGrp = entry[1][COMPONENT.MON_GROUP]
        // let monitorName = entry[0] // changed for resolving windows system monitor issues having same display name but diff internal name
        let monitorName = entry[1][COMPONENT.MON_DISPLAY_NAME]
        data = that.formData.filter(item => item._grp === monGrp); // for bug 108950
        data.map(function (matchedItems) {

          if (matchedItems[COMPONENT.MON_TYPE] === "" || matchedItems[COMPONENT.MON_TYPE] === monitorName) {
            if (matchedItems[COMPONENT.DEPENDENT_COMP]) {
              that.validateRequiredCompValidation(matchedItems[COMPONENT.DEPENDENT_COMP], true)
            }
            else if (matchedItems[COMPONENT.DROP_DOWN_LIST_ITEMS]) {
              that.validateRequiredCompValidation(matchedItems[COMPONENT.DROP_DOWN_LIST_ITEMS], true)
            }
            else if (matchedItems[COMPONENT.ITEMS_KEY]) {
              that.validateRequiredCompValidation(matchedItems[COMPONENT.ITEMS_KEY], true)
            }
            else {
              if (matchedItems['validationObj']['defRequired']) {
                matchedItems['validationObj']['required'] = true
              }
            }
          }
        })
      }
    }
  }

  // Method called for when table is present inside specific monitor 
  getTableInlineOptions(compItem: any, monName?: string) {
    let that = this;
    let finalObj: any = [];
    if (compItem[COMPONENT.TABLE_DATA]) {
      let tableVal = "";
      compItem[COMPONENT.TABLE_DATA].map(val => {
        let str = "";
        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
          str = str + "\"";

        compItem[COMPONENT.COLUMNDATA].map(each => {
          if (each._grp) {
            if (each._grp && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(each._grp) === -1) {
              if (each._grp != 'global')
                this.monGrpStateArr.push({ 'gn': each._grp, 'gdn': each._grpDisp });
            }
          }
          else // case comes here when inner specific components are checked.
          {
            let grp;
            grp = this.getMonGrpFromKey(each.key)
            if (grp && grp != 'global' && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(grp) === -1) {
              this.monGrpStateArr.push({ 'gn': grp, 'gdn': this.getMonitorGroupDisplayName(grp) });
            }
          }
          if (each.type != COMPONENT.NOTE_TAG) {
            let uiKeyVal = each.label;
            if (each.type === COMPONENT.DROPDOWN_TYPE) {
              uiKeyVal = "ui-" + each.label;
            }
            let value = val[uiKeyVal];

            if (each[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
              value = encodeURIComponent(value);

            if (each[COMPONENT.IS_QUOTE_REQUIRED] == "true")
              value = "'" + value + "'";

            if (each.args)
              str = str + each.args + COMPONENT.COLON_SEPARATOR + value + COMPONENT.COMMA_SEPARATOR;
            else
              str = str + value + COMPONENT.COMMA_SEPARATOR;
          }
        })
        str = str.substring(0, str.length - 1);
        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
          str = str + "\"";

        tableVal = tableVal + compItem.args + COMPONENT.SPACE_SEPARATOR + str + COMPONENT.SPACE_SEPARATOR;
      })
      that.deploymentOption[compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName] = tableVal.trim()
      finalObj.push({ "val": tableVal })
      return finalObj;
    }
  }

  /**Copy Method of getTableOptions() for creating table deployment options as -V [
    "m:2, P:url",
    "m:3, P:url1"
     ]  */
  getTableDepOptions(compItem: any) {
    let that = this;
    let option: any = {};
    let finalObj: any = [];
    let depOptionArr = [];
    let count = 0;
    if (compItem[COMPONENT.TABLE_DATA]) {
      compItem[COMPONENT.TABLE_DATA].map(val => {
        let str = "";
        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
          str = str + "\"";

        let depOptionObj = {};
        compItem[COMPONENT.COLUMNDATA].map(each => {
          if (each.type != COMPONENT.NOTE_TAG) {
            let uiKeyVal = each.label;
            if (each.type === COMPONENT.DROPDOWN_TYPE) {
              uiKeyVal = "ui-" + each.label;
            }
            let value = val[uiKeyVal];

            if (each[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
              value = encodeURIComponent(value);

            if (each[COMPONENT.IS_QUOTE_REQUIRED] == "true")
              value = "'" + value + "'";

            if (each.args)
              str = str + each.args + COMPONENT.COLON_SEPARATOR + value + COMPONENT.COMMA_SEPARATOR;
            else
              str = str + value + COMPONENT.COMMA_SEPARATOR;
          }


        })
        str = str.substring(0, str.length - 1);
        if (compItem[COMPONENT.IS_QUOTE_REQUIRED] == "true")
          str = str + "\"";

        count++;
        depOptionObj[count] = str;
        depOptionArr.push(depOptionObj)
      })
      that.monParams[compItem.key] = depOptionArr;
      option[compItem.key] = compItem.args + "  ${" + compItem.key + "}";
      finalObj.push({ "dep": that.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[compItem.key] });
      return finalObj;
    }
  }

  //Method called to create Fieldset inline options where fieldset has its own set of values such as in accesslog.
  getFieldSetInlineOptions(compItem: any, monName?: string) {
    let that = this;
    let specificMonOption = "";
    if (compItem[COMPONENT.DEPENDENT_COMP] != null) {
      compItem[COMPONENT.DEPENDENT_COMP].map(function (eachDepenComp: any) {

        let newKeyWithoutGrp = eachDepenComp['key'].split(COMPONENT.MON_GRP_KEY_SEPARATOR) // done for removing monitor group from key to be written in options(accesslog)
        if (eachDepenComp.value)
          specificMonOption = specificMonOption + newKeyWithoutGrp[1] + COMPONENT.COLON_SEPARATOR + eachDepenComp.value + COMPONENT.COMMA_SEPARATOR;
      })
    }
    specificMonOption = specificMonOption.substring(0, specificMonOption.length - 1);
    let key = "";

    // handling for endeca json fieldset for global components
    if (!monName) {
      key = compItem[COMPONENT.KEY];
      that.monParams[key] = specificMonOption.trim()
      that.deploymentOption[key] = compItem.args + COMPONENT.SPACE_SEPARATOR + COMPONENT.KEY_START + key + COMPONENT.KEY_END;
    }
    else {
      key = compItem[COMPONENT.KEY] + COMPONENT.UNDERSCORE + monName;
      that.deploymentOption[key] = compItem.args + COMPONENT.SPACE_SEPARATOR + specificMonOption.trim()
    }
  }

  // //Added for adding monitor group name along with Key.
  setAppCPJHInstance(keyName, monGrp) {
    let monGrpKeyName;
    return monGrpKeyName = monGrp + COMPONENT.MON_GRP_KEY_SEPARATOR + keyName;
  }


  //Method to generate Deployment Options
  createDeployementOptions(key: string, useAsOption?: string, monGrp?: string) {
    let that = this;
    if (useAsOption)
      that.deploymentOption[key] = useAsOption + COMPONENT.SPACE_SEPARATOR + COMPONENT.KEY_START + key + COMPONENT.KEY_END;
    else
      that.deploymentOption[key] = COMPONENT.KEY_START + key + COMPONENT.KEY_END;

  }

  //Method to generate Deployment Options
  createMonParameters(key: string, value?: string, monGrp?: string) {
    let that = this;
    that.monParams[key] = value;
  }

  getComponentData(CompData: any) {
    let that = this;
    let dep = [];

    if (CompData[COMPONENT.TYPE] === COMPONENT.TEXTFIELD_TYPE || CompData[COMPONENT.TYPE] === COMPONENT.SPINNER_TYPE)
      return that.getTextFieldOptions(CompData)

    if (CompData[COMPONENT.TYPE] === COMPONENT.RADIOBUTTONGROUP_TYPE)
      return that.getRadioButtonOptions(CompData)

    if (CompData[COMPONENT.TYPE] === COMPONENT.ACCORDIAN_TYPE) {
      dep = that.createAccordianOptions(CompData);
      that.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.CHECKBOX_TYPE) {
      return that.getCheckBoxOptions(CompData)
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.DROPDOWN_TYPE) {
      dep = that.getDropdownOptions(CompData);

      if (dep && dep[0][COMPONENT.OPTIONS_KEY])
        that.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";

      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TABLE_TYPE) {
      dep = that.getTableDepOptions(CompData);

      if (dep && dep[0][COMPONENT.OPTIONS_KEY])
        that.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";
      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TABLESINGLEARG_TYPE) {
      dep = that.getTableSingleArgOptions(CompData);

      if (dep && dep[0][COMPONENT.OPTIONS_KEY])
        that.deploymentOption[CompData.key] = dep[0][COMPONENT.OPTIONS_KEY].toString() + " ";

      return dep;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.FIELDSETLABEL_TYPE) {
      if (CompData.args != "" && CompData.value != "") {
        this.getFieldSetInlineOptions(CompData) // to handle case where fieldset has own value such as accesslog
      }
      else {
        dep = that.createFieldSetOptions(CompData);
        return dep;
      }
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.AGENT_TYPE || CompData[COMPONENT.TYPE] === COMPONENT.APPNAME ||
      CompData[COMPONENT.TYPE] === COMPONENT.EXCLUDE_APP || CompData[COMPONENT.TYPE] === COMPONENT.JAVAHOME ||
      CompData[COMPONENT.TYPE] === COMPONENT.CLASSPATH || CompData[COMPONENT.TYPE] === COMPONENT.INSTANCE) {

      that.updateConfMonitorArr(CompData);
      that.createMonParameters(CompData[COMPONENT.KEY], CompData[COMPONENT.VALUE]) // changed for handling case of instance name key in postgresSql 
      that.createDeployementOptions(CompData[COMPONENT.KEY], CompData[COMPONENT.USE_AS_OPTION]) // changed for handling case of instance name key in postgresSql 

      /**
       * Handled case where instance name comes as dependent component for checkbox. (in windows system)
       */
      let option = {}
      let finalObj = []
      if (CompData[COMPONENT.USE_AS_OPTION]) {
        option[CompData.key] = CompData[COMPONENT.USE_AS_OPTION] + COMPONENT.SPACE_SEPARATOR +
          COMPONENT.KEY_START + CompData.key + COMPONENT.KEY_END;
      }
      else
        option[CompData.key] = "${" + CompData.key + "}";

      finalObj.push({ "dep": this.deploymentOption, [COMPONENT.OPTIONS_KEY]: option[CompData.key] });
      return finalObj;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.TIER_TYPE) {
      let str = '';
      CompData[COMPONENT.VALUE_OBJ].map(each => {
        str = str + each + ",";
      })
      str = str.substring(1, str.length - 1);
      that.monParams[COMPONENT.TIER_TYPE] = str;
    }

    if (CompData[COMPONENT.TYPE] === COMPONENT.ISPROCESS) {
      that.monParams[CompData[COMPONENT.KEY]] = CompData[COMPONENT.VALUE];
      that.deploymentOption[CompData[COMPONENT.KEY]] = COMPONENT.KEY_START + CompData[COMPONENT.KEY] + COMPONENT.KEY_END;
    }

    // for handling blank type tags where without showing in UI options are to be added in dep-options.
    if (CompData[COMPONENT.TYPE] == "") {
      if (CompData[COMPONENT.ARGS]) {
        that.deploymentOption[CompData[COMPONENT.KEY]] = CompData[COMPONENT.ARGS] + COMPONENT.SPACE_SEPARATOR + CompData[COMPONENT.VALUE]; // for bug 109253 changed to key
      }
      else {
        that.deploymentOption[CompData[COMPONENT.KEY]] = CompData[COMPONENT.VALUE]; // for bug 109253 changed to key
      }
    }
  }

  removeDisableMonGrpParams() {
    let that = this;
    let monitorGroupArr = []
    for (let items in that.monParams) {
      // if (!items.startsWith(COMPONENT.MON_GRP_GLOBAL)) // skip global parameters commented for bug 110733
      monitorGroupArr.push(items);
    }

    return monitorGroupArr = monitorGroupArr.filter(ar => !that.monGrpMap.find(rm => (ar.startsWith(rm))))
  }

  //Method called at save to make final deployment options. Added for handling case of windows deployment options
  removeSpaceBtwArgsAndValue(deploymentOption: any) {
    if (deploymentOption.startsWith('/')) {
      let arsArr: string[] = deploymentOption.replace(/\s+/g, ' ').split(' ');
      let optionStr = '';
      for (let index = 0; index < arsArr.length; index++) {
        if (index == 0) {
          // if(arsArr[index].startsWith('/'))
          optionStr = arsArr[index] + arsArr[index + 1];
          // else
          //   optionStr = arsArr[index] + COMPONENT.SPACE_SEPARATOR + arsArr[index + 1];
        }
        else {
          // if(arsArr[index].startsWith('/'))
          optionStr += COMPONENT.SPACE_SEPARATOR + arsArr[index] + arsArr[index + 1];
          // else
          //  optionStr += COMPONENT.SPACE_SEPARATOR + arsArr[index] + COMPONENT.SPACE_SEPARATOR  + arsArr[index + 1];
        }
        index += 1;
      }
      deploymentOption = optionStr;
    }
    return deploymentOption;
  }

  resetRequiredProperty() {
    let that = this;
    that.formData.map(function (eachFormItem) {
      if (eachFormItem._grp === COMPONENT.MON_GRP_GLOBAL && eachFormItem.monType === "")  // for bug 108347
      { }
      else {
        if (eachFormItem[COMPONENT.DEPENDENT_COMP]) {
          that.validateRequiredCompValidation(eachFormItem[COMPONENT.DEPENDENT_COMP], false)
        }
        else if (eachFormItem[COMPONENT.DROP_DOWN_LIST_ITEMS]) {
          that.validateRequiredCompValidation(eachFormItem[COMPONENT.DROP_DOWN_LIST_ITEMS], false)
        }
        else if (eachFormItem[COMPONENT.ITEMS_KEY]) {
          that.validateRequiredCompValidation(eachFormItem[COMPONENT.ITEMS_KEY], false)
        }
        else {
          if (eachFormItem['validationObj']['defRequired']) {
            eachFormItem['validationObj']['required'] = false
          }
        }
      }
    })
  }

  //Method to add validate whether mandatory table is filled or not - for bug 108850
  validateTableDropdownComp(compData: any[]): boolean {
    try {
      if (!compData)
        compData = [];

      for (let index = 0; index < compData.length; index++) {
        let compArgs: any = compData[index];


        if (compArgs[COMPONENT.DEPENDENT_COMP] != null) {
          let flag = this.validateTableDropdownComp(compArgs[COMPONENT.DEPENDENT_COMP]);
          if (!flag)
            return flag;
        }
        else if (compArgs[COMPONENT.ITEMS_KEY] != null) {
          let flag = this.validateTableDropdownComp(compArgs[COMPONENT.ITEMS_KEY]);
          if (!flag)
            return flag;
        }
        else if (compArgs[COMPONENT.DROP_DOWN_LIST_ITEMS] != null) { // for bug 108891 - tierName tag case
          let that = this;
          let flag = true;
          compArgs[COMPONENT.DROP_DOWN_LIST_ITEMS].map(function (eachDropdownItem) {
            if (compArgs[COMPONENT.VALUE] === eachDropdownItem.value) {
              if (eachDropdownItem[COMPONENT.DEPENDENT_COMP]) {
                eachDropdownItem[COMPONENT.DEPENDENT_COMP].map(function (eachItem) {
                  if (eachItem[COMPONENT.TYPE] === COMPONENT.TIER_TYPE && eachItem[COMPONENT.VALIDATION_OBJ]['required']) {
                    if (eachItem[COMPONENT.VALUE_OBJ] === null || eachItem[COMPONENT.VALUE_OBJ] === "") {
                      that.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select ' + eachItem.label });
                      flag = false;
                    }
                  }
                  else {
                    flag = that.validateTableDropdownComp(eachDropdownItem[COMPONENT.DEPENDENT_COMP]);
                  }
                })
              }
            }
          })
          if (!flag)
            return flag;
        }
        else if ((compArgs[COMPONENT.TYPE] === COMPONENT.TABLE_TYPE || compArgs[COMPONENT.TYPE] === COMPONENT.TABLESINGLEARG_TYPE) &&
          compArgs[COMPONENT.VALIDATION_OBJ]['required']) {
          if (compArgs[COMPONENT.TABLE_DATA].length === 0) {
            this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please add ' + compArgs.label });
            return false;
          }
        }

        if (compArgs[COMPONENT.TYPE] === COMPONENT.DROPDOWN_TYPE && compArgs[COMPONENT.VALIDATION_OBJ]['required']) {
          if (compArgs[COMPONENT.VALUE] === "") {
            this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select ' + compArgs.label });
            return false;
          }
        }

      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  //Method called to show/hide other arguments on basis of toggle
  displayContent: boolean = false;
  expandPnl(node, state) {
    if (node[COMPONENT.DEPENDENT_COMP].length > 1) // for components apart from 'other' tag
      this.displayContent = state

    if (node[COMPONENT.DEPENDENT_COMP].length == 1) // for components having only 'other' tag
      this.displayContent = false;
  }
  //to open monitor GDF dialog
  getMonInfo(dispMonName, inMonName) {
    this.gdfDetail = {
      "dispMonName": dispMonName,
      "inMonName": inMonName,
      "techName": this.techName
    }
    this.display = true;
  }
  onDialogClose(event) {
    this.display = event;
  }

  /**
 * This method is used to download the json file 
 */
  downloadProfile() {
    this.loading = true;
    /***download file directly in server  */
    let url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;

    this.monitorupdownService.downloadProfile(this.techName).subscribe(data => {
      if (data['status']) {
        this.loading = false;
        let path = url + "/netstorm/temp/";
        path = path + this.techName + ".json";
        this.downloadURI(path, this.techName + ".json");
        this.cd.detectChanges();
      }
      else // for bug - 110352
      {
        this.loading = false;
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: data['msg'] });
        setTimeout(() => {
          this.cd.detectChanges();
        }, 0);
        return false;
      }
    })
  }

  /** This method is used to make the download link to download the selected json file */
  downloadURI(uri, name) {
    var link = document.createElement("a");

    link.download = name;
    link.href = uri;

    // Hence, We need to create mouse event initialization.
    var clickEvent = document.createEvent("MouseEvent");
    clickEvent.initEvent("click", true, true);

    link.dispatchEvent(clickEvent);
  }

  // Method added to check app name and exclude app name are not same bug - 109517
  checkDuplicateAppExcludeAppName() {
    let appNameValue;
    let excludeAppNameValue;
    for (const [key, value] of Object.entries(this.monParams)) {
      if (key.includes(COMPONENT.APPNAME)) {
        let monGrpKey = key.split(COMPONENT.MON_GRP_KEY_SEPARATOR)
        if (monGrpKey[1] === COMPONENT.APPNAME)
          appNameValue = value;
      }

      if (key.includes(COMPONENT.EXCLUDE_APP)) {
        let monGrpKey = key.split(COMPONENT.MON_GRP_KEY_SEPARATOR)
        if (monGrpKey[1] === COMPONENT.EXCLUDE_APP)
          excludeAppNameValue = value;
      }
    }

    if (appNameValue && excludeAppNameValue) {
      if (appNameValue.trim() === excludeAppNameValue.trim()) {
        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "App Name and Exclude App Name cannot be same." });
        return false;
      }
    }
    return true;
  }
  validateBlankTextField(compData: any[], monName?: string, label?: string): boolean {
    try {
      if (!compData)
        compData = [];

      for (let index = 0; index < compData.length; index++) {
        let compArgs: any = compData[index];


        // dependentComp
        if (compArgs['dependentComp'] != null) {
          let flag = this.validateBlankTextField(compArgs['dependentComp'], compArgs['monType'], label);

          if (!flag)
            return flag;
        }
        else if (compArgs['items'] != null) {
          let arr = []
          let selectedObj = _.find(compArgs['items'], function (each: any) { return each.value == compArgs.value })
          arr.push(selectedObj)
          let flag = this.validateBlankTextField(arr, "", selectedObj.label);

          if (!flag)
            return flag;
        }
        else if (compArgs[COMPONENT.DROP_DOWN_LIST_ITEMS] != null) {  // for bug 111351
          let that = this;
          let flag = true;
          compArgs[COMPONENT.DROP_DOWN_LIST_ITEMS].map(function (eachDropdownItem) {
            if (compArgs[COMPONENT.VALUE] === eachDropdownItem.value) {
              if (eachDropdownItem[COMPONENT.DEPENDENT_COMP]) {
                eachDropdownItem[COMPONENT.DEPENDENT_COMP].map(function (eachItem) {
                  if (eachItem[COMPONENT.TYPE] == COMPONENT.TEXTFIELD_TYPE || eachItem[COMPONENT.TYPE] == COMPONENT.INSTANCE) {
                    if (eachItem[COMPONENT.VALIDATION_OBJ]['required'] && eachItem[COMPONENT.VALUE]) {
                      const isWhitespace = (eachItem['value'] || '').trim().length === 0;
                      if (isWhitespace) {
                        that.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please enter valid ' + eachDropdownItem.label });
                        flag = false;
                      }
                    }
                  }
                  else {
                    flag = that.validateBlankTextField(eachDropdownItem[COMPONENT.DEPENDENT_COMP], "", eachDropdownItem.label);
                  }
                })
              }
            }
          })
          if (!flag)
            return flag;
        }
        else if (compArgs[COMPONENT.TYPE] == 'TextField' || compArgs[COMPONENT.TYPE] == 'instanceName') {
          if (compArgs['validationObj']['required'] && compArgs['value']) {
            const isWhitespace = (compArgs['value'] || '').trim().length === 0;
            if (isWhitespace) {
              if (compArgs['label'] != '') {
                this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please enter valid " + compArgs['label'] });
                return
              }
              else {
                this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please enter valid " + label });
                return
              }
            }
          }
        }
        else if (compArgs[COMPONENT.TYPE] == "other") {
          if (compArgs['value']) {
            let otherArgsVal = compArgs['value'].split(/(\s+)/)
            if (otherArgsVal[0] === (COMPONENT.DOUBLE_HYPHEN) || otherArgsVal[0] === (COMPONENT.HYPHEN) ||
              otherArgsVal[0] === (COMPONENT.FORWARD_SLASH)) {
              this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please enter valid " + compArgs['label'] + " in " + monName });
              return;
            }
            if (otherArgsVal[2] === (COMPONENT.DOUBLE_HYPHEN) || otherArgsVal[2] === (COMPONENT.HYPHEN) ||
              otherArgsVal[2] === (COMPONENT.FORWARD_SLASH)) {
              this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please enter valid " + compArgs['label'] + " in " + monName });
              return;
            }
          }
        }
      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  ngOnDestroy() {
    this.monitorupdownService.gMonId = "-1"
  }

  deleteConf() {
    const me = this;
    let gMonID = ""

    if (!me.selectedMonConf || me.selectedMonConf.length == 0) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Please select row to delete' })
      return
    }
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    me.confirmationService.confirm({
      message: 'Do you want to delete selected monitor configuration?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.loading = true;

        for (let i = 0; i < this.selectedMonConf.length; i++) {
          me.confTableData = me.confTableData.filter(each => {
            return each.gMonId != this.selectedMonConf[i].gMonId
          })
          gMonID += this.selectedMonConf[i].gMonId + ",";

        }
        gMonID = gMonID.slice(0, gMonID.length - 1)

        me.monitorupdownService.removeConfigurationInfo(gMonID, this.selectedMonConf[0]._id, me.techName).subscribe(res => {
          if (res[COMPONENT.RESPONSE_STATUS]) {
            me.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res[COMPONENT.RESPONSE_MSG] });
            me.loading = false;
            this.selectedMonConf = []
            me.clearFormFields();
            me.cd.detectChanges();
          }
        })
      },
      reject: () => {
        this.selectedMonConf = []
      },
    });
  }

  //Method called at on row edit click to generate per row agent-server list.
  getServerListAtEdit(tierServerObj) {
    let me = this;
    this.loading = true;
    let tier = tierServerObj.tier;
    if (tierServerObj.tier === "ALLtier")
      tier = "All Tiers";
      
    let tierInfo = _.find(me.tierHeadersList, function (each) { return each['label'] == tier })
    if(!tierInfo) // for bug 112482
    {
      this.loading = false
      tierServerObj.tier = "";
      tierServerObj.actualServer = "";
      this.messageService.add({severity:COMPONENT.SEVERITY_ERROR, summary:COMPONENT.SUMMARY_ERROR, detail:tier + " is not present in topology."})
      return;
    }
    else
    {
      me.monitorupdownService.getServerList(tierInfo.value).subscribe(res => {
        this.loading = false
        let dName = [];
        let sName = [];
        res.map(each => {
          if (each['id'] >= 0) 
          {
                sName.push(each['sName']);
                dName.push(each['dName']);
          }
        })

        if (tierServerObj.tier === "ALLtier") {
          me.exTierList = me.tierList.filter(val => {
            return val.value != "ALLtier"
          })
        }

        tierServerObj.serverList = UtilityService.createListWithKeyValue(dName, sName);
        if (tierServerObj.serverList && tierServerObj.serverList.length > 0)
          tierServerObj['exServerList'] = [...tierServerObj.serverList];

          let serverNotMatched="";
          tierServerObj['server'] = tierServerObj['server'].filter(function(obj) 
          { 
            if(sName.indexOf(obj) === -1)
            { 
              serverNotMatched = serverNotMatched + obj + ",";
            }
              return sName.indexOf(obj) != -1;
           });
           me.cd.detectChanges();
           if(serverNotMatched)
           {
             serverNotMatched = serverNotMatched.substring(0, serverNotMatched.length - 1);
             this.messageService.add({severity:COMPONENT.SEVERITY_ERROR, summary:COMPONENT.SUMMARY_ERROR, detail: serverNotMatched + " is not present for tier " + tierServerObj.tier + " in topology"})
             return;
           }
      })
    }
  }
  backClicked() {
    if (this.monitorupdownService.routeFlag) {
      this.monitorupdownService.flag = true;
    }
    this._location.back();
  }

  // For bug 110537 - Method to validate tier-server per row is selected or not.
  validateTierServer(tierServerInfos): boolean {
    let flag: boolean = true;
    tierServerInfos.map((tierServerInfo) => {
      if (tierServerInfo.tier != "ALLtier") {
        if (tierServerInfo.tier && tierServerInfo.actualServer) {
          if (tierServerInfo.tier != '' && tierServerInfo.actualServer === 'specified' && tierServerInfo.server.length == 0) {
            flag = false;
          }
        }
        else {
          flag = false
        }
      }
    })

    if (!flag)
      this.showErrorMsg(flag);

    return flag;
  }

  showErrorMsg(flag): boolean {
    if (!flag) {
      this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: "Please fill agent tier-server to add next." })
      return flag;
    }
  }

  // Method added to show confirmation dialog if any monitor is configured but monitor is not enabled - bug 110733
  showConfirmDialogForUpdate(msg, reqBody) {
    let me = this;
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    msg = msg.substring(0, msg.length - 1);
    let monMsg = "Monitor configuration(s) for group(s): " + msg.trim() + " has been updated, but monitor(s) are not enabled. If you continue, monitor configuration(s) will be lost.Do you want to continue?"
    me.confirmationService.confirm({
      message: monMsg,
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.createFinalSaveObj(reqBody)
      },
      reject: () => { },
    });
  }

  // Method used for creating save object.
  createFinalSaveObj(reqBody) {
    let me = this;
    let tierFlag = false;
    let serverFlag = false;
    let tierServerInfo: any[] = [];

    me.serverFilter.map(each => {
      let tSObj = {};
      let servers = "";
      let tierStr = "";
      tSObj['tier'] = each['tier'];
      if (each['tier'] == "ALLtier") {
        tSObj['server'] = "All";

        if (each.exTier && each.exTier.length > 0) {
          each['exTier'].map(tier => {
            tierStr = tierStr + tier + ",";
          })
        }
        tierStr = tierStr.substring(0, tierStr.length - 1);
        if (tierStr === "")
          tSObj['exTier'] = null;
        else
          tSObj['exTier'] = tierStr;
      }
      else {
        if (each['actualServer'] == -1) {
          tSObj['server'] = "All";
          if (each.exServer && each.exServer.length > 0) {
            each['exServer'].map(server => {
              servers = servers + server + ",";
            })
          }
          servers = servers.substring(0, servers.length - 1);
          if (servers === "")
            tSObj['exServer'] = null;
          else
            tSObj['exServer'] = servers;
        }
        else if (each['actualServer'] == -2) {
          tSObj['server'] = "Any";
        }
        else {
          each['server'].map(function (eachServer) {
            servers = servers + eachServer + ",";
          })
          servers = servers.substring(0, servers.length - 1);
          tSObj['server'] = servers;
        }
      }
      tierServerInfo.push(tSObj);
    })

    tierServerInfo.map(each => {
      if (!each.tier)
        tierFlag = true;
      if (each.server == "" || each.server.length == 0)
        serverFlag = true;
    })
    if (tierFlag) {
      me.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: '', detail: "Select Tier to Add Monitor" });
      return;
    }
    if (serverFlag) {
      me.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: '', detail: "Select Server to Add Monitor" });
      return;
    }

    if (!this.monitorupdownService.validateDuplicateTier(tierServerInfo)) { return false; }

    // me.serverFilter = [{}];
    let finalReqBody: any = {
      "techName": me.techName,
      "opr": me.operation,
      "gMonId": me.gMonId,
      [COMPONENT.TIER_INFO]: tierServerInfo,
      "body": reqBody
    };


    me.loading = true;
    me.monitorupdownService.saveMonitorConfiguration(finalReqBody, me.techName, -1).subscribe(res => {
      if (res[COMPONENT.RESPONSE_STATUS]) {
        me.clearFormFields();
        me.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res[COMPONENT.RESPONSE_MSG] });
      }
      else {
        me.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res[COMPONENT.RESPONSE_MSG], life: 5000 });
        me.loading = false;
      }

      me.monitorupdownService.getConfigInfo(this.techName).subscribe(response => {
        me.confTableData = response;
        me.loading = false;
        me.cd.detectChanges();
      });
    });
  }

  // Method called to get Monitor group from key tag in form data.
  getMonGrpFromKey(key) {
    let monGrp = key.split(COMPONENT.MON_GRP_KEY_SEPARATOR);
    return monGrp[0];
  }

  // Method added to maintain an array of object having monitor group and monitor group display name for configured monitor - bug 110733
  updateConfMonitorArr(compItem) {
    if (compItem.value != compItem.defVal) {
      if (compItem._grp) {
        if (compItem._grp && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(compItem._grp) === -1) {
          if (compItem._grp != 'global')
            this.monGrpStateArr.push({ 'gn': compItem._grp, 'gdn': compItem._grpDisp });
        }
      }
      else // case comes here when inner specific components are checked.
      {
        let grp;
        grp = this.getMonGrpFromKey(compItem.key)
        if (grp && grp != 'global' && this.monGrpStateArr.map(function (e) { return e.gn; }).indexOf(grp) === -1) {
          this.monGrpStateArr.push({ 'gn': grp, 'gdn': this.getMonitorGroupDisplayName(grp) });
        }
      }
    }
  }

  // Method added for bug 110733 to get monitor group display name incase of those where monitor group is found from key
  getMonitorGroupDisplayName(grpName) {
    for (let entry of this.specificMonMap.entries()) {
      if (entry[1][COMPONENT.MON_GROUP] == grpName) {
        return entry[1][COMPONENT.MON_GRP_DISPLAY_NAME];
      }
    }
  }
  validateJmxSearchPattern(jmxData){
    if(jmxData.jmxConn ==="pid" && jmxData.jmxConnPID === "searchPattern" && jmxData.adv.oP.length == 0){
      this.messageService.add({severity:COMPONENT.SEVERITY_ERROR,summary:COMPONENT.SUMMARY_ERROR,detail:"Please Provide atleast one pattern"})
      return;
    }
    return true;
  }
  getJmxPatternData(data,monData){
    if(this.index === 0){
    let arr = data.split('[').join("").split(']')
    let str = arr[0].split(',')
    let newStr = []
    let count = 0;
    for(let i = 0;i<str.length;i++){
      if(str[i].startsWith(' pattern')){
       newStr.push((str[i].substring(str[i].indexOf("=") + 1)))
      }
    }
    for(let j = 0;j<newStr.length;j++){
      this.jmxSp = new PatternVal()
      this.jmxSp['id'] = count
      this.jmxSp.pattern = newStr[j];
      monData['adv']['oP'].push(this.jmxSp);
      count = count + 1;
      }
    this.index = this.index + 1
    }
  }
}

