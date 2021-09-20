import { Component, OnInit, Input } from '@angular/core';
import { ExecDashboardCommonKPIDataservice } from './../../../services/exec-dashboard-common-kpi-data.service';
import { ExecDashboardUtil } from '../../../utils/exec-dashboard-util';
import { Meta } from '@angular/platform-browser';
@Component({
    templateUrl: './exec-dashboard-statstype.component.html',
    selector: 'app-exec-dashboard-statstype'
})
export class ExecDashbaordStatsTypeComponent implements OnInit {

    @Input('statsTypeView') statsTypeView;
    statsViewHeader: any;
    expandTable: Boolean = true;
    rowData = [];
    constructor(public _commonKpiDataService: ExecDashboardCommonKPIDataservice,  private meta : Meta) {

    }

    ngOnInit() {
        this.meta.removeTag("name='viewport'");
        this.meta.addTag({ name: 'viewport', content:'width=device-width, height=device-height, user-scalable=no, initial-scale=0.1, ' });
        console.log("inside statsType View ");
        console.log(this.statsTypeView);
        this.createHeaderBasedOnStatsType();
    }

    /**
     * type: Radis/Mongo/Mysql
     */
    createHeaderBasedOnStatsType() {
        // { "field": "updated2Min", "header": "Updated 2 Min", "icon": "fa fa-history", "class": "kpiTierName", "bodyStyles": "tierNamecss" },
        let tempHeader = [];
        let tempHeadeList = this._commonKpiDataService.kpiHeader[this.statsTypeView['headerType']];
        // tempHeadeList.forEach(element => {
        //     // console.log(element);
        //     tempHeader.push({ "field": element, "header": element, })
        //     tempObject[element] = Math.random();
        // });
        for (var key in tempHeadeList) {
            if (tempHeadeList.hasOwnProperty(key)) {
                // console.log(key + " -> " + tempHeadeList[key]);
                tempHeader.push({ "field": tempHeadeList[key], "header": key, });
            }
        }
        this.statsViewHeader = tempHeader;
    }


    /**
 * responsible for hiding and showing column
 */
    toggleTable() {
        try {
            if (this.expandTable) {
                this.expandTable = false;
            }
            else {
                this.expandTable = true;
            }
        } catch (error) {
            console.error(error);
        }
    }

}
