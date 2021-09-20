import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardComponent } from '../../dashboard.component';
import { TreeNode, MenuItem } from 'primeng/api';
import { DashboardFavListService } from './service/dashboard-fav-list.service';
import { Store } from 'src/app/core/store/store';
import {
  DashboardFavListLoadingState,
  DashboardFavListLoadedState,
  DashboardFavListLoadingErrorState,
} from './service/dashboard-fav-list-state';
import { Tree } from 'primeng';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FilterParameterBoxComponent } from 'src/app/shared/filter-parameter-box/filter-parameter-box.component';
import { CopyFavoriteLinkBoxComponent } from 'src/app/shared/copy-favorite-link-box/copy-favorite-link-box.component';
import { SessionService } from 'src/app/core/session/session.service';
import { READ_MODE, READ_WRITE_MODE } from 'src/app/pages/my-library/dashboards/service/dashboards.model';
import { DashboardFavNameCTX } from '../../service/dashboard.model';
import { DashboardService } from '../../service/dashboard.service';
import {TreeOperationsService} from '../../sidebars/show-graph-in-tree/service/tree-operations.service';

@Component({
  selector: 'app-dashboard-fav-list',
  templateUrl: './dashboard-fav-list.component.html',
  styleUrls: ['./dashboard-fav-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardFavListComponent
  extends PageSidebarComponent
  implements OnInit, AfterViewInit {
  classes = 'page-sidebar dashboard-fav-manager';
  @Input() dashboard: DashboardComponent;

  data: TreeNode[];
  error: boolean;
  loading: boolean;
  empty: boolean;
  noFilteredData = false;
  inputValue: any;
  favMenuOptions: MenuItem[];
  disableOptions : boolean = false;
  showEditField: boolean = false;
   items: MenuItem[];
   isEdit : boolean = false;
  @ViewChild('treeNode') treeNode: Tree;

  constructor(
    private dashboardFavListService: DashboardFavListService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private dashboardService: DashboardService,
    private treeOperationsService :TreeOperationsService,
    private dashboarService : DashboardService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const me = this;
    me.dashboarService.isAllowFavListForcefullyUpdate().subscribe(update =>{
      if(update){
        me.load(true);
      }
    })
  me.disableOptions = !me.dashboardService.getUserPermissions();
    me.favMenuOptions = [
      {
        label: 'Filter',
        command: (event: any) => {
          me.dashboard.openFilterByParam();
          me.closeClick();
        },
      },
      {
        label: 'Parameters',
        command: (event: any) => {
          me.dashboard.openFilterByParam();
          me.closeClick();
        },
      },
      {
        label: 'Copy Link',
        command: (event: any) => {
          me.dashboard.openCopyLink();
          me.closeClick();
        },
      },
    ];
  }

  ngAfterViewInit() {
    const me = this;
  }

  show() {
    const me = this;
    super.show();
    me.load();
  }

  closeClick() {
    const me = this;
    this.visible = !this.visible;
  }

  plusClick() {
    this.showEditField = true;
  }

  // showcopyFavoriteLinkBox(){
  //   this.copyFavoriteLinkBox = true;
  // }

  // showFlowpathInstance(){
  //   this.displayFlowpathInstance = true;
  // }

  load(force?: boolean) {
    const me = this;

    me.dashboardFavListService.load(force).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardFavListLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DashboardFavListLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DashboardFavListLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: DashboardFavListLoadingState) {
    const me = this;
    me.data = null;
    me.error = null;
    me.empty = false;
    me.loading = true;

    me.cd.detectChanges();
  }

  private onLoadingError(state: DashboardFavListLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = true;
    me.empty = false;
    me.loading = true;

    me.cd.detectChanges();
  }

  private onLoaded(state: DashboardFavListLoadedState) {
    const me = this;
    me.data = state.data;
    if (me.data) {
      me.empty = !me.data.length;
    }
    me.error = false;
    me.loading = false;

    me.cd.detectChanges();
  }

  treeNodeSelected(event: { originalEvent: MouseEvent; node: TreeNode }) {
    const me = this;

    // TODO: PrimeNG tree bug need to check if upgread solves this
    const key = _.get(event, 'node.key', null);
    if(typeof(key) == "string"){
      if (event.node && event.node.label && event.node.data && event.node.data.path ) {
        me.loadDashboard(event.node.label, event.node.data.path);
        me.hide();
      }
    }
    else{
      const data = JSON.parse(key);
      if (event.node && event.node.label && data && data.path && data) {
        me.loadDashboard(event.node.label, data.path);
        me.hide();
      }
    }
 
    // Expand tree node on label name
    if (event.node.children.length !== 0) {
      event.node.expanded = !event.node.expanded;
    }
  }

  loadDashboard(name: string, path: string) {
    const me = this;
    if (me.treeOperationsService.stopCounter)
      clearInterval(me.treeOperationsService.stopCounter);

    me.dashboard.isEditDashboard = me.isEdit;
    me.dashboard.load('DASHBOARD', name, path, true);
    me.isEdit = false;
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  onTreeFilter(event) {
    const me = this;
    if (!event.filteredValue) {
      me.load();
    } else if (event.filteredValue && event.filteredValue.length === 0) {
      me.noFilteredData = true;
    } else {
      me.noFilteredData = false;
      me.data = event.filteredValue;
    }
  }

  clearFilters() {
    const me = this;
    me.treeNode.filteredNodes = null;
    me.inputValue = document.querySelector('.ui-tree-filter');
    me.inputValue.value = '';
    me.load();
  }

  redirect() {
    const me = this;
    me.router.navigate(['/my-library/dashboards']);
  //  const favCtx : DashboardFavNameCTX = {
  //    name : me.dashboard.data.favNameCtx.name,
  //    path: me.dashboard.data.favNameCtx.path
  //  }
  //  me.router.navigate(['/my-library/dashboards'], {
  //   state: { favCtx: favCtx }
  // })
  }

  refreshDasboardList(){
    this.load(true);
  }

  openEditCanvas(){
  //  this.dashboard.editMode(false,true,null,null);
  this.isEdit = true;
  }
}
