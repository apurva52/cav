import { Component, Input, OnInit } from '@angular/core';
import { PatternVal } from '../../containers/adv-settings-data';
import { DbData } from '../../containers/db-data';

@Component({
  selector: 'app-db-advance-settings',
  templateUrl: './db-advance-settings.component.html',
  styleUrls: ['./db-advance-settings.component.scss']
})
export class DbAdvanceSettingsComponent implements OnInit {

  @Input() item: DbData;
  od: PatternVal;
  cols: any[];
  driverCls:string = '';

  constructor() { }

  ngOnInit() {
    this.od = new PatternVal();
    this.cols = [
      { field: "pattern", header: 'Key' },
      { field: "upVal", header: 'Value' },
    ]
    setTimeout(() => {
    // this.driverCls = this.monConfObj.driverCls;
    // if (this.monConfObj.dbQuery != "") {
    //   let splitByDollar = this.monConfObj.dbQuery.split("${");
    //   if (splitByDollar.length > 1) {
    //     let patternKey = [];
    //     let arr = [];
    //     for (let i = 1; i < splitByDollar.length; i++) {
    //       let splitStr = splitByDollar[i].split("}");
    //       patternKey[i - 1] = splitStr[0];
    //     }
    //     for (let k = 0; k < patternKey.length; k++) {
    //       let obj = {};
    //       obj["pattern"] = patternKey[k];
    //       obj["upVal"] = "";
    //       obj["id"] = k;
    //       arr.push(obj);
    //     }
    //     this.item['adv']['oP'] = arr;
    //   }
    // }
  },1000);
  }

}
