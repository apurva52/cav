import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Store } from 'src/app/core/store/store';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { environment } from 'src/environments/environment';
import { Metadata } from '../common/interfaces/metadata';
import { MetadataService } from './../common/service/metadata.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SystemSettingsComponent extends Store.AbstractService implements OnInit {
  base = environment.api.netvision.base.base;
  jsonFile: any;
  response: any;
  metadata: Metadata;
  defaultresponse: any;
  rumjson: any;
  titlecontent: string;
  defjson: any;
  rtcObj = {};
  badge: any;
  appdynamic: boolean = false;
  busy: boolean = false;
  presponse: any;
  readonly: boolean = false;
  nonrtckeyword: any[];
  rtckeyword: any[];
  nchannel: any[];
  npage: any[];
  mainObj: any;
  Obj: any;
  dynamicmetadata: any = {};
  sidePanelPosition = 'left';
  btnstyle = {
    width: '61px',
    height: '55px',
    'border-radius': '50%',
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    cursor: 'pointer',
    'font-size': '14px',
    'box-shadow': '0px 2px 5px #666'
  };
  msgs: any;



  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private httpService: NvhttpService, private metadataService: MetadataService) {
    super();
    this.metadata = new Metadata();
  }

  getResult(output) {
    this.busy = true;
    this.Obj = {};
    console.log('output : ', output);

    for (const i in output) {
      this.getKeyValues(output[i]);
    }
    let slaveid = -1;
    this.httpService.getRumData(slaveid).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        console.log('Response : ', response);

        this.response = response;


        // Handling for Duplicate keys
        // It may happen when are recursively creating same keys for multiple values

        if (this.response.hasOwnProperty("PARTITION_SETTINGS")) {
          let splitresponsepartition = this.response.PARTITION_SETTINGS.split(" ");
          if (splitresponsepartition[0] == "1")
            this.response.PARTITION_SETTINGS = splitresponsepartition[0] + " " + splitresponsepartition[1] + " " + splitresponsepartition[2].split(/([0-9]+)/)[1];
        }
        for (const i in this.Obj) {
          const tmp = [];
          for (const j in this.Obj) {
            if (i.split('$')[0] === j.split('$')[0]) {

              // Only those keyword whose value is not empty should be considered
              if (this.Obj[j] !== '') {
                tmp.push(this.Obj[j]);
              }
              delete this.Obj[j];
            }
          }

          if (tmp.length) {
            this.Obj[i.split('$')[0]] = tmp.join(' ');
            // remove those keywords whose value is not changed from default value and not also not present in rum.conf
            if (!this.response[i.split('$')[0]]) {
              if (this.mainObj[i.split('$')[0]] === this.Obj[i.split('$')[0]])
                delete this.Obj[i.split('$')[0]];
            }
            // remove those keywords whose value is not changed
            if (this.response[i.split('$')[0]] === this.Obj[i.split('$')[0]]) {
              delete this.Obj[i.split('$')[0]];
            }
          }
        }

        if (this.Obj.hasOwnProperty("PARTITION_SETTINGS")) {
          let splitedpartition = this.Obj.PARTITION_SETTINGS.split(" ");
          if (splitedpartition[0] == "1")
            this.Obj.PARTITION_SETTINGS = splitedpartition[0] + " " + splitedpartition[1] + " " + splitedpartition[2] + "h";
        }
        console.log(this.Obj);
        if (Object.entries(this.Obj).length == 0) {
          this.messageService.add({ severity: 'info', summary: 'Please Modify Some Value Before Saving', detail: '' });
          this.busy = false;
          return;
        }
        const data = 'data:' + JSON.stringify(this.Obj);
        this.httpService.UpdateRumData(this.Obj).subscribe((state: Store.State) => {
          if (state instanceof NVPreLoadingState) {
            this.busy = state.loading;
          }

          if (state instanceof NVPreLoadedState) {
            if (state.data != null) {
              this.busy = state.loading;
              this.messageService.add({ severity: 'success', summary: 'Saved Successfully', detail: '' });
              console.log(state.data);
            }
          }

        },
          (state: Store.State) => {
            if (state instanceof NVPreLoadingErrorState) {
              this.busy = state.loading;
            }
          });
        this.GetPendingKeywords();
      }
    });


  }

  getKeyValues(data: any) {

    console.log('data : ', data);
    if (data.hasOwnProperty('General Setting')) {
      this.getKeyValues(data['General Setting']);

    }

    if (data.hasOwnProperty('Advanced Setting')) {
      this.getKeyValues(data['Advanced Setting']);

    }
    for (const i in data) {
      if (data[i] == null)
        data[i] = "";
      if (data[i] === true) {
        this.Obj[i] = 1;

      } else if (data[i] === false) {
        this.Obj[i] = 0;

      } else if (typeof (data[i]) === 'object') {
        this.getKeyValues(data[i]);

      } else {
        this.Obj[i] = data[i];
      }

    }


  }


  ngOnInit() {
    this.start();
  }

  start() {
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      Array.from(this.metadata.channelMap.keys()).map(key => {
        return this.metadata.channelMap.get(key);
      });
      let channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        };
      });
      const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: this.metadata.pageNameMap.get(key).id.toString()
        };
      });
      this.dynamicmetadata["channelMap"] = this.nchannel;
      this.dynamicmetadata["Pages"] = this.npage;
    });
    this.getData();
  }

  getRTCKeywords(fields: any[]) {
    for (const i of fields) {
      if (i.hasOwnProperty('formName')) {
        this.getRTCKeywords(i.fields);
      }
      if (i.hasOwnProperty('subFormName')) {
        this.getRTCKeywords(i.fields);
      }
      if (i.hasOwnProperty('rtc')) {
        this.rtcObj[i.key.split('$')[0]] = i.rtc;
      }
    }
  }

  getData() {

    this.busy = true;
    this.mainObj = {};
    let url: any = environment.api.netvision.rumsettingLayout.endpoint;
    this.controller.get(url, null, this.base).subscribe((rstart) => {
      let data = rstart;
      console.log('JSON File loaded');
      this.rumjson = data;
      this.defjson = data;
      this.rtcObj = {};
      this.getRTCKeywords(this.rumjson);
      this.GetPendingKeywords();
      let jsonTmp = this.rumjson;
      let defjsontmp = this.defjson;
      let slaveid = -1;
      this.httpService.getRumData(slaveid).subscribe((state: Store.State) => {
        let response = state['data'];
        if (response != null) {
          console.log('Response : ', response);

          this.response = response;
          this.defaultresponse = response;
          for (const k of defjsontmp) {
            this.setDefaultValue(k.fields);
          }
          for (const i in this.mainObj) {
            const tmp = [];
            for (const j in this.mainObj) {
              if (i.split('$')[0] === j.split('$')[0]) {

                // Only those keyword whose value is not empty should be considered
                if (this.mainObj[j] !== '') {
                  tmp.push(this.mainObj[j]);
                }

                delete this.mainObj[j];
              }
            }

            if (tmp.length) {
              this.mainObj[i.split('$')[0]] = tmp.join(' ');
            }

          }
          for (const i of jsonTmp) {
            this.setJSONFile(i.fields);
          }
          if (jsonTmp[1].formName == "Partition Setting") {
            for (var i = 0; i < jsonTmp[1].fields[0].fields.length; i++) {
              if (jsonTmp[1].fields[0].fields[i].label == "Duration")
                jsonTmp[1].fields[0].fields[i].value = jsonTmp[1].fields[0].fields[i].value.split(/([0-9]+)/)[1];
            }
          }
          this.jsonFile = jsonTmp;
          this.appdynamic = true;
          this.busy = false;
        }
      },
        error => alert('Oops ... ' + error.statusText)
      );


    });


  }
  Refresh() {
    this.getData();
    /*if(this.badge  > 0 )
      {
      this.msgs.push({severity:'error', summary:'Message', detail:'All pending keywords are not run time changeable. Restart the hpd from command line.'});
      }
    */
  }

  setJSONFile(fields: any[]) {
    // tslint:disable-next-line: forin
    for (const i in fields) {

      if (fields[i].hasOwnProperty('formName')) {
        this.setJSONFile(fields[i].fields);
      } else if (fields[i].hasOwnProperty('subFormName')) {
        this.setJSONFile(fields[i].fields);

      } else {
        if (this.response.hasOwnProperty(fields[i].key.split('$')[0])) {
          if (!fields[i].hasOwnProperty('value')) {
            this.setJSONFile(fields[i].fields);

          } else {

            const tmp = this.response[(fields[i].key).split('$')[0]];
            const tmpArr = tmp.split(' ');
            const val = tmpArr[fields[i].key.split('$')[1]];
            fields[i].value = (val !== undefined ? val : '');

            // console.log('tmpArr : ', tmpArr[fields[i].key.split('$')[1]], ' tmp ', tmp);

          }
        }
      }
    }

  }

  setDefaultValue(fieldss: any[]) {
    for (const i in fieldss) {

      if (fieldss[i].hasOwnProperty('formName')) {
        this.setDefaultValue(fieldss[i].fields);
      } else if (fieldss[i].hasOwnProperty('subFormName')) {
        this.setDefaultValue(fieldss[i].fields);

      } else {
        if (this.defaultresponse.hasOwnProperty(fieldss[i].key.split('$')[0])) {
          if (!fieldss[i].hasOwnProperty('value')) {
            this.setDefaultValue(fieldss[i].fields);

          } else {

            const tmp = this.defaultresponse[(fieldss[i].key).split('$')[0]];
            const tmpArr = tmp.split(' ');
            fieldss[i].value = fieldss[i].value;
            console.log(i, ' ', fieldss[i].key, ' ', fieldss[i].value);

          }
        }
        this.mainObj[fieldss[i].key] = fieldss[i].value;
      }
    }

  }
  Activate() {
    this.msgs = [];
    //this.GetPendingKeywords();
    /*if(this.badge  > 0 )
    {
    this.msgs.push({severity:'error', summary:'Message', detail:'All pending keywords are not run time changeable. Restart the hpd from command line.'});
    return;
    }*/
    this.nonrtckeyword = [];
    this.rtckeyword = [];
    let pendingnonrtc = {};

    this.confirmationService.confirm({
      message: 'Are you sure that you want to apply your changes?',
      header: 'Apply Changes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.httpService.getpendingRumData().subscribe((state: Store.State) => {
          let dresponse = state['data'];
          if (dresponse) {

            let rtckeyword = [];
            for (var a of Object.keys(this.rtcObj)) {
              for (var b of Object.keys(dresponse)) {
                if (b == a) {
                  if (this.rtcObj[b] == false) {
                    this.nonrtckeyword.push(b);
                    pendingnonrtc[b] = dresponse[b];
                  }
                  if (this.rtcObj[b] == true) {
                    this.rtckeyword.push(b);
                  }

                }
              }
            }
            this.Obj = {};
            this.busy = true;
            if (this.nonrtckeyword.length >= 0 && this.rtckeyword.length == 0) {
              this.msgs.push({
                severity: 'error',
                summary: 'Message',
                detail: 'All pending keywords are not run time changeable  Restart the hpd from command line.'
              });
              this.busy = false;
              return;
            }
            if (this.rtckeyword.length > 0) {
              this.httpService.RumHpdRestart().subscribe((state: Store.State) => {
                let response = state['data'];
                this.msgs = [];
                if (response != null) {
                  this.busy = false;
                  if (response["status"]) {
                    if (response["status"] == "failed") {
                      this.messageService.add({ severity: 'error', summary: response["error"], detail: '' });
                    }
                    if (response["status"] == "pass") {

                      // this.badge = this.nonrtckeyword.length;
                      if (this.nonrtckeyword.length == 0)
                        this.messageService.add({ severity: 'success', summary: 'Run Time Changes Applied Succesfully', detail: '' });
                      if (this.nonrtckeyword.length != 0) {
                        this.messageService.add({ severity: 'warn', summary: 'Run Time Changes Applied Succesfully But All pending keywords are not run time changeable  Restart the hpd from command line.', detail: '' });
                      }
                      if (this.nonrtckeyword.length > 0 || this.nonrtckeyword.length == 0) {
                        this.httpService.Updatependingkeywords(pendingnonrtc).subscribe(nresponse => {
                          if (nresponse != null) {
                            this.GetPendingKeywords();
                          }
                        });
                      }
                    }
                  }
                  if (response["data"]) {
                    let hpddata = JSON.parse(response["data"]);
                  }
                }
              });
            }
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'You Abort The Changes', detail: '' });
      }
    });
  }

  GetPendingKeywords() {
    this.nonrtckeyword = [];
    let pendingnonrtc = {};
    this.httpService.getpendingRumData().subscribe((state: Store.State) => {
      let response = state['data'];
      if (response) {
        for (var k of Object.keys(this.rtcObj)) {
          for (var m of Object.keys(response)) {
            if (m == k) {
              if (this.rtcObj[m] == false) {
                this.nonrtckeyword.push(m);
                pendingnonrtc[m] = response[m];
              }
            }
          }
        }
        this.badge = Object.keys(response).length;
        if (Object.keys(response).length == 0) {
          this.badge = "";
          this.titlecontent = "Apurva";
          document.getElementById("pendingapply")["disabled"] = "true";
        }
        if (Object.keys(response).length != 0) {
          this.titlecontent = "There are " + this.badge + " changes pending to be applied Click Here To Apply Your Chages";
          document.getElementById("pendingapply")["disabled"] = false;
        }

      }
    });
  }
}

