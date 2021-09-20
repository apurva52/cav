import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PANEL_DUMMY, VARIATION_TABLE } from './service/variation-table.dummy';
import { MetadataService } from './../common/service/metadata.service';
import { Variation } from './variation';
import { Metadata } from '../common/interfaces/metadata';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';

import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Store } from 'src/app/core/store/store';
import 'moment-timezone';

@Component({
  selector: 'app-variation',
  templateUrl: './variation.component.html',
  styleUrls: ['./variation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VariationComponent implements OnInit {
  pagearrayy: any;
  metadata: Metadata = null;
  nvvariations: any;
  msgs: any;
  RuleDialog: boolean = false;
  formdata: FormGroup;
  formdata1: any;
  vname: any;
  mode = 'Variations';
  wrongusersegment: boolean;
  updatewrongusersegment: boolean;
  val: boolean;
  addvisible: boolean = false;
  button: boolean;
  vchannel: any;
  vtraffic: any;
  vurlpattern: any;
  vpagename: any;
  nchannel: any[];
  npage: any[];
  vdesc: any;
  vtesturl: any;
  currentData: any;
  busy: boolean;
  prevPageValue: any;
  prevUrl: any;
  Abtesting: any;
  abtesting: any;
  multidisabled = false;
  visible = false;
  paginator = 0;
  showGoals: boolean;
  varId: any;
  varName: any;


  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  editvisible: boolean = false;
  data: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  panel: any;

  testing: string[] = [];
  options: any[];

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, private httpService: NvhttpService, private metadataService: MetadataService) {
    this.metadata = new Metadata();
  }


  ngOnInit(): void {
    // this.start();
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'Sessions' },
      { label: 'Variation' },
    ]


    me.panel = PANEL_DUMMY;

    me.data = VARIATION_TABLE;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.options = [
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" },
      { name: "Dummy Text", code: "Dummy Text" }
    ];


    console.log("variation ngOnInit called ");
    this.route.queryParams.subscribe(params => {
      console.log("params : ", params, " .Now calling start.");
      this.start();
    });

    // in formdara, keep same name as in db
    this.formdata = new FormGroup({
      name: new FormControl(),
      comment: new FormControl(),
      channel: new FormControl('-1'),
      traffic: new FormControl(),
      Radioval: new FormControl('Page'),
      url: new FormControl(),
      pagelist: new FormControl(),
      active: new FormControl('0'),
      lastedit: new FormControl(),
      created: new FormControl()
      // vtesturl: new FormControl()
    });
    this.formdata1 = new FormGroup({
      name: new FormControl(),
      comment: new FormControl(),
      channel: new FormControl('-1'),
      traffic: new FormControl(),
      url: new FormControl(),
      Radioval: new FormControl(),
      pagelist: new FormControl(),
      active: new FormControl(),
      lastedit: new FormControl(),
      created: new FormControl()
      // vtesturl: new FormControl()
    });

    if (sessionStorage.getItem('isAdminUser') === 'true') {
      this.button = true;
    }
    if (sessionStorage.getItem('isAdminUser') !== 'true') {
      this.button = false;
    }




  }

  start() {
    this.metadataService.getMetadata().subscribe(response => {
      this.busy = false;
      this.metadata = response;
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return { label: this.metadata.channelMap.get(key).name, value: this.metadata.channelMap.get(key).id };
      });

      const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).id.toString() };
      });

      this.npage.unshift({
        label: 'All',
        value: '-2'
      });

      this.getData(response);
    });

    this.Abtesting = [
      { label: 'AB-Testing', value: '0' }, { label: 'All', value: '1' }, { label: 'Non AB-Testing', value: '2' }];
    this.abtesting = '1';
  }
  getData(metadata) {
    this.nvvariations = null;
    this.busy = true;
    let channel = '-1';
    this.httpService.getVariationData(channel).subscribe((state: Store.State) => {
      let response = state['data'];
      this.nvvariations = [];
      if (response != null && response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          this.nvvariations.push(new Variation(response[i], metadata));
        }

      }
      this.busy = false;
    }, err => {
      this.busy = false;
      this.nvvariations = [];
    }
    );
  }
  setData(data) {
    this.RuleDialog = true;
    this.currentData = data;
  }
  openRule(car) {
    document.querySelector('#jsrule p').innerHTML = '';
    document.querySelector('#cssrule p').innerHTML = '';
    if (car.command === 'null') {
      document.querySelector('#nrule')['style'].display = 'none';
      // document.querySelector("#cssrule")["style"].display = "none";
      document.querySelector('#invalid')['style'].display = 'block';
    } else if ((JSON.parse(car.command).cssrule).indexOf('undefined') > -1 || (JSON.parse(car.command).cssrule).trim() === '') {
      document.querySelector('#invalid')['style'].display = 'none';
      document.querySelector('#nrule')['style'].display = 'block';
      document.querySelector('#jsrule p').innerHTML = JSON.parse(car.command).jsrule || '';
      const csslink = document.querySelector('#csslink');
      csslink['className'] = csslink['className'].replace(/active/g, '');
      document.querySelector('#jsrule')['style'].display = 'block';
      document.querySelector('#jslink')['style'].background = '#d3d3d3';
      document.querySelector('#csslink')['style'].removeProperty('background');
      document.querySelector('#cssrule')['style'].display = 'none';
      document.querySelector('#cssrule p').innerHTML = 'NO DATA AVAILABLE';
    } else if ((JSON.parse(car.command).jsrule).indexOf('undefined') > -1 || (JSON.parse(car.command).jsrule).trim() === '') {
      document.querySelector('#invalid')['style'].display = 'none';
      document.querySelector('#nrule')['style'].display = 'block';
      document.querySelector('#cssrule p').innerHTML = JSON.parse(car.command).cssrule || '';
      const jslink = document.querySelector('#jslink');
      jslink['className'] = jslink['className'].replace(/active/g, '');
      document.querySelector('#cssrule')['style'].display = 'block';
      document.querySelector('#csslink')['style'].background = '#d3d3d3';
      document.querySelector('#jslink')['style'].removeProperty('background');
      document.querySelector('#jsrule')['style'].display = 'none';
      document.querySelector('#jsrule p').innerHTML = 'NO DATA AVAILABLE';
    } else {
      document.querySelector('#invalid')['style'].display = 'none';
      document.querySelector('#nrule')['style'].display = 'block';
      document.querySelector('#jsrule p').innerHTML = JSON.parse(car.command).jsrule || '';
      document.querySelector('#cssrule p').innerHTML = JSON.parse(car.command).cssrule || '';
      const csslinky = document.querySelector('#csslink');
      csslinky['className'] = csslinky['className'].replace(/active/g, '');
      document.querySelector('#jsrule')['style'].display = 'block';
      document.querySelector('#jslink')['style'].background = '#d3d3d3';
      document.querySelector('#csslink')['style'].removeProperty('background');

    }
  }

  openJSrule(event) {
    const csslink = document.querySelector('#csslink');
    csslink['className'] = csslink['className'].replace(/active/g, '');

    const jslink = event.target;
    jslink['className'] += ' active';

    document.querySelector('#jsrule')['style'].display = 'block';
    document.querySelector('#jslink')['style'].background = '#d3d3d3';
    document.querySelector('#csslink')['style'].removeProperty('background');
    document.querySelector('#cssrule')['style'].display = 'none';
  }

  openCSSrule() {
    const jslink = document.querySelector('#jslink');
    jslink['className'] = jslink['className'].replace(/active/g, '');
    const cslink = event.target;
    cslink['className'] += ' active';
    document.querySelector('#cssrule')['style'].display = 'block';
    document.querySelector('#csslink')['style'].background = '#d3d3d3';
    document.querySelector('#jslink')['style'].removeProperty('background');
    document.querySelector('#jsrule')['style'].display = 'none';
  }


  preview(vtesturl) {
    const data = this.currentData;
    data.vtesturl = vtesturl;
    // adding new parameters to enable ab testing extension on given vtesturl
    let channel = '-1';
    data.vtesturl += '?nvabtesting=true&origin=orig' + window.location.origin + '&variationid=' + data.id + '&channel=' + channel;
    data.origin = window.location.origin;
    console.log('preview DATTAAA: ', JSON.stringify(data));
    const winName = data.name + '_' + data.variationid;
    var twin = window.open(data.vtesturl, winName);
  }
  save(data) {
    console.log('data : ', data);

    this.msgs = [];
    for (var j of this.nvvariations) {
      if (data.name == j.name) {
        this.messageService.add({ severity: 'error', summary: 'This Variation Name Already Exist', detail: '' });

        return;
      }
    }
    if (this.wrongusersegment == true) {
      this.messageService.add({ severity: 'error', summary: 'This Variation will not be saved as you have select wrong PageList', detail: '' });
      return;
    }
    if (data.pagelist) {
      data.pagelist = data.pagelist.toString();
    } else {
      data.pagelist = '-1';
    }


    this.addvisible = false;
    //for set UTC Date and Time
    let a = new Date().toUTCString();
    data.created = new Date(a).getTime();
    data.lastedit = new Date(a).getTime();
    delete (data.Radioval);
    console.log('save DATTAAA: ', JSON.stringify(data));
    const root = this;
    this.httpService.addVariation(data).subscribe(response => {
      let obj = {};
      this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
      });
      const description = 'Variation ' + '\'' + data.name + '\'' + ' added';
      this.httpService.getAuditLog('INFO', 'Open Variation Configuration', description, 'UX Monitoring::ConfigUI::Variation').subscribe(() => {
      });
      root.metadataService.refreshMetadata();
      this.getData(this.metadata);

    }, err => {
      this.busy = false;
    });
    this.messageService.add({ severity: 'success', summary: 'Added Successfully', detail: '' });
  }
  activeReq(data) {
    // if(data.pagelist)
    // data.pagelist = data.pagelist.toString();
    if (data.command == 'null' && data.active == true) {
      return (data.active = 0);
    }

    if (data.active == true) {
      data.active = 1;
    } else {
      data.active = 0;
    }




    // modifying the data object to update the row
    data.channel = data.origChannel;
    if (data.lflag == 'pagelist') {
      data.pagelist = data.pagearray;
      data.url = null;
    } else {
      data.url = data.url_or_pagelistt;
      data.pagearray = null;
    }
    if (data.url_or_pagelistt) {
      data['url'] = data.url_or_pagelistt;
    }
    data.created = data.createdTimestamp;
    data.comment = data.description;
    // deleting unnecesary fields
    delete data['url_or_pagelist'];
    delete data['url_or_pagelistt'];
    delete data['pageid'];
    delete data['lflag'];
    delete data['pagearray'];
    delete data['channelid'];
    delete (data.status);
    delete (data.createdTimestamp);
    delete (data.description);
    delete (data.origChannel);
    this.update(data);
  }

  update(data) {
    this.msgs = [];
    if (this.updatewrongusersegment == true) {
      // this.msgs.push({ severity: 'error', summary: 'Message', detail: 'This Variation will not be saved as you have select wrong PageList' });
      this.messageService.add({ severity: 'error', summary: 'This Variation will not be saved as you have select wrong PageList', detail: '' });
      return;
    }
    console.log('update data : ', data);
    if (data.pagelist != null && data.pagelist != '') {
      data.pagelist = data.pagelist.toString();
      data.url = null;
    }
    if (data.url != null) {
      data.url = data.url.toString();
      data.pagelist = null;
    }
    let a = new Date().toUTCString();
    data.lastedit = new Date(a).getTime();
    data.condition = 'variationid=' + data.id;
    delete (data.id);
    delete (data.Radioval);
    console.log('save DATTAAA: ', JSON.stringify(data));
    this.busy = true;
    const root = this;
    this.httpService.updateVariation(data).subscribe(response => {
      let obj = {};
      this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
      });
      console.log('update response : ', response);
      root.metadataService.refreshMetadata();
      if (this.abtesting == '1') {
        this.getData(this.metadata);
      }
      if (this.abtesting == '0') {
        this.getAbTestingData(this.metadata);
      }
      this.editvisible = false;

    }, err => {
      this.busy = false;
    });
    this.messageService.add({ severity: 'success', summary: 'Successfully Updated', detail: '' });

  }

  delete(list) {
    this.msgs = [];
    const root = this;
    this.busy = true;
    root.httpService.deleteVariation(list).subscribe(response => {
      let obj = {};
      this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
      });
      const description = 'Variation deleted';
      this.httpService.getAuditLog('INFO', 'Open Variation Configuration', description, 'UX Monitoring::ConfigUI::Variation').subscribe(() => {
      });
      root.metadataService.refreshMetadata();
      root.getData(root.metadata);
    });
    this.messageService.add({ severity: 'success', summary: 'Deleted Successfully', detail: '' });


  }

  // enable pagelist
  enableInputBox() {
    this.multidisabled = true;
    // currently not working
    this.prevUrl = this.formdata1.url_or_pagelistt;
    this.formdata1.controls['pagelist'].patchValue(this.prevPageValue);
    this.formdata1.controls['url'].patchValue(null);
  }
  // disabling page input
  disableInputBox() {
    this.multidisabled = false;
    // currently not working
    this.prevPageValue = this.formdata1.pagelist;
    this.formdata1.controls['pagelist'].patchValue(null);
    this.formdata1.controls['url'].patchValue(this.prevUrl);
  }


  onSubmit() {
    this.visible = false;
  }

  reload() {
    if (this.abtesting == '1') {
      this.metadataService.getMetadata().subscribe(response => {

        this.getData(response);
      });
    }
    if (this.abtesting == '0') {
      this.metadataService.getMetadata().subscribe(response => {

        this.getAbTestingData(response);
      });
    }

    if (this.abtesting == '2') {
      this.metadataService.getMetadata().subscribe(response => {

        this.getNonAbTestingData(response);
      });
    }
  }

  /*
  * Function To Navigate goal-component
  */
  openGoals(varid, varName) {
    this.varId = varid;
    this.varName = varName.name;
    this.showGoals = true;

  }

  edit(data) {
    this.editvisible = true;
    let CRadioval = 'Page';
    this.showGoals = false;
    if (data.pageid) {
      CRadioval = 'Page';
      this.multidisabled = false;

    }
    if (data.url_or_pagelistt) {
      CRadioval = 'URL';
      this.multidisabled = true;
    }
    this.formdata1 = new FormGroup({
      name: new FormControl(data.name),
      comment: new FormControl(data.description),
      channel: new FormControl(data.channelid),
      traffic: new FormControl(data.traffic),
      url: new FormControl(data.url_or_pagelistt),
      pagelist: new FormControl(data.pageid),
      Radioval: new FormControl(CRadioval),
      active: new FormControl('0'),
      id: new FormControl(data.id),
      created: new FormControl(data.createdTimestamp)
      // vtesturl: new FormControl()
    });
  }

  // reset the values
  newForm() {
    this.addvisible = true;
    this.formdata = new FormGroup({
      name: new FormControl(),
      comment: new FormControl(),
      channel: new FormControl('-1'),
      traffic: new FormControl('1'),
      url: new FormControl(),
      Radioval: new FormControl('Page'),
      pagelist: new FormControl(),
      active: new FormControl('0'),
      lastedit: new FormControl(),
      created: new FormControl()
      // vtesturl: new FormControl()
    });
  }

  chagedata() {
    if (this.abtesting === '1') {
      this.metadataService.getMetadata().subscribe(response => {
        this.getData(response);
      });
    }
    if (this.abtesting === '0') {
      this.metadataService.getMetadata().subscribe(response => {
        this.getAbTestingData(response);
      });
    }
    if (this.abtesting === '2') {
      this.metadataService.getMetadata().subscribe(response => {
        this.getNonAbTestingData(response);
      });
    }
  }
  getAbTestingData(metadata) {
    this.nvvariations = null;
    this.busy = true;
    let channel = '-1';
    this.httpService.getABTestingData(channel).subscribe
      (
        (state: Store.State) => {
          let response = state['data'];
          this.nvvariations = [];
          if (response != null && response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              this.nvvariations.push(new Variation(response[i], metadata));
            }
          }
          console.log('lllllllvvvvv : ', this.nvvariations);
          this.busy = false;
        }, err => {
          this.busy = false;
          this.nvvariations = [];
        }
      );
  }
  getNonAbTestingData(metadata) {
    this.nvvariations = null;
    this.busy = true;
    let channel = '-1';
    this.httpService.getNonABTestingData(channel).subscribe
      (
        (state: Store.State) => {
          let response = state['data'];
          this.nvvariations = [];
          if (response != null && response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              this.nvvariations.push(new Variation(response[i], metadata));
            }
          }
          this.busy = false;
        }, err => {
          this.busy = false;
          this.nvvariations = [];
        }
      );
  }

  onChange(e) {
    this.msgs = [];
    let arr;
    arr = e.value;
    this.wrongusersegment = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '-2' && arr[i + 1] !== '-2' && arr.length > 1) {
        this.messageService.add({ severity: 'warn', summary: 'You cannot select both All and page list either select All or some pagelist', detail: '' });
        this.wrongusersegment = true;
        return;
      }
    }
    if (arr.length === (this.npage.length - 1)) {
      this.messageService.add({ severity: 'warn', summary: 'Please Select All Option from the Page Options', detail: '' });
      return;
      this.wrongusersegment = true;
    }
  }
  UpdateonChange(e) {
    this.msgs = [];
    let arr;
    arr = e.value;
    this.updatewrongusersegment = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '-2' && arr[i + 1] !== '-2' && arr.length > 1) {
        this.messageService.add({ severity: 'warn', summary: 'You cannot select both All and page list either select All or some pagelist', detail: '' });
        this.updatewrongusersegment = true;
        return;
      }
    }
    if (arr.length === (this.npage.length - 1)) {
      this.messageService.add({
        severity: 'warn', summary: 'Please Select All Option from the Page Options', detail: ''
      });
      return;
      this.updatewrongusersegment = true;
    }
  }

}


