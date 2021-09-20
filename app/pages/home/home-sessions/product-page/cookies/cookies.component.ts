import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { COOKIES_TABLE } from './service/cookies.dummy';
import { CookiesTable, CookiesTableHeaderColumn } from './service/cookies.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation';
import { Store } from 'src/app/core/store/store';
import { SessionStateService } from '../../session-state.service';


@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  data: CookiesTable;
  cookiesData : PageInformation;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: CookiesTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  _selectedColumns: CookiesTableHeaderColumn[] = [];
  emptyTable: boolean;
  globalFilterFields: string[] = [];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  tooltipzindex = 100000;
  constructor(private router: Router,private route: ActivatedRoute, private stateService: SessionStateService) { }


  ngOnInit(): void {
    const me = this;
    me.data = COOKIES_TABLE;
    this.route.queryParams.subscribe(params => {
      console.log("params in sessions page : ", params);
    });

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.stateService.onSessionPageChange().subscribe((idx: number) => {
      console.log('cookie, session change - ', idx);

      me.reload();
    })

    me.reload();
  }

  reload() {
    const me = this;
    me.cookiesData = me.stateService.getSelectedSessionPage();
    me.data.data = me.cookiesData.cookies
  }

  @Input() get selectedColumns(): CookiesTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: CookiesTableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
 
  }


