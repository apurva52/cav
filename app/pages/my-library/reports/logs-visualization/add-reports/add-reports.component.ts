import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ADD_REPORTS_DATA } from './service/add-reports.dummy';
import { AddReportsData } from './service/add-reports.model';
import { SaveDialogComponent } from 'src/app/shared/save-dialog/save-dialog.component';

@Component({
  selector: 'app-add-reports',
  templateUrl: './add-reports.component.html',
  styleUrls: ['./add-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddReportsComponent implements OnInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  data: AddReportsData;
  filteredReports: any[];
  saveReports : boolean = false;
  
  breadcrumb: MenuItem[];
  settingOptions: MenuItem[];
  orderList = [];
  reportitem: any[];
  isShow: boolean = false;

  @ViewChild('saveSearchData', { read: SaveDialogComponent })
  private saveSearchData: SaveDialogComponent;

  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'My Library' },
      { label: 'Visualization' },
    ];
    me.settingOptions = [
      { label: 'Alerts' },
      { label: 'Dashboard' },
      { label: 'Tier Status' },
    ];

    me.data = ADD_REPORTS_DATA;
  }
  saveReport(){
    const me = this;
    me.saveReports = true;
  }

  closeReport(){
    const me = this;
    me.saveReports = false;
  }
  showReport(){
    this.isShow = true;
  }
  filterFields(event) {
       
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.data.autocompleteData.length; i++) {
        let reportitem = this.data.autocompleteData[i];
        if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(reportitem);
        }
    }
    
    this.filteredReports = filtered;
}
  toCreateVisualization(){
    this.router.navigate(['/create-visualization-sub']);
  }
}
