import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppError } from 'src/app/core/error/error.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MetadataService } from './../common/service/metadata.service';
import { Metadata } from '../common/interfaces/metadata';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import { GoalDataSource } from './goaldatasource';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { MessageService } from 'primeng/api';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-goalinvariation',
  templateUrl: './goalinvariation.component.html',
  styleUrls: ['./goalinvariation.component.scss']
})
export class GoalinvariationComponent extends Store.AbstractService implements OnInit {
  @Input('varId') varid: number;
  @Input('varName') varName: string;
  msgs: any;
  responselength: any;
  base = environment.api.netvision.base.base;
  regResult: any;
  totalRecords = 0;
  testurl: any;
  checked = false;
  regflag = false;
  button: boolean;
  goalid: any;
  name: any;
  // varid: any;
  value2: any;
  goaldata: any[] = [];
  value1: any;
  busy: boolean;
  mode: any;
  modeg = 'Goals';
  pagelist: any;
  pagearray: any;
  datasource: any = [];
  cont_mode: any[];

  type: any[];
  Type: any;

  Page_mode: any[];
  displayDialog = false;
  Radioval = 'URL';
  metadata: Metadata = null;
  npage: any[];
  // for editing goalinvariation

  updatedisplayDialog = false;
  updatevalue1: any;
  updateType: any;
  updateRadioval = 'URL';
  updatemode: any;
  updatechecked = false;
  updatevalue2: any;
  updatetesturl: any;
  updateregflag = false;
  updatepagelist: any;
  updatetype: any;
  updatepagearray: any;
  updateid: any;
  updateregResult: any;
  paginator: number;
  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, private httpService: NvhttpService, private metadataService: MetadataService) {
    super();
    this.busy = true;
    this.metadata = new Metadata();
    this.metadataService.getMetadata().subscribe(response => {
      this.busy = false;
      this.metadata = response;
      const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return { label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).id.toString() };
      });

    });
    this.pagelist = null;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.route.queryParams.subscribe(params => {
      console.log("params : ", params, " .Now calling start.");
      this.start();
    });
    console.log("dddd", changes, this.varName, this.varid);

  }
  start() {
    this.getGoals(this.metadata);
  }
  ngOnInit() {

    this.type = [
      { label: 'Page Goal', value: 'PAGE_GOAL' },
      { label: 'Click Goal', value: 'CLICK_GOAL' },
      { label: 'Content Goal', value: 'CONTENT_GOAL' }
    ];
    this.Type = 'PAGE_GOAL';

    this.Page_mode = [
      { label: 'EQUAL', value: 'EQUAL' },
      { label: 'CONTAIN', value: 'CONTAIN' },
      { label: 'NOT CONTAIN', value: 'NOTCONTAIN' },
    ];
    this.mode = 'EQUAL';

    this.cont_mode = [
      { label: 'EXIST', value: 'EXIST' },
      { label: 'NOT EXIST', value: 'NOTEXIST' },
    ];
    this.mode = 'EXIST';
    if (sessionStorage.getItem('isAdminUser') === 'true') {
      this.button = true;
    }
    if (sessionStorage.getItem('isAdminUser') !== 'true') {
      this.button = false;
    }
    console.log("variation ngOnInit called ");

  }

  addGoal() {
    this.msgs = [];
    if (this.responselength !== 0 || this.responselength > 0) {
      this.messageService.add({ severity: 'error', summary: 'There will be only 1 goal for each variation(Goal Already Added)', detail: '' });
      this.displayDialog = false;
    } else {
      this.displayDialog = true;
    }
  }

  getGoals(metadata) {
    this.datasource = null;
    this.busy = true;
    console.log('RES-calling', this.varid);
    let url: any = environment.api.netvision.goalvar.endpoint;
    url += "?&varid=" + this.varid;
    this.controller.get(url, null, this.base).subscribe((data1) => {
      // this.httpService.showgoals(this.varid).subscribe((state: Store.State) => {
      console.log(data1);
      let response = data1;
      // this.datasource = response;

      if (response != null && response.length > 0) {
        this.responselength = response.length;
        this.datasource = [];
        for (let i = 0; i < response.length; i++) {
          response[i]['pageid'] = response[i].pagelist;
          response[i]['pagearray'] = Util.getPageNames((response[i].pagelist.split(',')), this.metadata);
          console.log('met1', this.metadata);
          this.datasource.push(response[i]);
          this.totalRecords = this.datasource.length;
          console.log(this.datasource);
          this.goaldata = this.datasource;
        }
      }
      else {
        this.busy = false;
        this.goaldata = [];
        this.responselength = response.length;
      }

    }, err => {
      this.busy = false;
      this.datasource = [];
      this.goaldata = [];
      console.log('errrrr : ', err);
    }
    );
  }

  SaveGoal() {
    const data = new GoalDataSource('', '', this.Type, this.mode, this.value1, this.value2, this.varid, this.pagelist, this.pagearray);
    console.log('name :', this.pagearray);
    console.log('data-------->', data);
    this.httpService.addgoal(data).subscribe(response => {
      const res = response;
      if (res) {
        let obj = {};
        this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
        });
        this.httpService.showgoals(this.varid).subscribe(response => {
          this.getGoals(this.metadata);
          // this.datasource = response;
        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Added Successfully', detail: '' });
    this.displayDialog = false;
  }
  delete(data) {
    this.busy = true;
    this.msgs = [];
    console.log('data-----?', data.goalid, data.varid);
    const data1 = new GoalDataSource(data.goalid, '', '', '', '', '', data.varid, '', '');
    this.httpService.deletegaols(data1).subscribe(response => {
      let obj = {};
      this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
      });
      const res = response;
      if (res) {
        this.httpService.showgoals(this.varid).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response != null) {
            this.datasource = response;
            this.goaldata = this.datasource;
            this.responselength = response.length;
            this.busy = false;
          }

        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Sucessfully Deleted', detail: '' });
  }
  disableInputBox() {
    this.value2 = '';
    this.value1 = '';
    this.testurl = '';
    this.pagelist = '';
    document.querySelector('#toggler')['style'].display = '-webkit-inline-box';

  }
  resetGoal() {
    this.value2 = '';
    this.value1 = '';
    this.testurl = '';
    this.pagelist = '';
    this.regResult = '';
    document.querySelector('#toggler')['style'].display = '-webkit-inline-box';
  }
  Option() {
    if (this.Type === 'CLICK_GOAL' || this.Type === 'CONTENT_GOAL') {
      this.value2 = '';
      this.value1 = '';
      this.testurl = '';
      this.pagelist = '';
      this.regResult = '';
      document.querySelector('#toggler')['style'].display = '-webkit-inline-box';
    } else {
      return;
    }
  }

  testReg() {
    const newUrl = this.testurl;
    const newReg = this.value2;
    this.regflag = true;
    if (newUrl.indexOf(newReg) >= 0) {
      this.regResult = 'Regex Matched';
      document.querySelector('#toggler')['style'].display = '-webkit-inline-box';


    } else {
      console.log(newReg + ' is NOT present');
      this.regResult = 'Regex not Matched';
      document.querySelector('#toggler')['style'].display = 'none';

    }
  }
  // for updating goalinvariation

  updategoal(data) {
    this.updateid = data.goalid;
    this.updatedisplayDialog = true;
    if (data.type === 'PAGE_GOAL') {
      this.updateType = 'PAGE_GOAL';
      if (data.mode === 'EQUAL') {
        this.updatemode = 'EQUAL';
      }
      if (data.mode === 'CONTAIN') {
        this.updatemode = 'CONTAIN';
      }
      if (data.mode === 'NOTCONTAIN') {
        this.updatemode = 'NOTCONTAIN';
      }
      if (data.value2 === '') {
        this.updateRadioval = 'PAGE';
        this.updatepagelist = data.pageid.split(/\s*,\s*/);
      } else {
        this.updatevalue2 = data.value2;
        this.updateRadioval = 'URL';
      }
    }

    if (data.type === 'CLICK_GOAL') {
      this.updateType = 'CLICK_GOAL';
      this.updatevalue2 = data.value2;
      this.updatepagelist = data.pageid.split(/\s*,\s*/);
    }
    if (data.type === 'CONTENT_GOAL') {
      this.updateType = 'CONTENT_GOAL';
      this.updatevalue2 = data.value2;
      this.updatepagelist = data.pageid.split(/\s*,\s*/);
      this.updatemode = data.mode;
    }

  }
  updateSaveGoal() {
    const updatedata = new GoalDataSource('', '', this.updateType, this.updatemode, this.updatevalue1, this.updatevalue2, this.updateid, this.updatepagelist, this.updatepagearray);
    console.log('data', updatedata);
    this.httpService.updategoal(updatedata).subscribe((state: Store.State) => {
      let response = state['data'];
      const res = response;
      if (res) {
        let obj = {};
        this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
        });
        this.httpService.showgoals(this.updateid).subscribe(response => {
          this.getGoals(this.metadata);
          // this.datasource = response;
        });

      }
    });
    this.updatedisplayDialog = false;
  }
  updatedisableInputBox() {
    this.updatevalue2 = '';
    this.updatevalue1 = '';
    this.updatetesturl = '';
    this.updatepagelist = '';

  }
  updateOption() {
    if (this.updateType === 'CLICK_GOAL' || this.updateType === 'CONTENT_GOAL') {
      this.updatevalue2 = '';
      this.updatevalue1 = '';
      this.updatetesturl = '';
      this.updatepagelist = '';
      this.updateregResult = '';
    } else {
      return;
    }
  }
  updatetestReg() {
    const newUrl = this.updatetesturl;
    const newReg = this.updatevalue2;
    this.updateregflag = true;
    if (newUrl.indexOf(newReg) >= 0) {
      console.log(newReg + ' is a prsent');
      this.updateregResult = 'Regex Matched';
      // console.log("twovalue" , this.value2);
      document.querySelector('#toggler')['style'].display = '-webkit-inline-box';


    } else {
      console.log(newReg + ' is NOT present');
      this.updateregResult = 'Regex not Matched';
      document.querySelector('#toggler')['style'].display = 'none';

    }
  }
}


