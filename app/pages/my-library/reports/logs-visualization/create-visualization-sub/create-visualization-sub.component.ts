import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CREATE_VISUALIZATION_SUB_DATA } from './service/create-visualization-sub.dummy';
import { CreateVisualizationData } from './service/create-visualization-sub.model';
import { Location } from '@angular/common';
import { VisualizationService } from 'src/app/pages/create-visualization/service/visualization.service';
import { visualLoadedState, visualLoadingErrorState, visualLoadingState } from 'src/app/pages/create-visualization/service/visualization-state';
import { Store } from 'src/app/core/store/store';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-create-visualization-sub',
  templateUrl: './create-visualization-sub.component.html',
  styleUrls: ['./create-visualization-sub.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateVisualizationSubComponent implements OnInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  data: CreateVisualizationData;
  filteredReports: any[];
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  
  // breadcrumb: MenuItem[];
  orderList = [];
  reportitem: any[];
  isShow: boolean = false;

  selectedCountryAdvanced: any[];
  filteredCountries: any[];
  countries: any[];
  settingOptions: MenuItem[];

  constructor(
    private router : Router,
    private location: Location,
    private vs:VisualizationService,
    public breadcrumb: BreadcrumbService
  ) { }

  ngOnInit(): void {
    const me = this;
    // me.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   { label: 'My Library' },
    //   { label: 'Create Visualization' },
    // ];
    this.breadcrumb.addNewBreadcrumb({ label: 'Create Visualization', routerLink: ['/create-visualization-sub'] });
    me.settingOptions = [
      { label: 'Alerts' },
      { label: 'Dashboard' },
      { label: 'Tier Status' },
    ];

    me.data = CREATE_VISUALIZATION_SUB_DATA;
    me.cols = me.data.layoutTable.headers[0].cols;
    for (const c of me.data.layoutTable.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

  //   this.vs.getVisualization().subscribe(
  //     (state: Store.State) => {
  //       if (state instanceof visualLoadingState) {
  //         this.onLoading(state);
  //         return;
  //       }

  //       if (state instanceof visualLoadedState) {
  //         this.onLoaded(state);
  //         return;
  //       }
  //     },
  //     (state: visualLoadingErrorState) => {
  //       this.onLoadingError(state);
  //     }
  //   );
  // }
  // onLoadingError(state: visualLoadingErrorState) {
  //   const me = this;
  //   me.data.visualizationTable.data = null;
  // }
  // onLoaded(state: visualLoadedState) {
  //   const me = this;
  //   me.data.visualizationTable.data = state.data;
  // }
  // onLoading(state: visualLoadingState) {
  //   const me = this;
  //   me.data.visualizationTable.data = null;
   }
    @Input() get selectedColumns(): TableHeaderColumn[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: TableHeaderColumn[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }

  
  backToReport(){
    this.router.navigate(['/reports']);
  }
  showReport(){
    this.isShow = true;
  }
  toCreateVisualization(){
    this.router.navigate(['/create-visualization']);
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

filterCountry(event) {
  const me = this;

  let filtered : any[] = [];
  let query = event.query;
  for(let i = 0; i < me.countries.length; i++) {
      let country = me.countries[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }
  
  me.filteredCountries = filtered;
}
goBack(){
  const me = this;
  me.location.back();    
}

}
