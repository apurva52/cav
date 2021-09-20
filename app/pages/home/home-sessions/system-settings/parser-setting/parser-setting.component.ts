import { Component, OnInit } from '@angular/core';
import { ParserService } from './service/parser-setting.service';
import { AppError } from 'src/app/core/error/error.model';
import { MessageService } from 'primeng';

import {
  ParserLoadedState, ParserLoadingErrorState, ParserLoadingState
} from './service/parser-setting.state';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store } from 'src/app/core/store/store';

import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
@Component({
  selector: 'app-parser-setting',
  templateUrl: './parser-setting.component.html',
  styleUrls: ['./parser-setting.component.scss']
})
export class ParserSettingComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  parserresponse: any;
  progresintervalvalue: number;
  weekprogresintervalvalue: number;
  dayprogresintervalvalue: number;
  monthprogresintervalvalue: number;
  parsername: string;
  inputtile: string;
  loader = false;
  cronForm: FormGroup;
  cronoptions: any;
  crongui = false;
  wdisable = false;
  mdisable = false;
  ddisable = false;
  crongen = false;
  button: boolean;
  aproffile: string;
  cronExpression: string;
  parserdialogue = false;
  cronoptionvalue: string;
  enabletoggle = false;
  dayvalue: any[] = [];
  weekvalue: any[] = [];
  monthvalue: any[] = [];
  offlinevalue: any[] = [];
  onlinevalue: any[] = [];
  processolddatavalue: any[] = [];

  constructor(private parserservice: ParserService, private httpService: NvhttpService, private messageService: MessageService) {
    this.getParserData();
  }

  ngOnInit(): void {
    this.cronoptions = [{
      label: 'Online',
      value: "Online"
    },
    {
      label: 'Offline',
      value: "Offline"
    }
    ]
    this.cronoptionvalue = "Online";

  }
  getParserData() {
    const me = this;
    me.parserservice.LoadParserData().subscribe(
      (state: Store.State) => {
        if (state instanceof ParserLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof ParserLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ParserLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: ParserLoadingState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: ParserLoadingErrorState) {
    const me = this;
    //me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = "error";
    me.error['msg'] = "Error while loading data.";
    me.loading = false;
  }

  private onLoaded(state: ParserLoadedState) {
    const me = this;
    //let response = state.data.data;
    me.parserresponse = state.data.data;
    //for (var k of response)
    //  if (k.runAt != null)
    //    me.parserresponse = response;

    // if (state.data.data.length != 0) {
    //   me.showData = true;
    // }

    me.empty = !me.parserresponse.length;
    me.loading = false;
    me.error = null;

  }
  rowdata(data) {
    this.aproffile = data.aprofFile;
    this.parsername = data.name;
    this.dayvalue = [];
    this.processolddatavalue = [];
    this.weekvalue = [];
    this.monthvalue = [];

    this.progresintervalvalue = data.progressInterval;
    this.weekprogresintervalvalue = data.mlaWeekProgressInterval;
    this.dayprogresintervalvalue = data.mlaDayProgressInterval;
    this.monthprogresintervalvalue = data.mlaMonthProgressInterval;
    if (data.runAt == null) {
      this.cronoptionvalue = "Online";
      this.crongen = false;
    }
    if (data.runAt != null) {
      this.cronoptionvalue = "Offline";
      this.crongen = true;
      this.cronExpression = data.runAt;
    }
    if (data.mlaDayEnable == 0) {
      this.ddisable = true;
      this.dayprogresintervalvalue = null;
    }

    if (data.mlaMonthEnable == 0) {
      this.mdisable = true;
      this.monthprogresintervalvalue = null;
    }
    if (data.mlaWeekEnable == 0) {
      this.weekprogresintervalvalue = null;
      this.wdisable = true;
    }
    this.parserdialogue = true;
    if (data.enable == 1 || data.enable == 2)
      this.enabletoggle = true;
    if (data.enable == 0)
      this.enabletoggle = false;
    if (data.processOldData == 1)
      this.processolddatavalue.push("check")
    if (data.mlaDayEnable == 1)
      this.dayvalue.push("check");
    if (data.mlaMonthEnable == 1)
      this.monthvalue.push("check");
    if (data.mlaWeekEnable == 1)
      this.weekvalue.push("check");
  }


  saveParserSetting() {
    if (this.progresintervalvalue < 60 || this.progresintervalvalue > 604800) {
      this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Progress Interval in the range (60-604800)', detail: '' });
      return;
    }
    if (this.cronoptionvalue == "Offline") {
      if (this.cronExpression == null) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Cron String', detail: '' });
        return;
      }
    }
    if (this.progresintervalvalue == null) {
      this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Progress Interval', detail: '' });
      return;
    }
    if (this.dayvalue.indexOf('check') > -1) {
      if (this.dayprogresintervalvalue == null) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Progress Interval in Day Multi Level Aggregation', detail: '' });
        return;
      }
      if (this.dayprogresintervalvalue < 60 || this.dayprogresintervalvalue > 604800) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Day Progress Interval in the range (60-604800)', detail: '' });
        return;
      }
    }

    if (this.weekvalue.indexOf('check') > -1) {
      if (this.weekprogresintervalvalue == null) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Progress Interval in Week Multi Level Aggregation', detail: '' });
        return;
      }

      if (this.weekprogresintervalvalue < 60 || this.weekprogresintervalvalue > 604800) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Week Progress Interval in the range (60-604800)', detail: '' });
        return;
      }
    }

    if (this.monthvalue.indexOf('check') > -1) {
      if (this.monthprogresintervalvalue == null) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Progress Interval in Month Multi Level Aggregation', detail: '' });
        return;
      }
      if (this.monthprogresintervalvalue < 60 || this.monthprogresintervalvalue > 604800) {
        this.messageService.add({ severity: 'info', summary: 'Please Fill the value of Month Progress Interval in the range (60-604800)', detail: '' });
        return;
      }

    }
    this.loader = true;
    this.parserdialogue = false;
    let postdata = {};
    postdata['aprofFile'] = this.aproffile;
    if (this.enabletoggle == false)
      postdata["enable"] = 0;
    if (this.enabletoggle == true && this.cronoptionvalue == 'Online')
      postdata["enable"] = 1;
    if (this.enabletoggle == true && this.cronoptionvalue == 'Offline')
      postdata["enable"] = 2;
    postdata["progressinterval"] = this.progresintervalvalue;
    if (this.processolddatavalue.indexOf("check") == -1)
      postdata["processolddata"] = 0;
    if (this.processolddatavalue.indexOf("check") > -1)
      postdata["processolddata"] = 1;
    if (this.dayvalue.indexOf("check") == -1) {
      postdata["mladayenable"] = 0;
      postdata["mladayprogressinterval"] = null;
    }

    if (this.dayvalue.indexOf("check") > -1) {
      postdata["mladayenable"] = 1;
      postdata["mladayprogressinterval"] = this.dayprogresintervalvalue;
    }

    if (this.weekvalue.indexOf("check") == -1) {
      postdata["mlaweekenable"] = 0;
      postdata["mlaweekprogressinterval"] = null;
    }

    if (this.weekvalue.indexOf("check") > -1) {
      postdata["mlaweekenable"] = 1;
      postdata["mlaweekprogressinterval"] = this.weekprogresintervalvalue;
    }


    if (this.monthvalue.indexOf("check") == -1) {
      postdata["mlamonthenable"] = 0;
      postdata["mlamonthprogressinterval"] = null;
    }

    if (this.monthvalue.indexOf("check") > -1) {
      postdata["mlamonthenable"] = 1;
      postdata["mlamonthprogressinterval"] = this.monthprogresintervalvalue;
    }
    if (this.cronoptionvalue == "Online")
      postdata['cronExpression'] = "null";
    if (this.cronoptionvalue == "Offline")
      postdata['cronExpression'] = this.cronExpression;

    console.log("data---", postdata);
    this.loading = true;
    this.httpService.postParserData(postdata).subscribe((response: any) => {
      if (response) {
        this.getParserData();
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Successfully Saved', detail: '' });

      }
    },
      (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: err.statusText, detail: '' });
      }
    );

  }



  wcheckvalue(e) {
    if (e.checked == false) {
      this.wdisable = true;
      this.weekprogresintervalvalue = null;
    }
    if (e.checked == true)
      this.wdisable = false;
  }

  dcheckvalue(e) {
    if (e.checked == false) {
      this.ddisable = true;
      this.dayprogresintervalvalue = null;
    }
    if (e.checked == true)
      this.ddisable = false;
  }

  mcheckvalue(e) {
    if (e.checked == false) {
      this.mdisable = true;
      this.monthprogresintervalvalue = null;
    }
    if (e.checked == true)
      this.mdisable = false;
  }
  onlinecheckvalue(e) {
    this.offlinevalue = [];
    if (e.checked == true)
      this.crongen = false;
  }

  offlinecheckvalue(e) {
    this.onlinevalue = [];
    if (e.checked == true)
      this.crongen = true;
  }

  cronoptinchanged(e) {
    if (e.value == "Offline") {
      this.crongen = true;
      this.cronExpression = null;
    }
    if (e.value == "Online")
      this.crongen = false;
  }
   showDialogToEditCronEx()
  {
    
  }
  closeDialog()
  {
  this.parserdialogue = false;
  }
}

