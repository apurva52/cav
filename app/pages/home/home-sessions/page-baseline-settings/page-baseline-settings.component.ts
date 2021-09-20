import { Component, OnInit } from '@angular/core';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import * as moment from 'moment';
import 'moment-timezone';
//import { AppComponent } from './../../app.component';
import { MessageService } from 'primeng/api';
import { Store } from 'src/app/core/store/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStateService } from '../session-state.service';
interface baselinetimeline {
  from: string;
  to: string;
}

@Component({
  selector: 'app-page-baseline-settings',
  templateUrl: './page-baseline-settings.component.html',
  styleUrls: ['./page-baseline-settings.component.scss']
})
export class PageBaselineSettingsComponent implements OnInit {
  pagebaselinedata = [];
  _selectedPages: string[] = [];
  oldpagebaselinedata = [];
  lasttime: any[];
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  Radioval = "last"
  lastdropdown = false;
  Todropdown = true;
  lastval: any;
  Fromval: any;
  Toval: any;
  Fromdropdown = true;
  isEnabledColumnFilter: boolean = false;
  FilterBaseline = false;
  ShowBaselineData = false;
  busy = false;
  adminflag = false;
  totalRecords: number;
  first: number = 0;


  constructor(private httpService: NvhttpService, private sessionstateservice: SessionStateService, private _snackBar: MatSnackBar) {
    this.lasttime = [
      { label: '15 Minutes', value: 900000 },
      { label: '1 Hour', value: 3600000 },
      { label: '4 Hours', value: 14400000 },
      { label: '8 Hours', value: 28800000 },
      { label: '12 Hours', value: 43200000 },
      { label: '16 Hours', value: 57600000 },
      { label: '20 Hours', value: 72000000 },
      { label: '1 Day', value: 86400000 },
      { label: '1 Week', value: 604800000 },
      { label: '1 Month', value: 2628000000 },
      { label: '1 Year', value: 31556952000 }];
    this.lastval = 900000;
    this.getData();
  }

  ngOnInit() {

    this.adminflag = this.sessionstateservice.isAdminUser();
    const time = new Date().getTime();
    const d = new Date(moment.tz(time, null).format('MM/DD/YYYY HH:mm:ss'));
    this.Fromval = new Date(d.toDateString() + ' 00:00:00');
    this.Toval = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  }


  getData() {
    this._selectedPages = [];
    this.busy = true;
    this.httpService.getPageBaselineData().subscribe((state: Store.State) => {
      let response = state['data'];
      this.pagebaselinedata = [];
      if (response) {
        this.busy = false;
        if (Object.keys(response).length == 0)
          this.FilterBaseline = true

        if (Object.keys(response).length > 0) {
          this.ShowBaselineData = true;
          this.pagebaselinedata = Object.values(response);
          this.totalRecords = this.pagebaselinedata.length;
        }
        console.log("PageBaseline", this.pagebaselinedata);
      }
    },
      error => {
        this.busy = false;
        this._snackBar.open('Unable To Fetch The Data', 'ok', {
          duration: 2000,
        });

      }
    );
  }
  SelectPageCheckbox(e, data) {
    console.log(e, data);
    if (e.checked == true)
      this._selectedPages.push(data);

    if (e.checked == false) {
      if (this._selectedPages.indexOf(data) > -1) {
        let tmpdata = this._selectedPages.indexOf(data);
        this._selectedPages.splice(tmpdata, 1);
      }
    }
  }

  SavePageBaseLine() {

    if (this._selectedPages.length == 0) {
      this._snackBar.open('Please Select any Page to save', 'ok', {
        duration: 2000,
      });
      return;
    }
    this.busy = true;
    let postbaselinedata = [];
    for (var k of this._selectedPages) {
      let filterdata = this.pagebaselinedata.filter(d => d.name == k);
      postbaselinedata.push(filterdata[0]);
    }
    console.log(postbaselinedata);
    this.httpService.PostBaselinedata(postbaselinedata).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        if (response.SUCCESS) {
          this.busy = false;
          this._snackBar.open('Successfully Updated', 'ok', {
            duration: 2000,
          });
        }
      }
    },
      (error) => {
        this.busy = false;
        this._snackBar.open('Unable To Update The Page-Baseline Data', 'ok', {
          duration: 2000,
        });

      })

  }

  GenerateBaseline() {
    this.busy = true;
    const gendata = {} as baselinetimeline;
    if (this.Radioval == 'specified') {
      let g = this.Fromval
      let e = this.Toval
      gendata.from = window["toDateString"](g) + " " + g.toTimeString().toString().replace("GMT+0530 (India Standard Time)", "").trim();
      gendata.to = window["toDateString"](e) + " " + e.toTimeString().toString().replace("GMT+0530 (India Standard Time)", "").trim();

    }

    if (this.Radioval == 'last') {
      let tmp = new Date().getTime() - this.lastval;
      let d = new Date(tmp);
      gendata.from = window["toDateString"](d) + " " + d.toTimeString().toString().replace("GMT+0530 (India Standard Time)", "").trim();
      let f = new Date();
      gendata.to = window["toDateString"](f) + " " + f.toTimeString().toString().replace("GMT+0530 (India Standard Time)", "").trim();
    }

    console.log(gendata);
    this.httpService.GenerateBaselineData(gendata).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        if (response.SUCCESS) {
          this.FilterBaseline = false;
          this.getData();
        }

        if (!response.SUCCESS) {
          this.busy = false;
          this._snackBar.open('Unable To Generate The Page-Baseline Data In The Given Specified Time', 'ok', {
            duration: 2000,
          });
        }
      }
    }, (error) => {
      this.busy = false;
      this._snackBar.open('Unable To Generate The Page-Baseline Data', 'ok', {
        duration: 2000,
      });

    });


  }

  disableSpecifiedTime() {
    this.Fromdropdown = true;
    this.Todropdown = true;
    this.lastdropdown = false;

  }
  disableLastTime() {
    this.lastdropdown = true;
    this.Fromdropdown = false;
    this.Todropdown = false;
  }

  Refresh() {
    this.getData();
  }

  editvaluechange(e, keyname) {
    console.log(e, this._selectedPages, this.pagebaselinedata);
    if (this._selectedPages.length > 0) {
      for (var k of this._selectedPages) {
        for (var p of this.pagebaselinedata) {
          if (k == p.name) {
            switch (keyname) {
              case "onLoad":
                p.onLoad = e.target.value;
                break;
              case "time_to_first_byte":
                p.time_to_first_byte = e.target.value;
                break;
              case "time_to_dom_content_loaded":
                p.time_to_dom_content_loaded = e.target.value;
                break;
              case "time_to_dom_interactive":
                p.time_to_dom_interactive = e.target.value;
                break;
              case "wait":
                p.wait = e.target.value;
                break;
              case "time_to_interactive":
                p.time_to_interactive = e.target.value;
                break;
              case "perceived_render_time":
                p.perceived_render_time = e.target.value;
                break;
              case "first_paint":
                p.first_paint = e.target.value;
                break;
              case "first_content_full_paint":
                p.first_content_full_paint = e.target.value;
                break;
              case "redirection_time":
                p.redirection_time = e.target.value;
                break;


            }
          }
        }
      }
    }

  }
}

