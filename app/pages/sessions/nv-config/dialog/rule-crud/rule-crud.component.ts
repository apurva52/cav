import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { RULE_DATA } from './service/rule-crud.dummy';
import { EditRuleData } from './service/rule-crud.model';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
@Component({
  selector: 'app-rule-crud',
  templateUrl: './rule-crud.component.html',
  styleUrls: ['./rule-crud.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RuleCrudComponent extends PageDialogComponent
  implements OnInit {

  data: EditRuleData[];
  showFields: boolean;
  addflag: boolean = false;
  npage: any[];
  rulepageidlist: any;
  type: any[];
  ruleType: any;
  ruleurl: any;
  value3: any;
  updateright: boolean = false;
  updatewrong: boolean = false;
  rulecookievalue: any;
  rulecookiename: any;
  ruleselector: any;
  @Output() editrulessegment: EventEmitter<any>;
  @Input() selecteddata : any;
  selectedRow : any;



  constructor(private MetadataService: MetadataService) {
    super();
    this.editrulessegment = new EventEmitter();
    this.MetadataService.getMetadata().subscribe(metadata => {
      let pagem: any[] = Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return {
          label: metadata.pageNameMap.get(key).name,
          value: metadata.pageNameMap.get(key).id.toString()
        };
      });
    });
  }

  ngOnInit(): void {
    const me = this;
    me.data = RULE_DATA;
    console.log("me.data ", me.data);
    this.type = [
      { label: "Url Pattern", value: "1" },
      { label: "Cookie", value: "0" },
      { label: "Click", value: "2" },
      { label: "Engagement", value: "3" }
    ];
    this.ruleType = "0";
  }



  showDialog(row) {
    console.log('showDialog : ', row);
    this.addflag = false;
    //super.show();
    this.visible = true;
    if (row) {

      this.rulepageidlist = row.page;
      this.ruleType = row.type;
      if (this.ruleType == "0") {
        this.rulecookiename = row.arg1;
        this.rulecookievalue = row.arg2;
      }
      if (this.ruleType == "2" || this.ruleType == "3")
        this.ruleselector = row.arg1;
      if (this.ruleType == "1")
        this.ruleurl = row.arg1;

    } else {
      this.rulecookiename = null;
      this.rulecookievalue = null;
      this.rulepageidlist = null;
      this.ruleType = null;
    }
  }
  TestupdateUrl() {
    let newruleUrl = this.ruleurl;
    let newReg = new RegExp(newruleUrl);
    let testurl = this.value3;
    if (testurl.match(newReg)) {
      this.updateright = true;
      this.updatewrong = false;
    } else {
      this.updatewrong = true;
      this.updateright = false;
    }
  }
  editDialog() {
    //this.editrulessegment.emit(true);

    let rulesobj = {
      'rulepageidlist': this.rulepageidlist,
      'ruleType': this.ruleType,
      'ruleurl': this.ruleurl,
      'value3': this.value3,
      'rulecookiename': this.rulecookiename,
      'rulecookievalue': this.rulecookievalue,
      'ruleselector': this.ruleselector,
      'updateright': this.updateright,
    };

    console.log('rulesobj : ', rulesobj);
    this.editrulessegment.emit(rulesobj);
    //console.log("this.rulepageidlist ", this.rulepageidlist, ' this.ruleurl', this.ruleurl, ' this.value3 : ', this.value3, 'this.ruleselector ', this.ruleselector);
    this.visible = false;
  }
  addDialog() {
    let rulesobj = {
      'rulepageidlist': this.rulepageidlist,
      'ruleType': this.ruleType,
      'ruleurl': this.ruleurl,
      'value3': this.value3,
      'rulecookiename': this.rulecookiename,
      'rulecookievalue': this.rulecookievalue,
      'ruleselector': this.ruleselector,
      'updateright': this.updateright,
      'selecteddata' : this.selectedRow
    };

    console.log('rulesobj : ', rulesobj);
    this.editrulessegment.emit(rulesobj);
    //this.editrulessegment.emit(true);
    //console.log("this.rulepageidlist ", this.rulepageidlist, ' this.ruleurl : ', this.ruleurl, ' this.value3 : ', this.value3, 'this.ruleselector ', this.ruleselector);
    this.visible = false;
  }

  open(event) {
    console.log('open event  : ', event , " selecteddata : ", this.selecteddata);
    this.selectedRow = {...this.selecteddata};
    this.rulecookiename = null;
    this.rulecookievalue = null;
    this.rulepageidlist = null;
    this.visible = true;
    this.addflag = true;
  }

  closeDialog() {
    this.visible = false;
  }
}