import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { APIData } from '../../containers/api-data';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import { Router } from '@angular/router';
import { FilterPipe } from 'src/app/shared/pipes/filter/filter.pipe';
import { MessageService } from 'primeng';


@Component({
  selector: 'app-auto-monitor',
  templateUrl: './auto-monitor.component.html',
  styleUrls: ['./auto-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FilterPipe]
})
export class AutoMonitorComponent implements OnInit {
  autoMonitorData: any[] = []
  cols: any[]
  isShowFilter: boolean;
  isShowDialog: boolean
  displayName: string
  @Output()
  showFilterEvent = new EventEmitter<boolean>();
  loading: boolean;
  apiData: APIData
  isMasterCheckbox:any[] = []
  grpName:any[] = []
  selectedProduct1:any
  monitorData:any[] = []
  arr:any[] = []
  display: boolean;
  gdfDetail: {};

  constructor(private monUpDownStatus: MonitorupdownstatusService,
    public router: Router,
    private msgService: MessageService) { }

  ngOnInit(): void {
    this.apiData = new APIData()
    this.loading = true;
    this.monUpDownStatus.getAutoMon().subscribe(data => {
      this.monitorData = data.data
      this.arr = []
      for(let i=0;i<this.monitorData.length;i++){
      
        this.arr.push(this.monitorData[i].monitor)
       
      }
      this.enableMasterCheckbox(this.arr);    
    },
      error => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      })

    this.cols = [
      { field: 'dn', header: 'Monitor Name' },
      //{field:'Description',header:'Description'}
    ]
  }
  saveAutoMon() {
   this.apiData['autoMonDTOs'] = []
    for(let i=0;i<this.monitorData.length;i++){
      for(let j=0;j<this.monitorData[i].monitor.length;j++){
      this.apiData['autoMonDTOs'].push(this.monitorData[i].monitor[j]);
      }
    }
    this.loading = true;
    this.monUpDownStatus.saveAutoMon(this.apiData).subscribe(data => {
      if (data) {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: data.msg })
        this.router.navigate(['/configure-monitors'])
        this.loading = false;
      }
    })
  }

  showFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.showFilterEvent.emit(this.isShowFilter);
  }

  autoMonDesc(rowData) {
    this.gdfDetail = {
      "dispMonName":rowData['dn'],
      "gdfName":rowData['gdfName']

     
    }
  this.display = true;
  }

  onDialogClose(event) {
    this.display = event;
 }
  
  onCheckBoxChange(rowData, checked) {
      for (let i = 0; i < rowData.length; i++) {
          rowData[i].enabled = checked.checked
        }
  }
  //to enable master checkbox of table
  enableMasterCheckbox(autoMonitorData){
    let flag:boolean = true;
    for (let i = 0; i < autoMonitorData.length; i++) {
      for(let j=0;j<autoMonitorData[i].length;j++){
      if(!autoMonitorData[i][j].enabled)
         flag = false;
      }
      this.autoMonitorData = autoMonitorData
      this.autoMonitorData[i]['isMasterCheckbox'] = flag;
  }
  }
}
