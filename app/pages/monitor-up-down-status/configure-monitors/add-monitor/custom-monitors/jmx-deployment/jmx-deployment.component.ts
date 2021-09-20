import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng';
import { Subscription } from 'rxjs';
import { MonitorupdownstatusService } from 'src/app/pages/monitor-up-down-status/service/monitorupdownstatus.service';
import { UtilityService } from '../../../../service/utility.service';
import { JmxData } from '../../containers/jmx-data';

@Component({
  selector: 'app-jmx-deployment',
  templateUrl: './jmx-deployment.component.html',
  styleUrls: ['./jmx-deployment.component.scss']
})
export class JmxDeploymentComponent implements OnInit {
  @Input()
  item: JmxData;
  setRequired: boolean = true;
  tierName: string = ""; // tierName from configuration screen.
  monName: string = '';
  monType: number;
  showSrchDialog: boolean = false;
  selectedSrchPattern: PatternVal[];
  dialogHeader: string = ''; //for search pattern dialog
  jmxUrl: SelectItem[];
  cols: any[];
  tempId: number = 0;
  isFromAdd: boolean; // flag to know whether operation is add or edit in search pattern dailog.
  count: number = 0;
  jmxSp: PatternVal;
  agentList: SelectItem[]; //added for dropdown list for agent Type tag
  jmxFormDataSubscription: Subscription;
  jmxSaveDataSubscripton: Subscription;

  constructor(private route: ActivatedRoute, private cms: ConfirmationService,
    private monUpDownServiceObj: MonitorupdownstatusService) { }

  ngOnInit() {
    this.jmxSp = new PatternVal();
    this.cols = [
      { field: 'pattern', header: 'Search Pattern' },
    ];

    this.route.params.subscribe((params: Params) => {
      this.tierName = params['tierName'];
      this.monName = params['monName'];
      this.monType = params['monType'];
    });

    this.jmxUrl = [
      { label: '--Select JMX URL-- ', value: '' },
      { label: 'JMX_REMOTING', value: 'JMX_REMOTING' },
      { label: 'JMX_RMI', value: 'JMX_RMI' },
      { label: 'JMX_CONNECTOR', value: 'JMX_CONNECTOR' },
      { label: 'JMX_HTTP', value: 'JMX_HTTP' },
      { label: 'Other', value: 'Other' }
    ]

    /**List for agent type dropdown */
    this.agentList = [
      { label: 'CMON', value: 'CMON' },
      { label: 'BCI', value: 'BCI' }
    ];


    this.item['port'] = Math.trunc(this.item['port']);
    this.item['occCount'] = Math.trunc(this.item['occCount'])
    this.item['pPort'] = Math.trunc(this.item['pPort'])
    this.item['pid'] = Math.trunc(this.item['pid'])

    this.jmxFormDataSubscription = this.monUpDownServiceObj.$customData.subscribe((res) => {
      if (res) {
        this.getRadiobuttonValues(res);
        res['port'] = Math.trunc(res['port']);
        res['occCount'] = Math.trunc(res['occCount'])
        res['pPort'] = Math.trunc(res['pPort'])
        res['pid'] = Math.trunc(res['pid'])
      }
    });


    this.jmxSaveDataSubscripton = this.monUpDownServiceObj.$saveMonConf.subscribe((res) => {
      this.setRequired = res;
    });
  }

  addSearchPattern() {
    this.dialogHeader = "Add Search Pattern";
    this.jmxSp = new PatternVal();
    this.showSrchDialog = true;
    this.isFromAdd = true;
  }

  editSearchPattern() {
    if (!this.selectedSrchPattern || this.selectedSrchPattern.length < 1) {
      alert("No row is selected to edit");
      return;
    }
    else if (this.selectedSrchPattern.length > 1) {
      alert("Select a single row to edit");
      return;
    }

    this.dialogHeader = "Edit Search Pattern"
    this.showSrchDialog = true;
    this.isFromAdd = false;
    this.tempId = this.selectedSrchPattern[0]["id"]
    this.jmxSp = Object.assign({}, this.selectedSrchPattern[0]);
  }

  saveSrchPattData() {
    if (this.isFromAdd) {
      this.jmxSp['id'] = this.count;
      this.item['adv']['oP'] = UtilityService.push(this.item['adv']['oP'], this.jmxSp); //adding new entries in the datatable when ADD is performed
      this.count = this.count + 1;
      this.showSrchDialog = false;
    }
    else {
      this.jmxSp['id'] = this.tempId; //assign temporary id
      this.item['adv']['oP'] = UtilityService.replace(this.item['adv']['oP'], this.jmxSp, this.getSelectedRowIndex(this.jmxSp['id']))
      this.isFromAdd = true;
      this.showSrchDialog = false;
      this.selectedSrchPattern = [];
    }
  }

  getSelectedRowIndex(data): number {
    let index = this.item['adv']['oP'].findIndex(each => each['id'] == this.tempId)
    return index;
  }

  deleteSrchPatData() {
    let noRowSelected: boolean = false;
    if (this.selectedSrchPattern == undefined || this.selectedSrchPattern.length == 0)
      noRowSelected = true;

    if (this.item['adv']['oP'].length == 0) {
      alert("No row is added");
      return;
    }

    this.cms.confirm({
      message: (noRowSelected) ? "Are You want to delete all row" : "Are you want to delete selected row",
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
          this.selectedSrchPattern = this.item['adv']['oP']; // if no row is selected then set the whole table data in the selected table data to perform delete

        this.selectedSrchPattern.map(function (each) {
          arrId.push(each.id); // push items to be deleted
        })

        this.item['adv']['oP'] = this.item['adv']['oP'].filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

        /**clearing object used for storing data ****/
        this.selectedSrchPattern = [];
      },
      reject: () => {
        this.selectedSrchPattern = [];
      }
    });
  }

  getRadiobuttonValues(data) {
    if (data['host'])
      data['jmxConn'] = "setting";
    else {
      data['jmxConn'] = "pid"

      if (data['pid'])
        data['jmxConnPID'] = "procId";
      else if (data['pidFile'])
        data['jmxConnPID'] = "pidFile";
      else
        data['jmxConnPID'] = "searchPattern";
    }
  }

  ngOnDestroy() {
    if (this.jmxFormDataSubscription)
      this.jmxFormDataSubscription.unsubscribe();

    if(this.jmxSaveDataSubscripton)
      this.jmxSaveDataSubscripton.unsubscribe();
  }
}

export class PatternVal {
  pattern: string = ''; // pattern value
  upVal: string = ''; // updated value
  id: number = 0;
}