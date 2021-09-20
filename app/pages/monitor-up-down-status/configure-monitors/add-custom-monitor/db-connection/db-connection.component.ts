import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
//import * as DB_DROPDOWN from '../../constants/cmd-monitor-constants';
import * as DB_DROPDOWN from '../constants/configure-cmd-mon-constant';
import { UtilityService } from '../../../../generic-gdf/services/utility.service';

@Component({
  selector: 'app-db-connection',
  templateUrl: './db-connection.component.html',
  styleUrls: ['./db-connection.component.scss']
})
export class DbConnectionComponent implements OnInit {

  @Input() item: Object;
  sslTypeList: SelectItem[]; // contains SSL Type list
  authModeList: SelectItem[]; // contains Authentication Mode list
  @Input() collapsed:boolean =  true;
  
  constructor() { }

  ngOnInit() {
    this.sslTypeList = UtilityService.createListWithKeyValue(DB_DROPDOWN.SSL_LABEL, DB_DROPDOWN.SSL_VALUE);
    this.authModeList = UtilityService.createListWithKeyValue(DB_DROPDOWN.DB_AUTH_LABEL, DB_DROPDOWN.DB_AUTH_VALUE);
  }

}
