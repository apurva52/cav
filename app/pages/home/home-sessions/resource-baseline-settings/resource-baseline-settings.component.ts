import { Component, OnInit } from '@angular/core';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Store } from 'src/app/core/store/store';
import 'moment-timezone';

interface baselinetimeline {
  from: string;
  to: string;
}
@Component({
  selector: 'app-resource-baseline-settings',
  templateUrl: './resource-baseline-settings.component.html',
  styleUrls: ['./resource-baseline-settings.component.scss']
})
export class ResourceBaselineSettingsComponent implements OnInit {
  domainbaselinedata = [];
  maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  _selectedDomain: string[] = [];
  lasttime: any[];
  button = false;
  Radioval = "last"
  lastdropdown = false;
  Todropdown = true;
  lastval: any;
  Fromval: any;
  Toval: any;
  isEnabledColumnFilter: boolean = false;
  Fromdropdown = true;
  FilterDomainBaseline = false;
  ShowDomainBaselineData = false;
  busy = false;
  displaydomainpopup = false;
  wait: number;
  secureconn: number;
  connect: number;
  redirect: number;
  dns: number;
  domainpattern: string;
  msgs: any;
  duration: number;
  regexspecific = false;
  regexpattern: string;
  totalRecords: number;
  first: number = 0;

  constructor(private httpService: NvhttpService, private _snackBar: MatSnackBar) {
    this.getData();
  }

  ngOnInit() {
    if (sessionStorage.getItem("isAdminUser") == "true") {
      this.button = true;
    }
    if (sessionStorage.getItem("isAdminUser") != "true") {
      this.button = false;
    }
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
    const time = new Date().getTime();
    const d = new Date(moment.tz(time, null).format('MM/DD/YYYY HH:mm:ss'));
    this.Fromval = new Date(d.toDateString() + ' 00:00:00');
    this.Toval = new Date(d.toDateString() + ' 23:59:00');
    this.maxDate = new Date(moment.tz(new Date(), sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  }
  getData() {
    this._selectedDomain = [];
    this.busy = true;
    this.httpService.getDomainBaselineData().subscribe((state: Store.State) => {
      let response = state['data'];
      this.domainbaselinedata = [];
      if (response) {
        this.busy = false;
        if (Object.keys(response).length == 0)
          this.FilterDomainBaseline = true

        if (Object.keys(response).length > 0) {
          this.ShowDomainBaselineData = true;
          this.domainbaselinedata = Object.values(response);
          for (var k of this.domainbaselinedata) {
            if (Number.isInteger(k.wait) == false && typeof k.wait == "number")
              k['wait'] = k['wait'].toFixed(2);
            if (Number.isInteger(k.connection_time) == false && typeof k.connection_time == "number")
              k['connection_time'] = k['connection_time'].toFixed(2);
            if (Number.isInteger(k.dns) == false && typeof k.dns == "number")
              k['dns'] = k['dns'].toFixed(2);
            if (Number.isInteger(k.download) == false && typeof k.download == "number")
              k['download'] = k['download'].toFixed(2);
            if (Number.isInteger(k.duration) == false && typeof k.duration == "number")
              k['duration'] = k['duration'].toFixed(2);
            if (Number.isInteger(k.redirect_time) == false && typeof k.redirect_time == "number")
              k['redirect_time'] = k['redirect_time'].toFixed(2);
            if (Number.isInteger(k.secure_connection_time) == false && typeof k.secure_connection_time == "number")
              k['secure_connection_time'] = k['secure_connection_time'].toFixed(2);
          }
	    this.totalRecords = this.domainbaselinedata.length;
        }

      }
      console.log("DomainBaseline", this.domainbaselinedata);



    },
      error => {
        this.busy = false;
        this._snackBar.open('Unable To Fetch The Data', 'ok', {
          duration: 2000,
        });
      }
    );
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
          this.FilterDomainBaseline = false;
          this.getData();
        }

        if (!response.SUCCESS) {
          this.busy = false;
          this._snackBar.open('Unable To Generate The Resource-Baseline Data In The  Given Specified Time', 'ok', {
            duration: 2000,
          });
        }
      }

    },
      (error) => {
        this.busy = false;
        this._snackBar.open('Unable To Generate The Resource-Baseline Data', 'ok', {
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

  SelectDomainCheckbox(e, domainname) {
    if (e.checked == true) {
      this._selectedDomain.push(domainname);
    }

    if (e.checked == false) {
      if (this._selectedDomain.indexOf(domainname) > -1) {
        let tmpdata = this._selectedDomain.indexOf(domainname);
        this._selectedDomain.splice(tmpdata, 1);
      }
    }
  }


  SaveDomainBaseLine() {
    if (this._selectedDomain.length == 0) {
      this._snackBar.open('Please Select any Domain Pattern to save', 'ok', {
        duration: 2000,
      });
      return;
    }

    //this.busy = true;
    let postdomainbaselinedata = [];
    for (var k of this._selectedDomain) {
      let filterdata = this.domainbaselinedata.filter(d => d.domain_name == k);
      postdomainbaselinedata.push(filterdata[0]);
    }
    console.log(postdomainbaselinedata);
    this.PostDomainData(postdomainbaselinedata);



  }


  PostDomainData(domainbaselinedata) {
    this.busy = true;
    this.httpService.PostDomainBaselinedata(domainbaselinedata).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        if (response.SUCCESS) {
          this.busy = false;
          this.getData();
          this._snackBar.open('Successfully Updated', 'ok', {
            duration: 2000,
          });
        }
      }

    },
      (error) => {
        this.busy = false;
        this._snackBar.open('Unable To Update The Resource Baseline Data', 'ok', {
          duration: 2000,
        });

      })
  }


  AddNewDomainBaseLine() {
    this.displaydomainpopup = true;
    this.dns = undefined;
    this.duration = undefined;
    this.redirect = undefined;
    this.connect = undefined;
    this.domainpattern = undefined;
    this.wait = undefined;
    this.secureconn = undefined;
    this.regexspecific = false;
    this.regexpattern = undefined;
  }


  AddDomainBaseline() {
    let finalnewdomainobj = [];
    let postobj = {};
    if (this.domainpattern == undefined || this.dns == undefined || this.duration == undefined || this.redirect == undefined || this.connect == undefined || this.wait == undefined || this.secureconn == undefined) {
      this._snackBar.open('Please Fill All The Required Fields', 'ok', {
        duration: 2000,
      });
      return;
    }

    postobj['domain_name'] = this.domainpattern;
    postobj['wait'] = this.wait;
    postobj['redirect_time'] = this.redirect;
    postobj['secure_connection_time'] = this.secureconn;
    postobj['connection_time'] = this.connect;
    postobj['duration'] = this.duration;
    postobj['dns'] = this.dns;
    let temp: any = Object.values(postobj);
    temp.shift();
    postobj['regex'] = this.regexspecific;

    if ((temp.every(k => ((k < 12001) && (k > 9)))) == false) {
      this._snackBar.open('Please Enter the value of Duration,DNS,Redirect,Connect,SSL,Wait in the range 10-12000 miliseconds', 'ok', {
        duration: 4000,
      });
      return;
    }

    console.log(postobj);
    finalnewdomainobj.push(postobj);
    this.PostDomainData(finalnewdomainobj);
    this.displaydomainpopup = false;

  }
  Refresh() {
    this.getData();
  }
  editvaluechange(e, keyname) {
    console.log(e, this._selectedDomain, this.domainbaselinedata);
    if (this._selectedDomain.length > 0) {
      for (var k of this._selectedDomain) {
        for (var p of this.domainbaselinedata) {
          if (k == p.domain_name) {
            switch (keyname) {
              case "duration":
                p.duration = e.target.value;
                break;
              case "dns":
                p.dns = e.target.value;
                break;
              case "redirect_time":
                p.redirect_time = e.target.value;
                break;
              case "connection_time":
                p.connection_time = e.target.value;
                break;
              case "secure_connection_time":
                p.secure_connection_time = e.target.value;
                break;
              case "wait":
                p.wait = e.target.value;
                break;

            }
          }
        }
      }
    }

  }


  RegexTest(a, b) {
    console.log(a, b);
    this.msgs = [];
    if (RegExp(b).test(a) == true) {
      this._snackBar.open('Test String Matched', 'ok', {
        duration: 2000,
      });

    } else {
      this._snackBar.open('Test String Not Matched', 'ok', {
        duration: 2000,
      });

    }
  }
}

