import { Component, OnInit, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BusinessprocessDataSource } from './businessprocessdatasource';
import { MessageService, MultiSelect } from 'primeng';
import { MetadataService } from '../../../home/home-sessions/common/service/metadata.service';
import { Metadata } from '../../../home/home-sessions/common/interfaces/metadata';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import { Cols } from '../../../home/home-sessions/common/interfaces/cols';
import * as moment from 'moment';
import { Store } from 'src/app/core/store/store';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-business-process',
  templateUrl: './business-process.component.html',
  styleUrls: ['./business-process.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessProcessComponent implements OnInit {
  @ViewChild("select") select: MultiSelect;
  @ViewChild("select1") select1: MultiSelect;
  // flags.
  columns: Cols[];
  nodeFlag: boolean = false;
  addFlag: boolean = false;
  updateFlag: boolean = false;
  saveFlag: boolean = false;
  load: boolean = false;
  buttonflag: boolean = false;
  // form controls
  nameSelect: any;
  typeSelect: any;
  confirmation: any;
  rowchange: any;
  instance: any;
  container: any;
  // bussiness process form controls.
  bpname: any;
  description: any;
  bpDesc: any;
  channel: any;
  userSeg: any;
  usersegment: any;
  usersegmentid: any;
  lastmodified: any;
  time: any;
  checked: boolean = false;
  bpchecked: boolean = false;
  bpAllData: any = [];
  selected: boolean = false;
  // update
  bpNameU: any;
  popupbpname: any;
  button: boolean;
  bpDescU: any;
  msgs: any = []
  channelU: any;
  busy: boolean = false;
  userSegU: any;
  checkedU: boolean = false;
  bpcheckedU: boolean = false;
  arrDataValues: any;
  currentData: any;
  nchannel: any;
  usersegmentoption: SelectItem[];
  status: any[];
  activech: any;
  checkoutflag: any[];
  checkoutfunnelflag: any;
  bpid: any;
  flowchartpic: boolean = false;
  errorflag;
  boolean = false;
  updatebpname: any;
  isEnabledColumnFilter: boolean = false;
  updatedescription: any;
  updateactivech: any;
  updatecheckoutfunnelflag: any;
  updatechannel: any;
  updateusersegmentid: any[];
  channelarray: any;
  channelid: any;
  usersegmentarray: any;
  editchannel: any;
  editusersegmentid: any;
  updateusersegments: any;
  usersegmetdisplay: any[];
  metadata: Metadata = null;
  selectedItems: any;
  item: any;
  bprocess = [];
  // just a random number to call component
  rno: any;

  constructor(private router: Router, private metadataService: MetadataService, private route: ActivatedRoute, private confirmationService: ConfirmationService, private messageService: MessageService, private httpService: NvhttpService, private SessionStateService: SessionStateService) {
    this.metadata = new Metadata();
    this.columns = [
      { field: 'bpname', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'channel', header: 'Channel' },
      { field: 'usersegmentid', header: 'User Segment' },
      { field: 'lastmodified', header: 'Last Modified' },
      { field: 'checkoutfunnelflag', header: 'Checkout BP', classes: 'text-right' }

    ];

  }
  ngOnInit() {
    if (this.SessionStateService.isAdminUser() == true) {

      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {
      this.buttonflag = false;
    }
    console.log("variation ngOnInit called ");
    this.route.queryParams.subscribe(params => {
      console.log("params : ", params, " .Now calling start.");
      this.start();
      this.status = [{
        label: 'Active',
        value: "1"
      },
      {
        label: 'Inactive',
        value: "0"
      }
      ];
      this.activech = "0";
      this.checkoutflag = [{
        label: 'Enable CheckoutBP ',
        value: "1"
      },
      {
        label: 'Disable CheckoutBP',
        value: "0"
      }
      ];
      this.checkoutfunnelflag = "0";

      if (sessionStorage.getItem('isAdminUser') == "true") {
        this.button = true;
      }
      if (sessionStorage.getItem('isAdminUser') != "true") {
        this.button = false;
      }
    });
  }
  warn(msg: string) {
    this.messageService.add({ key: 'add-bp-config', severity: 'warn', summary: 'Warning', detail: msg });
  }
  Error(msg: string) {
    this.messageService.add({ key: 'add-bp-config', severity: 'error', summary: 'Message', detail: msg });
  }
  Success(msg: string) {
    this.messageService.add({ key: 'add-bp-config', severity: 'success', summary: 'Message', detail: msg });

  }


  start() {
    // this.metadataService.getMetadata().subscribe(response => {
    //   this.metadata = response;
    //   let channelm: any[] = Array.from(this.metadata.channelMap.keys());
    //   this.nchannel = channelm.map(key => {
    //     return {
    //       label: this.metadata.channelMap.get(key).name,
    //       value: this.metadata.channelMap.get(key).id
    //     }
    //   });
    //   this.getcarddata(response);
    // });
    this.metadataService.getMetadata().subscribe(response => {
      if (response) {
        this.metadata = response;
        let channelm: any[] = Array.from(this.metadata.channelMap.keys());
        this.nchannel = channelm.map(key => {
          return {
            label: this.metadata.channelMap.get(key).name,
            value: this.metadata.channelMap.get(key).id
          }
        });
        this.nchannel.unshift({
          label: "All",
          value: -1
        });
        let usersegment: any[] = Array.from(this.metadata.userSegmentMap.keys());
        this.usersegmentoption = usersegment.map(key => {
          return {
            label: this.metadata.userSegmentMap.get(key).name,
            value: (this.metadata.userSegmentMap.get(key).id).toString()
          }
        });

        /*this.usersegmetdisplay = this.usersegmentoption;
         for(let i =0; i < this.usersegmetdisplay.length; i++)
             {
             this.usersegmetdisplay[i].value = this.usersegmetdisplay[i].label;
            }
        console.log("jusers222",this.usersegmetdisplay);
           */
        this.getdata(response);

      }

    });
    this.rno = 0;

  }


  saveUI() {
    if (!this.bprocess.length) {
      return;
    }
    let description = "Business Process Saved";
    this.httpService.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Business Process").subscribe(response => {
      // console.log("Audit Log");
    });
    this.metadataService.refreshMetadata();
    this.flowchartpic = true;
    this.saveFlag = true;
    this.load = false;
    this.rno = Math.random();
    console.log("componentload", this.flowchartpic, this.saveFlag, this.load, this.rno);
  }

  /**This opens the add BP Dialog */
  openDialog() {
    this.addFlag = true;
    this.channel = null;
    this.bpname = '';
    this.description = '';
    this.usersegmentid = '';
    for (var j of this.bprocess) {
      console.log("jjj", j.bppositionlist, j.bppagelist)
      if (j.bppositionlist == '' && j.bppagelist == '') {
        this.popupbpname = j.bpname;
        console.log("opendialog", this.popupbpname)
        this.addFlag = false;
        this.messageService.add({ key: 'add-bp-config', severity: 'error', summary: 'New added ' + this.popupbpname + ' is empty. Add some pages or delete', detail: '' });
      }
      if (j.bppositionlist != '') {
        console.log("popup");
        this.addFlag = true;
      }
    }
  }
  dataForTable() {
    this.saveFlag = false;
    this.msgs = [];
    if (this.bpname == '' || this.bpname == undefined || this.bpname == "undefined") {
      this.messageService.add({ key: 'add-bp-config', severity: 'warn', summary: 'Please Enter BP Name', detail: '' });
      return;
    }
    if (this.description == '' || this.description == undefined || this.description == "undefined") {
      this.messageService.add({ key: 'add-bp-config', severity: 'warn', summary: 'Please Enter Description', detail: '' });
      return;
    }

    if (this.channel == null) {
      this.messageService.add({ key: 'add-bp-config', severity: 'warn', summary: 'Please Select Channel', detail: '' });
      return;
    }

    if (this.usersegmentid == '' || this.usersegmentid == null || this.usersegmentid == "undefined") {
      this.messageService.add({ key: 'add-bp-config', severity: 'warn', summary: 'Please Select UserSegment', detail: '' });
      return;
    }

    // pass value as '-1' if all the pages are selected
    if (this.usersegmentoption.length === this.usersegmentid.length) {
      this.usersegmentid = ['-1'];
    }

    for (var j of this.bprocess) {
      if (this.bpname == j.bpname) {
        this.messageService.add({ key: 'add-bp-config', severity: 'error', summary: 'This BP Name Already Exist Please Enter other Name', detail: '' });
        return;
      }
    }
    let data = new BusinessprocessDataSource('', this.bpname, this.description, this.channel, this.usersegmentid, this.activech, this.checkoutfunnelflag, '', '');
    console.log("this.bp", data);

    this.busy = true;
    this.httpService.addBusinessProcess(data).subscribe(response => {

      console.log('state : ', response);
      this.busy = false;

      if (response != null) {
        this.messageService.add({ key: 'add-bp-config', severity: 'success', summary: 'Successfully Added', detail: '' });
        let description = "Business Process " + "'" + data.bpname + "'" + " added";
        this.httpService.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Business Process").subscribe(response => {
          // console.log("Audit Log");
        });
        // bpobj.bpid = response;
        // console.log("response " ,response , " bpobj.bpid " , bpobj.bpid);
        this.metadataService.refreshMetadata();
        this.getdata(this.metadata);
        this.flowchartpic = true;
      }

    }, () => {
      this.messageService.add({ key: 'add-bp-config', severity: 'error', summary: 'Error', detail: 'Failed to add business process.' });
      this.busy = false;
    });

    this.bpAllData.push(data);
    console.log("this.bpall", this.bpAllData);
    this.bprocess = [...this.bpAllData];
    console.log("this.bprocess", this.bprocess);

    // this.updateFlag = false;
    this.addFlag = false;
    // this.resetData();
  }

  getdata(metadata) {
    this.httpService.getBusinessProcessData().subscribe((state: Store.State) => {
      if (state instanceof NVPreLoadingState) {
        this.busy = state.loading;
      }

      if (state instanceof NVPreLoadedState) {
        this.busy = state.loading;
        let response = state.data;
        if (response != null && response.length > 0) {
          for (var i of response) {
            this.channelarray = (i.channel).split(",");
            i.channelid = i.channel;
            console.log("chhc", i.channel, this.channelarray)
            if (i.channel == "-1")
              i.channel = "All";
            else {
              i.channel = Util.getChannelNames(this.channelarray, metadata);
            }
          }

          for (var j of response) {
            this.usersegmentarray = (j.usersegmentid).split(",");
            j.usersegment = j.usersegmentid
            if (j.usersegmentid == -1)
              j.usersegmentid = "All";
            else {
              j.usersegmentid = Util.getUserSegmentNames(this.usersegmentarray, metadata);
            }
          }
          for (let m = 0; m < response.length; m++) {
            console.log("element lastmodified : ", response[m]['lastmodified']);
            let timesiddd = moment.utc(response[m]['lastmodified'], "YYYY-MM-DD  HH:mm:ss").valueOf();
            let timesidcc = moment.tz(timesiddd, sessionStorage.getItem("_nvtimezone")).format('YYYY-MM-DD  HH:mm:ss');
            response[m]['lastmodified'] = timesidcc;
          }

          this.bprocess = response;
          console.log("bplength", this.bprocess.length);
          console.log("resss", this.bprocess);
          // show the flowchart initially for first
          var a = {
            data: this.bprocess[this.bprocess.length - 1]
          }
          this.flowchartpic = true;
          this.onRowSelectEditTable(a);
          this.rowchange = a.data.bppagelist;
          this.selectedItems = this.bprocess[this.bprocess.length - 1];
        } else {
          this.bprocess = [];
          this.currentData = [];
          this.flowchartpic = false;
        }
      }

    }, (state: Store.State) => {
      if (state instanceof NVPreLoadingErrorState) {
        this.busy = state.loading;
      }
    });
  }

  showDialogToEditGroup() {
    console.log("12updatechannel now mod : ", this.updatechannel);
    this.updateFlag = true;

    setTimeout(() => {
      if (this.updateusersegmentid.length === this.usersegmentoption.length) {
        this.select1.valuesAsString = 'All';
      }
    });
  }


  updateTable() {
    this.msgs = [];
    console.log("updating");

    if (this.updateusersegmentid == null || this.updateusersegmentid.length == 0) {
      this.warn('Please select usersegment');
      return;
    }

    // check if all usersegment value is selected
    if (this.updateusersegmentid.length === this.usersegmentoption.length) {
      this.updateusersegmentid = ['-1'];
    }

    if (this.updatebpname == "" || this.updatebpname == undefined || this.updatebpname == "undefined") {
      this.warn("Please Enter Name");
      return;
    }
    if (this.updatedescription == "" || this.updatedescription == undefined || this.updatedescription == "undefined") {
      this.warn("Please Enter Description");
      return;
    }
    let updatedata = new BusinessprocessDataSource(this.bpid, this.updatebpname, this.updatedescription, this.updatechannel, this.updateusersegmentid, this.updateactivech, this.updatecheckoutfunnelflag, '', '');
    console.log("updateddd", updatedata);
    this.httpService.UpdateBusinessProcess(updatedata).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        this.messageService.add({ key: 'add-bp-config', severity: 'success', summary: 'Successfully Updated', detail: '' });
        let description = "Business Process " + "'" + updatedata.bpname + "'" + " updated";
        this.httpService.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Business Process").subscribe(response => {
          // console.log("Audit Log");
        });
        console.log("response : ", response);
        this.metadataService.refreshMetadata();
        this.getdata(this.metadata);
      }
    });
    this.updateFlag = false;

  }


  deleteFromTable() {
    this.msgs = [];
    this.confirmationService.confirm({
      message: 'Do you want to delete the Business Process ' + '?',
      header: 'Delete Confirmation',
      icon: 'icons8 icons8-error',

      accept: () => {
        this.httpService.deleteBPData(this.bpid).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response) {
            this.messageService.add({ key: 'add-bp-config', severity: 'success', summary: 'Successfully Deleted', detail: '' });
            let description = "Business Process Deleted";
            this.httpService.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Business Process").subscribe(response => {
              // console.log("Audit Log");
            });
            this.metadataService.refreshMetadata();
            this.getdata(this.metadata);
          }
        });
      },
      reject: () => {

      }
    });
  }

  // to reset add button form data.
  resetData() {
    this.bpname = "";
    this.bpDesc = "";
    this.channel = "";
    this.userSeg = "";
    this.checked = false;
    this.bpchecked = false;
  }

  onRowSelectEditTable(rowevent) {
    // if(this.rowchange != '')
    // return;
    console.log("onRowSelectEditTable : " + rowevent + " -- " + JSON.stringify(rowevent));
    this.bpid = rowevent.data.bpid;
    this.currentData = rowevent.data;
    // if(this.rowchange != '')
    this.flowchartpic = true;
    console.log("cureenty", this.currentData)
    this.item = true;
    this.load = true;
    this.updatebpname = rowevent.data.bpname;


    this.updatedescription = rowevent.data.description;
    this.updateactivech = rowevent.data.active;
    this.updatecheckoutfunnelflag = rowevent.data.checkoutfunnelflag;
    // this.updatechannel = rowevent.data.channel;
    this.updateusersegments = rowevent.data.usersegmentid;
    console.log("usere", this.updateusersegments); // this.updatechannel);
    this.updateusersegmentid = [];
    this.updateusersegmentid = (rowevent.data.usersegment).split(/\s*,\s*/);
    console.log("updateusersegmentid: ", this.updateusersegmentid);


    // check if '-1' value present, push all the usersegment values 
    if (this.updateusersegmentid[0] === '-1') {
      const tmp = [];
      for (const i of this.usersegmentoption) {
        console.log('i : '), i
        tmp.push(i.value);
      }

      this.updateusersegmentid = tmp;
    }

    console.log("updateusersegmentid: ", this.updateusersegmentid);
    console.log("usersegmentoption: ", this.usersegmentoption);
    //     if (this.updateusersegments === 'All' )
    //  { 
    //     // this.updateusersegmentid = [];
    // console.log("If");
    //       this.updateusersegmentid=-1;
    //   }
    //     else {
    //       // var sepratedRate = rowevent.data.usersegment; //.split(/\s*,\s*/);
    //       // this.updateusersegmentid = [];
    //       // for (var i = 0; i < sepratedRate.length; i++) {
    //         // let k = parseInt(sepratedRate[i], 10);
    //         console.log("keyy",parseIsepratedRate)
    //         this.updateusersegmentid= sepratedRate;
    //       // }
    //       console.log("Else");
    //     }
    console.log("updsteuser", this.updateusersegmentid);
    var cvalue = rowevent.data.channelid;
    this.updatechannel = Number(cvalue);
    console.log("updatechannel now mod : ", this.updatechannel);
    this.saveFlag = false;
  }

  onPanelHide(values, select: MultiSelect) {
    if (values.length === this.usersegmentoption.length) {
      select.valuesAsString = 'All';
    }
  }




}

