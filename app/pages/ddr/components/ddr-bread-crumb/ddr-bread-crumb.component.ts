import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import { CommonServices } from './../../services/common.services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';


@Component({
  selector: 'app-ddr-bread-crumb',
  templateUrl: './ddr-bread-crumb.component.html',
  styleUrls: ['./ddr-bread-crumb.component.css']
})
export class DdrBreadCrumbComponent implements OnInit {
  objDdrBreadcrumbs: MenuItem[];
  routeToHome: MenuItem[];
  isFromEd: boolean = false;
  testRunVisible: any;
  constructor(
    private breadcrumbService: DdrBreadcrumbService,
    private commonServices: CommonServices,
    private _router: Router,
    private _ddrData: DdrDataModelService
  ) {
    //this.objDdrBreadcrumbs = [];
  }

  ngOnInit() {

    let obj;
    this.testRunVisible = "";
    this.testRunVisible = this._ddrData.testRun;
    this.breadcrumbService.breadCrumbAsObservable$.subscribe((val: MenuItem[]) => {
      if (val) {
        this.objDdrBreadcrumbs = val;
        if (this.objDdrBreadcrumbs.length > 0) {
          if (this.objDdrBreadcrumbs[0].label == 'Flowpath') {
            this._ddrData.fpByBTFlag = false; // for bug 50708
            obj = {
              label: val[0].label, command: (event) => {
                console.log('coming here for flowpath')
                this.commonServices.flowpathHomeData$.next('');
                this.breadcrumbService.isFromHome = true;
                if (this.commonServices.isFromCopyLink == true)
                  this._router.navigate(['/home/ddrCopyLink/' + val[0].routerLink[0]]);
                else
                  this._router.navigate(['/ddr/' + val[0].routerLink[0]]);
              }
            }
          }
          else {
            if (val[0].routerLink[0] == 'DdrBtTrendComponent') {
              obj = {
                label: val[0].label, command: (event) => {
                  this.breadcrumbService.isFromHome = true;
                  this.breadcrumbService.isFromBreadCrumb = true;
                  this._router.navigate(['/ddr/' + val[0].routerLink[0]]);
                }
              }
            }
            else {
              obj = {
                label: val[0].label, command: (event) => {
                  this.breadcrumbService.isFromHome = true;
                  this.breadcrumbService.isFromBreadCrumb = true;
                  this._router.navigate(['/ddr/' + val[0].routerLink[0]])
                }
              }
            }
          }
        }
        this.routeToHome = obj;
        console.log(val, 'value of bread', this.objDdrBreadcrumbs, this.routeToHome);
      }
    });
  }
}
