import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ViewChild } from '@angular/core';
// import { Paginator } from 'primeng/api';
import { CommonServices } from '../../services/common.services';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
//import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
@Component({
    selector: '<app-ddr-paginator>',
    templateUrl: './ddr-paginator.component.html',
    styleUrls: ['./ddr-paginator.component.css']
})

export class DdrPaginator implements OnInit, OnChanges {

    @Input() limit;
    @Input() offset;
    @Input() totalCount;
    @Output() paginateData: EventEmitter<Object>;
    nvFlag: any;
    first: number = 10;
    //@ViewChild('pp') paginator: Paginator;

    constructor(public commonService: CommonServices, private _ddrData: DdrDataModelService,
        //private _cavConfig: CavConfigService
    ) {
        this.paginateData = new EventEmitter<Object>();
    }

    ngOnChanges(): void {
        if (this.limit == 50)
            this.commonService.rowspaerpage = 50;
        if (((this.totalCount >= this.offset + this.limit) || this.totalCount > 50)
            && this._ddrData.isFromNV && this._ddrData.isFromNV != 'NA'
            && Number(this._ddrData.isFromNV) == 1 && sessionStorage.getItem("isMultiDCMode") == "true") {
            this.nvFlag = true;
            setTimeout(() => {
                if (document.getElementById("tnv")) {
                    document.getElementById("tnv").children[0].children[0].children[0].className = "";
                    document.getElementById("tnv").children[0].children[0].children[4].className = "";
                    if (document.getElementById("tnv").children[0].children[0].children[0].children[0])
                        document.getElementById("tnv").children[0].children[0].children[0].children[0].className = "";
                    if (document.getElementById("tnv").children[0].children[0].children[4].children[0])
                        document.getElementById("tnv").children[0].children[0].children[4].children[0].className = "";
                }
                //console.log('document.getElementById("tnv").children[0].children[0].children[0].className ',document.getElementById("tnv").children[0].children[0].children[0].className);
            }, 1000);
        }
        else
            this.nvFlag = false;
        console.log('this._ddrData.isFromNV total count', this._ddrData.isFromNV, this.totalCount, ' ', this.limit, ' ', this.offset);
    }

    ngOnInit(): void {

        // console.log('this._ddrData.isFromNV total count',this._ddrData.isFromNV, this.totalCount, ' ', this.limit, ' ', this.offset);
    }

    paginate(event) {
        // event.first = Index of the first record  (used  as offset in query) 
        // event.rows = Number of rows to display in new page  (used as limit in query)
        // event.page = Index of the new page
        // event.pageCount = Total number of pages
        console.log('paginate event====>', event);
        if (this._ddrData.isFromNV && this._ddrData.isFromNV == '1') {
            if (this.commonService.rowspaerpage != event.rows) {
                //this.paginator.changePage(0);
                //this.paginator.changePageToFirst(event);
                this._ddrData.nvFirstPage = true;
                this.commonService.rowspaerpage = event.rows;
                event.first = 0;
                this.first = 0
            }
            else {
                this.first = 10;
                this._ddrData.nvFirstPage = false;
                this.commonService.rowspaerpage = event.rows;
            }
        }
        else {
            this.commonService.rowspaerpage = event.rows;
        }
        this.offset = parseInt(event.first);
        this.limit = parseInt(event.rows);
        if (this.limit > this.totalCount) {
            this.limit = Number(this.totalCount);
        }
        if ((this.limit + this.offset) > this.totalCount) {
            this.limit = Number(this.totalCount) - Number(this.offset);
        }
        this.commonService.fpLimit = this.limit;
        this.commonService.fpOffset = this.offset;
        this.paginateData.emit({ 'limit': this.limit, 'offset': this.offset });
    }
}
