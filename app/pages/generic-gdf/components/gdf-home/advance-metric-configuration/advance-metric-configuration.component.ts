import { Component, OnInit, Output, EventEmitter, Optional, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { AdvanceMetricConf, PatternVal } from '../../../containers/adv-metric-configuration-data';
import { ImmutableArray } from '../../../services/immutable-array';
import { GenericGdfService } from '../../../services/generic-gdf-service';
import { MetricConfData } from '../../../containers/metric-configuration-data';
@Component({
  selector: 'app-advance-metric-configuration',
  templateUrl: './advance-metric-configuration.component.html',
  styleUrls: ['./advance-metric-configuration.component.scss']
})
export class AdvanceMetricConfigurationComponent implements OnInit {
  
  @Input() item = new MetricConfData();
  @Output()  mConfTableData = new EventEmitter();
  showAdvDailog: boolean = false;  // flag for showing advance metric configuration dialog
  showPatternDailog: boolean = false; // flag for showing pattern and updated value dailog.
  advPatternVal: PatternVal[] = []; // datatable value of pattern dailog
  advpatt = new PatternVal();
  advanceMetricConf:AdvanceMetricConf
  dailogPatternHeader: string = ''; // header for 'ADD/EDIT' in pattern dailog
  isFromEdit: boolean = false //flag for add/edit in pattern dailog
  tempId: number;
  selectedPattern: PatternVal[];
  count: number = 0; // variable to keep count of rows addition in table
  converList: SelectItem[];
  dailogData: any; // for dailog data
  helpdialog:boolean = false;
  cols:any[]
  rejectVisible: boolean;
  acceptLable: string;
  constructor(
    private cms: ConfirmationService,
    private cd: ChangeDetectorRef,
    ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'pattern', header: 'Value'},
      {field: 'upVal', header: 'Mapped Value'}
  ]
  }

  /**Method called on cancel click in advance metric configuration dailog */
  closeAdvDailog() {
    this.showAdvDailog = false;
  }

  // Method called when 'ADD' button is clicked for adding pattern
  addPattern() {
    this.advanceMetricConf = new AdvanceMetricConf()
    this.dailogPatternHeader = "Add Mapped Values"
    this.showPatternDailog = true;
    this.isFromEdit = false;
    this.clearPatternDailog();
  }

  /**Method to edit the pattern */
  editPattern(rowData) {
    this.dailogPatternHeader = "Edit Mapped Values"
    this.isFromEdit = true;
    this.showPatternDailog = true;
    this.tempId = rowData["id"];
    this.advpatt = Object.assign({}, rowData)
  }

  /**Method called  when save is clicked add/edit pattern dailog */
  savePattern() {
    if (!this.isFromEdit) {
      this.advpatt["id"] = this.count;
      this.item['advPattern'] = ImmutableArray.push(this.advPatternVal, this.advpatt);
      this.count = this.count + 1;
    }
    else {
      this.advpatt["id"] = this.tempId;
      this.item['advPattern'] = ImmutableArray.replace(this.advPatternVal, this.advpatt, this.getSelectedRowIndex())
    }
    this.showPatternDailog = false;
    this.clearPatternDailog();

  }

  /*This method returns selected row on the basis of Id */
  getSelectedRowIndex(): number {
    let index = this.item['advPattern'].findIndex(each => each["id"] == this.tempId)
    return index;
  }

  /**Method called for clearing the field values in pattern dailog*/
  clearPatternDailog() {
    this.advpatt = new PatternVal();
  }

  addAdvConf() {
    let that = this;
    this.mConfTableData.emit(this.item)
  }

  deletePattern(rowData){
    this.rejectVisible = true;
    this.acceptLable = "Yes";
    this.cms.confirm({
      message: 'Are you sure to delete the selected pattern?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
       accept: () => {
        let arrId = [];

        arrId.push(rowData.id) // push selected row's id 
        this.item['advPattern'] = this.item['advPattern'].filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })
      },
      reject: () => {
      }
    })
  }

  

  /**Method to delete all patterns*/
  deleteAllPattern() {
    this.rejectVisible = true;
    this.acceptLable = "Yes";
    /* This flag is used to check whether any row is selected for delete or not*/
    let noRowSelected: boolean = false;

    if (this.selectedPattern == undefined || this.selectedPattern.length == 0)
      noRowSelected = true;

    this.cms.confirm({
      message: (noRowSelected) ? 'Are you sure to delete all values?' : 'Are you sure to delete the selected value(s)?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
          this.selectedPattern = this.item['advPattern']; // if no row is selected then set the whole table data in the selected table data to perform delete

        this.selectedPattern.map(function (each) {
          arrId.push(each.id); // push items to be deleted
        })

        this.item['advPattern'] = this.item['advPattern'].filter(function (val) {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

        /**clearing object used for storing data ****/
        this.selectedPattern = [];

        //Updating table values 
        // this.item['gdfInfo']['depMHComp'] = this.hrchicaltableData;
        // this.tableData.emit( this.item['gdfInfo']);
        this.dailogData['advPattern'] = this.advPatternVal;
      },
      reject: () => {
        this.selectedPattern = [];
      }
    });

  }
}
