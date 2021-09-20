import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, ConfirmationService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ADD_TEMPLATE_DATA } from './service/add-template.dummy';
import { CctxInfo, TemplateDataDTO, TemplateObject, TInfo } from './service/add-template.model';
import { AddReportSettingsService } from '../../metrics/add-report-settings/service/add-report-settings.service';
import { AddTemplateService } from './service/add-template.service'
import { SaveTemplateLoadedState, SaveTemplateLoadingErrorState, SaveTemplateLoadingState } from './service/add-template.state';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import * as moment from 'moment-timezone';
import { Router } from '@angular/router';
import { ReportConstant } from '../../metrics/add-report/service/add-report-enum';
import { TemplateService } from '../service/template.service';
import { TEMPLATE_TABLE_DATA } from '../service/template.dummy';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class AddTemplateComponent implements OnInit {

  error: AppError;
  empty: boolean;
  loading: boolean;
  data;
  templateDes = "";
  breadcrumb: MenuItem[];
  selectedCategory = 'All';
  templateName = "";
  reportSetData: any[];
  selectedfilterInclude =  "Include" ;
  selectedfilterValue = 0 ;
  filterFirstValue: any;
  filterSecondValue: any;
  isEnableFilter: boolean = false;
  dialogVisible = false;
  isTemplateEdit = false;
  //selectedFilterValue: any;
  selectedInclude: any;
  selectedOperator = { label: '=', value: 0 };
  categories: any[] = [{ name: 'All none zero', key: 'All' }, { name: 'All zero', key: 'Zero' }, { name: 'Advance', key: 'Advance' }];

  blockuiForSaveTemplate:boolean = false;

  constructor(
    public timebarService: TimebarService,
    private addReportSettingsService: AddReportSettingsService,
    private addTemplateService: AddTemplateService,
    private sessionService: SessionService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private templateService: TemplateService) { }

  ngOnInit(): void {
    const me = this;
    me.data = ADD_TEMPLATE_DATA;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system' }, for bug id - 110253
      { label: 'My Library', routerLink: '/my-library/dashboards' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Template', routerLink: '/template' },
      { label: 'Add Template', routerLink: '/add-template' },
    ];
    me.isEnableFilter = false;
    if (me.templateService.isEdit) {
       me.isTemplateEdit = true;
      me.editTemplate();
    }else{
      me.isEnableFilter = false;
    }
  }
  editTemplate() {
    try {
      const me = this;
      let editTemplateData = me.templateService.editAddedTemplate.data.template;
      me.templateService.previousTempName = editTemplateData.tInfo.tn;
      me.templateName = editTemplateData.tInfo.tn;
      me.templateDes = editTemplateData.tInfo.des;
      if(editTemplateData.ft){
      me.editFilterMode(editTemplateData.ft);
      }else{
        me.isEnableFilter = false;
      }
    } catch (error) {
      console.error(error)
    }

  }
  selectOperator() {
    const me = this;
  }
  saveTemplates() {
    const me = this;
    TEMPLATE_TABLE_DATA.paginator.first=0;
    TEMPLATE_TABLE_DATA.paginator.rows=10;
    try {
      if (me.templateName === '' || me.templateName == null) {
        this.confirmationDialog("Error", "Please Enter Template Name");
        return;
      }
      let regex_filter_validation = new RegExp('^[0-9]*$');
      let selectedFilterBy: any = me.filterFirstValue;
      if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
        && selectedFilterBy <= 0) {
          this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value greater than Zero for advance filter.");
          return;
        }
      if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
        && !regex_filter_validation.test(selectedFilterBy)) {
        this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter(Without decimal).");
        return;
      }
      let regex_report_name = new RegExp('^[a-zA-Z][A-Za-z0-9_()\.:]*$');
      let rpt = me.templateName;
      if (!regex_report_name.test(rpt)) {
        this.confirmationDialog("Error", "Please Enter valid Template Name.\r\nTemplate "
          + "Name must start with alphabet. \r\nMaximum length is 64. \r\nAllowed "
          + "characters are alphanumeric and following special characters:(_ . : )")
        return;
      }
      if (me.templateName.length > 64) {
        me.confirmationDialog("Error", "Template Name should not exceed 64 characters.");
        return;
      }
      if (me.templateService.templateList) {
        if (me.isTemplateEdit && me.templateService.previousTempName !== me.templateName) {
          for (let i = 0; i < me.templateService.templateList.length; i++) {
            if (me.templateName === me.templateService.templateList[i].tn) {
              me.confirmationDialog("Error", "Duplicate Template Name.Please enter unique name.");
              return;
            }
          }

        } else if (!me.isTemplateEdit) {
          for (let i = 0; i < me.templateService.templateList.length; i++) {
            if (me.templateName === me.templateService.templateList[i].tn) {
              me.confirmationDialog("Error", "Duplicate Template Name.Please enter unique name.");
              return;
            }
          }
        }
      }
      me.addTemplateService.templateName = me.templateName;
      if (me.addReportSettingsService.reportSetData == undefined || me.addReportSettingsService.reportSetData.length == 0) {
        me.confirmationDialog("Error", "Please Add atleast one Report Set.");
        return;
      }
      let tnObj: TInfo = {
        tn: me.templateName,
        des: me.templateDes,
        cd: me.getMachineDateTime(),
        md: me.getMachineDateTime(),
        un: me.sessionService.session.cctx.u,
        tr: parseInt(me.sessionService.session.testRun.id),
        rptSetNum: me.addReportSettingsService.reportSetData.length,
        type: "Userdefined",
        ext: "json"
      }

      let ft = null;
      if (this.isEnableFilter) {
        if (this.selectedCategory == 'All') {
          ft = {"in": true,
          "opt": ">",
          "typ": [0, 7],
          "val1": 0,
          "val2": -1
        }
        }
        else if (this.selectedCategory == 'Zero') {
          ft = {
            "in": true,
            "opt": "<",
            "typ": [0, 7],
            "val1": 0,
            "val2": -1
          }
        }
        else if (this.selectedCategory == 'Advance') {

          if (this.selectedOperator.value == ReportConstant.IN_BETWEEN) {
            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
            let secondcheck = this.numericCheckUptoThreeDec(this.filterSecondValue);
            if (!secondcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          else {

            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          let typ =  [this.selectedfilterValue];
          let inc = false;
          let val1 = -1;
          let val2 = -1;
          if(this.selectedfilterInclude === "Include"){
            inc = true;
            typ.push(7);
          }
          if(this.filterFirstValue){
            val1 = this.filterFirstValue;
          }
          if(this.filterSecondValue){
            val2 = this.filterSecondValue;
          }
          ft = {
            opt: this.selectedOperator.label,
            in: inc,
            typ: typ,
            val1: val1,
            val2: val2
          }
        }
      }

      let cctxObj: CctxInfo = {
        cck: me.sessionService.session.cctx.cck,
        pk: me.sessionService.session.cctx.pk,
        prodType: me.sessionService.session.cctx.prodType,
        u: me.sessionService.session.cctx.u
      }
      let templatedtObj: TemplateObject = {
        tInfo: tnObj,
        ars: me.addReportSettingsService.reportSetData,
        ft: ft,
      }
      me.blockuiForSaveTemplate = true;
      const payload: TemplateDataDTO = {
        templateDTO: templatedtObj,
        cctx: cctxObj,
      }

      if (me.isTemplateEdit) {     
        payload['temInfo'] = [{ tn: me.templateService.previousTempName }];
      }
        
      me.addTemplateService.saveTemplateData(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof SaveTemplateLoadingState) {
            me.saveTemplateLoading(state);
            return;
          }

          if (state instanceof SaveTemplateLoadedState) {
            me.saveTemplateLoaded(state);
            return;
          }
        },
        (state: SaveTemplateLoadingErrorState) => {
          me.saveTemplateLoadingError(state);
        }
      );

    } catch (error) {
      console.error(error);
    }
  }
  saveTemplateLoading(state) { 
    this.timebarService.setLoading(true);
  }
  saveTemplateLoaded(state) {
    const me = this;
    try {
      this.timebarService.setLoading(false);
      this.dialogVisible = true;
      me.blockuiForSaveTemplate = false;
      this.confirmationService.confirm({
        key: 'PerformanceDialog',
        message: "Template saved successfully.",
        header: "Success",
        accept: () => {
          if (me.templateService.isEdit) {
            me.templateService.isEdit = false;
          }
          me.router.navigate(['/template']);
          me.clearTemplate();
        },
        rejectVisible: false
      });

    } catch (error) {
      console.error(error);
    }
  }
  saveTemplateLoadingError(state) { 
    this.timebarService.setLoading(false);
  }
  getMachineDateTime() {
    try {
      let currentTime = Date.now();
      let timeZoneId = "Asia/Kolkata"
      //  let timeZoneId = sessionStorage.getItem('timeZoneId');
      let date = moment.tz(currentTime, timeZoneId).format('MM/DD/YY HH:mm:ss');
      return date;
    }
    catch (error) {
      console.error("error in machine date time fetching---", error);
    }

  }
  numericCheckUptoThreeDec(value): boolean {
    try {
      if (/^(0|[0-9]*\d)(\.\d{1,3})?$/.test(value))
        return true;
      else
        return false;
    } catch (error) {

    }
  }
  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: 'PerformanceDialog',
      message: msg,
      header: head,
      accept: () => { this.dialogVisible = false; return; },
      rejectVisible: false
    });
  }
  onChangeFilterOption() {
    if (this.isEnableFilter == false) {
      this.selectedCategory = 'All';
      this.selectedfilterInclude =  "Include" ;
      this.selectedfilterValue = 0;
      this.selectedOperator = { label: '=', value: 0 };
      this.filterFirstValue = "";
      this.filterSecondValue = "";
    }
  }
  clearTemplate() {
    try {
      const me = this;
      me.templateName = "";
      me.templateDes = "";
      me.addReportSettingsService.reportSetData = [];
      this.reportSetData = [];
      this.isEnableFilter = false;
    } catch (error) {
      console.error(error);
    }
  }
  editFilterMode(ft){
    if(ft['opt']){
      this.isEnableFilter = true;
      let opt = ft['opt'];
      if(opt === ">"){
      this.selectedCategory = "All";
      }else if(opt === "<" && ft['in'] && ft['typ'][0] === 0){
        this.selectedCategory = "Zero";
      // }else if(opt === "Bottom"){
      //   this.selectedCategory = "Advance"; 
      //   this.selectedOperator = {label : opt , value : 6};
      //   this.filterFirstValue = ft['val1'];
      // }else if(opt === "Top"){
      //   this.selectedCategory = "Advance"; 
      //   this.selectedOperator = {label : opt , value : 5};
      //   this.filterFirstValue = ft['val1'];
      }
      else{
        if(opt === "In-Between"){
          this.selectedOperator = {label : opt , value : 7};
          this.filterSecondValue = ft['val2'];
        }else if(opt === "="){
          this.selectedOperator = {label : opt , value : 0};
        }else if(opt === ">="){
          this.selectedOperator = {label : opt , value : 3};
        }else if(opt === "<="){
          this.selectedOperator = {label : opt , value : 4};
        }else if(opt === "Top"){
          this.selectedOperator = {label : opt , value : 5};
        }else if(opt === "Bottom"){
          this.selectedOperator = {label : opt , value : 6};
        }
        else{
           console.log("Unsupported Filter");
          return;
        }
        this.selectedCategory = "Advance";      
        this.filterFirstValue = ft['val1'];
        this.selectedfilterValue = ft['typ'][0];
        if(ft['in']){
          this.selectedfilterInclude = "Include";
        }else{
          this.selectedfilterInclude = "Exclude";     
        }
      
      }
    }
  }
}
