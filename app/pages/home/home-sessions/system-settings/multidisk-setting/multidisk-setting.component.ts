import { Component, OnInit } from '@angular/core';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { TreeNode } from 'primeng/api';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from 'src/app/core/store/store';
import { MULTIDISK_SETTING_DATA } from './service/multidisk-setting.dummy'
import { MessageService } from 'primeng';
interface DiskSummaryObject {
  filename: string;
  mount: string;
  status: number;
  avail: string,
  size: string;
}

interface Cols {
  field: string;
  header: string;
}

interface dropdowndata {
  label: string;
  value: any;
}

@Component({
  selector: 'app-multidisk-setting',
  templateUrl: './multidisk-setting.component.html',
  styleUrls: ['./multidisk-setting.component.scss']
})

export class MultidiskSettingComponent implements OnInit {
  files: TreeNode[];
  slavenode: any[];
  nodevalue: any;
  clsutermode = false;
  cols: any[];
  mountdisk: any[];
  diskusedspace = {};
  diskoverloaddisplay = false;
  guestdisabled = false;
  finaldiskhealthnrdb: number;
  finaldiskhealthhpd: number;
  pdiskheader: string;
  diskspacedata: any;
  disksummarydata: any[] = [];
  multidiskCriticalThreshold: number;
  multidiskMajorThreshold: number;
  criticalthreshold: number;
  majorthreshold: number;
  multidiskresponse: any;
  pagedumpValues: any[] = [];
  useractionValues: any[] = [];
  pagetablecsvValues: any[] = [];
  sessiontablecsvValues: any[] = [];
  useractiontablecsvValues: any[] = [];
  feedbacktablecsvValues: any[] = [];
  custommetricstablecsvValues: any[] = [];
  eventstablecsvValues: any[] = [];
  xhrdatatablecsvValues: any[] = [];
  usertimingtablecsvValues: any[] = [];
  mobileappinfotablecsvValues: any[] = [];
  nvcrashreporttablecsvValues: any[] = [];
  nvjserrortablecsvValues: any[] = [];
  nvaggregatorValues: any[] = [];
  paralleldiskdisplay = false;
  csvValues: any[] = [];
  feedbackValues: any[] = [];
  nr_db_uploadValues: any[] = [];
  hpdValues: any[] = [];
  pdiskvalue: any;
  actualpdisk: number;
  defaultPostData: any;
  postData: any[];
  jsonFile: any;
  loader = false;
  button = false;
  nodata = true;
  pdiskdatadialog: any;

  nvdomainwiseaggregatevValues: any[] = [];
  nvcampaignaggregateValues: any[] = [];
  nvsessentrypgaggValues: any[] = [];
  nvtransactionaggregateValues: any[] = [];
  nvpageperformanceValues: any = [];
  nvsessionaggregateValues: any[] = [];
  nvresourceaggregateValues: any[] = [];
  nvpageaggregateValues: any[] = [];
  // boolean to check is dbip flag is enable or not
  isDBBoolean = false;
  tempjsondata = [];

  constructor(private httpService: NvhttpService, private messageService: MessageService) {
    this.nodata = true;
    this.LoadJsonFile(-1);
  }
  ngOnInit() {
    // if (sessionStorage.getItem("isAdminUser") == "true") {
    //   this.button = true;
    //   this.guestdisabled = false;
    // }
    // if (sessionStorage.getItem("isAdminUser") != "true") {
    //   this.button = false;
    //   this.guestdisabled = true;
    // }
  }

  LoadJsonFile(slaveid) {
    let jsdata = MULTIDISK_SETTING_DATA;
    //let url = jsdata.treetable;
    console.log('JSON File loaded');
    this.tempjsondata = jsdata.treetable;
    this.GetDiskAlloocationData(slaveid);
    //for disk threshold
    this.GetDiskThresholdData(slaveid);
    // to get Parser Data
    this.GetParserData();
    //for slave list name
    if (slaveid == -1)
      this.GetSlaveNode();
  }
  constructDiscAllocationTable(slaveid) {
    this.loader = true;
    this.pagedumpValues = [];
    this.hpdValues = [];
    this.csvValues = [];
    this.useractionValues = [];
    this.feedbackValues = [];
    this.pagetablecsvValues = [];
    this.sessiontablecsvValues = [];
    this.useractiontablecsvValues = [];
    this.feedbacktablecsvValues = [];
    this.custommetricstablecsvValues = [];
    this.eventstablecsvValues = [];
    this.xhrdatatablecsvValues = [];
    this.usertimingtablecsvValues = [];
    this.mobileappinfotablecsvValues = [];
    this.nvcrashreporttablecsvValues = [];
    this.nvjserrortablecsvValues = [];
    this.nr_db_uploadValues = [];
    // these three column header are fixed
    // remaining headers are dynamic
    this.cols = [{
      field: 'components',
      header: 'Modules/Components'
    },
    {
      field: 'health',
      header: 'Health'
    },
    {
      field: 'pdisk',
      header: 'Parallel Disk'
    }
    ];
    this.loader = true;
    //  get data from backened for disc allocation table
    this.httpService.getRumDataformultidisk(slaveid).subscribe((state: Store.State) => {
      //check the MULTIDISK_TABLESPACE_INFO (if this keyword is present than we can show disk allocation table_)
      this.mountdisk = [];
      this.files = [];
      let response = state['data'];
      // sort the response in ascending order
      if (response) {
        this.loader = false;
        response.sort();
        this.multidiskresponse = response;
        // for table header extract MULTIDISK_TABLESPACE_INFO data
        if (response.length == 0)
          this.nodata = true;
        for (const i of response) {
          // to check if dbflag is true then nr_db_upload and agregator comonent will be enable
          if (i.indexOf('isDBLocal') > -1) {
            if (i.split(":")[1] == "true") {
              this.files = this.tempjsondata;
              this.isDBBoolean = true;
              this.files[2].data['pdisk'] = "N.A";
              this.files[2].data['health'] = "N.A";
              for (var k of this.files[2].children) {
                console.log("CONSOLE", k);
                k.data['pdisk'] = "N.A";
                k.data['health'] = "N.A";
              }
            }

            if (i.split(":")[1] == "false") {
              this.isDBBoolean = false;
              this.files.push(this.tempjsondata[0]);
            }
          }
          // check if the response contains MULTIDISK_TABLESPACE_INFO
          if (i.indexOf('MULTIDISK_TABLESPACE_INFO') > -1) {
            this.nodata = false;
            this.mountdisk.push({
              diskname: i.split(' ')[1],
              mount: i.split(' ')[2]
            });
            this.cols.push({
              field: i.split(' ')[1],
              header: i.split(' ')[1]
            });
          }
        }

        // set file with default value based on column headers length
        this.setFileWithDefaultValues();

        for (let i of response) {
          // check if the response contains NV_ASSIGN_MULTIDISK_TABLESPACE
          if (i.indexOf('NV_ASSIGN_MULTIDISK_TABLESPACE') > -1) {
            //to check if in any keyword parallel is disk is there if not than assign 1
            let splitdata = i.split(' ')
            if (isNaN(splitdata[splitdata.length - 1])) {
              i = i + " 1";
            }
            if (i.split(' ')[1] == "HPD") {
              //this.HealthAllocationDisk1(i);
              this.updateFileWithResponseValues(i.split(' ')[2], i);
              this.hpdHealthAllocation(i);
            }
            if (i.split(' ')[1] == "NR_DB_UPLOAD") {
              this.updateFileWithResponseValues2(i.split(' ')[2], i);
              if (this.isDBBoolean == true)
                this.nrdbHealthDiskAllocation(i)
            }
          }


        }
      } else {
        this.loader = false;
      }

    });
    setTimeout(() => {
      for (var k of this.multidiskresponse) {
        if (k.includes("CSV") || k.includes("Pagedump") || k.includes("USERACTION") || k.includes("Feedback"))
          this.hpdValues = [];
        if (k.includes(".csv"))
          this.nr_db_uploadValues = [];
      }
      document.getElementById('savedisk')['disabled'] = true;
      for (var k of this.cols) {
        if (k.field != "components" && k.field != "health" && k.field != "pdisk") {
          const fieldvalue = k.field;
          this.CheckDotCondiition(fieldvalue);
        }
      }
    }, 400);


  }
  hpdHealthAllocation(data) {
    let pdata = data.split(" ");
    if (!data.includes("CSV") && !data.includes("Pagedump") && !data.includes("USERACTION") && !data.includes("Feedback")) {
      this.files[0].data['pdisk'] = pdata[pdata.length - 1];
      this.files[0].children[2].data['health'] = this.HealthAllocationDisk1(data, this.csvValues);
      this.files[0].children[2].data['healthname'] = this.getDiskName(this.files[0].children[2].data['health']);
      this.files[0].children[0].data['health'] = this.HealthAllocationDisk1(data, this.pagedumpValues);
      this.files[0].children[0].data['healthname'] = this.getDiskName(this.files[0].children[0].data['health']);
      this.files[0].children[1].data['health'] = this.HealthAllocationDisk1(data, this.useractionValues);
      this.files[0].children[1].data['healthname'] = this.getDiskName(this.files[0].children[1].data['health']);
      this.files[0].children[3].data['health'] = this.HealthAllocationDisk1(data, this.feedbackValues);
      this.files[0].children[3].data['healthname'] = this.getDiskName(this.files[0].children[3].data['health']);

      this.files[0].data['health'] = this.HealthAllocationDisk1(data, this.hpdValues);
      this.files[0].data['healthname'] = this.getDiskName(this.files[0].data['health']);
      let cfiles = this.files[0].children;
      cfiles.forEach(element => {
        element.data['pdisk'] = pdata[pdata.length - 1];
      });
    }
    if (data.includes("CSV") || data.includes("Pagedump") || data.includes("USERACTION") || data.includes("Feedback")) {
      this.files[0].data['pdisk'] = "N.A";
      let modulehealth = [];
      switch (data.split(" ")[2]) {
        case "CSV":
          this.files[0].children[2].data['health'] = this.HealthAllocationDisk1(data, this.csvValues);
          this.files[0].children[2].data['healthname'] = this.getDiskName(this.files[0].children[2].data['health']);
          this.files[0].children[2].data['alert'] = this.alertPDisk(pdata, this.csvValues);
          break;

        case "Pagedump":
          this.files[0].children[0].data['health'] = this.HealthAllocationDisk1(data, this.pagedumpValues);
          this.files[0].children[0].data['healthname'] = this.getDiskName(this.files[0].children[0].data['health']);
          this.files[0].children[0].data['alert'] = this.alertPDisk(pdata, this.pagedumpValues);
          break;

        case "USERACTION":
          this.files[0].children[1].data['health'] = this.HealthAllocationDisk1(data, this.useractionValues);
          this.files[0].children[1].data['healthname'] = this.getDiskName(this.files[0].children[1].data['health']);
          this.files[0].children[1].data['alert'] = this.alertPDisk(pdata, this.useractionValues);
          break;

        case "Feedback":
          this.files[0].children[3].data['health'] = this.HealthAllocationDisk1(data, this.feedbackValues);
          this.files[0].children[3].data['healthname'] = this.getDiskName(this.files[0].children[3].data['health']);
          this.files[0].children[3].data['alert'] = this.alertPDisk(pdata, this.feedbackValues);
          break;
      }
      for (var t of this.files[0].children) {
        if (t.data.health != undefined)
          modulehealth.push(t.data.health);
      }
      this.files[0].data['health'] = modulehealth.sort()[modulehealth.length - 1];
      this.files[0].data['healthname'] = this.getDiskName(this.files[0].data['health']);
      let cfiles = this.files[0].children;
      cfiles.forEach(element => {
        if (element.data['components'] == pdata[2])
          element.data['pdisk'] = pdata[pdata.length - 1];
      });
    }


  }

  alertPDisk(data, value) {
    if (typeof data == "object") {
      if ((parseInt(data[data.length - 1]) <= value.length)) {
        return false;
      }
      if ((parseInt(data[data.length - 1]) > value.length)) {
        return true;
      }
    }
    if (typeof data != "object") {
      if ((parseInt(data) <= value.length)) {
        return false;
      }
      if ((parseInt(data) > value.length)) {
        return true;
      }
    }

  }
  // this method will give the final name of the disk for 2nd table in health column 
  getDiskName(data) {
    for (var u = 0; u < Object.values(this.diskusedspace).length; u++) {
      let sp = (Object.values(this.diskusedspace)[u] as string).split("%")[0]
      if (parseInt(data) == parseInt(sp)) {
        for (var p of this.mountdisk) {
          if (Object.keys(this.diskusedspace)[u] == p.mount)
            return p.diskname;
        }
      }

    }
  }
  nrdbHealthDiskAllocation(data) {
    let pdata = data.split(" ");
    if (!data.includes(".csv")) {
      this.files[1].data['pdisk'] = pdata[pdata.length - 1];
      let cfiles = this.files[1].children;
      cfiles.forEach(element => {
        element.data['pdisk'] = pdata[pdata.length - 1];
      });

      this.files[1].data['health'] = this.HealthAllocationDisk1(data, this.nr_db_uploadValues);
      this.files[1].data['healthname'] = this.getDiskName(this.files[1].data['health']);
      this.files[1].children[0].data['health'] = this.HealthAllocationDisk1(data, this.pagetablecsvValues);
      this.files[1].children[0].data['healthname'] = this.getDiskName(this.files[1].children[0].data['health']);
      this.files[1].children[0].data['alert'] = this.alertPDisk(pdata, this.pagetablecsvValues);
      this.files[1].children[1].data['health'] = this.HealthAllocationDisk1(data, this.sessiontablecsvValues);
      this.files[1].children[1].data['healthname'] = this.getDiskName(this.files[1].children[1].data['health']);
      this.files[1].children[1].data['alert'] = this.alertPDisk(pdata, this.sessiontablecsvValues);
      this.files[1].children[2].data['health'] = this.HealthAllocationDisk1(data, this.useractiontablecsvValues);
      this.files[1].children[2].data['healthname'] = this.getDiskName(this.files[1].children[2].data['health']);
      this.files[1].children[2].data['alert'] = this.alertPDisk(pdata, this.useractiontablecsvValues);
      this.files[1].children[3].data['health'] = this.HealthAllocationDisk1(data, this.feedbacktablecsvValues);
      this.files[1].children[3].data['healthname'] = this.getDiskName(this.files[1].children[3].data['health']);
      this.files[1].children[3].data['alert'] = this.alertPDisk(pdata, this.feedbacktablecsvValues);
      this.files[1].children[4].data['health'] = this.HealthAllocationDisk1(data, this.custommetricstablecsvValues);
      this.files[1].children[4].data['healthname'] = this.getDiskName(this.files[1].children[4].data['health']);
      this.files[1].children[4].data['alert'] = this.alertPDisk(pdata, this.custommetricstablecsvValues);
      this.files[1].children[5].data['health'] = this.HealthAllocationDisk1(data, this.eventstablecsvValues);
      this.files[1].children[5].data['healthname'] = this.getDiskName(this.files[1].children[5].data['health']);
      this.files[1].children[5].data['alert'] = this.alertPDisk(pdata, this.eventstablecsvValues);
      this.files[1].children[6].data['health'] = this.HealthAllocationDisk1(data, this.xhrdatatablecsvValues);
      this.files[1].children[6].data['healthname'] = this.getDiskName(this.files[1].children[6].data['health']);
      this.files[1].children[6].data['alert'] = this.alertPDisk(pdata, this.xhrdatatablecsvValues);
      this.files[1].children[7].data['health'] = this.HealthAllocationDisk1(data, this.usertimingtablecsvValues);
      this.files[1].children[7].data['healthname'] = this.getDiskName(this.files[1].children[7].data['health']);
      this.files[1].children[7].data['alert'] = this.alertPDisk(pdata, this.usertimingtablecsvValues);
      this.files[1].children[8].data['health'] = this.HealthAllocationDisk1(data, this.mobileappinfotablecsvValues);
      this.files[1].children[8].data['healthname'] = this.getDiskName(this.files[1].children[8].data['health']);
      this.files[1].children[8].data['alert'] = this.alertPDisk(pdata, this.mobileappinfotablecsvValues);
      this.files[1].children[9].data['health'] = this.HealthAllocationDisk1(data, this.nvcrashreporttablecsvValues);
      this.files[1].children[9].data['healthname'] = this.getDiskName(this.files[1].children[9].data['health']);
      this.files[1].children[9].data['alert'] = this.alertPDisk(pdata, this.nvcrashreporttablecsvValues);
      this.files[1].children[10].data['health'] = this.HealthAllocationDisk1(data, this.nvjserrortablecsvValues);
      this.files[1].children[10].data['healthname'] = this.getDiskName(this.files[1].children[10].data['health']);
      this.files[1].children[10].data['alert'] = this.alertPDisk(pdata, this.nvjserrortablecsvValues);
    }

    if (data.includes("csv")) {
      this.files[1].data['pdisk'] = "N.A";
      let nrmodulehealth = [];
      switch (data.split(" ")[2]) {
        case 'pagetable.csv':
          this.files[1].children[0].data['health'] = this.HealthAllocationDisk1(data, this.pagetablecsvValues);
          this.files[1].children[0].data['healthname'] = this.getDiskName(this.files[1].children[0].data['health']);
          this.files[1].children[0].data['alert'] = this.alertPDisk(pdata, this.pagetablecsvValues);
          break;
        case 'sessiontable.csv':
          this.files[1].children[1].data['health'] = this.HealthAllocationDisk1(data, this.sessiontablecsvValues);
          this.files[1].children[1].data['healthname'] = this.getDiskName(this.files[1].children[1].data['health']);
          this.files[1].children[1].data['alert'] = this.alertPDisk(pdata, this.sessiontablecsvValues);
          break;
        case 'useractiontable.csv':
          this.files[1].children[2].data['health'] = this.HealthAllocationDisk1(data, this.useractiontablecsvValues);
          this.files[1].children[2].data['healthname'] = this.getDiskName(this.files[1].children[2].data['health']);
          this.files[1].children[2].data['alert'] = this.alertPDisk(pdata, this.useractiontablecsvValues);
          break;
        case 'feedbacktable.csv':
          this.files[1].children[3].data['health'] = this.HealthAllocationDisk1(data, this.feedbacktablecsvValues);
          this.files[1].children[3].data['healthname'] = this.getDiskName(this.files[1].children[3].data['health']);
          this.files[1].children[3].data['alert'] = this.alertPDisk(pdata, this.feedbacktablecsvValues);
          break;
        case 'custommetricstable.csv':
          this.files[1].children[4].data['health'] = this.HealthAllocationDisk1(data, this.custommetricstablecsvValues);
          this.files[1].children[4].data['healthname'] = this.getDiskName(this.files[1].children[4].data['health']);
          this.files[1].children[4].data['alert'] = this.alertPDisk(pdata, this.custommetricstablecsvValues);
          break;
        case 'eventstable.csv':
          this.files[1].children[5].data['health'] = this.HealthAllocationDisk1(data, this.eventstablecsvValues);
          this.files[1].children[5].data['healthname'] = this.getDiskName(this.files[1].children[5].data['health']);
          this.files[1].children[5].data['alert'] = this.alertPDisk(pdata, this.eventstablecsvValues);
          break;
        case 'xrdatatable.csv':
          this.files[1].children[6].data['health'] = this.HealthAllocationDisk1(data, this.xhrdatatablecsvValues);
          this.files[1].children[6].data['healthname'] = this.getDiskName(this.files[1].children[6].data['health']);
          this.files[1].children[6].data['alert'] = this.alertPDisk(pdata, this.xhrdatatablecsvValues);
          break;
        case 'usertimingtable.csv':
          this.files[1].children[7].data['health'] = this.HealthAllocationDisk1(data, this.usertimingtablecsvValues);
          this.files[1].children[7].data['healthname'] = this.getDiskName(this.files[1].children[7].data['health']);
          this.files[1].children[7].data['alert'] = this.alertPDisk(pdata, this.usertimingtablecsvValues);
          break;
        case 'mobileappinfotable.csv':
          this.files[1].children[8].data['health'] = this.HealthAllocationDisk1(data, this.mobileappinfotablecsvValues);
          this.files[1].children[8].data['healthname'] = this.getDiskName(this.files[1].children[8].data['health']);
          this.files[1].children[8].data['alert'] = this.alertPDisk(pdata, this.mobileappinfotablecsvValues);
          break;
        case 'nvcrashreporttable.csv':
          this.files[1].children[9].data['health'] = this.HealthAllocationDisk1(data, this.nvcrashreporttablecsvValues);
          this.files[1].children[9].data['healthname'] = this.getDiskName(this.files[1].children[9].data['health']);
          this.files[1].children[9].data['alert'] = this.alertPDisk(pdata, this.nvcrashreporttablecsvValues);
          break;
        case 'nvjserrortable.csv':
          this.files[1].children[10].data['health'] = this.HealthAllocationDisk1(data, this.nvjserrortablecsvValues);
          this.files[1].children[10].data['healthname'] = this.getDiskName(this.files[1].children[10].data['health']);
          this.files[1].children[10].data['alert'] = this.alertPDisk(pdata, this.nvjserrortablecsvValues);
          break;

      }
      for (var t of this.files[1].children) {
        if (t.data.health != undefined)
          nrmodulehealth.push(t.data.health);
      }
      this.files[1].data['health'] = nrmodulehealth.sort()[nrmodulehealth.length - 1];
      this.files[1].data['healthname'] = this.getDiskName(this.files[1].data['health']);
    }
    let cfiles = this.files[1].children;
    cfiles.forEach(element => {
      if (element.data['components'] == pdata[2])
        element.data['pdisk'] = pdata[pdata.length - 1];
    });

  }

  HealthAllocationDisk1(ddata, diskvalue) {
    let a = ddata.split(" ");
    let diskarray = diskvalue;
    let pdisk = a[a.length - 1];
    let disksizevalue = [];
    let assignmount: string;
    for (let k of diskarray) {
      for (var p of this.mountdisk) {
        if (p.diskname == k)
          assignmount = p.mount;
      }
      if (this.diskusedspace[assignmount] != undefined)
        disksizevalue.push(parseInt(this.diskusedspace[assignmount].split("%")[0]));
      disksizevalue.sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      });
    }
    let sorteddisk = [];
    for (let t = 0; t < parseInt(pdisk); t++) {
      sorteddisk.push(disksizevalue[t])
    }
    return sorteddisk[sorteddisk.length - 1];
  }

  /**
   * @param component : PAGEDUMP.
   * @param data : 'NV_ASSIGN_MULTIDISK_TABLESPACE HPD PAGEDUMP NVHPDDisk1, NVHPDDisk2, NVHPDDisk3 2'
   */

  updateFileWithResponseValues(components: string, data: any) {
    const tmp = data.split(' ');
    let filedataHpd: any;
    for (const t of this.files) {
      if (t.data.components == tmp[1])
        filedataHpd = t.children;
    }

    filedataHpd.forEach(item => {

      if (item.data['components'] === components) {
        this.cols.forEach(col => {

          switch (col.field) {

            case 'components':
              break;

            // case 'health':
            //     item.data['health'] = this.finaldiskhealthhpd;
            //     break;

            // case 'pdisk':
            //     if (!isNaN(tmp[tmp.length - 1])) {
            //         item.data['pdisk'] = tmp[tmp.length - 1];
            //     }
            //     break;

            default:

              let tmpInd = -1;
              let tmpData = [];
              tmp.forEach(el => {
                if (el.split(',').indexOf(col.field) > -1) {
                  tmpInd = el.split(',').indexOf(col.field);
                  tmpData = el.split(',');
                }
              });

              switch (item.data['components']) {
                case 'Pagedump':
                  if (tmpInd > -1) {
                    //this.pagedumpValues = tmpData;
                    tmpData.forEach(pdump => {
                      if (this.pagedumpValues.indexOf(pdump) == -1)
                        this.pagedumpValues.push(pdump);
                    });

                  }
                  break;

                case 'USERACTION':
                  if (tmpInd > -1) {
                    // this.useractionValues = tmpData;
                    tmpData.forEach(useraction => {
                      if (this.useractionValues.indexOf(useraction) == -1)
                        this.useractionValues.push(useraction);
                    });
                  }
                  break;

                case 'CSV':
                  if (tmpInd > -1) {
                    //this.csvValues = tmpData;
                    tmpData.forEach(csvv => {
                      if (this.csvValues.indexOf(csvv) == -1)
                        this.csvValues.push(csvv);
                    });
                  }
                  break;

                case 'Feedback':
                  if (tmpInd > -1) {
                    //this.feedbackValues = tmpData;
                    tmpData.forEach(feedb => {
                      if (this.feedbackValues.indexOf(feedb) == -1)
                        this.feedbackValues.push(feedb);
                    });
                  }
                  break;


              }
              break;

          }


        });
      }
      if (!components.includes("CSV") && !components.includes("USERACTION") && !components.includes("Pagedump") && !components.includes("Feedback") && data.split(" ")[1] == "HPD") {

        this.cols.forEach(col => {
          //        let tmpData = [];
          let hpdisk = data.split(" ")[2];
          let tmp = hpdisk.split(",")
          tmp.forEach(el => {
            if (el.indexOf(col.field) > -1) {
              if (this.hpdValues.indexOf(col.field) == -1)
                this.hpdValues.push(col.field);
              if (this.pagedumpValues.indexOf(col.field) == -1)
                this.pagedumpValues.push(col.field);
              if (this.useractionValues.indexOf(col.field) == -1)
                this.useractionValues.push(col.field)
              if (this.csvValues.indexOf(col.field) == -1)
                this.csvValues.push(col.field)
              if (this.feedbackValues.indexOf(col.field) == -1)
                this.feedbackValues.push(col.field)

            }
          });
        });
      }


    });


  }


  updateFileWithResponseValues2(components: string, data: any) {
    const tmp = data.split(' ');
    let filedatanrdbupload: any;
    for (const t of this.files) {
      if (t.data.components == tmp[1])
        filedatanrdbupload = t.children;
    }
    if (filedatanrdbupload != undefined) {
      filedatanrdbupload.forEach(item => {

        if (item.data['components'] === components) {
          this.cols.forEach(col => {


            switch (col.field) {

              case 'components':
                break;

              case 'health':
                item.data['health'] = this.finaldiskhealthnrdb;
                break;

              case 'pdisk':
                if (!isNaN(tmp[tmp.length - 1])) {
                  item.data['pdisk'] = tmp[tmp.length - 1];
                }
                break;

              default:

                let tmpInd = -1;
                let tmpData = [];
                tmp.forEach(el => {
                  if (el.split(',').indexOf(col.field) > -1) {
                    tmpInd = el.split(',').indexOf(col.field);
                    tmpData = el.split(',');
                  }
                });

                switch (item.data['components']) {
                  case 'pagetable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(pelement => {
                        if (this.pagetablecsvValues.indexOf(pelement) == -1)
                          this.pagetablecsvValues.push(pelement);
                      });

                    }
                    break;

                  case 'sessiontable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(selement => {
                        if (this.sessiontablecsvValues.indexOf(selement) == -1)
                          this.sessiontablecsvValues.push(selement);
                      });

                    }
                    break;

                  case 'useractiontable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(uelement => {
                        if (this.useractiontablecsvValues.indexOf(uelement) == -1)
                          this.useractiontablecsvValues.push(uelement);
                      });
                    }
                    break;

                  case 'feedbacktable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(felement => {
                        if (this.feedbacktablecsvValues.indexOf(felement) == -1)
                          this.feedbacktablecsvValues.push(felement);
                      });
                    }
                    break;

                  case 'custommetricstable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(celement => {
                        if (this.custommetricstablecsvValues.indexOf(celement) == -1)
                          this.custommetricstablecsvValues.push(celement);
                      });
                      break;
                    }
                  case 'eventstable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(eelement => {
                        if (this.eventstablecsvValues.indexOf(eelement) == -1)
                          this.eventstablecsvValues.push(eelement);
                      });
                    }
                    break;
                  case 'xrdatatable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(xelement => {
                        if (this.xhrdatatablecsvValues.indexOf(xelement) == -1)
                          this.xhrdatatablecsvValues.push(xelement);
                      });
                    }
                    break;
                  case 'usertimingtable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(utelement => {
                        if (this.usertimingtablecsvValues.indexOf(utelement) == -1)
                          this.usertimingtablecsvValues.push(utelement);
                      });
                    }
                    break;
                  case 'mobileappinfotable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(melement => {
                        if (this.mobileappinfotablecsvValues.indexOf(melement) == -1)
                          this.mobileappinfotablecsvValues.push(melement);
                      });
                    }

                    break;

                  case 'nvcrashreporttable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(nvelement => {
                        if (this.nvcrashreporttablecsvValues.indexOf(nvelement) == -1)
                          this.nvcrashreporttablecsvValues.push(nvelement);
                      });
                    }

                    break;
                  case 'nvjserrortable.csv':
                    if (tmpInd > -1) {
                      tmpData.forEach(jselement => {
                        if (this.nvjserrortablecsvValues.indexOf(jselement) == -1)
                          this.nvjserrortablecsvValues.push(jselement);
                      });
                    }
                    break;
                }
                break;

            }


          });
        }


        if (!components.includes(".csv") && data.split(" ")[1] == "NR_DB_UPLOAD") {

          this.cols.forEach(col => {
            let nrdisk = data.split(" ")[2];
            let tmp = nrdisk.split(",")
            tmp.forEach(el => {
              if (el.indexOf(col.field) > -1) {
                //tmpInd = el.split(',').indexOf(col.field);
                //tmpData = el.split(',');*/

                if (this.nr_db_uploadValues.indexOf(col.field) == -1)
                  this.nr_db_uploadValues.push(col.field);
                if (this.usertimingtablecsvValues.indexOf(col.field) == -1)
                  this.usertimingtablecsvValues.push(col.field);
                if (this.custommetricstablecsvValues.indexOf(col.field) == -1)
                  this.custommetricstablecsvValues.push(col.field);
                if (this.pagetablecsvValues.indexOf(col.field) == -1)
                  this.pagetablecsvValues.push(col.field);
                if (this.eventstablecsvValues.indexOf(col.field) == -1)
                  this.eventstablecsvValues.push(col.field);
                if (this.nvjserrortablecsvValues.indexOf(col.field) == -1)
                  this.nvjserrortablecsvValues.push(col.field);
                if (this.feedbacktablecsvValues.indexOf(col.field) == -1)
                  this.feedbacktablecsvValues.push(col.field);
                if (this.nvcrashreporttablecsvValues.indexOf(col.field) == -1)
                  this.nvcrashreporttablecsvValues.push(col.field);
                if (this.sessiontablecsvValues.indexOf(col.field) == -1)
                  this.sessiontablecsvValues.push(col.field);
                if (this.mobileappinfotablecsvValues.indexOf(col.field) == -1)
                  this.mobileappinfotablecsvValues.push(col.field);
                if (this.xhrdatatablecsvValues.indexOf(col.field) == -1)
                  this.xhrdatatablecsvValues.push(col.field);
                if (this.useractiontablecsvValues.indexOf(col.field) == -1)
                  this.useractiontablecsvValues.push(col.field);
              }
            });


          });
        }

      });
    }
  }

  setFileWithDefaultValues() {
    this.files.forEach(item => {
      item.children.forEach(childcol => {
        this.cols.forEach(col => {
          switch (col.field) {
            case 'components':
              break;
            case 'health':
              break;
            case 'pdisk':
              break;
            default:
              item.data[col.field] = col.field;
              childcol.data[col.field] = col.field;
          }
        });
      });
    });

  }


  GetParserData() {
    let parserdata = [];
    this.httpService.getParsers().subscribe((state: Store.State) => {
      let response = state['data'];
      parserdata = response;
      if (parserdata) {
        parserdata.forEach(item => {
          console.log("PARSERDATA", item);
          switch (item.name) {
            case 'DomainwiseAggregate':
              if (item.tableSpace != "") {
                this.nvdomainwiseaggregatevValues.push(item['tableSpace'])
              }
              break;

            case 'NVCampaignAggregate':
              if (item.tableSpace != "")
                this.nvcampaignaggregateValues.push(item['tableSpace']);
              break;

            case 'NVSessEntryPgAgg':
              if (item.tableSpace != "")
                this.nvsessentrypgaggValues.push(item['tableSpace']);
              break;

            case 'NVTransactionAggregate':
              if (item.tableSpace != "")
                this.nvtransactionaggregateValues.push(item['tableSpace']);
              break;

            case 'NVPagePerformance':
              if (item.tableSpace != "")
                this.nvpageperformanceValues.push(item['tableSpace']);
              break;

            case 'NVSessionAggregate':
              if (item.tableSpace != "")
                this.nvsessionaggregateValues.push(item['tableSpace']);
              break;

            case 'NVResourceAggregate':
              if (item.tableSpace != "")
                this.nvresourceaggregateValues.push(item['tableSpace']);
              break;

            case 'NVPageAggregate':
              if (item.tableSpace != "")
                this.nvpageaggregateValues.push(item['tableSpace']);
              break;
          }
        });
      }
    });

  }

  parsercheckvalue(e, fieldvalue, componentname) {
    document.getElementById('savedisk')['disabled'] = false;
    console.log(e, fieldvalue, componentname);


    switch (componentname) {
      case 'DomainwiseAggregate':
        this.nvdomainwiseaggregatevValues = [];
        this.nvdomainwiseaggregatevValues.push(fieldvalue);
        if (e == false)
          this.nvdomainwiseaggregatevValues = [];

        break;

      case 'NVCampaignAggregate':
        this.nvcampaignaggregateValues = [];
        this.nvcampaignaggregateValues.push(fieldvalue);
        if (e == false)
          this.nvcampaignaggregateValues = [];
        break;

      case 'NVSessEntryPgAgg':
        this.nvsessentrypgaggValues = [];
        this.nvsessentrypgaggValues.push(fieldvalue);
        if (e == false)
          this.nvsessentrypgaggValues = [];
        break;

      case 'NVTransactionAggregate':
        this.nvtransactionaggregateValues = [];
        this.nvtransactionaggregateValues.push(fieldvalue);
        if (e == false)
          this.nvtransactionaggregateValues = [];
        break;

      case 'NVPagePerformance':
        this.nvpageperformanceValues = [];
        this.nvpageperformanceValues.push(fieldvalue);
        if (e == false)
          this.nvpageperformanceValues = [];
        break;

      case 'NVSessionAggregate':
        this.nvsessionaggregateValues = [];
        this.nvsessionaggregateValues.push(fieldvalue);
        if (e == false)
          this.nvsessionaggregateValues = [];
        break;

      case 'NVResourceAggregate':
        this.nvresourceaggregateValues = [];
        this.nvresourceaggregateValues.push(fieldvalue);
        if (e == false)
          this.nvresourceaggregateValues = [];
        break;

      case 'NVPageAggregate':
        this.nvpageaggregateValues = [];
        this.nvpageaggregateValues.push(fieldvalue);
        if (e == false)
          this.nvpageaggregateValues = [];
        break;
    }

  }

  GetDiskThresholdData(slaveid) {
    this.httpService.getRumData(slaveid).subscribe((state: Store.State) => {
      let thresholdresponse = state['data'];
      if (thresholdresponse) {

        if (thresholdresponse['NV_MULTIDISK_OVERLOAD_THRESHOLD']) {
          this.multidiskCriticalThreshold = parseInt(thresholdresponse['NV_MULTIDISK_OVERLOAD_THRESHOLD'].split(' ')[0]);
          this.multidiskMajorThreshold = parseInt(thresholdresponse['NV_MULTIDISK_OVERLOAD_THRESHOLD'].split(' ')[1]);
        }
        if (!thresholdresponse['NV_MULTIDISK_OVERLOAD_THRESHOLD']) {
          this.multidiskCriticalThreshold = 95;
          this.multidiskMajorThreshold = 90;
        }
      }

    });

  }
  GetDiskAlloocationData(slaveid) {
    this.loader = true;
    this.disksummarydata = [];
    this.httpService.getDiskData(slaveid).subscribe((state1: Store.State) => {
      let respondisk = state1['data'];
      if (respondisk) {
        if (slaveid != -1 && respondisk[1] == undefined) {
          respondisk = JSON.parse(respondisk[0]);
        }
        this.loader = false;
        this.diskspacedata = respondisk;

        // Structure for Disk Summary Table
        for (const w of this.diskspacedata) {
          const k = {} as DiskSummaryObject;
          const dp = w.split(' ');
          for (let f = 0; f < dp.length; f++) {
            if (dp[f] === '') {
              dp.splice(f, 1);
              if (dp[f - 1] === '' || dp[f - 2] === '' || dp[f - 3] === '' || dp[f - 4] === '' || dp[f - 5] === '' || dp[f - 6] || dp[f - 7] || dp[f - 8] || dp[f - 9] || dp[f - 10]) {
                f--;
              }
            }
          }
          if (dp[1] === '')
            dp.splice(1, 1);
          if (dp[0] !== 'Filesystem') {
            this.diskusedspace[dp[5]] = dp[4];
            k.filename = dp[0];
            k.mount = dp[5];
            k.status = parseInt(dp[4].split('%')[0]);
            k.size = dp[1];
            k.avail = dp[3];
            this.disksummarydata.push(k);
          }

        }
        this.constructDiscAllocationTable(slaveid);

      } else {
        this.loader = false;
      }
    },
      error => {
        console.log("erorr-->", error);
      }
    );


  }

  RefreshDiskAllocation() {
    if (this.nodevalue == undefined)
      this.nodevalue = -1;
    this.GetDiskThresholdData(this.nodevalue);
    this.GetDiskAlloocationData(this.nodevalue);
  }

  checkvalue(e, fieldvalue, componentname) {
    let hpdvalue = this.hpdValues;
    let nrvalue = this.nr_db_uploadValues;

    let pg = [] = this.pagedumpValues;
    let user = [] = this.useractionValues
    let csv = [] = this.csvValues;
    let feed = [] = this.feedbackValues;

    let pagecsv = this.pagetablecsvValues;
    let sessioncsv = this.sessiontablecsvValues;
    let useracsv = this.useractiontablecsvValues;
    let feedcsv = this.feedbacktablecsvValues;
    let eventcsv = this.eventstablecsvValues;
    let customcsv = this.custommetricstablecsvValues;
    let xhrcsv = this.xhrdatatablecsvValues;
    let usertcsv = this.usertimingtablecsvValues;
    let mobilecsv = this.mobileappinfotablecsvValues;
    let crashcsv = this.nvcrashreporttablecsvValues;
    let jscsv = this.nvjserrortablecsvValues;

    if (componentname == "HPD") {
      if (document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
        document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

      if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
        document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
      }
      if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
        document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
      }
      if (e == true || e == false) {
        this.pagedumpValues = [];
        this.csvValues = [];
        this.useractionValues = [];
        this.feedbackValues = [];
      }

    }
    if (componentname != "NR_DB_UPLOAD" && componentname.includes(".csv")) {
      this.nr_db_uploadValues = [];
    }

    if (componentname != "HPD") {
      if (componentname == "CSV" || componentname == "Pagedump" || componentname == "Feedback" || componentname == "USERACTION") {
        this.hpdValues = [];
      }
    }

    if (componentname == "NR_DB_UPLOAD") {
      if (document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
        document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

      if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
        document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
      }
      if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
        document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
      }
      if (e == true || e == false) {
        this.pagetablecsvValues = [];
        this.sessiontablecsvValues = [];
        this.useractiontablecsvValues = [];
        this.feedbacktablecsvValues = [];
        this.eventstablecsvValues = [];
        this.xhrdatatablecsvValues = []
        this.usertimingtablecsvValues = [];
        this.mobileappinfotablecsvValues = [];
        this.nvcrashreporttablecsvValues = [];
        this.custommetricstablecsvValues = [];
        this.nvjserrortablecsvValues = [];
      }
    }


    const url = '/netvision/samples/multidiskallocation.json';
    fetch(url).then((response) => {

      if (componentname != "NR_DB_UPLOAD" && componentname.includes(".csv")) {

        if (this.pagetablecsvValues.indexOf(fieldvalue) == -1 || this.sessiontablecsvValues.indexOf(fieldvalue) == -1 ||
          this.useractiontablecsvValues.indexOf(fieldvalue) == -1 || this.feedbacktablecsvValues.indexOf(fieldvalue) == -1 || this.custommetricstablecsvValues.indexOf(fieldvalue) == -1 ||
          this.eventstablecsvValues.indexOf(fieldvalue) == -1 || this.xhrdatatablecsvValues.indexOf(fieldvalue) == -1 || this.usertimingtablecsvValues.indexOf(fieldvalue) == -1 ||
          this.mobileappinfotablecsvValues.indexOf(fieldvalue) == -1 || this.nvcrashreporttablecsvValues.indexOf(fieldvalue) == -1 || this.nvjserrortablecsvValues.indexOf(fieldvalue) == -1) {
          if (nrvalue.indexOf(fieldvalue) > -1) {
            let nrid = nrvalue.indexOf(fieldvalue);
            nrvalue.splice(nrid, 1);
          }
          this.nr_db_uploadValues = nrvalue;

        }
        if (this.pagetablecsvValues.indexOf(fieldvalue) > -1 || this.sessiontablecsvValues.indexOf(fieldvalue) > -1 ||
          this.useractiontablecsvValues.indexOf(fieldvalue) > -1 || this.feedbacktablecsvValues.indexOf(fieldvalue) > -1 || this.custommetricstablecsvValues.indexOf(fieldvalue) > -1 ||
          this.eventstablecsvValues.indexOf(fieldvalue) > -1 || this.xhrdatatablecsvValues.indexOf(fieldvalue) > -1 || this.usertimingtablecsvValues.indexOf(fieldvalue) > -1 ||
          this.mobileappinfotablecsvValues.indexOf(fieldvalue) > -1 || this.nvcrashreporttablecsvValues.indexOf(fieldvalue) > -1 || this.nvjserrortablecsvValues.indexOf(fieldvalue) > -1) {
          document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.add('fa');
          document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.add('las-dot-circle');
          document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.add('ui-state-active');
        }

        if (this.pagetablecsvValues.indexOf(fieldvalue) == -1 && this.sessiontablecsvValues.indexOf(fieldvalue) == -1 &&
          this.useractiontablecsvValues.indexOf(fieldvalue) == -1 && this.feedbacktablecsvValues.indexOf(fieldvalue) == -1 && this.custommetricstablecsvValues.indexOf(fieldvalue) == -1 &&
          this.eventstablecsvValues.indexOf(fieldvalue) == -1 && this.xhrdatatablecsvValues.indexOf(fieldvalue) == -1 && this.usertimingtablecsvValues.indexOf(fieldvalue) == -1 &&
          this.mobileappinfotablecsvValues.indexOf(fieldvalue) == -1 && this.nvcrashreporttablecsvValues.indexOf(fieldvalue) == -1 && this.nvjserrortablecsvValues.indexOf(fieldvalue) == -1) {
          if (document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

          if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
          }
          if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
          }
        }

        if (this.pagetablecsvValues.indexOf(fieldvalue) > -1 && this.sessiontablecsvValues.indexOf(fieldvalue) > -1 &&
          this.useractiontablecsvValues.indexOf(fieldvalue) > -1 && this.feedbacktablecsvValues.indexOf(fieldvalue) > -1 && this.custommetricstablecsvValues.indexOf(fieldvalue) > -1 &&
          this.eventstablecsvValues.indexOf(fieldvalue) > -1 && this.xhrdatatablecsvValues.indexOf(fieldvalue) > -1 && this.usertimingtablecsvValues.indexOf(fieldvalue) > -1 &&
          this.mobileappinfotablecsvValues.indexOf(fieldvalue) > -1 && this.nvcrashreporttablecsvValues.indexOf(fieldvalue) > -1 && this.nvjserrortablecsvValues.indexOf(fieldvalue) > -1) {

          if (document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

          if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
          }
          if ((document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
            document.getElementById("nr_db_upload_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
          }
          if (this.nr_db_uploadValues.indexOf(fieldvalue) == -1)
            nrvalue.push(fieldvalue);
        }
        this.nr_db_uploadValues = nrvalue;
      }


      if (componentname != "HPD") {
        if (componentname == "CSV" || componentname == "Pagedump" || componentname == "Feedback" || componentname == "USERACTION") {
          if (this.pagedumpValues.indexOf(fieldvalue) == -1 || this.csvValues.indexOf(fieldvalue) == -1 || this.useractionValues.indexOf(fieldvalue) == -1 || this.feedbackValues.indexOf(fieldvalue) == -1) {
            if (hpdvalue.indexOf(fieldvalue) > -1) {
              let hpid = hpdvalue.indexOf(fieldvalue);
              hpdvalue.splice(hpid, 1);
            }
            this.hpdValues = hpdvalue;
          }
          if (this.pagedumpValues.indexOf(fieldvalue) > -1 || this.csvValues.indexOf(fieldvalue) > -1 || this.useractionValues.indexOf(fieldvalue) > -1 || this.feedbackValues.indexOf(fieldvalue) > -1) {
            document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.add('fa');
            document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.add('las-dot-circle');
            document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.add('ui-state-active');
          }
          if (this.pagedumpValues.indexOf(fieldvalue) == -1 && this.csvValues.indexOf(fieldvalue) == -1 && this.useractionValues.indexOf(fieldvalue) == -1 && this.feedbackValues.indexOf(fieldvalue) == -1) {
            if (document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

            if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
            }
            if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
            }
          }
          if (this.pagedumpValues.indexOf(fieldvalue) > -1 && this.csvValues.indexOf(fieldvalue) > -1 && this.useractionValues.indexOf(fieldvalue) > -1 && this.feedbackValues.indexOf(fieldvalue) > -1) {
            if (document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.contains('ui-state-active') == true)
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].classList.remove('ui-state-active');

            if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('las-dot-circle');
            }
            if ((document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.contains('fa')) == true) {
              document.getElementById("hpd_" + fieldvalue).children[0].children[1].children[0].classList.remove('fa');
            }
            if (hpdvalue.indexOf(fieldvalue) == -1)
              hpdvalue.push(fieldvalue);
          }
          this.hpdValues = hpdvalue;
        }
      }
      if (componentname == "NR_DB_UPLOAD") {
        if (e == true) {
          pagecsv.push(fieldvalue);
          pagecsv = this.getUnique(pagecsv)
          useracsv.push(fieldvalue);
          sessioncsv.push(fieldvalue);
          sessioncsv = this.getUnique(sessioncsv)
          feedcsv.push(fieldvalue);
          feedcsv = this.getUnique(feedcsv)
          eventcsv.push(fieldvalue);
          eventcsv = this.getUnique(eventcsv)
          customcsv.push(fieldvalue);
          customcsv = this.getUnique(customcsv);

          xhrcsv.push(fieldvalue);
          xhrcsv = this.getUnique(xhrcsv)
          usertcsv.push(fieldvalue);
          usertcsv = this.getUnique(usertcsv)
          mobilecsv.push(fieldvalue);
          mobilecsv = this.getUnique(mobilecsv)
          crashcsv.push(fieldvalue);
          crashcsv = this.getUnique(crashcsv)
          jscsv.push(fieldvalue);
          jscsv = this.getUnique(jscsv)

        }

        if (e == false) {
          if (pagecsv.indexOf(fieldvalue) > -1) {
            let pageind = pagecsv.indexOf(fieldvalue)
            pagecsv.splice(pageind, 1);
          }
          if (useracsv.indexOf(fieldvalue) > -1) {
            let useracind = useracsv.indexOf(fieldvalue)
            useracsv.splice(useracind, 1);
          }
          if (sessioncsv.indexOf(fieldvalue) > -1) {
            let sessind = sessioncsv.indexOf(fieldvalue)
            sessioncsv.splice(sessind, 1);
          }
          if (feedcsv.indexOf(fieldvalue) > -1) {
            let feedind = feedcsv.indexOf(fieldvalue)
            feedcsv.splice(feedind, 1);
          }
          if (customcsv.indexOf(fieldvalue) > -1) {
            let customind = customcsv.indexOf(fieldvalue);
            customcsv.splice(customind, 1);
          }
          if (eventcsv.indexOf(fieldvalue) > -1) {
            let eeventind = eventcsv.indexOf(fieldvalue);
            eventcsv.splice(eeventind, 1);
          }
          if (xhrcsv.indexOf(fieldvalue) > -1) {
            let xhrind = xhrcsv.indexOf(fieldvalue);
            xhrcsv.splice(xhrind, 1);
          }
          if (usertcsv.indexOf(fieldvalue) > -1) {
            let usertind = usertcsv.indexOf(fieldvalue);
            usertcsv.splice(usertind, 1);
          }

          if (mobilecsv.indexOf(fieldvalue) > -1) {
            let mobind = mobilecsv.indexOf(fieldvalue)
            mobilecsv.splice(mobind, 1);
          }
          if (crashcsv.indexOf(fieldvalue) > -1) {
            let crashind = crashcsv.indexOf(fieldvalue);
            crashcsv.splice(crashind, 1);
          }
          jscsv.splice(jscsv.indexOf(fieldvalue), 1);

        }
        this.pagetablecsvValues = pagecsv;
        this.useractiontablecsvValues = useracsv;
        this.sessiontablecsvValues = sessioncsv;
        this.feedbacktablecsvValues = feedcsv;
        this.custommetricstablecsvValues = customcsv;
        this.eventstablecsvValues = eventcsv;
        this.xhrdatatablecsvValues = xhrcsv;
        this.usertimingtablecsvValues = usertcsv;
        this.mobileappinfotablecsvValues = mobilecsv;
        this.nvcrashreporttablecsvValues = crashcsv;
        this.nvjserrortablecsvValues = jscsv

      }


      if (componentname == "HPD") {
        if (e == true) {
          pg.push(fieldvalue);
          pg = this.getUnique(pg)
          user.push(fieldvalue);
          user = this.getUnique(user);
          csv.push(fieldvalue);
          csv = this.getUnique(csv);
          feed.push(fieldvalue);
          feed = this.getUnique(feed)
        }
        if (e == false) {
          pg.splice(pg.indexOf(fieldvalue), 1);
          user.splice(user.indexOf(fieldvalue), 1);
          csv.splice(csv.indexOf(fieldvalue), 1);
          feed.splice(feed.indexOf(fieldvalue), 1);
        }
        this.pagedumpValues = pg;

        this.csvValues = csv;
        this.useractionValues = user;
        this.feedbackValues = feed;

      }

      for (const data of this.multidiskresponse) {
        // check if the response contains NV_ASSIGN_MULTIDISK_TABLESPACE
        if (data.indexOf('NV_ASSIGN_MULTIDISK_TABLESPACE') > -1) {
          if (data.split(' ')[1] == "HPD") {
            let pdata = data.split(" ");
            this.files[0].children[2].data['alert'] = this.alertPDisk(this.files[0].children[2].data['pdisk'], this.csvValues);
            this.files[0].children[0].data['alert'] = this.alertPDisk(this.files[0].children[0].data['pdisk'], this.pagedumpValues);
            this.files[0].children[1].data['alert'] = this.alertPDisk(this.files[0].children[1].data['pdisk'], this.useractionValues);
            this.files[0].children[3].data['alert'] = this.alertPDisk(this.files[0].children[3].data['pdisk'], this.feedbackValues);

          }
          if (data.split(' ')[1] == "NR_DB_UPLOAD" && this.isDBBoolean == true) {
            let pdata = data.split(" ");
            this.files[1].children[0].data['alert'] = this.alertPDisk(this.files[1].children[0].data['pdisk'], this.pagetablecsvValues);
            this.files[1].children[1].data['alert'] = this.alertPDisk(this.files[1].children[1].data['pdisk'], this.sessiontablecsvValues);
            this.files[1].children[2].data['alert'] = this.alertPDisk(this.files[1].children[2].data['pdisk'], this.useractiontablecsvValues);
            this.files[1].children[3].data['alert'] = this.alertPDisk(this.files[1].children[3].data['pdisk'], this.feedbacktablecsvValues);
            this.files[1].children[4].data['alert'] = this.alertPDisk(this.files[1].children[4].data['pdisk'], this.custommetricstablecsvValues);
            this.files[1].children[5].data['alert'] = this.alertPDisk(this.files[1].children[5].data['pdisk'], this.eventstablecsvValues);
            this.files[1].children[6].data['alert'] = this.alertPDisk(this.files[1].children[6].data['pdisk'], this.xhrdatatablecsvValues);
            this.files[1].children[7].data['alert'] = this.alertPDisk(this.files[1].children[7].data['pdisk'], this.usertimingtablecsvValues);
            this.files[1].children[8].data['alert'] = this.alertPDisk(this.files[1].children[8].data['pdisk'], this.mobileappinfotablecsvValues);
            this.files[1].children[9].data['alert'] = this.alertPDisk(this.files[1].children[9].data['pdisk'], this.nvcrashreporttablecsvValues);
            this.files[1].children[10].data['alert'] = this.alertPDisk(this.files[1].children[10].data['pdisk'], this.nvjserrortablecsvValues);

          }
        }
      }
      this.CheckPostData();


    });
  }

  getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }
  //this method is used to check wtheher to put dot or check mark in HPD AND NR_DB_UPLOAD
  CheckDotCondiition(fieldvaluecol) {

    //for Hpd checkbox
    let boolencheckinghpd = false;
    let booleannrdb = false;
    if (this.pagedumpValues.indexOf(fieldvaluecol) > -1 && this.csvValues.indexOf(fieldvaluecol) > -1 && this.feedbackValues.indexOf(fieldvaluecol) > -1 &&
      this.useractionValues.indexOf(fieldvaluecol) > -1) {
      boolencheckinghpd = true;
      if (this.hpdValues.indexOf(fieldvaluecol) == -1) {
        if (document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].classList.contains('ui-state-active') == true)
          document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].classList.remove('ui-state-active');

        if ((document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
          document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.remove('las-dot-circle');
        }
        if ((document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.contains('fa')) == true) {
          document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.remove('fa');
        }
        this.hpdValues.push(fieldvaluecol);
      }
    }
    if (boolencheckinghpd == false) {
      if (this.pagedumpValues.indexOf(fieldvaluecol) > -1 || this.csvValues.indexOf(fieldvaluecol) > -1 || this.feedbackValues.indexOf(fieldvaluecol) > -1 ||
        this.useractionValues.indexOf(fieldvaluecol) > -1) {
        document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.add('fa');
        document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].children[0].classList.add('las-dot-circle');
        document.getElementById("hpd_" + fieldvaluecol).children[0].children[1].classList.add('ui-state-active');
      }
    }

    // for nrdb checkbox

    if (this.pagetablecsvValues.indexOf(fieldvaluecol) > -1 && this.sessiontablecsvValues.indexOf(fieldvaluecol) > -1 &&
      this.useractiontablecsvValues.indexOf(fieldvaluecol) > -1 && this.feedbacktablecsvValues.indexOf(fieldvaluecol) > -1 && this.custommetricstablecsvValues.indexOf(fieldvaluecol) > -1 &&
      this.eventstablecsvValues.indexOf(fieldvaluecol) > -1 && this.xhrdatatablecsvValues.indexOf(fieldvaluecol) > -1 && this.usertimingtablecsvValues.indexOf(fieldvaluecol) > -1 &&
      this.mobileappinfotablecsvValues.indexOf(fieldvaluecol) > -1 && this.nvcrashreporttablecsvValues.indexOf(fieldvaluecol) > -1 && this.nvjserrortablecsvValues.indexOf(fieldvaluecol) > -1) {
      booleannrdb = true;

      if (this.nr_db_uploadValues.indexOf(fieldvaluecol) == -1) {
        if (document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].classList.contains('ui-state-active') == true)
          document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].classList.remove('ui-state-active');

        if ((document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.contains('las-dot-circle')) == true) {
          document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.remove('las-dot-circle');
        }
        if ((document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.contains('fa')) == true) {
          document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.remove('fa');
        }
        this.nr_db_uploadValues.push(fieldvaluecol);
      }
    }
    if (booleannrdb == false) {
      if (this.pagetablecsvValues.indexOf(fieldvaluecol) > -1 || this.sessiontablecsvValues.indexOf(fieldvaluecol) > -1 ||
        this.useractiontablecsvValues.indexOf(fieldvaluecol) > -1 || this.feedbacktablecsvValues.indexOf(fieldvaluecol) > -1 || this.custommetricstablecsvValues.indexOf(fieldvaluecol) > -1 ||
        this.eventstablecsvValues.indexOf(fieldvaluecol) > -1 || this.xhrdatatablecsvValues.indexOf(fieldvaluecol) > -1 || this.usertimingtablecsvValues.indexOf(fieldvaluecol) > -1 ||
        this.mobileappinfotablecsvValues.indexOf(fieldvaluecol) > -1 || this.nvcrashreporttablecsvValues.indexOf(fieldvaluecol) > -1 || this.nvjserrortablecsvValues.indexOf(fieldvaluecol) > -1) {
        document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.add('fa');
        document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].children[0].classList.add('las-dot-circle');
        document.getElementById("nr_db_upload_" + fieldvaluecol).children[0].children[1].classList.add('ui-state-active');
      }
    }

  }

  CheckPostData() {
    let finalpagecsv = this.pagetablecsvValues;
    let finalsessioncsv = this.sessiontablecsvValues;
    let finaluseraccsv = this.useractiontablecsvValues;
    let finalfeedcsv = this.feedbacktablecsvValues;
    let finalcustomcsv = this.custommetricstablecsvValues;
    let finaleventcsv = this.eventstablecsvValues;
    let finalxhrcsv = this.xhrdatatablecsvValues;
    let finalusertcsv = this.usertimingtablecsvValues;
    let finalmobilecsv = this.mobileappinfotablecsvValues;
    let finalcrashcsv = this.nvcrashreporttablecsvValues;
    let finaljserrorcsv = this.nvjserrortablecsvValues;

    let finalpagedump = this.pagedumpValues;
    let finaluseraction = this.useractionValues;
    let finalcsv = this.csvValues;
    let finalfeedback = this.feedbackValues;
    //     // sort the response in ascending order
    // prepare all the components data as in rum format
    this.defaultPostData = new Array(17);
    //for HPD   Component
    this.defaultPostData[0] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[0].data['components']} ${this.pagedumpValues.join(',')} ${this.files[0].children[0].data['pdisk']}`;
    this.defaultPostData[1] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[1].data['components']} ${this.useractionValues.join(',')} ${this.files[0].children[1].data['pdisk']}`;
    this.defaultPostData[2] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[2].data['components']} ${this.csvValues.join(',')} ${this.files[0].children[2].data['pdisk']}`;
    this.defaultPostData[3] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[3].data['components']} ${this.feedbackValues.join(',')} ${this.files[0].children[3].data['pdisk']}`;
    //for NR_DB_UPLOAD Component
    if (this.isDBBoolean == true) {
      this.defaultPostData[4] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[0].data['components']} ${this.pagetablecsvValues.join(',')} ${this.files[1].children[0].data['pdisk']}`;
      this.defaultPostData[5] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[1].data['components']} ${this.sessiontablecsvValues.join(',')} ${this.files[1].children[1].data['pdisk']}`;
      this.defaultPostData[6] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[2].data['components']} ${this.useractiontablecsvValues.join(',')} ${this.files[1].children[2].data['pdisk']}`;
      this.defaultPostData[7] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[3].data['components']} ${this.feedbacktablecsvValues.join(',')} ${this.files[1].children[3].data['pdisk']}`;
      this.defaultPostData[8] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[4].data['components']} ${this.custommetricstablecsvValues.join(',')} ${this.files[1].children[4].data['pdisk']}`;
      this.defaultPostData[9] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[5].data['components']} ${this.eventstablecsvValues.join(',')} ${this.files[1].children[5].data['pdisk']}`;
      this.defaultPostData[10] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[6].data['components']} ${this.xhrdatatablecsvValues.join(',')} ${this.files[1].children[6].data['pdisk']}`;
      this.defaultPostData[11] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[7].data['components']} ${this.usertimingtablecsvValues.join(',')} ${this.files[1].children[7].data['pdisk']}`;
      this.defaultPostData[12] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[8].data['components']} ${this.mobileappinfotablecsvValues.join(',')} ${this.files[1].children[8].data['pdisk']}`;
      this.defaultPostData[13] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[9].data['components']} ${this.nvcrashreporttablecsvValues.join(',')} ${this.files[1].children[9].data['pdisk']}`;
      this.defaultPostData[14] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[10].data['components']} ${this.nvjserrortablecsvValues.join(',')} ${this.files[1].children[10].data['pdisk']}`;
      this.defaultPostData[15] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.nr_db_uploadValues.join(',')} ${this.files[1].children[0].data['pdisk']}`;
    }
    this.defaultPostData[16] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.hpdValues.join(',')} ${this.files[0].children[1].data['pdisk']}`;

    if (this.nr_db_uploadValues.length > 0) {
      this.nr_db_uploadValues.forEach(nrdata => {
        if (this.pagetablecsvValues.indexOf(nrdata) > -1) {

          let finalpageind = this.pagetablecsvValues.indexOf(nrdata);
          finalpagecsv.splice(finalpageind, 1)
          this.defaultPostData[4] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[0].data['components']} ${finalpagecsv.join(',')} ${this.files[1].children[0].data['pdisk']}`;

        }
        if (this.sessiontablecsvValues.indexOf(nrdata) > -1) {

          let finalsessind = this.sessiontablecsvValues.indexOf(nrdata);
          finalsessioncsv.splice(finalsessind, 1)
          this.defaultPostData[5] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[1].data['components']} ${finalsessioncsv.join(',')} ${this.files[1].children[1].data['pdisk']}`;

        }
        if (this.useractiontablecsvValues.indexOf(nrdata) > -1) {

          let finaluseracind = this.useractiontablecsvValues.indexOf(nrdata);
          finaluseraccsv.splice(finaluseracind, 1)
          this.defaultPostData[6] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[2].data['components']} ${finaluseraccsv.join(',')} ${this.files[1].children[2].data['pdisk']}`;

        }
        if (this.feedbacktablecsvValues.indexOf(nrdata) > -1) {

          let finalfeedind = this.feedbacktablecsvValues.indexOf(nrdata);
          finalfeedcsv.splice(finalfeedind, 1)
          this.defaultPostData[7] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[3].data['components']} ${finalfeedcsv.join(',')} ${this.files[1].children[3].data['pdisk']}`;

        }

        if (this.custommetricstablecsvValues.indexOf(nrdata) > -1) {

          let finalcustomind = this.custommetricstablecsvValues.indexOf(nrdata);
          finalcustomcsv.splice(finalcustomind, 1)
          this.defaultPostData[8] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[4].data['components']} ${finalcustomcsv.join(',')} ${this.files[1].children[4].data['pdisk']}`;

        }
        if (this.eventstablecsvValues.indexOf(nrdata) > -1) {

          let finaleventind = this.eventstablecsvValues.indexOf(nrdata);
          finaleventcsv.splice(finaleventind, 1)
          this.defaultPostData[9] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[5].data['components']} ${finaleventcsv.join(',')} ${this.files[1].children[5].data['pdisk']}`;

        }
        if (this.xhrdatatablecsvValues.indexOf(nrdata) > -1) {

          let finalxhrind = this.xhrdatatablecsvValues.indexOf(nrdata);
          finalxhrcsv.splice(finalxhrind, 1)
          this.defaultPostData[10] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[6].data['components']} ${finalxhrcsv.join(',')} ${this.files[1].children[6].data['pdisk']}`;

        }
        if (this.usertimingtablecsvValues.indexOf(nrdata) > -1) {

          let finalusertind = this.usertimingtablecsvValues.indexOf(nrdata);
          finalusertcsv.splice(finalusertind, 1)
          this.defaultPostData[11] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[7].data['components']} ${finalusertcsv.join(',')} ${this.files[1].children[7].data['pdisk']}`;

        }
        if (this.mobileappinfotablecsvValues.indexOf(nrdata) > -1) {

          let finalmobileind = this.mobileappinfotablecsvValues.indexOf(nrdata);
          finalmobilecsv.splice(finalmobileind, 1)
          this.defaultPostData[12] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[8].data['components']} ${finalmobilecsv.join(',')} ${this.files[1].children[8].data['pdisk']}`;

        }
        if (this.nvcrashreporttablecsvValues.indexOf(nrdata) > -1) {

          let finalcrashind = this.nvcrashreporttablecsvValues.indexOf(nrdata);
          finalcrashcsv.splice(finalcrashind, 1)
          this.defaultPostData[13] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[9].data['components']} ${finalcrashcsv.join(',')} ${this.files[1].children[9].data['pdisk']}`;

        }
        if (this.nvjserrortablecsvValues.indexOf(nrdata) > -1) {

          let finaljserrorind = this.nvjserrortablecsvValues.indexOf(nrdata);
          finaljserrorcsv.splice(finaljserrorind, 1)
          this.defaultPostData[14] = `NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[10].data['components']} ${finaljserrorcsv.join(',')} ${this.files[1].children[10].data['pdisk']}`;

        }

      });

      this.nr_db_uploadValues.forEach(pushnrdata => {
        this.pagetablecsvValues.push(pushnrdata);
        this.sessiontablecsvValues.push(pushnrdata);
        this.useractiontablecsvValues.push(pushnrdata);
        this.feedbacktablecsvValues.push(pushnrdata);
        this.custommetricstablecsvValues.push(pushnrdata);
        this.eventstablecsvValues.push(pushnrdata);
        this.xhrdatatablecsvValues.push(pushnrdata);
        this.usertimingtablecsvValues.push(pushnrdata);
        this.mobileappinfotablecsvValues.push(pushnrdata);
        this.nvcrashreporttablecsvValues.push(pushnrdata);
        this.nvjserrortablecsvValues.push(pushnrdata);
      });

    }

    if (this.hpdValues.length > 0) {
      this.hpdValues.forEach(hpdata => {
        if (this.pagedumpValues.indexOf(hpdata) > -1) {

          let finalpagedumpind = this.pagedumpValues.indexOf(hpdata);
          finalpagedump.splice(finalpagedumpind, 1)
          this.defaultPostData[0] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[0].data['components']} ${finalpagedump.join(',')} ${this.files[0].children[0].data['pdisk']}`;

        }
        if (this.useractionValues.indexOf(hpdata) > -1) {

          let finaluseractionind = this.useractionValues.indexOf(hpdata);
          finaluseraction.splice(finaluseractionind, 1)
          this.defaultPostData[1] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[1].data['components']} ${finaluseraction.join(',')} ${this.files[0].children[1].data['pdisk']}`;

        }
        if (this.csvValues.indexOf(hpdata) > -1) {

          let finalcsvind = this.csvValues.indexOf(hpdata);
          finalcsv.splice(finalcsvind, 1)
          this.defaultPostData[2] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[2].data['components']} ${finalcsv.join(',')} ${this.files[0].children[2].data['pdisk']}`;

        }
        if (this.feedbackValues.indexOf(hpdata) > -1) {

          let finalfeedbackind = this.feedbackValues.indexOf(hpdata);
          finalfeedback.splice(finalfeedbackind, 1)
          this.defaultPostData[3] = `NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[3].data['components']} ${finalfeedback.join(',')} ${this.files[0].children[3].data['pdisk']}`;

        }


      });

      this.hpdValues.forEach(pushhpdata => {
        this.pagedumpValues.push(pushhpdata);
        this.useractionValues.push(pushhpdata);
        this.csvValues.push(pushhpdata);
        this.feedbackValues.push(pushhpdata);
      });
    }


    this.postData = [];
    for (const i of this.multidiskresponse) {
      let dbflag: boolean;
      // check if the response contains NV_ASSIGN_MULTIDISK_TABLESPACE
      if (i.indexOf('NV_ASSIGN_MULTIDISK_TABLESPACE') > -1) {
        if (i.indexOf('isDBLocal') > -1) {
          dbflag = i.split(":")[1];
        }
        switch (i.split(' ')[2]) {
          case 'Pagedump':
            if (i !== this.defaultPostData[0]) {
              if (this.defaultPostData[0].split(" ")[3] == "")
                this.postData.push("Pagedump")
              else
                this.postData.push(this.defaultPostData[0]);
            }
            break;

          case 'USERACTION':
            if (i !== this.defaultPostData[1]) {
              if (this.defaultPostData[1].split(" ")[3] == "")
                this.postData.push("USERACTION")
              else
                this.postData.push(this.defaultPostData[1]);
            }
            break;

          case 'CSV':
            if (i !== this.defaultPostData[2]) {
              if (this.defaultPostData[2].split(" ")[3] == "")
                this.postData.push("CSV")
              else
                this.postData.push(this.defaultPostData[2]);
            }
            break;

          case 'Feedback':
            if (i !== this.defaultPostData[3]) {
              if (this.defaultPostData[3].split(" ")[3] == "")
                this.postData.push("Feedback")
              else
                this.postData.push(this.defaultPostData[3]);
            }
            break;

          case 'pagetable.csv':
            if (i !== this.defaultPostData[4] && dbflag == true) {
              if (this.defaultPostData[4].split(" ")[3] == "")
                this.postData.push("pagetable.csv")
              else
                this.postData.push(this.defaultPostData[4]);
            }
            break;
          case 'sessiontable.csv':
            if (i !== this.defaultPostData[5] && dbflag == true) {
              if (this.defaultPostData[5].split(" ")[3] == "")
                this.postData.push("sessiontable.csv")
              else
                this.postData.push(this.defaultPostData[5]);
            }
            break;

          case 'useractiontable.csv':
            if (i !== this.defaultPostData[6] && dbflag == true) {
              if (this.defaultPostData[6].split(" ")[3] == "")
                this.postData.push("useractiontable.csv")
              else
                this.postData.push(this.defaultPostData[6]);
            }
            break;
          case 'feedbacktable.csv':
            if (i !== this.defaultPostData[7] && dbflag == true) {
              if (this.defaultPostData[7].split(" ")[3] == "")
                this.postData.push("feedbacktable.csv")
              else
                this.postData.push(this.defaultPostData[7]);
            }
            break;
          case 'custommetricstable.csv':
            if (i !== this.defaultPostData[8] && dbflag == true) {
              if (this.defaultPostData[8].split(" ")[3] == "")
                this.postData.push("custommetricstable.csv")
              else
                this.postData.push(this.defaultPostData[8]);
            }
            break;
          case 'eventstable.csv':
            if (i !== this.defaultPostData[9] && dbflag == true) {
              if (this.defaultPostData[9].split(" ")[3] == "")
                this.postData.push("eventstable.csv")
              else
                this.postData.push(this.defaultPostData[9]);
            }
            break;
          case 'xrdatatable.csv':
            if (i !== this.defaultPostData[10] && dbflag == true) {
              if (this.defaultPostData[10].split(" ")[3] == "")
                this.postData.push("xrdatatable.csv")
              else
                this.postData.push(this.defaultPostData[10]);
            }
            break;
          case 'usertimingtable.csv':
            if (i !== this.defaultPostData[11] && dbflag == true) {
              if (this.defaultPostData[11].split(" ")[3] == "")
                this.postData.push("usertimingtable.csv")
              else
                this.postData.push(this.defaultPostData[11]);
            }
            break;
          case 'mobileappinfotable.csv':
            if (i !== this.defaultPostData[12] && dbflag == true) {
              if (this.defaultPostData[12].split(" ")[3] == "")
                this.postData.push("mobileappinfotable.csv")
              else
                this.postData.push(this.defaultPostData[12]);
            }
            break;
          case 'nvcrashreporttable.csv':
            if (i !== this.defaultPostData[13] && dbflag == true) {
              if (this.defaultPostData[13].split(" ")[3] == "")
                this.postData.push("nvcrashreporttable.csv")
              else
                this.postData.push(this.defaultPostData[13]);
            }
            break;
          case 'nvjserrortable.csv':
            if (i !== this.defaultPostData[14] && dbflag == true) {
              if (this.defaultPostData[14].split(" ")[3] == "")
                this.postData.push("nvjserrortable.csv")
              else
                this.postData.push(this.defaultPostData[14]);
            }
            break;
        }

        switch (i.split(' ')[1]) {
          case 'NR_DB_UPLOAD':
            if (this.nr_db_uploadValues.length > 0) {
              if (i !== this.defaultPostData[15] && !i.includes(".csv")) {
                if (this.postData.indexOf(this.defaultPostData[15]) == -1)
                  this.postData.push(this.defaultPostData[15]);
              }
            }
            break;

          case 'HPD':
            if (this.hpdValues.length > 0) {
              if (i !== this.defaultPostData[16] && !i.includes("Pagedump") && !i.includes("USERACTION") && !i.includes("CSV") && !i.includes("Feedback")) {
                if (this.postData.indexOf(this.defaultPostData[16]) == -1)
                  this.postData.push(this.defaultPostData[16]);
              }
            }
            break;
        }


      }


    }


    const tmpArr = this.defaultPostData.filter(val => !this.postData.includes(val) && !this.multidiskresponse.includes(val));

    console.log('reamining data - ', tmpArr);

    tmpArr.forEach(item => {
      if (item.split(' ')[3] !== undefined && isNaN(item.split(' ')[3]) && item.split(' ')[3].length) {
        this.postData.push(item);
      }
    });


    if (this.postData.length == 0) {
      document.getElementById('savedisk')['disabled'] = true
    } else {
      document.getElementById('savedisk')['disabled'] = false;
    }
    console.log('this.postData ---', this.postData);


  }

  saveDiskAllocation() {
    this.loader = true;
    this.postData = [];
    let postmultidiskdata = [];
    let parserdata = [];


    this.CheckPostData();
    //FOR HPD
    if (this.hpdValues.length == this.pagedumpValues.length && this.hpdValues.length == this.csvValues.length && this.hpdValues.length ==
      this.feedbackValues.length && this.hpdValues.length == this.useractionValues.length && this.files[0].children[0].data['pdisk'] == this.files[0].children[1].data['pdisk'] && this.files[0].children[0].data['pdisk'] == this.files[0].children[2].data['pdisk'] &&
      this.files[0].children[0].data['pdisk'] == this.files[0].children[3].data['pdisk']) {
      postmultidiskdata.push(this.defaultPostData[16]);
    }
    else {
      postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[0].data['components']} ${this.pagedumpValues.join(',')} ${this.files[0].children[0].data['pdisk']}`);
      postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[1].data['components']} ${this.useractionValues.join(',')} ${this.files[0].children[1].data['pdisk']}`);
      postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[2].data['components']} ${this.csvValues.join(',')} ${this.files[0].children[2].data['pdisk']}`);
      postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE HPD ${this.files[0].children[3].data['components']} ${this.feedbackValues.join(',')} ${this.files[0].children[3].data['pdisk']}`);
    }

    // For NR_DB_UPLOAD
    if (this.isDBBoolean == true) {
      if (this.nr_db_uploadValues.length == this.pagetablecsvValues.length && this.nr_db_uploadValues.length == this.sessiontablecsvValues.length && this.nr_db_uploadValues.length == this.usertimingtablecsvValues.length &&
        this.nr_db_uploadValues.length == this.feedbacktablecsvValues.length && this.nr_db_uploadValues.length == this.custommetricstablecsvValues.length &&
        this.nr_db_uploadValues.length == this.eventstablecsvValues.length && this.nr_db_uploadValues.length == this.xhrdatatablecsvValues.length &&
        this.nr_db_uploadValues.length == this.usertimingtablecsvValues.length && this.nr_db_uploadValues.length == this.mobileappinfotablecsvValues.length &&
        this.nr_db_uploadValues.length == this.nvcrashreporttablecsvValues.length && this.nr_db_uploadValues.length == this.nvjserrortablecsvValues.length && this.files[1].children[0].data['pdisk'] == this.files[1].children[1].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[2].data['pdisk'] &&
        this.files[1].children[0].data['pdisk'] == this.files[1].children[3].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[4].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[5].data['pdisk'] &&
        this.files[1].children[0].data['pdisk'] == this.files[1].children[6].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[7].data['pdisk']
        && this.files[1].children[0].data['pdisk'] == this.files[1].children[8].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[9].data['pdisk'] && this.files[1].children[0].data['pdisk'] == this.files[1].children[10].data['pdisk']) {
        postmultidiskdata.push(this.defaultPostData[15]);
      }
      else {
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[0].data['components']} ${this.pagetablecsvValues.join(',')} ${this.files[1].children[0].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[1].data['components']} ${this.sessiontablecsvValues.join(',')} ${this.files[1].children[1].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[2].data['components']} ${this.useractiontablecsvValues.join(',')} ${this.files[1].children[2].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[3].data['components']} ${this.feedbacktablecsvValues.join(',')} ${this.files[1].children[3].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[4].data['components']} ${this.custommetricstablecsvValues.join(',')} ${this.files[1].children[4].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[5].data['components']} ${this.eventstablecsvValues.join(',')} ${this.files[1].children[5].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[6].data['components']} ${this.xhrdatatablecsvValues.join(',')} ${this.files[1].children[6].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[7].data['components']} ${this.usertimingtablecsvValues.join(',')} ${this.files[1].children[7].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[8].data['components']} ${this.mobileappinfotablecsvValues.join(',')} ${this.files[1].children[8].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[9].data['components']} ${this.nvcrashreporttablecsvValues.join(',')} ${this.files[1].children[9].data['pdisk']}`);
        postmultidiskdata.push(`NV_ASSIGN_MULTIDISK_TABLESPACE NR_DB_UPLOAD ${this.files[1].children[10].data['components']} ${this.nvjserrortablecsvValues.join(',')} ${this.files[1].children[10].data['pdisk']}`);
      }
    }
    //----PARSER------
    console.log("VALUEEE", this.nvdomainwiseaggregatevValues);
    if (this.nvdomainwiseaggregatevValues.join(',') != "")
      parserdata.push(`DomainwiseAggregate '${this.nvdomainwiseaggregatevValues.join(',')}'`);
    if (this.nvdomainwiseaggregatevValues.join(',') == "")
      parserdata.push(`DomainwiseAggregate '' `)


    if (this.nvcampaignaggregateValues.join(',') != "")
      parserdata.push(`NVCampaignAggregate '${this.nvcampaignaggregateValues.join(',')}'`);
    if (this.nvcampaignaggregateValues.join(',') == "")
      parserdata.push(`NVCampaignAggregate '' `)

    if (this.nvsessentrypgaggValues.join(',') != "")
      parserdata.push(`NVSessEntryPgAgg '${this.nvsessentrypgaggValues.join(',')}'`);
    if (this.nvsessentrypgaggValues.join(',') == "")
      parserdata.push(`NVSessEntryPgAgg '' `)

    if (this.nvtransactionaggregateValues.join(',') != "")
      parserdata.push(`NVTransactionAggregate '${this.nvtransactionaggregateValues.join(',')}'`);
    if (this.nvtransactionaggregateValues.join(',') == "")
      parserdata.push(`NVTransactionAggregate '' `)

    if (this.nvpageperformanceValues.join(',') != "")
      parserdata.push(`NVPagePerformance '${this.nvpageperformanceValues.join(',')}'`);
    if (this.nvpageperformanceValues.join(',') == "")
      parserdata.push(`NVPagePerformance '' `)

    if (this.nvsessionaggregateValues.join(',') != "")
      parserdata.push(`NVSessionAggregate '${this.nvsessionaggregateValues.join(',')}'`);
    if (this.nvsessionaggregateValues.join(',') == "")
      parserdata.push(`NVSessionAggregate '' `)


    if (this.nvresourceaggregateValues.join(',') != "")
      parserdata.push(`NVResourceAggregate '${this.nvresourceaggregateValues.join(',')}'`);
    if (this.nvresourceaggregateValues.join(',') == "")
      parserdata.push(`NVResourceAggregate '' `)

    if (this.nvpageaggregateValues.join(',') != "")
      parserdata.push(`NVPageAggregate '${this.nvpageaggregateValues.join(',')}'`);
    if (this.nvpageaggregateValues.join(',') == "")
      parserdata.push(`NVPageAggregate '' `)

    console.log("PARSER", parserdata);



    document.getElementById('savedisk')['disabled'] = true
    if (this.nodevalue == undefined)
      this.nodevalue = -1;
    this.httpService.SaveDiskAllocation(postmultidiskdata, this.nodevalue).subscribe((state3: Store.State) => {
      let response = state3['data'];
      if (response) {

        this.httpService.UpdateParerTablespace(parserdata).subscribe((response) => {
          this.constructDiscAllocationTable(this.nodevalue);
        });
        this.messageService.add({ severity: 'success', summary: 'Successfully Saved', detail: '' });
      }

    }, (error) => {
      this.loader = false;
      this.messageService.add({ severity: 'error', summary: error.statusText, detail: '' });
      // this._snackBar.open(error.statusText, 'ok', {
      //   duration: 2000,
      // });
    });

  }

  nodeExpand() {
    setTimeout(() => {
      for (var k of this.cols) {
        if (k.field != "components" && k.field != "health" && k.field != "pdisk") {
          const fieldvalue = k.field;
          this.CheckDotCondiition(fieldvalue);
        }
      }
    }, 400);

  }
  nodeCollapsed() {
    setTimeout(() => {
      for (var t of this.cols) {
        if (t.field != "components" && t.field != "health" && t.field != "pdisk") {
          const fieldvalue = t.field;
          this.CheckDotCondiition(fieldvalue);
        }
      }
    }, 400);

  }
  ParrallelDisk(data) {
    this.pdiskheader = data.components.toUpperCase();
    //FOR NR_DB_UPLOAD
    if (data.components == "custommetricstable.csv") {
      this.actualpdisk = this.custommetricstablecsvValues.length;
    }
    if (data.components == "pagetable.csv") {
      this.actualpdisk = this.pagetablecsvValues.length;
    }
    if (data.components == "sessiontable.csv") {
      this.actualpdisk = this.sessiontablecsvValues.length;
    }
    if (data.components == "useractiontable.csv") {
      this.actualpdisk = this.useractiontablecsvValues.length;
    }
    if (data.components == "feedbacktable.csv") {
      this.actualpdisk = this.feedbacktablecsvValues.length;
    }
    if (data.components == "eventstable.csv") {
      this.actualpdisk = this.eventstablecsvValues.length;
    }
    if (data.components == "xrdatatable.csv") {
      this.actualpdisk = this.xhrdatatablecsvValues.length;
    }
    if (data.components == "usertimingtable.csv") {
      this.actualpdisk = this.usertimingtablecsvValues.length;
    }

    if (data.components == "mobileappinfotable.csv") {
      this.actualpdisk = this.mobileappinfotablecsvValues.length;
    }

    if (data.components == "nvcrashreporttable.csv") {
      this.actualpdisk = this.nvcrashreporttablecsvValues.length;
    }
    if (data.components == "nvjserrortable.csv") {
      this.actualpdisk = this.nvjserrortablecsvValues.length;
    }

    //FOR HPD

    if (data.components == "Pagedump") {
      this.actualpdisk = this.pagedumpValues.length;
    }
    if (data.components == "USERACTION") {
      this.actualpdisk = this.useractionValues.length;
    }
    if (data.components == "CSV") {
      this.actualpdisk = this.csvValues.length;
    }
    if (data.components == "Feedback") {
      this.actualpdisk = this.feedbackValues.length;
    }


    this.paralleldiskdisplay = true;
    // this.actualpdisk = parseInt(data.pdisk);
    this.pdiskvalue = data.pdisk;
    this.pdiskdatadialog = data;
  }

  saveParallelDisk() {
    if (this.pdiskvalue > this.actualpdisk) {
      this.messageService.add({ severity: 'info', summary: 'Please assign parrallel disk value less than or equal to ' + this.actualpdisk, detail: '' });
      return;
    }
    if (this.pdiskvalue == "" || this.pdiskvalue == null) {
      this.messageService.add({ severity: 'info', summary: 'Please fill the value of parallel disk', detail: '' });
      return;
    }
    this.CheckPostData();
    this.paralleldiskdisplay = false;
    if (parseInt(this.pdiskvalue) <= this.actualpdisk)
      this.pdiskdatadialog.alert = false;
    this.pdiskdatadialog.pdisk = this.pdiskvalue;
  }

  GetSlaveNode() {
    this.slavenode = [];
    this.httpService.GetSlaveNodeList().subscribe((state4: Store.State) => {
      let slavelist = state4['data'];
      if (slavelist != null) {
        if (!slavelist.status) {
          this.clsutermode = true;
          for (let i = 0; i < 10; i++) {
            const h = {} as dropdowndata;
            if (slavelist['slaveList'][i] != undefined) {
              h.label = slavelist['slaveList'][i].tomcatIp + ":" + slavelist['slaveList'][i].tomcatPort + " (" + slavelist['slaveList'][i].name + ")";
              h.value = slavelist['slaveList'][i].slaveId;
              this.slavenode.push(h);
            }
          }


          console.log(this.slavenode);
          for (var m of slavelist['slaveList']) {
            if (m.slaveId == slavelist['selfSlaveId']) {
              this.nodevalue = m.slaveId;
            }
          }
        }
      }
      else if (slavelist == null || slavelist['status']) {
        this.clsutermode = false;
      }
    });
  }
  selectvalue(e) {
    this.LoadJsonFile(e.value);
  }

  EditDiskOverloadThreshold() {
    this.majorthreshold = this.multidiskMajorThreshold;
    this.criticalthreshold = this.multidiskCriticalThreshold;
    this.diskoverloaddisplay = true;
  }

  saveDiskOverload() {
    if (this.nodevalue == undefined)
      this.nodevalue = -1;
    let obj = [];
    if (this.majorthreshold >= this.criticalthreshold) {
      this.messageService.add({ severity: 'info', summary: 'Please Fill Major Threshold value less than the Critical Threshold value', detail: '' })
      return;
    }
    this.diskoverloaddisplay = false;
    this.loader = true;
    obj.push(`NV_MULTIDISK_OVERLOAD_THRESHOLD ${this.criticalthreshold} ${this.majorthreshold}`);
    this.httpService.SaveDiskAllocation(obj, this.nodevalue).subscribe((state6: Store.State) => {
      let response = state6['data'];
      if (response != null) {
        this.loader = false;
        this.multidiskMajorThreshold = this.majorthreshold;
        this.multidiskCriticalThreshold = this.criticalthreshold;
        this.messageService.add({ severity: 'info', summary: 'Saved Successfully', detail: '' })
      }
    },
      (err) => {
        this.loader = false;
        this.messageService.add({ severity: 'error', summary: err.statusText, detail: '' })
      }
    );
  }

}




