import { Component, OnInit } from '@angular/core';

import { Message, ConfirmationService } from 'primeng/api';

import { CommonServices } from '../../services/common.services';

import {Location} from '@angular/common';

@Component({
  selector: 'app-ddr-header-top-nav-bar',
  templateUrl: './ddr-header-top-nav-bar.html',
  styleUrls: ['./ddr-header-top-nav-bar.css']
})
export class DdrHeaderTopNavBarComponent implements OnInit {

  constructor(public commonService: CommonServices, private confirmationService: ConfirmationService, private _location: Location) { }



  ngOnInit() {

    console.log("Report Naameeeee====>>>>>>>>",this.commonService.currentReport);
  }

  back(){
    this._location.back();
  }
}
