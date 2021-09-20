import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { rotateOutUpRightAnimation } from 'angular-animations';
import { ConfirmationService, MessageService } from 'primeng';
import { MonitorupdownstatusService } from '../../service/monitorupdownstatus.service';
import * as COMPONENT from '../add-monitor/constants/monitor-configuration-constants';



@Component({
    selector: 'app-configured-monitor-info',
    templateUrl: './configured-monitor-info.component.html',
    styleUrls: ['./configured-monitor-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService],
})

export class ConfiguredMonitorInfoComponent implements OnInit {

    cols: any[];
    confTableData: any = [];
    @Input() techName: string;
    @Input() showCols: any;
    @Output() logMonData = new EventEmitter();
    loading:boolean = false;
    rejectVisible: boolean = true;
    acceptLable: string = "Yes";

    constructor(private monServiceObj: MonitorupdownstatusService, private cd: ChangeDetectorRef,
        private messageService: MessageService, private confirmationService: ConfirmationService,) { }

    ngOnInit() {

        this.cols = this.showCols;
        // this.getTableData(this.techName);
    }

    onRowEditInit(data) {
        this.loading = true;
        if(this.techName === COMPONENT.TECH_HEALTH_CHECK)
        {
            this.monServiceObj.getHealthChkMonData(data.gMonId).subscribe(res=>{
                console.log("res- ", res)
                res['gMonId'] = data.gMonId;
                res['objID'] = data._id;
                this.loading = false;
                this.logMonData.emit(res);
            })
        }
        else{
            this.monServiceObj.otherMonConfig(data.gMonId, data._id, this.techName).subscribe(res => {
                if (res) {
                    if (res[COMPONENT.RESPONSE_STATUS] === false) {
                        this.messageService.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: res['reason'] });
                        this.loading = false;
                        this.cd.detectChanges();
                    }
                    else {
                        res['gmonID'] = data.gMonId;
                        res['objID'] = data._id;
                        this.loading = false;
                        this.logMonData.emit(res);
                    }
                }
            })
        }

    }

    removeRowData(rowData) {
        const me = this;
        me.rejectVisible = true;
        me.acceptLable = "Yes";
        me.confirmationService.confirm({
            message: 'Do you want to delete this monitor configuration?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                me.loading = true;
                me.confTableData = me.confTableData.filter(each => {
                    return each.gMonId != rowData.gMonId;
                })

                me.monServiceObj.removeConfigurationInfo(rowData.gMonId, rowData._id, me.techName).subscribe(res => {
                 if (res[COMPONENT.RESPONSE_STATUS]) 
                 {
                    me.messageService.add({ severity: COMPONENT.SEVERITY_SUCCESS, summary: COMPONENT.SUMMARY_SUCCESS, detail: res[COMPONENT.RESPONSE_MSG] });
                    me.loading = false;
                    this.monServiceObj.deleteOtherMonConf(true);
                    me.cd.detectChanges();
                 }
               })
            },
            reject: () => { },
        });
    }

    getTableData(data) {
            this.confTableData = data;
            this.cd.detectChanges();
    }


}

