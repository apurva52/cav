import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';

@Component({
  selector: 'app-mon-stats',
  templateUrl: './mon-stats.component.html',
  styleUrls: ['./mon-stats.component.scss'],
})

export class MonStatsComponent implements OnInit {
  @Input() display: boolean;
  @Input() item: object
  @Output() displayChange = new EventEmitter();
  cols: any[] = []
  monName: string;
  arrPerGrpData: any = [{}]
  displayErrorMsg: string = ""; // show error message in case of no graph stats
  tableData: any[] = []; // for graph table data
  showDialog1:boolean = false;
  showDialog2:boolean = false;
  constructor(private monitorupdownService: MonitorupdownstatusService,  private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    let that = this;
    this.monName = this.item['dispMonName']
    this.cols = [
      { field: "gname", header: "Metric" },
      { field: "desc", header: "Description" }
    ]

    this.monitorupdownService.gdfDetail(this.item).subscribe(data => {
      if (data['status'] === undefined || data['status']) {
        this.arrPerGrpData = data;
          this.showDialog1 = true;
          this.showDialog2 = false;
      }
      else {
        this.displayErrorMsg = data['msg'];
        this.showDialog1 = false;
        this.showDialog2 = true;
      }
      setTimeout(() => {
        this.cd.detectChanges();
      },0);
    })

  }
  dialogCloseEvent() {
    this.displayChange.emit(false);
  }

  // Work against memory leak if component is destroyed
  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }

}