import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import * as _ from 'lodash';
import { FlowmapsManagementService } from 'src/app/pages/end-to-end/flowmaps-management/service/flowmaps-management.service';
import { GeolocationService } from 'src/app/pages/geolocation/service/geolocation.service';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardTime } from '../../dashboard/service/dashboard.model';
import { TableHeaderColumn } from '../../table/table.model';
import { TimebarService } from '../../time-bar/service/time-bar.service';
import { CONFIGURE_SIDEBAR_PAYLOAD } from './service/configure-sidebar.dummy';
import { AddAppForm, AppTierMap, ConfigureSidebarData, ConfigureSidebarLoadPayload, ConfigureSidebarTableHeaderCols, Duration } from './service/configure-sidebar.model';
import { ConfigureSidebarService } from './service/configure-sidebar.service';
import { ConfigureSidebarLoadingState, ConfigureSidebarLoadedState, ConfigureSidebarLoadingErrorState } from './service/configure-sidebar.state';

@Component({
  selector: 'app-configure-sidebar',
  templateUrl: './configure-sidebar.component.html',
  styleUrls: ['./configure-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigureSidebarComponent extends PageSidebarComponent
implements OnInit {

  data: ConfigureSidebarData;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  selectedFlowMaps: any;
  classes = 'page-sidebar';
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  
  cols: ConfigureSidebarTableHeaderCols[] = [];
  _selectedColumns: ConfigureSidebarTableHeaderCols[] = [];

  isDirty: boolean = false;
  saveBtnLabel: string = "ADD";


  //Adding this 2 variable for only resolving error Remove this after merging at cavisson side
  saveAppForm:any
  configureData: any

  constructor(private configureSidebarService: ConfigureSidebarService, 
    private geolocationService: GeolocationService, 
    private sessionService: SessionService, 
    private messageService: MessageService,
    private timebarService: TimebarService) { 
    super();
  }


  ngOnInit(): void {
    const me = this;
    me.load(this.getRequestPayload());
  }

  ngOnDestroy(): void {
    /* Handle if isDirty is true */
    if (this.isDirty) {
      // Need to refresh the main data and reload all data
    }
  }

  @Input() get selectedColumns(): ConfigureSidebarTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: ConfigureSidebarTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  load(payload: ConfigureSidebarLoadPayload) {
    const me = this;
    me.configureSidebarService.load(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ConfigureSidebarLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof ConfigureSidebarLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ConfigureSidebarLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: ConfigureSidebarLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: ConfigureSidebarLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: ConfigureSidebarLoadedState) {
    const me = this;
    me.data = state.data;
    console.log("data", this.data);
    if (me.data && me.data.tableData.data.length == 0) {
      me.empty = true;
    }
    me.error = null;
    me.loading = false;
  }

  private stopLoading(state: ConfigureSidebarLoadedState) {
    this.error = null;
    this.loading = false;
  }

  closeClick(){
    const me = this;
    me.hide();
  }

  onClickEdit(table: Table, form: NgForm){
    if (table && table._value && table._selection) {
      if (table._selection.length > 1) {
        this.messageService.add({severity:'warn', summary:'Invalid Selection', detail:'Select one application only'});
        return;
  }

      let index = this.data.tableData.data.findIndex(item => item.application == table._selection[0].application);
      if (index != -1) {
        form.controls.application.setValue(this.data.tableData.data[index].application);
        form.controls.tier.setValue(this.data.tableData.data[index].tier.split(",").map(item => item.trim()));
        form.controls.frontTier.setValue(this.data.tableData.data[index].fronTier);
        this.saveBtnLabel = "SAVE";
        form.controls.application.markAsDirty();
        
      }
    } else {
      this.messageService.add({severity:'warn', summary:'Invalid Selection', detail:'Select an application'});
    }
  }

  deleteConfiguration(table: Table) {
    if (table && table._value && table._selection) {
      table._selection.forEach(selection => {
        let index = this.data.tableData.data.findIndex(item => item.application == selection.application);
        if (index != -1) {
          this.data.tableData.data.splice(index, 1);
        }
      });
      this.saveApplications(this.getAppSavableObject(this.data.tableData.data));
      this.messageService.add({severity:'success', summary:'Successful', detail:'Application' + (table._selection.length > 1? 's ': ' ') + 'deleted'});
    } else {
      this.messageService.add({severity:'warn', summary:'Invalid Selection', detail:'Select an application'});
    }
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

  getRequestPayload(): ConfigureSidebarLoadPayload {
    let payload: ConfigureSidebarLoadPayload = {
      cctx: this.sessionService.session.cctx,
      dataFilter: [0,1],
      duration: this.getDuration(),
      appName: this.geolocationService.$selectedGeoApp,
      opType: 11,
      storeAlertType: this.geolocationService.payLoadData.storeAlertType,
      tr: +this.sessionService.testRun.id
    };
    return payload;
    // return CONFIGURE_SIDEBAR_PAYLOAD; // For dummy payload
  }

  /**
   * This method is used for get the duration object from the dashboard component
   */
  getDuration() {
    const value = this.timebarService.getValue();
    let duration: Duration = {
      preset: _.get(value, 'timePeriod.selected.id', "LIVE5"),
      st: _.get(value, 'time.frameStart.value', 0),
      et: _.get(value, 'time.frameEnd.value', 0),
      viewBy: _.get(value, 'viewBy.selected.id', 60)
    }
    return duration;
  }


  saveApplications(appTierMap: AppTierMap) {
    let payload: ConfigureSidebarLoadPayload = this.getRequestPayload();
    payload.appTierMap = appTierMap;
    this.configureSidebarService.saveApplications(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ConfigureSidebarLoadingState) {
          this.onLoading(state);
          return;
        }
        if (state instanceof ConfigureSidebarLoadedState) {
          // this.stopLoading(state);
          this.load(this.getRequestPayload());
          this.isDirty = true;
          return;
        }
      },
      (state: ConfigureSidebarLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
  }


  /**
   * This method transforms the given array into Object of Objects that can be sent to the server to save applications
   */
  getAppSavableObject(data: any[]) : AppTierMap {
    let returnableObj: AppTierMap = {};
    if (data && data.length > 0) {
      data.forEach(
        item => {
          returnableObj[item.application] = {
            "frontTier": item.frontTier || item.fronTier,
            "tierList": item.tier.split(",").map(tier => tier.trim())
          };
        }
      );
    }

    return returnableObj;
  }


  addApplication(form: NgForm, tableObj: Table) {
    console.log("Submitted form", form)
    let saveSuccess: boolean = false;
    if (form.valid) {
      const formValue: AddAppForm = this.getAddableApplication(form.value);
      if (formValue.application.length &&  formValue.tier.length && formValue.frontTier.length) {
        if (this.data.tableData.data != null) {
          const index = this.data.tableData.data.findIndex(item => item.application === formValue.application);
          if (index == -1) {
            this.data.tableData.data.push(formValue);
            saveSuccess = this.processSave(form);
          } else {
            if (this.saveBtnLabel == "SAVE") {
              this.data.tableData.data[index] = formValue;
              saveSuccess = this.processSave(form);
            } else {
              // Prompt: Application already available
              this.messageService.add({severity:'error', summary:'Duplicate', detail:'Application "' + formValue.application + '" already exists'});
            }
          }
        }
      }
    }
    if (!saveSuccess) {
      if (!form.controls.application.valid) {
        this.messageService.add({severity:'error', summary:'Invalid', detail:'Application name can not be empty'});
      }
      if (!form.controls.tier.valid) {
        this.messageService.add({severity:'error', summary:'Invalid', detail:'Minimum one tier must be provided'});
      }
      if (!form.controls.frontTier.valid) {
        this.messageService.add({severity:'error', summary:'Invalid', detail:'A Front-Tier must be selected'});
      }
    }
  }

  getAddableApplication(formValue: AddAppForm): AddAppForm {
    return {application: formValue.application.trim(), tier: formValue.tier.toLocaleString(), frontTier: formValue.frontTier};
  }

  clearForm(form: NgForm): void {
    form.reset();
    this.saveBtnLabel = "ADD";
  }

  processSave(form: NgForm): boolean {
    this.saveBtnLabel = "ADD";
    this.saveApplications(this.getAppSavableObject(this.data.tableData.data));
    this.messageService.add({severity:'success', summary:'Successful', detail:'Application added'});
    form.reset();
    return true;
  }

}
