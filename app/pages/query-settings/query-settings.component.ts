import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { QUERY_SETTINGS_TABLE } from './service/query-settings.dummy';
import { QueryTable } from './service/query-settings.model';
import { MessageService, SelectItem } from 'primeng';
import { QuerySettingsService } from './service/query-settings.service';
import { QuerySettingsLoadedState, QuerySettingsLoadingErrorState, QuerySettingsLoadingState, updateQuerySettingsLoadedState, updateQuerySettingsLoadingErrorState, updateQuerySettingsLoadingState } from './service/query-settings.state';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-query-settings',
  templateUrl: './query-settings.component.html',
  styleUrls: ['./query-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuerySettingsComponent implements OnInit {

  // breadcrumb: MenuItem[];
  QUERY_SETTINGS_TABLE: QueryTable
  edit: boolean;
  selectedQuery: any;
  selectedOption: any;
  error: boolean;
  empty: boolean;
  loading: boolean;
  querySettingDefaultVal = QUERY_SETTINGS_TABLE


  constructor(
    private qs: QuerySettingsService,
    private messageService: MessageService,
    public breadcrumb:BreadcrumbService
    ) { }

  ngOnInit(): void {
    const me = this;
    // me.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   { label: 'Configuration', routerLink: 'home/dashboard' },
    //   { label: 'Query-Settings' }
    // ];
    
    me.breadcrumb.add({ label: 'Query-Settings', routerLink: '/query-settings' })
    me.QUERY_SETTINGS_TABLE = {
      headers: [{
        cols: [
          {
            label: 'Name',
            valueField: 'name',
            classes: 'text-left',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-left',
          },
        ],
      }],
      data: []
    }
    // this.qs.initialsettings().subscribe((data)=>{
    // me.QUERY_SETTINGS_TABLE.data=data
    // console.log(me.QUERY_SETTINGS_TABLE.data)
    // })



    this.qs.initialsettings().subscribe(
      (state: Store.State) => {
        if (state instanceof QuerySettingsLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof QuerySettingsLoadedState) {
          this.onLoaded(state);
          return;
        }
      },
      (state: QuerySettingsLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );

  }
  onLoading(state: QuerySettingsLoadingState) {
    const me = this;
    me.QUERY_SETTINGS_TABLE.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  onLoadingError(state: QuerySettingsLoadingErrorState) {
    const me = this;
    me.QUERY_SETTINGS_TABLE.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  onLoaded(state: QuerySettingsLoadedState) {
    const me = this;
    me.QUERY_SETTINGS_TABLE.data = state.data
  }

setValue(val){
console.log(val)
this.QUERY_SETTINGS_TABLE.data[3].value=val.label
}

  // Save action on query
  saveSettings() {
    const me = this;
    let obj_keys = []
    let data = {}
    console.log(me.QUERY_SETTINGS_TABLE.data)
    me.QUERY_SETTINGS_TABLE.data.forEach(element => {
      if (element.value == '' || element.value == null) {
       element.value = this.querySettingDefaultVal.data[0][element.name].value
      }
      data = Object.assign(data, { [element.name]: element });


    });
    console.log('datatat', data);

    this.qs.updatesettings(data).subscribe((state: Store.State) => {

      if (state instanceof updateQuerySettingsLoadingState) {
        this.onLoading(state);
        return;
      }

      if (state instanceof updateQuerySettingsLoadedState) {
        this.onLoaded(state);
        me.messageService.clear();
        me.messageService.add({
          severity: 'success',
          summary: 'Query Setting:-',
          detail: 'Setting Saved Successfully.'
        });
        return;
      }
    },
      (state: updateQuerySettingsLoadingErrorState) => {
        this.onLoadingError(state);
      })

  }

  editQuery() {
    const me = this;
    me.edit = true;

  }

  deleteQuery() {
    console.log('delete');
  }

}


// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { MenuItem } from 'primeng';
// import { QUERY_SETTINGS_TABLE } from './service/query-settings.dummy';
// import { QueryTable } from './service/query-settings.model';
// import { QuerySettingsService } from './service/query-settings.service';

// @Component({
//   selector: 'app-query-settings',
//   templateUrl: './query-settings.component.html',
//   styleUrls: ['./query-settings.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class QuerySettingsComponent implements OnInit {

//   breadcrumb: MenuItem[];
//   data: QueryTable;
//   QUERY_SETTINGS_TABLE: QueryTable;
//   edit: boolean;
//   selectedQuery: any;
//   selectedOption: any;

//   constructor(private qs: QuerySettingsService) {}

//   ngOnInit(): void {
//     const me = this;
//     me.breadcrumb = [
//       {label:'Home',routerLink: '/home/dashboard'},
//       {label:'Configuration',routerLink: 'home/dashboard'},
//       {label: 'Query-Settings'}
//     ];

//     me.data = QUERY_SETTINGS_TABLE;
//     me.QUERY_SETTINGS_TABLE ={ 
//             headers: [{
//             cols: [
//                 {
//                   label: 'Name',
//                   valueField: 'name',
//                   classes: 'text-left',
//                 },
//                 {
//                   label: 'Value',
//                   valueField: 'value',
//                   classes: 'text-left',
//                 },
//               ],
//         }],
//         data:[]
//       }
//       this.qs.initialsettings().subscribe((data)=>{
//         me.QUERY_SETTINGS_TABLE.data=data
//         console.log(me.QUERY_SETTINGS_TABLE.data)
//       })
//   }

//   // Save action on query
//   saveSettings() {
//     const me = this;
//     let obj_keys = []
//     let data = {}
//     console.log(me.QUERY_SETTINGS_TABLE.data)
//     me.QUERY_SETTINGS_TABLE.data.forEach(element => {
//       data = Object.assign(data, { [element.name]: element });
//     });
//     console.log('datatat', data);
//   }

//   editQuery(){
//     const me = this;
//     me.edit = true;

//   }

//   deleteQuery(){
//     console.log('delete');
//   }

// }
