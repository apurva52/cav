import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { DashboardFavCTX, DashboardFavNameCTX } from 'src/app/shared/dashboard/service/dashboard.model';
import { COPY_DASHBOARD, DashboardReq, DASHBOARD_SUCCESSFULY_SAVED, DUPLICATE_DASHBOARD_NAME, EDIT_DASHBOARD, EXCEPTION_IN_DASHBOARD_SAVING, EXCEPTION_IN_DASHBOARD_SAVING_MESSAGE, NO_ACCESS, NO_WRITE_ACCESS_FOR_DASHBOARD, NO_WRITE_ACCESS_FOR_DASHBOARD_MESSAGE, READ_MODE, READ_WRITE_MODE, SAVE_DASHBOARD, Status, UPDATE_DASHBOARD } from '../../service/dashboards.model';
import { DashboardStateLoadedStatus, DashboardStateLoadingErrorStatus, DashboardStateLoadingStatus } from '../../service/dashboards.state';
import { DashboardsService } from '../../service/dashboards.service';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { ADD_CONTENT } from '../../service/dashboards.dummy';

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class AddDashboardComponent
  extends PageDialogComponent
  implements OnInit {
  dashboardName: string;
  showPermission: boolean;
  title: string = "Add New Dashboard";
  selectedAccessMode: string = 'public';
  selectedReadOperation: string = 'readWrite';
  defaultDashboardPath: string = '/dashboards';
  content:InfoData;
  isAddDashboard: boolean = false;
  data: Status;
  empty: boolean;
  error: boolean;
  loading: boolean = false;
  dashboardData: DashboardReq
  @Input() dashboard: DashboardComponent;
  nameError: boolean = false;
  payload: DashboardReq;
  oldDashboardNameCtx: DashboardFavNameCTX
  oldPath: string;
  operationType: string;
  dashboardDescription: string;
  userName: string;
  access: boolean = false;
  permission: boolean = false;
  acceptLable = "Yes";
  rejectVisible = true;
  existError : boolean = false;
  @Output() dashboardEventBind = new EventEmitter<Status>();
  editConfirmMessage: string;
  editPreviousName: string;
  editNewName: string;
  constructor(private dashboardsService: DashboardsService, private confirmationService: ConfirmationService, private cd: ChangeDetectorRef, private sessionService: SessionService, private messageService: MessageService) {

    super();
  }

  showDialog(row, operationType) {
    super.show();
    // if (row) {
    //   this.dashboardName = row.name;
    // } else {
    //   this.dashboardName = null;
    // }

    // this.showPermission = isShowPermission;
    this.nameError = false;
    this.existError = false;
    this.access = false;
    this.permission = false;
    if (operationType == 'addOperation') {
      this.dashboardName = null;
      this.defaultDashboardPath = "/dashboards";
      this.dashboardDescription = null;
      this.title = "Add New Dashboard";
      this.selectedReadOperation = "readWrite";
    }
    else if (operationType == 'editOperation' || operationType == 'copyOperation') {


      if (this.dashboard.data == null) {
        return;
      }
      this.dashboardName = operationType == 'editOperation' ? this.dashboard.data.favNameCtx.name : this.dashboard.data.favNameCtx.name + '_copy';



      this.defaultDashboardPath = this.dashboard.data.favNameCtx.path;
      this.dashboardDescription = this.dashboard.data.favDetailCtx.description;
      this.selectedAccessMode = this.dashboard.data.favDetailCtx.isPublic ? 'public' : 'private';


      if (this.defaultDashboardPath.indexOf("/dashboards") == 0) {
        this.selectedReadOperation = this.selectedAccessMode == 'private' ? 'noAccess' : this.dashboard.data.favDetailCtx.readWriteMode == READ_WRITE_MODE ? 'readWrite' : 'read';
      }
      else {
        this.selectedReadOperation = this.selectedAccessMode == 'public' ? 'readWrite' : 'noAccess';
      }

      this.title = operationType == 'editOperation' ? "Edit Dashboard" : "Copy Dashboard";
    }
    this.userName = this.sessionService.session.cctx.u;
    this.operationType = operationType;
  }
  ngOnInit(): void {
    this.content=ADD_CONTENT;
   }
  saveChanges() {
    this.editPreviousName=this.dashboard.data.favNameCtx.name;
    this.editNewName=this.dashboardName;
    if (!this.dashboardName) {
      this.nameError = true;
      return;
    }
    else if (this.dashboardName.startsWith('_') || /^[0-9]/.test(this.dashboardName)) {
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Dashboard name should start with alphabet." });
      return;
    } else if (/[-!$%^&*()+|~=`{}:/<>?,.@# ]/g.test(this.dashboardName) || this.dashboardName.includes('[') || this.dashboardName.includes(']')) {
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Special characters are not allowed. Only AlphaNumeric and Underscore(_) are allowed." });
      return;
    }
    else if( this.dashboard.data.favDetailCtx.widgets.length == 0){
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "No permission to add empty dashboard." });

      return;
    }
    else if (!this.selectedReadOperation) {
      this.permission = true;
      return;
    }
    else if (this.defaultDashboardPath.indexOf("/dashboards/system") == 0 || this.defaultDashboardPath.indexOf("/system") == 0){
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "User has no permission to add in system favorites." });
      return;
    }
    if (this.operationType == "addOperation") {
      if (this.dashboard.data.favDetailCtx == null) {
        return;
      }

      this.dashboard.data.favDetailCtx.public = this.selectedReadOperation == 'read' || this.selectedReadOperation == 'readWrite' ? true : false;

      if ( this.dashboard.data.favDetailCtx.public) {

        this.dashboard.data.favDetailCtx.readWriteMode = this.selectedReadOperation == 'read' ? READ_MODE : READ_WRITE_MODE;
      }
      else {
        this.dashboard.data.favDetailCtx.readWriteMode = NO_ACCESS;
      }

      this.dashboard.data.favDetailCtx.description = this.dashboardDescription;
      this.dashboard.data.favDetailCtx.updatedBy = this.userName;
      this.dashboard.data.favDetailCtx.owner = this.userName;
      this.dashboard.data.favDetailCtx.createdDate = new Date().toDateString();


      //for setting viewby as auto
      this.dashboard.data.favDetailCtx.viewBy.selected = '0';

      const favNameCtx: DashboardFavNameCTX = {
        name: this.dashboardName,
        path: this.defaultDashboardPath
      }

      const favCtx: DashboardFavCTX = {
        favNameCtx: favNameCtx,
        favDetailCtx: this.dashboard.data.favDetailCtx,
        oldfavNameCtx: null
      }

      const payload: DashboardReq = {
        opType: SAVE_DASHBOARD,
        cctx: null,
        tr: null,
        compareCtx: null,
        multiDc: false,
        favCtx: favCtx

      };
      this.payload = payload;
      this.addDashboard(payload);
    }

    else if (this.operationType == "editOperation" || this.operationType == "copyOperation") {
      var op_type = SAVE_DASHBOARD;
      var oldDashboardNameCtx: DashboardFavNameCTX = {
        name: this.dashboard.data.favNameCtx.name,
        path: this.dashboard.data.favNameCtx.path
      }

      if (oldDashboardNameCtx.path.indexOf("/dashboards") != 0) {
        if (this.defaultDashboardPath.indexOf("/dashboards") !== 0) {
          this.defaultDashboardPath = oldDashboardNameCtx.path == oldDashboardNameCtx.name ? "/dashboards" : "/dashboards/" + oldDashboardNameCtx.path.split("/" + oldDashboardNameCtx.name)[0];

        }
        this.dashboard.data.favDetailCtx.owner = this.userName;
        this.dashboard.data.favDetailCtx.updatedBy = this.userName;
        this.dashboard.data.favDetailCtx.createdDate = new Date().toDateString();
      }
      else {
        if (this.operationType == "editOperation") {
          op_type = EDIT_DASHBOARD;
          this.dashboard.data.favDetailCtx.updatedBy = this.userName;
        }
        else {
          op_type = COPY_DASHBOARD;
          this.dashboard.data.favDetailCtx.owner = this.userName;
          this.dashboard.data.favDetailCtx.updatedBy = this.userName;
          this.dashboard.data.favDetailCtx.createdDate = new Date().toDateString();
        }
      }

      this.dashboard.data.favDetailCtx.public = this.selectedReadOperation == 'read' || this.selectedReadOperation == 'readWrite' ? true : false;

      if ( this.dashboard.data.favDetailCtx.public) {

        this.dashboard.data.favDetailCtx.readWriteMode = this.selectedReadOperation == 'read' ? READ_MODE : READ_WRITE_MODE;
      }
      else {
        this.dashboard.data.favDetailCtx.readWriteMode = NO_ACCESS;
      }

      this.dashboard.data.favDetailCtx.description = this.dashboardDescription;

      const favNameCtx: DashboardFavNameCTX = {
        name: this.dashboardName,
        path: this.defaultDashboardPath
      }

      const favCtx: DashboardFavCTX = {
        favNameCtx: favNameCtx,
        favDetailCtx: this.dashboard.data.favDetailCtx,
        oldfavNameCtx: oldDashboardNameCtx
      }

      const payload: DashboardReq = {
        opType: op_type,
        cctx: null,
        tr: null,
        compareCtx: null,
        multiDc: false,
        favCtx: favCtx

      };
      this.payload = payload;
      this.addDashboard(payload);
    }

    //this.visible = false;
    //  this.confirm1();
  }

  onAccessChange() {

    if (this.selectedAccessMode == 'public' && this.selectedReadOperation == 'noAccess') {

      this.selectedReadOperation = 'read';
    }

    else if (this.selectedAccessMode == 'private' && this.selectedReadOperation !== 'noAccess') {

      this.selectedReadOperation = 'noAccess';
    }
  }
  confirmDialog() {
    const me = this;
    me.acceptLable = "Yes";
    me.rejectVisible = true;
    if(this.editNewName==this.editPreviousName){
      this.editConfirmMessage="Do you want to save dashboard changes ?";
    } else{
      this.editConfirmMessage="Dashboard with same name is already available. Do you want to overwrite ?";
    }
    this.confirmationService.confirm({
      message: this.editConfirmMessage,

      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        me.payload.opType = UPDATE_DASHBOARD;
        me.addDashboard(me.payload);
        //  this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  addDashboard(data: DashboardReq) {
    const me = this;
    me.dashboardsService.addDashboard(data, false).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardStateLoadingStatus) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DashboardStateLoadedStatus) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DashboardStateLoadingErrorStatus) => {
        me.onLoadingError(state);
      }
    );
  }



  private onLoading(state: DashboardStateLoadingStatus) {
    const me = this;
    me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }

  private onLoadingError(state: DashboardStateLoadingErrorStatus) {
    const me = this;
    me.data = null;
    me.error = true;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }

  private onLoaded(state: DashboardStateLoadedStatus) {
    const me = this;
    me.data = state.data;
    me.empty = false;
    me.error = false;
    me.loading = false;
    if (me.data.code == DUPLICATE_DASHBOARD_NAME) {
      me.confirmDialog();
      me.cd.detectChanges();
    }
    else {
      if (me.payload.opType == UPDATE_DASHBOARD) {
        me.messageService.add({ severity: 'success', summary: 'Update Message', detail: me.dashboardName + " dashboard is updated successfully." });
        me.dashboardEventBind.emit(me.data);
        setTimeout(() => {
          me.visible = false;
        });
      }
      else if (me.data.code == NO_WRITE_ACCESS_FOR_DASHBOARD) {
        //confirmation dialog box
        me.infoMsg(NO_WRITE_ACCESS_FOR_DASHBOARD_MESSAGE);
      }
      else if (me.data.code == DASHBOARD_SUCCESSFULY_SAVED) {
        me.messageService.add({ severity: 'success', summary: 'Success Message', detail: me.dashboardName + " dashboard is saved successfully." });

        if (this.operationType == "editOperation" || this.operationType == "copyOperation") {
          me.dashboardEventBind.emit(me.data);
        }
      }
      else if (me.data.code == EXCEPTION_IN_DASHBOARD_SAVING) {
        //confirmation dialog box
        me.infoMsg(EXCEPTION_IN_DASHBOARD_SAVING_MESSAGE);
      }

      setTimeout(() => {
        me.visible = false;
        me.cd.detectChanges();
      });
    }



  }
  eventBind(path: String) {
    this.defaultDashboardPath = "/dashboards" + path;
  }

  infoMsg(message: string) {
    const me = this;
    me.rejectVisible = false;
    me.acceptLable = "Ok";
    this.confirmationService.confirm({
      message: message,
      header: 'Info',
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      accept: () => {
        //  me.load(me.dataTable);
      }

    });
  }

  switchToEdit(){
    const me = this;
     if (!this.dashboardName) {
      this.nameError = true;
      return;
    }
    else if (this.dashboardName.startsWith('_') || /^[0-9]/.test(this.dashboardName)) {
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Dashboard name should start with alphabet." });
      return;
    } else if (/[-!$%^&*()+|~=`{}:/<>?,.@# ]/g.test(this.dashboardName) || this.dashboardName.includes('[') || this.dashboardName.includes(']')) {
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Special characters are not allowed. Only AlphaNumeric and Underscore(_) are allowed." });
      return;
    }
    const favNameCtx : DashboardFavNameCTX = {
      name : me.dashboardName,
      path : me.defaultDashboardPath
    }
    const favCtx : DashboardFavCTX = {
      favNameCtx : favNameCtx,
      favDetailCtx:{}
    }
    const payload: DashboardReq = {
      opType: SAVE_DASHBOARD,
      cctx: null,
      tr: null,
      compareCtx: null,
      multiDc: false,
      favCtx: favCtx

    };

    me.dashboardsService.chkAvailableDashboard(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardStateLoadingStatus) {
          me.onCheckingAvailability(state);
          return;
        }

        if (state instanceof DashboardStateLoadedStatus) {
          me.onCheckedDashboard(state);
          return;
        }
      },
      (state: DashboardStateLoadingErrorStatus) => {
        me.onCheckingAvailabilityError(state);
      }
    );
  }

  private onCheckingAvailability(state : DashboardStateLoadingStatus){
    const me = this;
    me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }
  private onCheckedDashboard(state : DashboardStateLoadedStatus){
    const me = this;
    me.data = state.data;
    me.empty = false;
    me.error = false;
    me.loading = false;
    if(state.data.code !== DUPLICATE_DASHBOARD_NAME){
      let favObj : any = {
        dashboardName : me.dashboardName,
        dashboardPath : me.defaultDashboardPath,
        dashboarddesc : me.dashboardDescription,
        dashboardPermissionMode : me.selectedReadOperation =='read' ? READ_MODE  : me.selectedReadOperation == 'readWrite' ? READ_WRITE_MODE: NO_ACCESS

      }
    me.dashboard.editMode(true, favObj);
    setTimeout(() => {
      me.visible = false;
    });
  }
  else{
      this.existError = true;
      me.cd.detectChanges();
      return;
  }
  }
  private onCheckingAvailabilityError(state:DashboardStateLoadingErrorStatus){
    const me = this;
    me.data = null;
    me.error = true;
    me.empty = false;
    me.loading = true;
    me.cd.detectChanges();
  }
}
