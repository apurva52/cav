import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { Config } from '../service/alert-config.model';
import { AlertConfigService } from '../service/alert-config.service';
@Component({
  selector: 'app-add-configure',
  templateUrl: './add-configure.component.html',
  styleUrls: ['./add-configure.component.scss']
})
export class AddConfigureComponent extends PageDialogComponent implements OnInit {


  showCharts:boolean;
  generateReport:boolean;
  useMetrics:boolean=true;
  similarPattern:boolean;
  PlaceMetrices:boolean;
  useMetrics1:boolean=true;
  similarPattern1:boolean;
  displaySetings: boolean;


  @Input()
  config: Config;

  @Output() 
  addConfigureData = new EventEmitter<Config>();
  isEdit: boolean;
  
  constructor(private AlertConfigServiceObj:AlertConfigService,
    private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    let me = this;
   
  }

  open(){
    this.displaySetings = true;
  }
  
  closeDialog() {
    this.displaySetings = false;
  }
}
