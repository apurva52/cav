import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DdrBreadcrumbService } from './services/ddr-breadcrumb.service';
import { CommonServices } from './services/common.services';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
//import { DdrDataModelService } from './services/ddr-data-model.service';
import { DdrDataModelService } from './../../pages/tools/actions/dumps/service/ddr-data-model.service';
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { MenuItem } from 'primeng';

@Component({
  selector: 'ddr-loading',
  templateUrl: 'ddr.component.html',
  styleUrls: ['ddr.component.scss']
})

export class DdrComponent implements OnInit {
  title = 'app works!';
  @ViewChild('navSideBar') menuSideNav: MatSidenav;
  constructor(
    private route: Router, 
    private service: DdrBreadcrumbService,
    public breadcrumb: BreadcrumbService,
    public commonServices : CommonServices,
    private ddr_data :DdrDataModelService,
    private sessionService: SessionService
    ) {
    console.log('title===>',this.title, this.menuSideNav);
    this.changeNvToNd(); 
  }

  /**change the label from NV to ND */
  changeNvToNd() {
    try {
      let path = location.href;
      //let checkProduct = sessionStorage.getItem('productType');
      let checkProduct = this.sessionService.session.cctx.prodType;
      if (checkProduct == 'netstorm') {
        document.title = 'Cavisson NetStorm';
      } else if (checkProduct == 'netdiagnostics' || "NetDiagnostics") {
        document.title = 'Cavisson NetDiagnostics Enterprise';
      } else if (checkProduct == 'netocean') {
        document.title = 'Cavisson NetOcean';
      } else if (checkProduct == 'netfunction') {
        document.title = 'Cavisson NetFunction';
      } else if (checkProduct == 'Netcloud' || checkProduct == 'netcloud') {
        document.title = 'Cavisson NetCloud';
      } else if (!checkProduct && (path.indexOf("/home/ddrCopyLink/") != -1)) {
        document.title = 'Cavisson NetDiagnostics Enterprise';
      }
      else {
        document.title = 'Cavisson NetVision';
      }
      console.log('document.title===>',document.title);
    } catch (error) {
      console.log('Error in changing the name', error);
    }
  }

  ngOnInit() {
    // this.route.events.subscribe((val) => {
    //   if (val['url'] == "/home/ddr") {
    //     let routenMae = this.service.itemBreadcrums[this.service.itemBreadcrums.length - 1].routerLink[0];
    //     console.log("routenMaeeee", routenMae);
    //     this.route.navigate(['/home/ddr/' + routenMae]);
    //   }
    // });
    if (this.ddr_data.isFromNV != "1") {
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
    }
    
   this.commonServices.closeUISideBarObservable$.subscribe((temp) => {
      this.menuSideNav.close();
    });
  }
  openSideNav() {
    console.log('value in menusideNav===>', this.menuSideNav);
    console.log("flag of isToLoadSideBarAmannnnnn",this.commonServices.isToLoadSideBar);
    if (!this.menuSideNav.opened) {
      this.menuSideNav.open();
    } else {
      this.menuSideNav.close();
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ddr_data.nsCQMFilter = {};
    //this.ddr_data.searchString="";
    this.commonServices.errMsg = undefined;
  }
}
