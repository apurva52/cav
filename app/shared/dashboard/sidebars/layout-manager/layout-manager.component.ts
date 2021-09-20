import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { DashboardLayoutManagerService } from './service/layout-manager.service';
import {
  DashboardGalleryLayoutConfig,
  DashboardGridLayoutConfig,
  DashboardLayout,
  DashboardWidgetLayout,
  LayoutCreationForm,
} from '../../service/dashboard.model';
import { Store } from 'src/app/core/store/store';
import {
  DashboardLayoutLoadingState,
  DashboardLayoutLoadedState,
  DashboardLayoutLoadingErrorState,
  DashboardLayoutDummyLoadingState,
  DashboardLayoutDummyLoadedState,
  DashboardLayoutDummyLoadingErrorState,
  DashboardLayoutSavingState,
  DashboardLayoutDeletingState,
  DashboardLayoutDeletedState,
  DashboardLayoutDeletingErrorState,
} from './service/layout-manager.state';
import { DashboardComponent } from '../../dashboard.component';
import { DASHBOARD_LAYOUT, DASHBOARD_LAYOUTS } from './service/layout-manager.dummy';
import { FilterPipe } from 'src/app/shared/pipes/filter/filter.pipe';
import { DashboardLayoutRequest, DELETE_CUSTOM_LAYOUT, GALLERY_LAYOUT_MARGIN, GRID_MAXCOLS, GRID_ROWHEIGHT, LayoutCtx, LayoutNameCtx, LOAD_CUSTOM_LAYOUT, WIDGETS_MARGIN } from './service/layout-manager.model';
import { DashboardLoadedState } from '../../service/dashboard.state';
import { ConfirmationService, MessageService  } from 'primeng';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'app-sidebar-layout-manager',
  templateUrl: './layout-manager.component.html',
  styleUrls: ['./layout-manager.component.scss'],
  providers: [
    { provide: PageSidebarComponent, useExisting: LayoutManagerComponent },
    FilterPipe, ConfirmationService
  ],  
  encapsulation: ViewEncapsulation.None,
})
export class LayoutManagerComponent
  extends PageSidebarComponent
  implements OnInit {
  classes = 'page-sidebar dashboard-layout-manager';
  @Input() dashboard: DashboardComponent;

  data= { DEFAULT : [], CUSTOM:[] };
  error: boolean;
  loading: boolean;

  searchDefaultLayout: string;
  searchCustomLayout: string;
  widgetLayouts : DashboardWidgetLayout[] = [];
  columnError  : boolean = false;
  rowError : boolean = false;
  isNew : boolean = false;
  selectedMode : string = "currentDashboard"
  noPermission : boolean = false;
  layoutNameCtx : LayoutNameCtx;
  selectedIndex : number = -1;
  index : number = 0;
  // Options to New Layout should be static | save bandwidth
  newLayoutForm: LayoutCreationForm = {
    options: {
      rows: [
        { label: 'Select Rows', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
      ],
      columns: [
        { label: 'Select Columns', value: null },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
      ],
    },
    error: null,
    model: {
      rows: null,
      columns: null,
      name: null,
      applyToCurrentDashboard: true,
      applyToExistingDashboard: false
    },
  };
  layoutName: string;

  constructor(
    private dashboardLayoutManagerService: DashboardLayoutManagerService,
    private cd: ChangeDetectorRef,  private dashboardService: DashboardService,
    private messageService: MessageService,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const me = this;
    me.newLayoutForm.model.rows = null;
    me.newLayoutForm.model.columns = null;
    me.newLayoutForm.model.applyToCurrentDashboard = true;
    me.newLayoutForm.model.applyToExistingDashboard = false;
    //me.selectedMode =  me.newLayoutForm.model.applyToCurrentDashboard ?"currentDashboard" : "existingDashboard";
    me.widgetLayouts.length = 0;
  }
  closeClick() {
    const me = this;
    this.visible = !this.visible;
  }
  show() {
    const me = this;
    if (me.dashboard) {
      super.show();
    me.getDefaultListOflayouts();
    me.selectedMode = "currentDashboard";
    me.index = 0;
    me.noPermission = me.dashboardService.getUserPermissions() ? false : true;
    } else {
      console.error('Dashboard not given to LayoutManagerComponent');
    }
  }

  loadDummy() {
    const me = this;

    me.dashboardLayoutManagerService.loadDummy().subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLayoutDummyLoadingState) {
          me.onLoadingDummy(state);
          return;
        }

        if (state instanceof DashboardLayoutDummyLoadedState) {
          me.onLoadedDummy(state);
          return;
        }
      },
      (state: DashboardLayoutDummyLoadingErrorState) => {
        me.onLoadingErrorDummy(state);
      }
    );
  }
  private onLoadingDummy(state: DashboardLayoutDummyLoadingState) {
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = true;

    me.cd.detectChanges();
  }

  private onLoadingErrorDummy(state: DashboardLayoutDummyLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = true;
    me.loading = true;

    me.cd.detectChanges();
  }

  private onLoadedDummy(state: DashboardLayoutDummyLoadedState) {
    const me = this;

    me.data = {
      CUSTOM: [],
      DEFAULT: [],
    };

    for (const d of state.data) {
      me.data[d.category] = me.data[d.category] || [];
      me.data[d.category].push(d);
    }

    me.error = false;
    me.loading = false;
    me.cd.detectChanges();

  }

  load(layoutNameCtx : LayoutNameCtx) {
    const me = this;

    const layoutCtx : LayoutCtx= {
      layoutNameCtx: layoutNameCtx,
      layoutDetailCtx: {}
    }

    const loadPayload : DashboardLayoutRequest= {
      opType: LOAD_CUSTOM_LAYOUT, 
      multiDc: false,
      cctx: null,
      tr : null,
      layoutCtx: layoutCtx
    };
    me.dashboardLayoutManagerService.load(loadPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardLayoutLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DashboardLayoutLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DashboardLayoutLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: DashboardLayoutLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;

    //me.cd.detectChanges();
  }

  private onLoadingError(state: DashboardLayoutLoadingErrorState) {
    const me = this;
    me.error = true;
    me.loading = true;

   // me.cd.detectChanges();
  }

  private onLoaded(state: any) {
    const me = this;
    me.error = false;
    me.loading = false;
    me.widgetLayouts.length == 0
  if(state.data.layoutCtx.configGrid !== null &&  state.data.layoutCtx.configGrid.widgetLayouts.length !==0){ 
    me.widgetLayouts = state.data.layoutCtx.configGrid.widgetLayouts;
      //check widget length is less then widget layouts then create new widget according to that
      if(me.dashboard.data.favDetailCtx.widgets.length < me.widgetLayouts.length){
        me.createWidgetsAccToExistingLayout()
      }
      else if(me.dashboard.data.favDetailCtx.widgets.length > me.widgetLayouts.length){
        let calc = 0;
        let colCounter =0;
        let length = me.dashboard.data.favDetailCtx.widgets.length -me.widgetLayouts.length;
        for(let i = 0; i<me.widgetLayouts.length;i++){
          if(me.widgetLayouts[i].cols+me.widgetLayouts[i].x <= state['data']['layoutCtx']['configGrid']['cols']){    
            colCounter++;
        }
        else{
          break;
        }
      }
      let maxRow = this.getMaxRows();
        me.appendExistingLayout(colCounter,length, state['data']['layoutCtx']['configGrid']['cols'],maxRow);
      }
      if(!state.data.layoutCtx.configGallery.enable){
     
          state.data.layoutCtx.configGrid.widgetLayouts = me.widgetLayouts;
          this.dashboard.changeLayout(state.data.layoutCtx); 
          super.hide();
         }
        
    }
    else{
      return;
    }


  }
  clearFilters() {
    this.searchDefaultLayout = "";
    this.searchCustomLayout = "";
  }

  createWidgetsAccToExistingLayout(){
    const me = this;
    for(var i = me.dashboard.data.favDetailCtx.widgets.length; i < me.widgetLayouts.length; i++){
      me.dashboard.data.favDetailCtx.widgets.push(me.dashboard.getNewWidget('GRAPH'));
    }
  }

  createNewCustomLayout() {
    const me = this;
    console.log(me.newLayoutForm.model);
    if(this.layoutName != undefined){
    me.messageService.add({ severity: 'success', summary: 'Success Message', detail: this.layoutName + " Layout is applied successfully" });
    }else if(!this.newLayoutForm.model.applyToCurrentDashboard){
      me.messageService.add({ severity: 'error', summary: 'Error Message', detail: "No layout is selected" });
      return;
    }
    if (me.newLayoutForm.model.applyToCurrentDashboard) {
      
    if(me.newLayoutForm.model.rows == null || me.newLayoutForm.model.rows == undefined){
      me.rowError = true;
      return;
    }
    if(me.newLayoutForm.model.columns == null || me.newLayoutForm.model.columns == undefined){
      me.columnError = true;
      return;
    }

    if(me.dashboard.data.favDetailCtx.widgets.length > 0){
      me.widgetLayouts = this.getWidgetLayouts(me.newLayoutForm.model.rows, me.newLayoutForm.model.columns, me.dashboard.data.favDetailCtx.widgets.length);
      if ((me.newLayoutForm.model.rows * me.newLayoutForm.model.columns) > me.widgetLayouts.length) {
        let totalLength = (me.newLayoutForm.model.rows * me.newLayoutForm.model.columns) - me.widgetLayouts.length;
        me.widgetLayouts = me.appendWidgetsToExistingLayout(me.newLayoutForm.model.rows, me.newLayoutForm.model.columns, totalLength);
      }
    }
    else{
      let totalLength = me.newLayoutForm.model.rows * me.newLayoutForm.model.columns;
      me.widgetLayouts = me.appendWidgetsToExistingLayout(me.newLayoutForm.model.rows, me.newLayoutForm.model.columns, totalLength);
    }
      me.layoutNameCtx = null;
   
      const gallery: DashboardGalleryLayoutConfig = {
        enable: false
      }
      const grid: DashboardGridLayoutConfig = {
        cols: GRID_MAXCOLS,
        row: -1,
        rowHeight: GRID_ROWHEIGHT,
        gridType: "VerticalFixed",
        widgetLayouts: me.widgetLayouts,
      }
      const layout: DashboardLayout = {
        category: "custom",
        configGallery: gallery,
        configGrid: grid,
        id: 'layout',
        name: "layout_row",
        type: "GRID",
      }
  
  
      me.dashboard.changeLayout(layout);
      //me.cd.detectChanges();
      super.hide();
   
    }

    else if(me.layoutNameCtx !=null){
      me.load(me.layoutNameCtx);
    }
    


  }

  //decimal calculation
getWidgetLayouts(rowsCalc,colsCalc , length){
  const me = this;
  let viewPortContainerHeight = this.calculateContainerHeight();
  let fixedRowHeight = GRID_ROWHEIGHT; //rowheight of grids
  let margin = WIDGETS_MARGIN; // margin between widgets
  let totalRowHeight = fixedRowHeight+margin;
  let maxCols = GRID_MAXCOLS; // fixed cols in layout
  let totalNoOfRows = Math.floor(viewPortContainerHeight/totalRowHeight);
 // totalNoOfRows = totalNoOfRows - 2;
  let widgetPerRowHeight = Math.floor(totalNoOfRows/rowsCalc);
  let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
  let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc-totalNoOfRows;
  let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
  let calc = rowsCalc;
  let counter = 1;
  let rowCounter = 1;
  let widgetPerColWidth = colsCalc <=0 ? maxCols : Math.floor(maxCols/colsCalc);
  let widgetWidthCalc = widgetPerColWidth * colsCalc;
  let wWidth = maxCols > widgetWidthCalc ? maxCols - widgetWidthCalc : widgetWidthCalc-maxCols;
  let islessWidth = maxCols > widgetWidthCalc ? true : false;
  let colNewCalc = colsCalc - 1;
  let widgetLayouts : DashboardWidgetLayout[] = [];
  widgetLayouts.push({cols:widgetPerColWidth,rows:widgetPerRowHeight,x:0,y:0});
  //convert according to widget length

  for(let i = 0; i<length;i++){

    //ignoring first widget
    if(i==0){
      continue;
    }
   
   else if(i%colsCalc == 0){    
    let rows = widgetPerRowHeight;
    counter++;
    if(counter == rowsCalc){
      rows = islessHeight ? widgetPerRowHeight+wHeight : widgetPerRowHeight-wHeight;
      counter = 0;
    }

      widgetLayouts.push({cols:widgetPerColWidth,rows:rows,x:0,y:widgetLayouts[i-1].rows+widgetLayouts[i-1].y});
      continue;
    }
    //for same row for another cols
    let cols = widgetPerColWidth;
    if(rowCounter == colNewCalc){
      cols = islessWidth ? widgetPerColWidth+wWidth : widgetPerColWidth-wWidth;
      rowCounter = 0;
    }
    rowCounter++;
    widgetLayouts.push({cols:cols,rows:widgetLayouts[i-1].rows,x:widgetLayouts[i-1].cols+widgetLayouts[i-1].x,y:widgetLayouts[i-1].y});
    continue;
  }
  return widgetLayouts;
}

appendWidgetsToExistingLayout(rowsCalc,colsCalc, totalLength){
   const me = this;
  let viewPortContainerHeight = this.calculateContainerHeight();
  let fixedRowHeight = GRID_ROWHEIGHT; //rowheight of grids
  let margin = WIDGETS_MARGIN; // margin between widgets
  let totalRowHeight = fixedRowHeight+margin;
  let maxCols = GRID_MAXCOLS; // fixed cols in layout
  let totalNoOfRows = Math.floor(viewPortContainerHeight/totalRowHeight);
  //totalNoOfRows = totalNoOfRows - 2;
  let widgetPerRowHeight = Math.floor(totalNoOfRows/rowsCalc);
  let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
  let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc-totalNoOfRows;
  let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
  let calc = rowsCalc - 1;
  let counter = 1;

  let widgetPerColWidth = colsCalc <=0 ? maxCols : Math.floor(maxCols/colsCalc);
  let widgetWidthCalc = widgetPerColWidth * colsCalc;
  let wWidth = maxCols > widgetWidthCalc ? maxCols - widgetWidthCalc : widgetWidthCalc-maxCols;
  let islessWidth = maxCols > widgetWidthCalc ? true : false;
  let colNewCalc = colsCalc - 1;
  let exist = widgetPerColWidth+me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x > maxCols ? true : false;
  let x = exist ? 0 :  me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x;
  let y =  exist ?  me.widgetLayouts[me.widgetLayouts.length-1].y + me.widgetLayouts[me.widgetLayouts.length-1].rows : me.widgetLayouts[me.widgetLayouts.length-1].y ;
  let colCounter = exist ? 1 : me.getStartCol(colNewCalc);
  let row = exist ? widgetPerRowHeight : me.widgetLayouts[me.widgetLayouts.length-1].rows;
  me.widgetLayouts.push({cols:widgetPerColWidth,rows:row,x:x,y:y});
  me.dashboard.data.favDetailCtx.widgets.push(me.dashboard.getNewWidget('GRAPH'));
  
  //convert according to widget length
  for(let i = 0; i<totalLength; i++){

    //ignoring first widget
    if(i==0){
      continue;
    }   
    // check for new row
    if(widgetPerColWidth+me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x > maxCols){    
      counter++;
      let rows = widgetPerRowHeight;
      if(counter == rowsCalc){
        rows = islessHeight ? widgetPerRowHeight+wHeight : widgetPerRowHeight-wHeight;
        counter = 0;
      }
      me.widgetLayouts.push({cols:widgetPerColWidth,rows:rows,x:0,y:me.widgetLayouts[me.widgetLayouts.length-1].y + me.widgetLayouts[me.widgetLayouts.length-1].rows});
      me.dashboard.data.favDetailCtx.widgets.push(me.dashboard.getNewWidget('GRAPH'));
      continue;
    }
    //for same row for another cols
    let cols = widgetPerColWidth;
    if(colCounter == colNewCalc){
      cols = islessWidth ? widgetPerColWidth+wWidth : widgetPerColWidth-wWidth;
      colCounter = 0;
    }
    colCounter++;
    me.widgetLayouts.push({cols:cols,rows:me.widgetLayouts[me.widgetLayouts.length-1].rows,x:me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x,y:me.widgetLayouts[me.widgetLayouts.length-1].y});
    me.dashboard.data.favDetailCtx.widgets.push(me.dashboard.getNewWidget('GRAPH'));
    continue;
  }
  return me.widgetLayouts;
}

appendExistingLayout(colCounter,totalLength,maxCols ,maxRows){
  const me = this;
  let exist =me.widgetLayouts[0].cols+ me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x > maxCols ? true : false;
  let x = exist ? 0 :  me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x;
  let y =  exist ?  me.widgetLayouts[me.widgetLayouts.length-1].y + me.widgetLayouts[me.widgetLayouts.length-1].rows : me.widgetLayouts[me.widgetLayouts.length-1].y ;
  y = !exist ? y : maxRows < y ? y : maxRows;
  me.widgetLayouts.push({cols:me.widgetLayouts[0].cols,rows:me.widgetLayouts[0].rows,x:x,y:y});
  
  //convert according to widget length
  for(let i = 0; i<totalLength; i++){

    //ignoring first widget
    if(i==0){
      continue;
    }   
    // check for new row
    if(me.widgetLayouts[i].cols+me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x > maxCols){    
    
      //}
      maxRows = this.getMaxRows();
      y = maxRows < me.widgetLayouts[me.widgetLayouts.length-1].y + me.widgetLayouts[me.widgetLayouts.length-1].rows ? me.widgetLayouts[me.widgetLayouts.length-1].y + me.widgetLayouts[me.widgetLayouts.length-1].rows : maxRows;
      me.widgetLayouts.push({cols:me.widgetLayouts[i].cols,rows:me.widgetLayouts[i].rows,x:0,y:y});
      continue;
    }
    //for same row for another cols
    y = maxRows >= me.widgetLayouts[me.widgetLayouts.length-1].y ? me.widgetLayouts[me.widgetLayouts.length-1].y : maxRows;
    me.widgetLayouts.push({cols:me.widgetLayouts[i].cols,rows:me.widgetLayouts[i].rows,x:me.widgetLayouts[me.widgetLayouts.length-1].cols+me.widgetLayouts[me.widgetLayouts.length-1].x,y:y});
    continue;
  }
  return me.widgetLayouts;
}
createExistingLayout(){
  const me = this;
  let widgetLayouts : DashboardWidgetLayout[] = [];
  me.dashboard.data.favDetailCtx.widgets.forEach((widget: any, index: number) => {
    if (widget) {
      widgetLayouts.push(widget.layout);
    }
  });
return widgetLayouts;
}

get3GridWidgetLayouts(rowsCalc){
  const me = this;
  let viewPortContainerHeight = this.calculateContainerHeight();
  let fixedRowHeight = GRID_ROWHEIGHT; //rowheight of grids
  let margin = WIDGETS_MARGIN; // margin between widgets
  let totalRowHeight = fixedRowHeight+margin;
  let maxCols = GRID_MAXCOLS; // fixed cols in layout
  let totalNoOfRows = Math.floor(viewPortContainerHeight/totalRowHeight);
 // totalNoOfRows = totalNoOfRows - 2;
  let widgetPerRowHeight = Math.floor(totalNoOfRows/rowsCalc);
  let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
  let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc-totalNoOfRows;
  let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
  let rowCounter = 1;
  let last2ColWidth = Math.floor(maxCols/2);
  let widgetPerColWidth = maxCols;
  let widgetLayouts : DashboardWidgetLayout[] = [];
  widgetLayouts.push({cols:widgetPerColWidth,rows:widgetPerRowHeight,x:0,y:0});
  let totalRowsCalc = 3;
  for(let i =0; i<me.dashboard.data.favDetailCtx.widgets.length;i++){
    if(i ==0){
      continue;
    }
    else if(i%totalRowsCalc ==0){
      widgetLayouts.push({cols : widgetPerColWidth, rows:widgetPerRowHeight ,x:0,y:widgetLayouts[i-1].rows + widgetLayouts[i-1].y});
     continue;
     }
     else{
      let x = widgetLayouts[i-1].cols == maxCols ? widgetLayouts[i-1].x : widgetLayouts[i-1].cols+widgetLayouts[i-1].x; 
      let y =  widgetLayouts[i-1].cols == maxCols ? widgetLayouts[i-1].rows+widgetLayouts[i-1].y : widgetLayouts[i-1].y;
      let row = islessHeight ? widgetPerRowHeight+wHeight : widgetPerRowHeight-wHeight;
       widgetLayouts.push({cols:last2ColWidth, rows:row,x:x,y:y});
      continue;
     }
  }
  return widgetLayouts;
}

calculateContainerHeight(){
  if(document.getElementsByClassName('scrollVertical')[0] !== undefined){
    let totalheight  = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
    if(document.getElementsByClassName('open')[0] !== undefined && document.getElementsByClassName('analysis-mode')[0] !== undefined){
      let lowerPanelHeight = (<HTMLElement>document.getElementsByClassName('analysis-mode')[0]).clientHeight;
     // totalheight = totalheight + lowerPanelHeight;
     totalheight = lowerPanelHeight;
    }
    return totalheight -= 1;
  }

let height = Math.round(document.getElementsByClassName('selected-widget-container')[0].clientHeight);
//let smallCarouselHeight = Math.floor(document.getElementsByClassName('ui-carousel-items-container')[0].getBoundingClientRect().height);
let smallCarouselHeight = Math.floor(document.getElementsByClassName("widget-thumbnail")[0].clientHeight);
//let totalheight = height + x +  (2* WIDGETS_MARGIN);
//let totalheight = height +  smallCarouselHeight;
let totalheight = height +  smallCarouselHeight  +GALLERY_LAYOUT_MARGIN; 
//totalheight = totalheight -GALLERY_LAYOUT_MARGIN //-1 is padding space
return totalheight;
}

getCustomListOfLayouts(){
  const me = this;
  me.dashboardLayoutManagerService.listOfLayouts().subscribe(
    (state: Store.State) => {
      if (state instanceof DashboardLayoutLoadingState) {
        me.onLoadingList(state);
        return;
      }

      if (state instanceof DashboardLayoutLoadedState) {
        me.onLoadedList(state);
        return;
      }
    },
    (state: DashboardLayoutLoadingErrorState) => {
      me.onLoadingErrorList(state);
    }
  );
}

private onLoadingList(state: DashboardLayoutLoadingState) {
  const me = this;
  // me.data = null;
  me.error = null;
  me.loading = true;

  me.cd.detectChanges();
}

private onLoadingErrorList(state: DashboardLayoutLoadingErrorState) {
  const me = this;
  // me.data = null;
  me.error = true;
  me.loading = true;

  me.cd.detectChanges();
}

private onLoadedList(state: any) {
  const me = this;

  me.data.CUSTOM =  [];
   // DEFAULT: [],




  // custom layout list
  if(state.data !== null){
  for (const d of state.data) {
     me.data[d.category] = me.data[d.category] || [];
      me.data[d.category].push(d);
  }
}
  me.error = false;
  me.loading = false;

  me.cd.detectChanges();
}

onLayoutChange(){
  const me = this;
  me.selectedIndex = -1;
  this.layoutName = undefined;
}

changeLayout(layout: DashboardLayout, i : number) {
  if(this.dashboard.data.favDetailCtx.widgets.length==0 && layout.name=='Gallery'){
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: " There is no widget availble, So Gallery layout cannot be applied." });
    return;
  }
  // this.dashboard.changeLayout(layout);
  const me = this;
  this.layoutName=layout.name;
  let length = this.dashboard.data.favDetailCtx.widgets.length;
  if(layout.category == "DEFAULT"){
  me.messageService.add({ severity: 'success', summary: 'Success Message', detail: layout.name + " Layout is applied successfully" });
  }
  if(layout.category == "DEFAULT" && layout.type !== "GALLERY"){
   switch(layout.id){
     case "default-grid-4x4" : 
        length = length >= 4 ? this.dashboard.data.favDetailCtx.widgets.length : 4;
      me.widgetLayouts = this.getWidgetLayouts(2,2,length);
         break;
     case "default-grid-horizontal-2" :
        length = length >= 3 ? this.dashboard.data.favDetailCtx.widgets.length : 3;
        me.widgetLayouts = this.getWidgetLayouts(2,1,length);
         break;
     case "default-grid-6" :
        length = length >= 6 ? this.dashboard.data.favDetailCtx.widgets.length : 6;
         me.widgetLayouts = this.getWidgetLayouts(2,3,length);
         break;
     case "default-grid-9" :
       length = length >= 9 ? this.dashboard.data.favDetailCtx.widgets.length : 9;
         me.widgetLayouts = this.getWidgetLayouts(3,3,length);
         break;
     case "default-grid-3":
       me.widgetLayouts = this.get3GridWidgetLayouts(2);
       break;
   default:
     break;
      }
      if(me.widgetLayouts.length > me.dashboard.data.favDetailCtx.widgets.length){
     
      //append
      for(var i = me.dashboard.data.favDetailCtx.widgets.length; i<me.widgetLayouts.length;i++){
        me.dashboard.data.favDetailCtx.widgets.push(me.dashboard.getNewWidget('GRAPH'));
      }
      }
      const gallery: DashboardGalleryLayoutConfig = {
        enable: false
      }
      const grid: DashboardGridLayoutConfig = {
        cols: GRID_MAXCOLS,
        row: -1,
        rowHeight: GRID_ROWHEIGHT,
        gridType: "VerticalFixed",
        widgetLayouts: me.widgetLayouts,
      }
      const layoutData: DashboardLayout = {
        category: "custom",
        configGallery: gallery,
        configGrid: grid,
        id: 'layout',
        name: "layout_row",
        type: "GRID",
      }
  
      this.selectedIndex = 0;
      me.dashboard.changeLayout(layoutData);
      super.hide();
      return;

  
 }
 else if(layout.category == "CUSTOM" && layout.type !== "GALLERY"){
  const layoutNameCtx :LayoutNameCtx={
    name : layout.name.split('.layout')[0],
    path : layout.category == "CUSTOM" ? "custom":"default"
  }
 // me.load(layoutNameCtx);
 me.layoutNameCtx = layoutNameCtx;
 me.newLayoutForm.model.applyToCurrentDashboard = false;
 this.selectedIndex = i;
 me.rowError = false;
 me.columnError = false;
 }
 else{
  // me.dashboard.data.favDetailCtx.layout.configGallery['enable'] = true;
layout.configGallery.enable = true;
  me.dashboard.changeLayout(layout);
  super.hide();
  //return;
 }
}

  getMaxRows() {
    const me = this;
    try {

      let maxRows = 0;

        for (let i = 0; i < me.widgetLayouts.length; i++) {
            let rowWidgets = me.widgetLayouts[i];

            if (maxRows < (rowWidgets.y + rowWidgets.rows)) {
              maxRows = rowWidgets.y + rowWidgets.rows;
            }
          }
      return maxRows;

    } catch (e) {
      console.error(e);
    }

 
}

getStartCol(totalCols){
  const me = this;
  let colCounter = 0;
 for(let i = me.widgetLayouts.length - 1; i> 0;i--)
{
if(me.widgetLayouts[i].x == 0){
  colCounter++
  break;
}
else{
  colCounter ++;
}
}
return colCounter + 1;
}

getDefaultListOflayouts(){
  const me = this;
  me.data.DEFAULT = [];

  for (const d of DASHBOARD_LAYOUTS) {
    me.data[d.category] = me.data[d.category] || [];
    me.data[d.category].push(d);
  }
  me.cd.detectChanges();
}

handleChange(event){
if(event.index == 0){
  this.getDefaultListOflayouts();
}
else{
  this.getCustomListOfLayouts();
}
}

saveChanges(){
  const me = this;
  if(me.selectedMode == "existingDashboard"){
  //   if(me.widgetLayouts.length !==0){
  // me.dashboard.data.favDetailCtx.layout.configGrid.widgetLayouts = me.widgetLayouts ;
  //   }
    me.dashboard.openCustomTemplateLayoutDialog()
  }
  else{
    console.log(me.newLayoutForm.model);

    if(me.newLayoutForm.model.rows == null || me.newLayoutForm.model.rows == undefined){
      me.rowError = true;
      return;
    }
    if(me.newLayoutForm.model.columns == null || me.newLayoutForm.model.columns == undefined){
      me.columnError = true;
      return;
    }
      // let widgetLayout = [];
      let totalLength = me.newLayoutForm.model.rows* me.newLayoutForm.model.columns;
      me.widgetLayouts = this.getWidgetLayouts(me.newLayoutForm.model.rows, me.newLayoutForm.model.columns, totalLength);

    const gallery: DashboardGalleryLayoutConfig = {
      enable: false
    }
    const grid: DashboardGridLayoutConfig = {
      cols: GRID_MAXCOLS,
      row: -1,
      rowHeight: GRID_ROWHEIGHT,
      gridType: "VerticalFixed",
      widgetLayouts: me.widgetLayouts,
    }
    const layout: DashboardLayout = {
      category: "custom",
      configGallery: gallery,
      configGrid: grid,
      id: 'layout',
      name: "layout_row",
      type: "GRID",
    }

    me.dashboard.data.favDetailCtx.layout = layout;
    me.dashboard.openCustomTemplateLayoutDialog()
  }
}
}
