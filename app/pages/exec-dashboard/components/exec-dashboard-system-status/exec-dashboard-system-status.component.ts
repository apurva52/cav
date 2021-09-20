import { ExecDashboardConfigService } from './../../services/exec-dashboard-config.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
// import { Observable } from 'rxjs/Rx';
import { SelectItem, MenuItem, Dropdown, OverlayPanel } from 'primeng/primeng';
import { ExecDashboardUtil } from '../../utils/exec-dashboard-util';
import { ExecDashboardCommonRequestHandler } from '../../services/exec-dashboard-common-request-handler.service';
import { ExecDashboardCommonKPIDataservice } from './../../services/exec-dashboard-common-kpi-data.service';

@Component({
  selector: 'app-exec-dashboard-system-status',
  templateUrl: './exec-dashboard-system-status.component.html',
  styleUrls: ['./exec-dashboard-system-status.component.css']
})
export class ExecDashboardSystemStatusComponent implements OnInit {

  dcInfoArr: any = [];
  sysStatusMainArr: any[] = [];
  dcClass: String;  // responsive code variable
  alertGridFlag: Boolean = false;
  refreshInterval = 120;
  strTimeStamp: any[] = [];   // DC Time stamp

  // System Status Filter and Level Params
  drpFilterArr: SelectItem[] = [];
  drpSelecterdFilter: string = 'Show All';
  drpLevelArr: SelectItem[] = [];
  drpSelectedLevel: string = '1';
  customerColorCode: string = '#F0F2F4';

  customer: string = '';  // Customer Name

  systemStatusData: any = {};

  // Alert Counters
  ccalert: Number = 0;
  cmmalert: Number = 0;
  bcalert: Number = 0;
  bmmalert: Number = 0;

  // Table Params
  alertTableData: any[] = [];
  capacityAlertTableData: any[] = [];
  behAlertTableData: any[] = [];
  alertGridDataObj: Object = {};
  showAlertTable: Boolean = false;
  alertTableHeaders: any[] = [];
  overlayAlertTableHeaders: any[] = [];
  overlayAlertGrid: any[] = [];
  gridHeaderFlag: Boolean = false;
  gridHeader: String = '';

  showCompleteView: Boolean = true;   // Main View Flag
  callForUpdate: Boolean = false;

  // Color Codes
  normalAlertCode: string = '#00B050';
  criticalAlertCode: string = '#e82620';
  warningAlertCode: string = '#EA9215';
  normalAlertCodeL: string = '#59D290';
  warningAlertCodeL: string = '#eab261';
  crticalAlertCodeL: string = '#e82620';
  minorAlertCode: string = '#FFBB00';
  majorAlertCode: string = '#FE5400';

  // Div Responsive Codes
  respClass: String = 'ui-g-4';
  levelThreeClass: String = 'ui-g-6';
  spanLabelFieldClass: String = '210px';
  spanLabelFieldClass2: String = '150px';
  headerSpanClass: string = '370px';

  // One Entity Dialog Params
  sysStatusEntityMainArr: any[] = [{
    name: '',
    childrens: [],
    data: {}
  }];
  showOneEntityView: Boolean = false;
  drpSelectedEntityLevel: string = '1';
  breadcrumbs: MenuItem[] = [];
  mainBreadCrumb: MenuItem[] = [];
  levelOne: string = '';
  levelTwo: string = '';
  levelTwoColorCode: string = '';
  levelThree: string = '';
  levelThreeColorCode: string = '';
  levelFour: string = '';
  levelFive: string = '';

  // Block UI
  blockUIFlag: Boolean = false;

  progress: number = 0;
  filteredData: any[] = [];
  constructor(private http: HttpClient, private request: ExecDashboardCommonRequestHandler,
    public _config: ExecDashboardConfigService, public execDashboardKpiDataService: ExecDashboardCommonKPIDataservice) { }

  ngOnInit() {

    const filterArr = ['Show All', 'Critical', 'Major and Above'];
    this.drpFilterArr = ExecDashboardUtil.createSelectItem(filterArr);

    const levelArr = ['1', '2', '3', '4', '5'];
    this.drpLevelArr = ExecDashboardUtil.createSelectItem(levelArr);

    this.alertTableHeaders = [
      { field: 'severity', header: 'Severity', width: '1.5%', align: 'center', sort: false },
      { field: 'dc', header: 'Data Center', width: '2%', align: 'left', sort: true },
      { field: 'rn', header: 'Rule Name', width: '3%', align: 'left', sort: true },
      { field: 'am', header: 'Alert Message', width: '4%', align: 'left', sort: true },
      { field: 'atime', header: 'Time', width: '2.5%', align: 'right', sort: true },
      { field: 'vec', header: 'Indices', width: '2.5%', align: 'left', sort: true },
      { field: 'val', header: 'Alert Value', width: '1.8%', align: 'right', sort: true },
      { field: 'tval', header: 'Threshold', width: '2%', align: 'right', sort: true },
      { field: 'bname', header: 'Baseline', width: '2%', align: 'left', sort: true },
    ];

    let cloneArr = [];
    cloneArr = [...cloneArr, ...this.alertTableHeaders];
    let arr = cloneArr.splice(1, 2);
    this.overlayAlertTableHeaders = cloneArr;  // removing dc and rule name

    this.blockUIFlag = true;
    this.getDCInfo().then(result => {
      if (!result) {
        this.execDashboardKpiDataService.kpiMessages('No Config file found', 'error');
        this.blockUIFlag = false;
        return;
      }

      result = result['members'];
      this.drpSelectedLevel = result['depthLevel'];
      this.refreshInterval = parseInt(result['refreshInterval']) * 1000;

      this.dcInfoArr = result;
      this.getUpdatedData();
      this.blockUIFlag = false;

      setInterval(() => {
        this.callForUpdate = true;
        let currentScrollTop = document.getElementById('mainDiv').scrollTop;
        this.getUpdatedData();
        if (this.showOneEntityView) {
          this.showOneEntity(this.levelOne, this.levelTwo, this.levelThree, this.levelFour, this.levelFive);
        }
        setTimeout(() => {
          document.getElementById('mainDiv').scrollTop = currentScrollTop;
        }, 200)

      }, this.refreshInterval);

    }).catch((error) => {
      this.execDashboardKpiDataService.kpiMessages('Unable to get Data Center Information', 'error');
      this.blockUIFlag = false;
    });
  }

  /**
   * Gets updated data from server, also works on refresh button on GUI acc to page
   */
  getUpdatedData() {
    if (this.showCompleteView) {
      this.getSystemStatusData();
    } else {
      this.getAlertCounter('Critical', 3, 'Capacity', () => { });
    }
  }

  /**
   * Call to get DC informations at start of sys status
   */
  getDCInfo() {
    let host = this._config.getNodePresetURL();
    return this.request
      .getSysDataFromGetRequest(`${host}DashboardServer/RestService/KPIWebService/systemStatusConfig`)
  }

  /**
   * Gets alert counter from both dc's
   */
  getAlertCounter(tmpSeverity, tmpAlertVal, alertCat, callback) {
    let cc = 0;
    let cm = 0;
    let bc = 0;
    let bm = 0;
    let arr = [];
    this.capacityAlertTableData = [];
    this.behAlertTableData = [];

    const alertType = (alertCat === 'Capacity') ? '0' : '1';

    let resultCount = 0;
    for (let i = 0; i < this.dcInfoArr['dataCenterMap'].length; i++) {
      let host = this.getHost(this.dcInfoArr['dataCenterMap'][i]);
      const url = `${host}DashboardServer/RestService/KPIWebService/systemStatusInfo?strOperName=GET_ALERTS_TABLES&severity=${tmpSeverity}&type=${alertType}&strDebugLevel=0&strTimeStamp=${this.strTimeStamp[i]}&isReplayMode=false`;

      this.blockUIFlag = true;
      // Call to get data for alert table
      this.request
        .getSysDataFromGetRequest(url)
        .then((d: any) => {
          resultCount++;
          const data = JSON.parse(d);
          if (data !== null) {
            cc += data['CC'];
            cm += data['CM'];
            bc += data['BC'];
            bm += data['BM'];

            this.ccalert = cc;
            this.cmmalert = cm;
            this.bcalert = bc;
            this.bmmalert = bm;

            arr = [...arr, ...data['alertdata']];
          }

          // Sending back callback data only when all dc has been iterated
          if (resultCount === this.dcInfoArr['dataCenterMap'].length) {
            callback(arr);
          }

          this.blockUIFlag = false;
        }).catch((error) => {
          console.error('Error in showAlertsTable : ', error);
          callback(arr);
        });
    }
  }

  /**
   * Gets updated sys status data from server
   */
  getSystemStatusData() {

    try {
      let dcCounter = 0;
      let cc = 0;
      let cm = 0;
      let bc = 0;
      let bm = 0;
      let obj = {};
      let reqCounter = 0;
      let isAllReceived = 0;
      let selectedDepthProcessed = false;

      for (let i = 0; i < this.dcInfoArr['dataCenterMap'].length; i++) {
        let url = '';
        let host = this.getHost(this.dcInfoArr['dataCenterMap'][i]);
        if (!this.callForUpdate) {
          url = `${host}DashboardServer/RestService/KPIWebService/systemStatusInfo?strOperName=getTopologyMap&strDebugLevel=0`;
        } else {
          if (this.strTimeStamp[i]) {
            url = `${host}DashboardServer/RestService/KPIWebService/systemStatusInfo?strOperName=getColorMap&strDebugLevel=0&strTimeStamp=${this.strTimeStamp[i]}`;
          } else {
            url = `${host}DashboardServer/RestService/KPIWebService/systemStatusInfo?strOperName=getTopologyMap&strDebugLevel=0`;
          }
        }

        this.blockUIFlag = true;
        this.request
          .getSysDataFromGetRequest(url)
          .then((data: any) => {
            let orgiData = JSON.parse(data);
            reqCounter++;
            data = JSON.parse(data);
            let updatedColorMap = {};

            if (this.callForUpdate) {
              updatedColorMap = this.getUpdatedColorMap(this.systemStatusData, data);
              data = updatedColorMap;
            }

            if (data != null) {
              const d = orgiData;
              const cName = Object.keys(d['customerData'])[0];
              cc += d['customerData'][cName]['CC'];
              cm += d['customerData'][cName]['CM'];
              bc += d['customerData'][cName]['BC'];
              bm += d['customerData'][cName]['BM'];

              if (dcCounter === 0) {
                obj = data;

                let dcObj = {};
                for (const data1 in obj['customerData']) {
                  if (obj['customerData'].hasOwnProperty(data1)) {
                    this.customer = data1;
                    const customerData = obj['customerData'][data1];
                    const dc = Object.keys(customerData['m'])[0];
                    if (customerData['m'][dc]) {
                      let dcKeys = this.dcInfoArr['dataCenterMap'].map(e => e.dataCenterName);
                      let index = dcKeys.indexOf(this.dcInfoArr['dataCenterMap'][i]['dataCenterName'])
                      this.strTimeStamp[index] = `${customerData['m'][dc].ts}:${customerData['m'][dc].l}`;
                    }
                    dcObj = customerData['m'];
                  }
                }

                // Home breadcrumb
                this.mainBreadCrumb = [
                  {
                    label: this.customer, 'command': (event) => {
                      this.goToHomeScreen();
                    }
                  }
                ];

              } else {
                // Merging other dc data
                const parsedData = data;
                const customerName = Object.keys(parsedData['customerData'])[0];
                const dcData = Object.keys(parsedData['customerData'][customerName]['m']);
                for (let j = 0; j < dcData.length; j++) {
                  obj['customerData'][this.customer]['m'][dcData[j]]
                    = parsedData['customerData'][customerName]['m'][dcData[j]];
                  let dcKeys = this.dcInfoArr['dataCenterMap'].map(e => e.dataCenterName);
                  let index = dcKeys.indexOf(this.dcInfoArr['dataCenterMap'][i]['dataCenterName'])
                  this.strTimeStamp[index] = `${parsedData['customerData'][customerName]['m'][dcData[j]]['ts']}:${parsedData['customerData'][customerName]['m'][dcData[j]]['l']}`;
                }
              }
              this.systemStatusData = obj;
              dcCounter++;
            }
            this.blockUIFlag = false;

            if (isAllReceived === this.dcInfoArr['dataCenterMap'].length - 1) {
              this.ccalert = cc;
              this.cmmalert = cm;
              this.bcalert = bc;
              this.bmmalert = bm;
              this.setSelectedDepth();
              selectedDepthProcessed = true;
            }
          }).then(() => {
            if (reqCounter === this.dcInfoArr['dataCenterMap'].length && !selectedDepthProcessed) {
              this.setSelectedDepth();
            }
            isAllReceived++;
          }).catch((error) => {
            console.error('Error in getSystemStatusData : ', error);
            this.setSelectedDepth();
            this.blockUIFlag = false;
            isAllReceived++;
          });
      }
    } catch (err) {
      console.error('Error in getSystemStatusData: ', err);
    }
  }

  /**
   * Gets updated data for sys alert GUI
   * @param oldData
   * @param updatedData
   */
  getUpdatedColorMap(oldData, updatedData) {
    if (updatedData == null) {
      return null;
    }

    for (const key in updatedData['customerData']) {
      if (oldData['customerData'].hasOwnProperty(key)) {    // Customer KOHLS
        oldData['customerData'][key]['c'] = updatedData['customerData'][key]['c'];
        oldData['customerData'][key]['ts'] = updatedData['customerData'][key]['ts'];

        // Get childrens
        const custKey = Object.keys(updatedData['customerData'][key]['m']);
        if (custKey.length !== 0) {
          for (let i = 0; i < custKey.length; i++) {    // DC loop
            oldData['customerData'][key]['m'][custKey[i]]['c'] = updatedData['customerData'][key]['m'][custKey[i]]['c'];
            oldData['customerData'][key]['m'][custKey[i]]['ts'] = updatedData['customerData'][key]['m'][custKey[i]]['ts'];

            const dcObj = updatedData['customerData'][key]['m'][custKey[i]]['m'];
            const dcKeys = Object.keys(dcObj);
            if (dcKeys.length !== 0) {
              for (let j = 0; j < dcKeys.length; j++) { // Tier Loop
                oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['c']
                  = dcObj[dcKeys[j]]['c'];
                oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['ts']
                  = dcObj[dcKeys[j]]['ts'];

                const tierObj = dcObj[dcKeys[j]]['m'];
                const tierChildKeys = Object.keys(tierObj);
                if (tierChildKeys.length !== 0) {
                  for (let k = 0; k < tierChildKeys.length; k++) { // Server Loop
                    oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['m'][tierChildKeys[k]]['c']
                      = tierObj[tierChildKeys[k]]['c'];
                    oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['m'][tierChildKeys[k]]['ts']
                      = tierObj[tierChildKeys[k]]['ts'];

                    const serverObj = tierObj[tierChildKeys[k]]['m'];
                    const serverChildKeys
                      = Object.keys(serverObj);
                    if (serverChildKeys.length !== 0) {
                      for (let l = 0; l < serverChildKeys.length; l++) { // Instance Loop
                        oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['m'][tierChildKeys[k]]['m'][serverChildKeys[l]]['c']
                          = serverObj[serverChildKeys[l]]['c'];
                        oldData['customerData'][key]['m'][custKey[i]]['m'][dcKeys[j]]['m'][tierChildKeys[k]]['m'][serverChildKeys[l]]['ts']
                          = serverObj[serverChildKeys[l]]['ts'];

                        const instChildKeys = Object.keys(serverObj[serverChildKeys[l]]['m']);
                        if (instChildKeys.length !== 0) {
                          // TODO handle for inst childs
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return oldData;
  }

  /**
   * Handles alert table view
   * @param tmpSeverity
   * @param tmpAlertType
   */
  showAlertsTable(tmpSeverity, tmpAlertVal, alertCat, op: OverlayPanel) {
    op.hide();
    this.getAlertCounter(tmpSeverity, tmpAlertVal, alertCat, (data) => {
      this.gridHeaderFlag = false;
      this.showOneEntityView = false;
      this.showCompleteView = false;
      this.showAlertTable = true;
      console.log('Getting alert table data: ', data);
      this.alertTableData = data;   // Data for alert table
      this.filteredData = data; // For bug ID: 44685
    });
  }

  /**
   * Responsible for opening alert history table on Alert msg click
   * @param data
   */
  openHistoryTable(data) {
    this.gridHeaderFlag = true;
    this.gridHeader = `Alert History for ${data.rn} for Vector ${data.vec}`;

    const filterArr = this.alertTableData.filter(e => {
      if (data.vec !== '' || data.vec !== '-') {
        if (e.dc === data.dc && e.vec === data.vec) {
          return e;
        }
      } else {
        if (e.vec === data.vec) {
          return e;
        }
      }
    });

    this.alertTableData = filterArr;
  }

  applyFilter() {
    document.getElementById('mainDiv').scrollTop = 0;
    this.setSelectedDepth();
  }

  /**
   * To view alerts on main page
   */
  setSelectedDepth() {
    try {
      this.sysStatusMainArr = [];
      const level = this.drpSelectedLevel;
      this.customer = Object.keys(this.systemStatusData['customerData'])[0];
      const filterVal = (this.drpSelecterdFilter === 'Show All') ? '0' : (this.drpSelecterdFilter === 'Critical') ? '1' : '2';
      const sysData = this.systemStatusData['customerData'][this.customer]['m'];
      this.customerColorCode = this.systemStatusData['customerData'][this.customer].c;

      // DC List
      if (level === '1') {

        const childrensArr = this.getDataByFilterForVector(this.systemStatusData['customerData'][this.customer], Object.keys(this.systemStatusData['customerData'][this.customer]['m']), filterVal);
        this.sysStatusMainArr.push({
          data: this.systemStatusData['customerData'][this.customer]['m'],
          childrens: childrensArr,
          level: level
        });

      } else if (level === '2') {
        for (const key in sysData) {
          if (sysData.hasOwnProperty(key)) {

            const dcData = sysData[key];
            const childrensArr = this.getDataByFilterForVector(dcData, Object.keys(dcData['m']), filterVal);

            this.sysStatusMainArr.push({
              name: key,
              data: dcData,
              childrens: childrensArr,
              level: level
            });
          }
        }
      } else if (level === '3' || level === '4' || level === '5') {     // Inside DC, Iterating Tiers
        const dcArr = [];
        for (const key in sysData) {
          if (sysData.hasOwnProperty(key)) {
            dcArr.push(key);
            const dcData = sysData[key];
            const dcDataObj = [];

            for (const dcKey in dcData['m']) {
              if (dcData['m'].hasOwnProperty(dcKey)) {
                const childrensArr = this.getDataByFilterForVector1(dcData['m'][dcKey], Object.keys(dcData['m'][dcKey]['m']), filterVal);
                if (childrensArr.length === 0) {    // For Scaler
                  const scalerArr = this.getDataByFilterForScaler(dcData['m'][dcKey], filterVal);
                  for (let i = 0; i < scalerArr.length; i++) {
                    dcDataObj.push({
                      name: scalerArr[i],
                      data: dcData['m'][dcKey],
                      childrens: [],
                      level: level,
                      parent: dcArr
                    });
                  }
                } else {
                  dcDataObj.push({
                    name: dcKey,
                    data: dcData['m'][dcKey],
                    childrens: childrensArr,
                    level: level,
                    parent: dcArr
                  });
                }
              }
            }

            const childrenLevelFour = [];
            let tierArr = [];
            let tierObj = new Map();
            if (level === '4' || level === '5') {

              for (const dcKey in dcData['m']) {
                if (dcData['m'].hasOwnProperty(dcKey)) {
                  const tierChildArr = this.getDataByFilterForVector1(dcData['m'][dcKey], Object.keys(dcData['m'][dcKey]['m']), filterVal);
                  //                  const tierChildArr = Object.keys(dcData['m'][dcKey]['m']);  // Servers
                  const tierChildDataObj = dcData['m'][dcKey]['m'];
                  if (tierChildArr.length !== 0) {

                    // Looping servers
                    let serverArr = [];
                    for (const tc in tierChildDataObj) {
                      if (tierChildDataObj.hasOwnProperty(tc)) {
                        const childrensArr = this.getDataByFilterForVector(dcData['m'][dcKey]['m'][tc], Object.keys(dcData['m'][dcKey]['m'][tc]['m']), filterVal);

                        if (childrensArr.length === 0) {    // For Scaler
                          const scalerArr = this.getDataByFilterForScaler(dcData['m'][dcKey]['m'][tc], filterVal);
                          for (let i = 0; i < scalerArr.length; i++) {
                            serverArr.push({
                              name: scalerArr[i],
                              children: [],
                              data: dcData['m'][dcKey]['m'][tc],
                              parent: dcKey
                            });
                          }
                        } else {
                          // getting childrens of instance level
                          let childrenData = [];
                          childrenData.push(childrensArr);

                          let obj = {};
                          for (let i = 0; i < childrensArr.length; i++) {
                            obj[childrensArr[i]] = Object.keys(dcData['m'][dcKey]['m'][tc]['m'][childrensArr[i]]['m']);
                          }
                          childrenData.push(obj);

                          serverArr.push({
                            name: tc,
                            children: childrenData,
                            data: dcData['m'][dcKey]['m'][tc],
                            parent: dcKey
                          });
                        }
                      }
                    }
                    tierObj[dcKey] = serverArr;
                  }
                }
              }
            }

            this.sysStatusMainArr.push({
              label: key,
              data: dcDataObj,
              serverChild: tierObj,
              level: level
            });
          }
        }
      }

      if (level === '4') {
        if (this.sysStatusMainArr.length === 2) {
          this.spanLabelFieldClass2 = '150px';
          this.headerSpanClass = '155px';
        } else {
          this.spanLabelFieldClass2 = '150px';
          this.headerSpanClass = '370px';
        }
      } else if (level === '5') {
        if (this.sysStatusMainArr.length === 2) {
          this.spanLabelFieldClass2 = '105px';
          this.headerSpanClass = '160px';
        } else {
          this.spanLabelFieldClass2 = '110px';
          this.headerSpanClass = '370px';
        }
      } else {
        if (this.sysStatusMainArr.length === 2) {
          this.spanLabelFieldClass2 = '105px';
          this.headerSpanClass = '160px';
        } else {
          this.spanLabelFieldClass2 = '138px';
          this.headerSpanClass = '370px';
        }
      }

      // For dividing cells for DC
      if (this.sysStatusMainArr.length === 2) {
        this.dcClass = 'ui-g-6';
        this.respClass = 'ui-g-4';
        this.levelThreeClass = 'ui-g-12';
        this.spanLabelFieldClass = '140px';
      } else if (this.sysStatusMainArr.length === 1) {
        this.dcClass = 'ui-g-12';
        this.respClass = 'ui-g-3';
        this.spanLabelFieldClass2 = '220px';
        this.spanLabelFieldClass = '140px';
        this.headerSpanClass = '240px';
        this.levelThreeClass = 'ui-g-6';
      } else {
        this.dcClass = 'ui-g-6';
        this.respClass = 'ui-g-4';
        this.levelThreeClass = 'ui-g-12';
        this.spanLabelFieldClass = '150px';
      }
    } catch (err) {
      console.error('Error in setSelectedDepth: ', err);
    }
  }

  /**
   * Function to show alert table on click on single entity alert icon
   * @param levelO
   * @param levelT
   * @param levelTh
   * @param levelF
   */
  showAlert(event, levelO, levelT, levelTh, levelF, levelS, op: OverlayPanel) {

    op.toggle(event);   // opens the dialog
    this.overlayAlertGrid = [];
    this.dcInfoArr['dataCenterMap'].map(e => {
      let vector = '';
      if (levelF === '') {
        vector = `${levelO}>${levelT}>${levelTh}`;
      } else if (levelF !== '' && levelS === '') {
        vector = `${levelO}>${levelT}>${levelTh}>${levelF}`;
      } else {
        vector = `${levelO}>${levelT}>${levelTh}>${levelF}>${levelS}`;
      }

      const dc = vector.split('>')[1].split(':')[1];
      const timeStamp = `${this.systemStatusData['customerData'][this.customer]['m'][vector.split('>')[1]]['ts']}:${this.systemStatusData['customerData'][this.customer]['m'][vector.split('>')[1]]['l']}`;
      let currentScrollTop = document.getElementById('mainDiv').scrollTop;
      if (dc === e.dataCenterName) {
        let host = this.getHost(e);
        const url = `${host}DashboardServer/RestService/KPIWebService/systemStatusInfo?strOperName=getAlerts&strEntityName=${vector}&strSeparator=>&strTooltipDepth=2&strDebugLevel=0&strTimeStamp=${timeStamp}&isReplayMode=false`;
        this.request
          .getSysDataFromGetRequest(url).then((data: any) => {
            if (data === 'REFRESH') {
              console.log('Color Map is not in sync with server. So refreshing GUI. Please Wait...');
              this.execDashboardKpiDataService.kpiMessages('Color Map is not in sync with server. So refreshing GUI. Please Wait...', 'warn');
              op.toggle(event); // close the dialog
              this.callForUpdate = true;
              this.getUpdatedData();
              setTimeout(() => {
                document.getElementById('mainDiv').scrollTop = currentScrollTop;
              }, 200)
            } else if (data === '' || data === '[]') {
              this.overlayAlertGrid = [];
            } else {
              this.fillAlertHistoryTable(data);
            }
            document.getElementById('mainDiv').scrollTop = currentScrollTop;
          }).catch(error => {
            console.error('Error in showAlert: ', error);
          });
      }
    });
    this.alertGridFlag = true;
    event.stopPropagation();
  }

  /**
   * Returns the host depending upon number of dcs
   * @param dcs {Object} The object should've at leaset three properties like {dataCenterIP: string, dataCenterPort: string|number, protocol: string|number} 
   */
  getHost(dcObj) {
    if (sessionStorage.isMultiDCMode == "true") {
      return this._config.getNodePresetURL(dcObj.dataCenterName.split(","));
    } else {
      return `${dcObj.protocol}://${dcObj.dataCenterIP}:${dcObj.dataCenterPort}/`;
    }
  }
  /**
   * Method to fill alert history table
   */
  fillAlertHistoryTable(data) {
    this.overlayAlertGrid = JSON.parse(data);
  }

  /**
   * Displaying One entity View
   * @param levelOne
   * @param levelTwo
   * @param levelThree
   */
  showOneEntity(levelOne, levelTwo, levelThree, levelFour, levelFive) {
    const breadArr = [
      { label: levelOne },
      {
        label: levelTwo, 'command': (event) => {
          this.showOneEntity(this.levelOne, this.levelTwo, '', '', '');
        }
      },
      {
        label: levelThree, 'command': (event) => {
          this.showOneEntity(this.levelOne, this.levelTwo, this.levelThree, '', '');
        }
      }
    ];

    this.breadcrumbs = breadArr;

    const level = this.drpSelectedLevel;

    this.levelOne = levelOne;
    this.levelTwo = levelTwo;
    this.levelThree = levelThree;
    this.levelFour = levelFour;
    this.levelFive = levelFive;

    this.showOneEntityView = true;
    this.getOneEntityAlertsByLevel();
  }

  /**
   * handling data acc to levels in one entity view
   * Double Click Dialog Functionality and data
   */
  getOneEntityAlertsByLevel() {
    this.sysStatusEntityMainArr = [];
    const level = this.drpSelectedEntityLevel;
    const sysData = this.systemStatusData['customerData'];
    this.levelTwoColorCode = sysData[this.levelOne]['m'][this.levelTwo].c;
    if (this.levelThree !== '') {
      this.levelThreeColorCode = sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree].c;
    }

    try {
      if (this.levelThree === '') {
        const childrens = Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m']);
        this.sysStatusEntityMainArr.push({
          name: this.levelTwo,
          childrens: childrens,
          data: sysData[this.levelOne]['m'][this.levelTwo]['m'],
          level: '2'
        });
      } else if (this.levelFour === '') {
        const childrens = Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m']);
        this.sysStatusEntityMainArr.push({
          name: this.levelThree,
          childrens: childrens,
          data: sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree],
          level: '3'
        });
      } else {
        let levelObj = [];

        if (this.levelFive === '') {
          this.breadcrumbs.push(
            {
              label: this.levelFour, 'command': (event) => {
                this.showOneEntity(this.levelOne, this.levelTwo, this.levelThree, this.levelFour, '');
              }
            });
          this.sysStatusEntityMainArr.push({
            name: this.levelFour,
            childrens: Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour]['m']),
            data: sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour],
            level: '4'
          });
        } else {

          this.breadcrumbs.push(
            {
              label: this.levelFour, 'command': (event) => {
                this.showOneEntity(this.levelOne, this.levelTwo, this.levelThree, this.levelFour, '');
              }
            },
            { label: this.levelFive });

          const obj = {};
          const data = Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour]['m']);
          for (let i = 0; i < data.length; i++) {
            obj[data[i]] = Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour]['m'][data[i]]['m'])
          }

          this.sysStatusEntityMainArr.push({
            name: this.levelFour,
            childrens: Object.keys(sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour]['m']),
            levelFiveChild: obj,
            data: sysData[this.levelOne]['m'][this.levelTwo]['m'][this.levelThree]['m'][this.levelFour],
            level: '5'
          });
        }
      }
    } catch (err) {
      console.error('Error in getOneEntityAlertsByLevel: ', err);
    }
  }

  /**
   * Filter value acc to selected filter
   * @param dataArr
   * @param arr
   * @param filterVal
   */
  getDataByFilterForVector(dataArr, arr, filterVal) {
    const filteredArr = arr.filter((a) => {
      if (filterVal === '1') {
        if (dataArr['m'][a].c === 'R') {
          return a;
        }
      } else if (filterVal === '2') {
        if (dataArr['m'][a].c === 'Y' || dataArr['m'][a].c === 'R') {
          return a;
        }
      } else {
        return a;
      }
    });
    return filteredArr;
  }

  /** Alternate filter for level 4-5 . Need to check*/
  getDataByFilterForVector1(dataArr, arr, filterVal) {
    const filteredArr = arr.filter((a) => {
      let arr = Object.keys(dataArr['m'][a]['m']);
      if (filterVal === '1') {
        for (let i = 0; i < arr.length; i++) {
          if (dataArr['m'][a].c === 'R' || dataArr['m'][a]['m'][arr[i]].c === 'R') {
            return a;
          }
        }
      } else if (filterVal === '2') {
        for (let i = 0; i < arr.length; i++) {
          if ((dataArr['m'][a].c === 'Y' || dataArr['m'][a].c === 'R') || (dataArr['m'][a]['m'][arr[i]].c === 'R' || dataArr['m'][a]['m'][arr[i]].c === 'Y')) {
            return a;
          }
        }
      } else {
        return a;
      }
    });
    return filteredArr;
  }

  /**
   * Get filter data for scaler graph
   * @param dataArr
   * @param filterVal
   */
  getDataByFilterForScaler(dataArr, filterVal) {
    const filteredArr = [];

    switch (filterVal) {
      case '1': if (dataArr.c === 'R') {
        filteredArr.push(`${dataArr.t}:${dataArr.l}`);
      }
        break;
      case '2': if (dataArr.c === 'Y' || dataArr.c === 'R') {
        filteredArr.push(`${dataArr.t}:${dataArr.l}`);
      }
        break;
      default: filteredArr.push(`${dataArr.t}:${dataArr.l}`);
        break;
    }

    return filteredArr;
  }

  /**
   * This method is to download Data table as pdf,word and excel
   * type = pdf/word/excel
   */
  onDownload(fileType, dataObj, tableNo) {
    try {
      const tableHeaders = [];

      // Creating header array from alert data table
      for (const key in this.alertTableHeaders) {
        if (this.alertTableHeaders.hasOwnProperty(key)
        ) {

          const element = this.alertTableHeaders[key]['header'];
          //for bug 74055
          if (element == "Threshold" || element == "Baseline")
           continue;
          if (tableNo == 1) {
            console.log("Table 1");
            if (element == "Data Center" || element == "Rule Name")
              continue;
          } else {
            dataObj = this.filteredData;	// Getting the filtered data
          }
          tableHeaders.push(element);
          tableHeaders[0] = 'Severity';
        }
      }

      const data = [];
      const response = {};

      data.push(tableHeaders);

      /**
       * getTableData returns array of array
       * getting each array and pushing in data
       */
      const tempArr = this.getTableData(dataObj, tableNo);
      for (let i = 0; i < tempArr.length; i++) {
        data.push(tempArr[i]);
      }

      // Creating response
      response['downloadType'] = fileType;
      response['jsonData'] = [data];
      response['varFilterCriteria'] = '';
      response['strSrcFileName'] = 'SystemStatusReport_';
      response['renameArray'] = '';
      response['header'] = this._config.$productName + ' Executive Dashboard- System Status';

      // Creating url for REST
      let host = this._config.getNodePresetURL();
      const url = host + 'DashboardServer/RestService/KPIWebService/KPIDownloadData';
      this.http.post(url, response)
        .subscribe((res: any) => {
          let path = res.trim();
          path = host + 'common/' + path;
          window.open(path);
        });

    } catch (error) {
      console.error('Error in download: ', error);
    }
  }

  /**
   * Getting table data
   */
  getTableData(tableDataArr, tableNo) {
    try {
      const dataObj = [];
      for (const key in tableDataArr) {
        if (tableDataArr.hasOwnProperty(key)) {
          const element = tableDataArr[key];
          const singleArr = [];
          switch (element['severity']) {
            case "1": singleArr.push('Minor'); break;
            case "2": singleArr.push('Major'); break;
            case "3": singleArr.push('Critical'); break;
          }
          if (tableNo === 0) {
            singleArr.push(element['dc']?element['dc']:"");
            singleArr.push(element['rn']?element['rn']:"");
          }
          singleArr.push(element['am']?element['am']:"");
          singleArr.push(element['atime']?element['atime']:"");
          singleArr.push(element['vec']?element['vec']:"");
          //singleArr.push(element['server']?element['server']:"");
          //singleArr.push(element['instance']?element['instance']:"");
          singleArr.push(element['val']?element['val']:"");
          singleArr.push(element['tval']?element['tval']:"");
          singleArr.push(element['bname']?element['bname']:"");
          dataObj.push(singleArr);
        }
      }
      return dataObj;
    } catch (error) {
      console.log(`getting error inside getTableData() in system status`, error);
    }
  }

  customsortOnColumns(event, tempData, t) {
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/[:.,]/g, ''));
        var value2 = Number(b[temp].replace(/[:.,]/g, ''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/[:.,]/g, ''));
        var value2 = Number(b[temp].replace(/[:.,]/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.overlayAlertGrid = [];
    this.alertTableData = [];
    if (tempData) {
      tempData.map((rowdata) => {
        if (t === 0) {
          this.overlayAlertGrid = [...this.overlayAlertGrid, rowdata];
        } else {
          this.alertTableData = [...this.alertTableData, rowdata];
        }
      });
    }
  }

  /**
   * SOrting Group Name
   */
  alphaNumsort(e, data, t) {
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    if (e.order == 1) {
      data.sort(function (a, b) {
        var temp = (e["field"]);
        var aA = a[temp].replace(reA, "");
        var bA = b[temp].replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a[temp].replace(reN, ""), 10);
          var bN = parseInt(b[temp].replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      });
    }
    else if (e.order == -1) {
      data.sort(function (a, b) {
        var temp = (e["field"]);
        var aA = a[temp].replace(reA, "");
        var bA = b[temp].replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a[temp].replace(reN, ""), 10);
          var bN = parseInt(b[temp].replace(reN, ""), 10);
          return aN === bN ? 0 : aN < bN ? 1 : -1;
        } else {
          return aA < bA ? 1 : -1;
        }
      });
    }

    if (t === 0) {
      this.overlayAlertGrid = [];
      this.overlayAlertGrid = [...data];
    } else {
      this.alertTableData = [];
      this.alertTableData = [...data];
    }
  }

  /**
   * For Navigation Purpose
   */
  openBreadCrumbLink() {
    this.showCompleteView = true;
    this.showAlertTable = false;
    this.setSelectedDepth();
  }
  goToHomeScreen() {
    this.showCompleteView = true;
    this.showAlertTable = false;
  }

  onFilter(e) {
    this.filteredData = e.filteredValue;
  }
}

