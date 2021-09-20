import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';
import { DashboardWidgetTypeFileConfig } from '../../../service/dashboard.model';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import { FileImportService } from './service/file-import.service';
import { FileImportLoadedState, FileImportLoadingErrorState, FileImportLoadingState } from './service/file-import.state';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: FileImportComponent },
  ],
})
export class FileImportComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container';

  editTitle: boolean;

  dataTable: Table;

  fileOptions: DashboardWidgetTypeFileConfig;
  @Input() visiblityMenu : any;
  cols : any;
  tableColumns: any = [];
    tableData: any=  [];
    titleCopy: any = '';
  render() {
    const me = this;
    
    // //TODO: table Data should comes from backend
    // me.dataTable = {
    //   headers: [
    //     {
    //       cols: [
    //         {
    //           label: 'Label',
    //           valueField: 'label',
    //           classes: 'text-center',
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //         },
    //         {
    //           label: 'Value',
    //           valueField: 'value',
    //           classes: 'text-right',
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   data: [
    //     {
    //       label: 'Status',
    //       value: 'Normal',
    //       stats: true,
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Store Size',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Index Req Total',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //     {
    //       label: 'Document Deleted',
    //       value: '2.0 GB',
    //     },
    //   ],
    // };
   me.fileImportService.getFileImportInfo().subscribe(info => {
    //let data : any = {"filePath":me.widget.settings.types.file.filePath,"delimiter":me.widget.settings.types.file.delimiter,"uploadFile":true,"userName":me.widget.settings.types.file.userName};
 
    if(info !== undefined && info.filePath !== undefined){
      me.fileOptions.fileWidgetTitle = info.filePath;
      me.loading = true;
    me.getFileImport(info);
    }
    else{
   me.loading = false;
    }
  });
if(me.tableColumns == undefined || me.tableColumns.length == 0){
    me.fileOptions = JSON.parse(JSON.stringify(me.widget.settings.types.file));
let data : any = {"filePath":me.widget.settings.types.file.filePath,"delimiter":me.widget.settings.types.file.delimiter,"uploadFile":true,"userName":me.widget.settings.types.file.userName};
this.fileOptions.fileWidgetTitle = me.widget.settings.types.file.filePath;
if(data.delimiter && data.filePath){
me.loading = true;
me.getFileImport(data);
}
else{
me.loading = false;
}

   
    }
  }

  getFileImport(data){
    const me = this;
    me.fileImportService.getFileImportData(data).subscribe(
      (state: Store.State) => {
        if (state instanceof FileImportLoadingState) {
          me.onLoading1(state);
          return;
        }

        if (state instanceof FileImportLoadedState) {
          me.onLoaded1(state);
          return;
        }
      },
      (state: FileImportLoadingErrorState) => {
        me.onLoadingError1(state);
      }
    );
  }
  private onLoading1(state: any) {
    const me = this;
    me.error = null;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }

  private onLoadingError1(state: any) {
    const me = this;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }

  private onLoaded1(state: any) {
    const me = this;
 console.log("hi data is there"+state.data);
    me.empty = false;
    me.loading = true;
me.cols = state.data.column;
let dataTab = me.getFileData(state.data);

setTimeout(() => {
  me.loading = false;
  me.tableColumns= dataTab.tableColumn;
me.tableData = dataTab.tableData;
me.cd.detectChanges();
}, 
);

  }

  getFileData(response) {
    try {

      let finalColumn = [];
      let Data = [];
      let jsonData = response;
      let Column = [];
      let array = [];
      let finalData = [];

      Column = jsonData['column'];

      for (let i = 0; i < Column.length; i++) {
        let colObj = {};
        colObj = { 'header': Column[i], 'field': Column[i] };
        finalColumn.push(colObj);
      }
      Data = jsonData['Data'];
      for (let i = 0; i < Data.length; i++) {
        let inp: String = Data[i];
        array = inp.split('+,');
        let obj = {};
        for (let j = 0; j < Column.length; j++) {
          obj[Column[j]] = array[j];
        }
        finalData = finalData.concat(obj);
      }

      let finalObj = { 'tableColumn': finalColumn, 'tableData': finalData };
      console.log('Final Data:', finalData);
      return finalObj;
    } catch (e) {
      console.error(e);
    }
  }

  addFocus() {
    setTimeout(() => {
      document.getElementById("title").focus();
      this.titleCopy = {...this.fileOptions}

    })
    
  }

    onBlurMethod(){
        this.editTitle = false;
        this.fileOptions.fileWidgetTitle = this.titleCopy.fileWidgetTitle;
      }
    
}

