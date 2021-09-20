import { Injectable } from '@angular/core';

@Injectable()
export class GenericGdfService {

  advMConf: any;
  mConfTable: any; // metric configuration table data to be used in advance metric configuration
  constructor() { }

  ngOnit() {
  }

  setMConfTable(data) {
    this.mConfTable = data;
  }

  getMConfTable() {
    return this.mConfTable;
  }


}
