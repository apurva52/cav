import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformation } from '../common/interfaces/pageinformation';
import { Session } from '../common/interfaces/session';
import { SessionStateService } from '../session-state.service';
import { ParseSessionFilters } from '../common/interfaces/parsesessionfilters';
import { NvhttpService, NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from '../common/service/metadata.service';
import { SessionPageService } from './../sessions-details/session-page/service/session-page.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductPageComponent implements OnInit {

  items: MenuItem[];
  downloadOptions: MenuItem[];
  selectedPage: PageInformation;
  selectedSession: Session;
  shortUrl: string = '';
  metadata: any;
  pages: PageInformation[] = [];
  carouselPage: number = 0;
  pageIndex: number = 0;
  max: number = 0;
  min: number = 0;
  pageName: string;
  pageURL: string;
  pageStartTime: string;
  pageTTL: number;
  pageInst: any;
  Sid: string;
  loaded = false;
  breadcrumb: BreadcrumbService; 
  activeItem:any;
  from: any;

  constructor(private router: Router, private _location: Location, private route: ActivatedRoute, private stateService: SessionStateService, private metadataService: MetadataService, private httpService: NvhttpService, breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
    this.metadataService = metadataService;
    this.metadata = null;
    this.loaded = false;


    this.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' },
    ];

    this.items = [
      { label: 'Navigation Timing', routerLink: '/product-page/navigation-timing', replaceUrl: true },
      { label: 'Resource Timing', routerLink: '/product-page/resource-timing', replaceUrl: true },
      { label: 'User Timing', routerLink: '/product-page/user-timing', replaceUrl: true },
      { label: 'Event(s)', routerLink: '/product-page/events', replaceUrl: true },
      { label: 'Cookie(s)', routerLink: '/product-page/cookies', replaceUrl: true },
      { label: 'HTTP Requests', routerLink: '/product-page/http-request', replaceUrl: true },
      { label: 'JS Error(s)', routerLink: '/product-page/js-error', replaceUrl: true },
      { label: 'User Activity', routerLink: '/product-page/user-activity', replaceUrl: true },
      { label: 'Transactions', routerLink: '/product-page/transactions', replaceUrl: true },
      { label: 'Custom Metric(s)', routerLink: '/product-page/custom-metrics', replaceUrl: true },
      { label: 'User Action(s)', routerLink: '/product-page/user-action', replaceUrl: true },
      { label: 'Page Dump', routerLink: '/product-page/page-dump', replaceUrl: true },
    ]; 
    this.activeItem = this.items[0];
  }

  ngOnInit(): void {
    this.loaded = false;
    this.Sid = this.route.snapshot.queryParams['sid'];
    this.pageInst = this.route.snapshot.queryParams['pageInstance'];
    this.from = this.route.snapshot.queryParams['from'];
    if(this.from == "http-detail")
      this.activeItem = this.items[5];
    if(this.from == "transaction")
      this.activeItem = this.items[8];
    if (this.Sid != undefined) 
    {
      // check if Sid is array
      if (Array.isArray(this.Sid))
        this.Sid = this.Sid[0];

      // remove leading zeros.
      this.Sid = this.Sid.replace(/^0+/, '');
      this.ddr_to_pagedetails();
    }
    if (this.Sid == undefined)
      this.reload()
    // Note: subscribing for one only and will update data for both.
    this.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('product-page, onSessionPageChange - ', idx);
      if (this.Sid == undefined)
        this.reload()
    });

  }


  ddr_to_pagedetails() {
    let isActive = false;
    let pageindexx: number;
    let filterCriteria = { "limit": 15, "offset": 0, "sessionCount": false, "orderBy": ["sessionstarttime"], "output": [], "timeFilter": { "last": "1 Hour", "startTime": "", "endTime": "" }, "previousSessFlag": false, "particularPage": false, "autoCommand": { "particularPage": false, "pageTab": { "jserrorflag": { "jsError": false }, "xhrdata": { "httpFlag": false }, "transactiondata": { "tFlag": false }, "eventdata": { "eventFlag": false }, "navigationflag": { "navflag": false } } }, "nvSessionId": this.Sid, "countBucket": 300 };
    this.metadataService.getMetadata().subscribe(response => {
      this.metadata = response;
      if (this.metadata != null && this.metadata != undefined) {

        this.httpService.getSessions(filterCriteria, isActive).subscribe(
          (state: Store.State) => {
            if (state instanceof NVPreLoadedState) {
              let response = state.data;
              if (response != null) {
                let dbRecord = response.data[0];
                let storesessiondata = response.data.map(a => {
                  let session2: Session = new Session(a, this.metadata, false);

                  return session2;
                });
                let session: Session = new Session(dbRecord, this.metadata, false);
                console.log("SESSION-DETAILS", response);
                let ref = { activeSession: isActive, session: session };
                this.httpService.getPages(ref).subscribe(
                  (state: Store.State) => {
                    if (state instanceof NVPreLoadedState) {
                      let response2 = state.data;
                      if (response2 != null) {
                        this.pages = response2;
                        let setpdagedata = this.pages.map((a, i) => {
                          return new PageInformation(a, i, this.metadata);
                        });
                        setpdagedata.forEach((temp, i) => {
                          if (temp.pageInstance == this.pageInst)
                            pageindexx = i;
                        })
                        console.log(setpdagedata, this.pageInst);
                        this.stateService.set('sessions.data', storesessiondata);
                        this.stateService.set('sessions.selectedSessionIdx', 0);
                        this.stateService.set('sessions.pages.data', setpdagedata, true);
                        this.stateService.set('sessions.selectedPageIdx', pageindexx || 0);

                        this.ddr()
                      }
                      //this.loaded = true;
                    }
                  });
              }
            }
            else if (state instanceof NVPreLoadingErrorState) {
              // TODO: throw error using toast. 
              console.error('Error in loading data for sid - ' + this.Sid);

              //native to backward.
              this._location.back();
            } else if (state instanceof NVPreLoadingState) {
              //this.loaded = true;
            }


          });
      }
    });
  }

  ddr() {
    this.reload();
    this.loaded = true;
  }


  reload() {
    this.pages = this.stateService.getSelectedPage();
    this.max = this.pages.length - 1;

    this.selectedSession = this.stateService.getSelectedSession();
    this.selectedPage = this.stateService.getSelectedSessionPage();

    this.pageIndex = this.stateService.get('sessions.selectedPageIdx', 0);

    if (ParseSessionFilters.sessionFilters.autoCommand && ParseSessionFilters.sessionFilters.autoCommand.particularPage) {
      this.pageName = this.pages[Number(ParseSessionFilters.sessionFilters.autoCommand.pageinstance) - 1].pageName.name;
      this.pageURL = this.pages[Number(ParseSessionFilters.sessionFilters.autoCommand.pageinstance) - 1].url;
      this.pageStartTime = this.pages[Number(ParseSessionFilters.sessionFilters.autoCommand.pageinstance) - 1].navigationStartTime;
      this.pageTTL = this.pages[Number(ParseSessionFilters.sessionFilters.autoCommand.pageinstance) - 1].timeToLoad;
      //console.log(" @ pName " , this.pageName , this.pageURL , " - " , this.pageStartTime, " - " , this.pageTTL);
    }
    else {
      this.pageName = this.pages[this.pageIndex].pageName.name;
      this.pageURL = this.pages[this.pageIndex].url;
      this.pageStartTime = this.pages[this.pageIndex].navigationStartTime;
      this.pageTTL = this.pages[this.pageIndex].timeToLoad;
      //console.log(" @ else pName " , this.pageName , this.pageURL , " - " , this.pageStartTime, " - " , this.pageTTL);
    }

    console.log('product-page | selectedPage : ', this.selectedPage);

    // update breadcrumb.
    // set breadcrumb.
    this.breadcrumb.getBreadcrumbMenu().pipe(first()).subscribe((items: MenuItem[]) => {
      // search for Session Id, if present then remove that and add this.
      items.some((item, idx) => {
        if (item.label.indexOf('Page - ') == 0) {
          this.breadcrumb.removeFrom(idx - 1);
          return true;
        }
      });

      this.breadcrumb.add({
        label: `Page - ${this.selectedPage.pageName.name}`,
        routerLink: '/page-detail',
        queryParams: { from: 'breadcrumb' }
      } as MenuItem);
    });

    this.loaded = true;
  }

  navigate_to_sessionpage() {

    this.router.navigate(['/sessions-details/session-page'], { replaceUrl: true, queryParams: { tabindex: true } });
  }
  onPageChange(i) {
    this.selectedPage = this.pages[i];
    this.stateService.set('sessions.selectedPageIdx', i, true);
    this.shortUrl = this.selectedPage.url;
  }

  prev(): void {
    this.pageIndex--;
    this.stateService.set('sessions.selectedPageIdx', this.pageIndex, true);
  }

  next(): void {
    this.pageIndex++;
    this.stateService.set('sessions.selectedPageIdx', this.pageIndex, true);
  }

}
