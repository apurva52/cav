import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { MY_DASHBOARDS_TABLE } from './service/dashboards.structure';
import { MyDashboardsTable, DashboardHeaderCols, Status, DELETE_DASHBOARD, DELETE_DASHBOARD_DIRECTORY, DashboardReq, READ_MODE, USER_DEFAULT, DASHBOARD_USER_PROJECT_SAVED, DELETE_MULTIPLE_DASHBOARD, PROJECT_DEFAULT, DASHBOARD_USER_SAVING_MESSAGE, DASHBOARD_PROJECT_SAVING_MESSAGE, DASHBOARD_CURRENT_LOAD_INFO_MESSAGE, DASHBOARD_USER_INFO_MESSAGE, DASHBOARD_PROJECT_INFO_MESSAGE, DELETE_DASHBOARD_DIRECTORY_MESSAGE, DELETE_DASHBOARD_MESSAGE, DELETE_MULTIPLE_DASHBOARD_MESSAGE } from './service/dashboards.model';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng';
import { DashboardsService } from './service/dashboards.service';
import { Store } from 'src/app/core/store/store';
import { DashboardDataLoadedState, DashboardDataLoadingErrorState, DashboardDataLoadingState, DashboardStateLoadedStatus, DashboardStateLoadingErrorStatus, DashboardStateLoadingStatus } from './service/dashboards.state';
import { SessionService } from 'src/app/core/session/session.service';
import { AddDashboardComponent } from './dialogs/add-dashboard/add-dashboard.component';
import { DashboardFavCTX, DashboardFavNameCTX } from 'src/app/shared/dashboard/service/dashboard.model';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { DashboardLoadedState, DashboardLoadingErrorState, DashboardLoadingState } from 'src/app/shared/dashboard/service/dashboard.state';
import { Router } from '@angular/router';
import { CONTENT } from './service/dashboards.dummy';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class DashboardsComponent implements OnInit {

  dataTable: MyDashboardsTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  cols: DashboardHeaderCols[] = [];
  _selectedColumns: DashboardHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  selectedNodes: TreeNode[] = [];
  userName: string;
  frequency: number = -1;
  data: DashboardFavCTX;
  deleteData: Status;
  disableOptions : boolean = false;
  favCtx : any;
  selectMultipleDelete : boolean = false;
  acceptLable = "Yes";
  rejectVisible = true;
  updateInfo : Status;
  selectedNode: boolean = false;
  content: InfoData;
  selectedUserOption : string;
  isDownload: boolean = false;
  @ViewChild(AddDashboardComponent, { read: AddDashboardComponent })
  private addDashboard: AddDashboardComponent;
  @ViewChild('dashboard') treeTable : any;
  dd2 : string='';
  multipleDeletemessagefile: boolean= false;
  multipleDeletemessagefolder: boolean= false;
  multiDeleteMessage: string;
  constructor(private dashboardsService: DashboardsService, private sessionService: SessionService, private _dashboardService: DashboardService,
    private cd: ChangeDetectorRef, private confirmationService: ConfirmationService, private messageService: MessageService,private router: Router) {
      //this.favCtx = this.router.getCurrentNavigation().extras.state.favCtx;
    }

  ngOnInit(): void {
    const me = this;
    me.dataTable = MY_DASHBOARDS_TABLE;
    me.content = CONTENT;
    // this.totalRecords = me.data.data.length;
    // me.cols = me.data.headers[0].cols;
    // for (const c of me.data.headers[0].cols) {
    //   me.globalFilterFields.push(c.valueField);
    //   if (c.selected) {
    //     me._selectedColumns.push(c);
    //   }
    // }
    const session = me.sessionService.session;
    if (session)
      this.userName = session.cctx.u;
      const feature = session.permissions[1];
this.disableOptions = !this._dashboardService.getUserPermissions();
    this.load(me.dataTable);
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]
  }

  @Input() get selectedColumns(): DashboardHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: DashboardHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
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

  load(dataTable: MyDashboardsTable) {
    const me = this;
    me.dashboardsService.load(dataTable).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DashboardDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DashboardDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: DashboardDataLoadingState) {
    const me = this;
    // me.dataTable.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;
  }

  private onLoadingError(state: DashboardDataLoadingErrorState) {
    const me = this;
    //me.dataTable.data = null;
    me.error = state.error;
    me.empty = false;
    me.loading = false;
  }

  private onLoaded(state: DashboardDataLoadedState) {
    const me = this;
    me.dataTable = state.data;
    console.log("----what is data table", me.dataTable.data.data);
    me.totalRecords = me.dataTable.data.length;
    if (me.dataTable) {
      me.empty = !me.dataTable.data.length;
    }
    me.selectedUserOption = me.dataTable.options[0].label;
    me.dataTable.headers[0].cols.forEach(c => me.globalFilterFields.push(c['valueField']));
    me.error = state.error;
    me.loading = false;

  }

  delete(data: DashboardReq, op_type: number) {
    const me = this;
    me.dashboardsService.deleteData(data).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardStateLoadingStatus) {
          me.onDeleteLoadingState(state);
          return;
        }

        if (state instanceof DashboardStateLoadedStatus) {
          me.onDeleteLoadedState(state, op_type);
          return;
        }
      },
      (state: DashboardStateLoadingErrorStatus) => {
        me.onDeleteLoadingErrorState(state);
      }
    );
  }

  private onDeleteLoadingState(state: DashboardStateLoadingStatus) {
    const me = this;
    me.deleteData = null;
    me.error = null;
    me.empty = false;
    me.loading = true;

    //  me.cd.detectChanges();
  }

  private onDeleteLoadingErrorState(state: DashboardStateLoadingErrorStatus) {
    const me = this;
    me.deleteData = null;
    me.error = state.error;
    me.empty = false;
    me.loading = true;


    // me.cd.detectChanges();
  }

  private onDeleteLoadedState(state: DashboardStateLoadedStatus, op_type: number) {
    const me = this;
    me.deleteData = state.data;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
    if (op_type == DELETE_DASHBOARD_DIRECTORY) {
      me.messageService.add({ severity: 'success', summary: 'Success Message', detail: "Dashboard directory is successfully deleted." });
      me.load(me.dataTable);
    }
    else if(op_type == DELETE_MULTIPLE_DASHBOARD){
      me.messageService.add({ severity: 'success', summary: 'Success Message', detail: "Dashboard directory is successfully deleted." });
      me.selectedNodes.length = 0;
      me.selectMultipleDelete = false;
      me.load(me.dataTable);
    }
    else {
      me.messageService.add({ severity: 'success', summary: 'Success Message', detail: "Dashboard is successfully deleted." });
      me.load(me.dataTable);
    }

  }
  nodeSelect(node , event) {
    console.log(node);
    if(node.node.data.isSelected){
    let isDefault : string = this.checkDefalultDashboard(node.node);
    if(isDefault !== null && isDefault !== "file"){
      if (this.isRowSelected(node.node)) {
        this.selectedNodes.splice(this.selectedNodes.indexOf(node.node), 1);
        if(node.node.data.type === "Folder" || node.node.children.length !==0){
          this.childSelection(node.node.children,false);
          node.node.data.isSelected = false;
         }
         else{
           node.node.data.isSelected = false;
         }

      }
      event.target.checked = false;
      let message : string = isDefault == 'currentSession' ? DASHBOARD_CURRENT_LOAD_INFO_MESSAGE : isDefault == 'icons8-user' ? DASHBOARD_USER_INFO_MESSAGE : DASHBOARD_PROJECT_INFO_MESSAGE;
      this.rejectVisible = false;
      this.acceptLable = "Ok";
      node.node['data']['isSelected'] = false;
      this.confirmationService.confirm({
        message: message,
        header: 'Info',
        icon: 'pi pi-exclamation-triangle',
        rejectVisible: false,
        accept: () => {

        },
        reject: () => {

        }

      });

      return;
    }
    if(node.node.data.type === "Folder" || node.node.children.length !==0){
     this.childSelection(node.node.children,true);
     node.node.data.isSelected = true;
    }
    else{
      node.node.data.isSelected = true;
    }
    this.selectedNodes.push(node.node);
  }
  else{
    if (this.isRowSelected(node.node)) {
      this.selectedNodes.splice(this.selectedNodes.indexOf(node.node), 1);
      if(node.node.data.type === "Folder" || node.node.children.length !==0){
        this.childSelection(node.node.children,false);
        node.node.data.isSelected = false;
       }
       else{
         node.node.data.isSelected = false;
       }

    }
  }
  }
  childSelection(children,isSelect){
    for(var i =0; i < children.length;i++){
    if(children[i].data.type === "Folder" || children[i].children.length !==0){
      this.childSelection(children[i].children,isSelect);
      children[i].data.isSelected = isSelect;
     }
     else{
      children[i].data.isSelected = isSelect;
     }
    }
  }


  nodeUnselect(event) {
    if (this.isRowSelected(event.node)) {
      this.selectedNodes.splice(this.selectedNodes.indexOf(event.node), 1);
    }
  }
  toggleRowSelection(event , rowNode){
    // this.selectedNode = false;

      if(rowNode.node['data']['type'] == "Folder"){
        let isDefault : string = this.checkDefalultDashboard(rowNode.node);
        if(isDefault !== null && isDefault !== "file"){
          event.currentTarget.getElementsByClassName("pi-check")[0].classList.remove("pi-check");
          if (this.isRowSelected(rowNode.node)) {
            this.selectedNodes.splice(this.selectedNodes.indexOf(rowNode.node), 1);
          }
          let message : string = isDefault == 'currentSession' ? DASHBOARD_CURRENT_LOAD_INFO_MESSAGE : isDefault == 'icons8-user' ? DASHBOARD_USER_INFO_MESSAGE : DASHBOARD_PROJECT_INFO_MESSAGE;
          this.rejectVisible = false;
          this.acceptLable = "Ok";
          this.confirmationService.confirm({
            message: message,
            header: 'Info',
            icon: 'pi pi-exclamation-triangle',
            rejectVisible: false,
            accept: () => {
            //  event.currentTarget.getElementsByClassName("pi-check")[0].classList.remove("pi-check");
            },
            reject: () => {
             // event.currentTarget.getElementsByClassName("pi-check")[0].classList.remove("pi-check");
            }

          });
          return;
        }


  //this.cd.detectChanges();
    }

  //   this.selectedNodes = [...this.selectedNodes];
  }

  isRowSelected(rowNode: any): boolean {
    if(this.selectedNodes.length > 0)
    return this.selectedNodes.indexOf(rowNode) >= 0;
  }

  loadDashboard(rowNode, operationType) {

    var path = '/dashboards';

    if (!rowNode.node.data.path) {
      var Oldpath = JSON.parse(rowNode.node.data.key);
      if (Oldpath.hasOwnProperty('path')) {
        path = Oldpath.path;
      }
    }
    else {
      path = rowNode.node.data.path;
    }

    // if(operationType == "editOperation" && path.indexOf("/dashboards") == 0){
    //   return;
    // }
    const payload: DashboardFavCTX = {
      favNameCtx: {
        name: rowNode.node.data.label,
        path: path,
      },
      favDetailCtx: {},
    };
    this.loadOldDashboard(payload, operationType, rowNode, path);
    //this.addDashboard.showDialog(null, 'editOperation');
  }

  loadOldDashboard(payload: DashboardFavCTX, operationType: string, rowNode, path: string) {
    const me = this;

    me._dashboardService.load(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLoadingState) {
          me.onLoadingOldDashboard(state);
          return;
        }

        if (state instanceof DashboardLoadedState) {
          me.onLoadedOldDashboard(state, operationType, rowNode, path);
          return;
        }
      },
      (state: DashboardLoadingErrorState) => {
        me.onLoadingErrorOldDashboard(state);
      }
    );
  }

  private onLoadingOldDashboard(state: DashboardLoadingState) {
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = true;
    me.cd.detectChanges();
  }

  private onLoadingErrorOldDashboard(state: DashboardLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.cd.detectChanges();
  }

  private onLoadedOldDashboard(state: DashboardLoadedState, operationType: string, rowNode, path: string) {
    const me = this;
    me.data = state.data;
    me.error = state.error;
    me.loading = false;
    me.data.favNameCtx.path = path;
    //if(operationType == 'editOperation' || operationType == 'copyOperation'){
    if (me.data.favDetailCtx.isPublic) {
      me.addDashboard.showDialog(null, operationType);
    }
    else if (!me.data.favDetailCtx.isPublic && me.data.favDetailCtx.updatedBy == this.userName) {
      me.addDashboard.showDialog(null, operationType);
    }
    else {
      this.infoMsg();
    }
    //}
    // else if (operationType == 'deleteOperation'){
    //   me.confirmDialog(rowNode , me.data,null);
    // }
    me.cd.detectChanges();
  }

  dashboardEventBind(staus: Status) {
    const me = this;
    me.load(me.dataTable);
  }

  confirmDialog(payload: DashboardReq, op_type : number , message:string) {
    const me = this;
    me.acceptLable = 'Yes';
    me.rejectVisible = true;
    this.confirmationService.confirm({
      message: message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        me.delete(payload, op_type);
        //  this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
  }

  deleteDashboard(rowNode) {
    const me = this;
    // let permission: boolean = true;
    // if (rowNode.node.data.permission == false && rowNode.node.data.owner !== this.userName && rowNode.node.data.type == "Folder") {
    //   permission = false;

    // }
    var op_type = rowNode.node.data.type == "Folder" ? DELETE_DASHBOARD_DIRECTORY : DELETE_DASHBOARD;
    var message =  rowNode.node.data.type == "Folder" ? DELETE_DASHBOARD_DIRECTORY_MESSAGE : DELETE_DASHBOARD_MESSAGE;
    if(op_type == DELETE_DASHBOARD_DIRECTORY){
      let isDefault : string = this.checkDefalultDashboard(rowNode.node);
      if(isDefault !== null && isDefault !== "file"){
        let message : string = isDefault == 'currentSession' ? DASHBOARD_CURRENT_LOAD_INFO_MESSAGE : isDefault == 'icons8-user' ? DASHBOARD_USER_INFO_MESSAGE : DASHBOARD_PROJECT_INFO_MESSAGE;
        me.rejectVisible = false;
        me.acceptLable = "Ok";
        this.confirmationService.confirm({
          message: message,
          header: 'Info',
          icon: 'pi pi-exclamation-triangle',
          rejectVisible: false,
          accept: () => {
          },
          reject: () => {}

        });
        return;
      }
    }

    const favCtx: DashboardFavCTX = {
      favNameCtx: {
        name: rowNode.node.data.label,
        path: rowNode.node.data.path,
      },
      favDetailCtx: {},
    };
    const payload: DashboardReq = {
      opType: op_type,
      cctx: null,
      tr: null,
      compareCtx: null,
      multiDc: false,
      favCtx: favCtx

    };
    this.confirmDialog(payload, op_type , message);

  }

  infoMsg() {
    const me = this;
    me.rejectVisible = false;
    me.acceptLable = "Ok";
    this.confirmationService.confirm({
      message: 'No rights to edit/copy/delete this dashboard.',
      header: 'Info',
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      accept: () => {
      },
      reject: () => {}

    });
  }

  setUserProjectDashboard(rowNode , operation){
    const me = this;
    if(rowNode.node.data['path']){
    const favNameCtx : DashboardFavNameCTX = {
      name : rowNode.node.data.label,
      path : rowNode.node.data.path
    }
    const favCtx : DashboardFavCTX = {
      favNameCtx : favNameCtx,
      favDetailCtx: {}
    }
    var op_type = USER_DEFAULT;
    if(operation == 'project'){
      op_type = PROJECT_DEFAULT;
    }

    const payload: DashboardReq = {
      opType : op_type,
      cctx : null,
      tr:null,
      compareCtx: null,
      multiDc:false,
      favCtx : favCtx

    };
    me.rejectVisible = true;
    me.acceptLable = "Yes";
    let message : string = op_type == USER_DEFAULT ? DASHBOARD_USER_SAVING_MESSAGE : DASHBOARD_PROJECT_SAVING_MESSAGE
    me.confirmationService.confirm({
      message: message,
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        me.setUserProjectDefault(payload,rowNode.node.data.label,operation);
      },
      reject: () => {},
    });

  }
}

setUserProjectDefault(payload: DashboardReq,dashboardName : string , operation : string){
  const me = this;

  me.dashboardsService.setUserProjectDefault(payload).subscribe(
    (state: Store.State) => {
      if (state instanceof DashboardStateLoadingStatus) {
        me.onLoadingUserProjectDashboard(state);
        return;
      }

      if (state instanceof DashboardStateLoadedStatus) {
        me.onLoadedUserProjectDashboard(state,dashboardName,operation);
        return;
      }
    },
    (state: DashboardStateLoadingErrorStatus) => {
      me.onLoadingErrorUserProjectDashboard(state);
    }
  );
}

private onLoadingUserProjectDashboard(state: DashboardStateLoadingStatus) {
  const me = this;
  me.updateInfo = null;
  me.error = null;
  me.loading = true;
  me.cd.detectChanges();
}

private onLoadingErrorUserProjectDashboard(state: DashboardStateLoadingErrorStatus) {
  const me = this;
  me.updateInfo = null;
  me.error = state.error;
  me.loading = false;
  me.cd.detectChanges();
}

private onLoadedUserProjectDashboard(state: DashboardStateLoadedStatus, dashboardName : string , operation : string) {
  const me = this;
  me.updateInfo = state.data;
  me.error = state.error;
  me.loading = false;
  if(state.data.code == DASHBOARD_USER_PROJECT_SAVED){
    me.messageService.add({severity:'success', summary: 'Success Message', detail:dashboardName +" dashboard is saved successfully as "+operation+" default."});
    me.load(me.dataTable);
  me.cd.detectChanges();
  }
  else{
    me.rejectVisible = false;
    me.acceptLable = "Ok";
    me.confirmationService.confirm({
      message: 'User has no write permission to make this dashboard as user/project default.',
      header: 'Info',
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      accept: () => {
      },
      reject: () => {}

    });
  }

}

deleteMultipleDashboard(){
  //console.log(this.selectedNodes);
  let newPath = null;
  this.multipleDeletemessagefolder=false;
  this.multipleDeletemessagefile=false;
  for(let path of this.selectedNodes){
    if(path.data.type == "File"){
        this.multipleDeletemessagefile=true;
      }
      if(path.data.type == "Folder"){
        this.multipleDeletemessagefolder=true;
      }
    if(newPath == null){
      newPath = path.data.type == "File" ? path.data.path+"/"+path.data.label+"$" : path.data.path;
    }
    else{
      newPath = newPath.concat(path.data.type == "File" ? ","+path.data.path+"/"+path.data.label+"$" : ","+path.data.path);
    }
  }
    if(this.multipleDeletemessagefile && !this.multipleDeletemessagefolder){
      this.multiDeleteMessage="Are you sure to delete selected dashboards ?";
    }else{
      this.multiDeleteMessage=DELETE_MULTIPLE_DASHBOARD_MESSAGE;
    }

  const favCtx: DashboardFavCTX = {
    favNameCtx: {
      name: null,
      path: newPath,
    },
    favDetailCtx: {},
  };

  const payload: DashboardReq = {
    opType: DELETE_MULTIPLE_DASHBOARD,
    cctx: null,
    tr: null,
    compareCtx: null,
    multiDc: false,
    favCtx: favCtx

  };
  this.confirmDialog(payload, DELETE_MULTIPLE_DASHBOARD , this.multiDeleteMessage);
  console.log(newPath);
}

deleteSelection(){
  this.selectMultipleDelete =  this.selectMultipleDelete == false ? true: false;
  this.cd.detectChanges();
   }

   checkDefalultDashboard(node) {
    try {
      let defaultDashboard : string = "file";
       if (node['children'] !== undefined && node['data']['type'] != 'File') {
        for (let i = 0; i < node['children'].length; i++){
          if( node['children'][i]['data']['icon'] == "icons8-user" ||  node['children'][i]['data']['icon'] == "icons8-project"){
          defaultDashboard =  node['children'][i]['data']['icon'] ;
          break;
          }
          else if( node['children'][i]['data']['label'] == sessionStorage.getItem('loadedDashboardName') &&  node['children'][i]['data']['path'] == sessionStorage.getItem('loadedDashboardPath'))
          {
            defaultDashboard = "currentSession";
            break;
          }
          defaultDashboard = 'file';
          this.checkDefalultDashboard(node['children'][i]);
        }
        return defaultDashboard;
      }
      else{
        if(node['data']['type'] != 'File' && (node['data']['icon'] == "icons8-user" || node['data']['icon'] == "icons8-project")){
          defaultDashboard =node['data']['icon'] ;
        }
        else{
        defaultDashboard = "file";
        }
        return defaultDashboard;
      }
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }
  onChange(event) {
    console.log('event :' + event);
    console.log(event.value);
//     var filterFolderData = this.dataTable.data.filter(obj=> {return obj.data.owner == event.value});
// console.log("filter folde r data========================"+filterFolderData);
  }

  confirm1(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
          //Actual logic to perform a confirmation
      }
  });
  }

  fileToDownload(rowNode){
    let path = ""
    let favName = rowNode.node.data.label + ".json";
    if(rowNode.node.data.data.path.startsWith("/dashboards"))
      path =  "webapps/sys/webdashboard" + rowNode.node.data.data.path + "/" + favName;
    else
      path = "webapps/sys/webdashboard/favorites/" + rowNode.node.data.data.path + ".json";

                this.dashboardsService.download(path).subscribe(res => {
                  let url = window.location.protocol + "//"+ window.location.hostname +":"+window.location.port;
                if(res['data']['status']['code'] == 0){
                  // this.showSuccess("File downloaded successfully");
                  this.downloadBrowseFile(favName, url);
                  this.messageService.add({
                    severity: 'success',
                    summary: "Success Messasge",
                    detail: "Dashboard downloaded successfully"
                  });
                 }
                  else{

                    return;
                  }
                })
               // this.close();
  }

  downloadBrowseFile(file, url) {
    let splitPath = file.split('/');
    let fName = splitPath[splitPath.length - 1];
    let path = url + '/netstorm/temp/' + fName;
    if(this.sessionService.preSession.DWNMULFILE) {
      window.open(path);
    }else {
      this.downloadURI(path, fName);
    }
  }

  downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;

    // Because firefox not executing the .click()
    // Hence, We need to create mouse event initialization.
    var clickEvent = document.createEvent('MouseEvent');
    clickEvent.initEvent('click', true, true);

    link.dispatchEvent(clickEvent);
  }

  clearFilters(){
    this.selectedUserOption = this.dataTable.options[0].label;
    this.dd2='';
  }

  searchGlobally(searchText){

    setTimeout(() => {
      this.treeTable.filterGlobal(searchText,'contains');
      // this.expandNodes(this.treeTable.filteredNodes);
      // setTimeout(() => {
      if(this.treeTable.filteredNodes){
       // this.treeTable._value[0].expanded = true;
       let action = true;
       if(!searchText){
        action = false;
       }
      for(const childNode of this.treeTable._value){
        this.expandNodes(childNode , action);
      }
      console.log(this.treeTable.filteredNodes);

        this.cd.detectChanges();
    }
  }, 0);
  // });

  }
  expandNodes(node , action){
    if(!node.children){
      return;
    }
    node.expanded = action;
        for(const childNode of node.children){
      this.expandNodes(childNode,action);
    }
  }
}



