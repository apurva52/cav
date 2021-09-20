import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { SelectItem } from 'primeng';
import { CategoryLoadedState, deleteCatalogueCreatedState, deleteCatalogueCreatingErrorState, deleteCatalogueCreatingState, getCatalogueCreatedState, getCatalogueCreatingErrorState, getCatalogueCreatingState, matchPatternCreatedState, matchPatternCreatingErrorState, matchPatternCreatingState, patternMatchingGraphCreatedState, patternMatchingGraphCreatingState, patternMatchingGroupCreatedState, patternMatchingGroupCreatingState, saveCatalogueCreatedState, saveCatalogueCreatingErrorState, saveCatalogueCreatingState, updateCatalogueCreatedState, updateCatalogueCreatingErrorState, updateCatalogueCreatingState } from './pattern-matching.state';
import { AppError } from 'src/app/core/error/error.model';
import { getGraphPayload, getGroupListPayload, groupData } from '../../derived-metric/service/derived-metric.model';
import { PatternMatchMetaDataResponseDTO, patternMatchRequest, TargetData } from '../pattern-matching.model';
import { environment } from 'src/environments/environment';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from '../catalogue-management/service/catalogue-management.model';
import { DashboardWidgetComponent } from '../../dashboard/widget/dashboard-widget.component';
import { SessionService } from 'src/app/core/session/session.service';
@Injectable({
  providedIn: 'root'
})
export class PatternMatchingService extends Store.AbstractService {
  constructor(private sessionService: SessionService) {
    super();
 } 
  metaDatapath = environment.api.dashboard.metaData.endpoint;
  targetData:TargetData[];
  duration:any;
  flagPattern:boolean;
  catalogueTableData :CatalogueTableData[];
  selectedCatalogue: string;
  groupData:groupData;
  groupList: any[];
  groupNameObject: any;
  widget:DashboardWidgetComponent;
  derivedFormula:string;
  expressionForAdvancedSelection:string;
  selectedTestIndices:string;
  expressionSpecified:string;
  catalogueList:any[];
  finalArrayOfSelectedIndices:string;
  totalHierarchyList:any[];
  matchPatternFlag :boolean;
  lowerpanelSelectedGraphInfo: any = null;
  zoomApply:boolean;
  globalCatalogue:boolean;
  setGlobalCatalogue(globalCatalogue:boolean){
    this.globalCatalogue = globalCatalogue;
  }
  getGlobalCatalogue(){
    return this.globalCatalogue;
  }
  getZoomApply(){
    return this.zoomApply;
  }
  setZoomApply(zoomApply:boolean){
    this.zoomApply =zoomApply;
  }
  getsetCatalogueList(){
    return this.catalogueList;
  }
  setCatalogueList(catalogueList:any[]){
   this.catalogueList =catalogueList;
  }
  getTargetData(){
    return this.targetData;
  }
  setDuration(duration:any){
    this.duration=duration;
  }
  setTargetData(targetData:TargetData[]){
   this.targetData =targetData;
  }
  getCatalogueTableData(){
    return this.catalogueTableData;
  }
  setCatalogueTableData(catalogueTable:CatalogueTableData[]){
    this.catalogueTableData =catalogueTable;
  }
  getGroupNameObject(){
   return this.groupNameObject;
  }
  setGroupNameObject(groupNameObject){
    this.groupNameObject =groupNameObject;
  }
  getFlagPattern(){
    return this.flagPattern;
  }
  setFlagPattern(flagPattern){
    this.flagPattern =flagPattern;
  }
  getWidget(){
    this.widget;
  }
  setWidget(widget:DashboardWidgetComponent){
    this.widget =widget;
  }

  getDuration(){
    return this.getDuration;
  }
  getSelectedCatalogue(){
    this.selectedCatalogue;
  }
  setSelectedCatalogue(selectedCatalogue){
  this.selectedCatalogue =selectedCatalogue;
  }
  getGroupData(){
    this.groupData;
  }
  setGroupData(groupData:groupData){
   this.groupData =groupData;
  }
  getDerivedFormula(){
    return this.derivedFormula;
  }
  setDerivedFormula(derivedFormula:string){
  this.derivedFormula =derivedFormula;
  }

  setExpressionForAdvancedSelection(expressionForAdvancedSelection:string){
    this.expressionForAdvancedSelection =expressionForAdvancedSelection;
  }
  getExpressionForAdvancedSelection(){
    return this.expressionForAdvancedSelection;
  }
  getSelectedTestIndices(){
   return this.selectedTestIndices;
  }
  setSelectedTestIndices(selectedTestIndices:string){
  this.selectedTestIndices=selectedTestIndices;
  }
  getExpressionSpecified(){
   return this.expressionSpecified;
  }
  setExpressionSpecified(expressionSpecified:string){
    this.expressionSpecified=expressionSpecified;
  }
  getFinalArrayOfSelectedIndices(){
  return this.finalArrayOfSelectedIndices;
  }
  setFinalArrayOfSelectedIndices(finalArrayOfSelectedIndices:string){
  this.finalArrayOfSelectedIndices =finalArrayOfSelectedIndices;
  }
  getTotalHierarchyList(){
    return this.totalHierarchyList;
  }
  setTotalHierarchyList(totalHierarchyList:any[]){
 this.totalHierarchyList =totalHierarchyList;
  }
  getMatchPatternFlag(){
    return this.matchPatternFlag;
  }

  setMatchPatternFlag(matchPatternFlag:boolean){
    this.matchPatternFlag =matchPatternFlag;
  }
  
  getLowerpanelSelectedGraphInfo(){
    return this.lowerpanelSelectedGraphInfo;
  }
  setLowerpanelSelectedGraphInfo(lowerpanelSelectedGraphInfo:any){
    this.lowerpanelSelectedGraphInfo =lowerpanelSelectedGraphInfo;
  }

  loadCategory(): Observable<Store.State> {
    const me = this;
    const output: Subject<Store.State> = new Subject<Store.State>();
   let session =this.sessionService.session
    // output.next(new TireLoadingState());

    // /// DEV CODE ----------------->
    const categoryItem: SelectItem[] = [
      
      { label: 'Select Metric Catalogue', value: 'select_metric_catalogue' },
      { label: 'Select Metric', value: 'select_graphs' },
      // { label: 'All Graphs', value: 'all_graphs' },
    ];
    if(session['defaults']['patternMatchAllGraph'] === '1' && session['cctx']['prodType']==='Netstorm'){
      categoryItem.push(
        { label: 'All Graphs', value: 'all_graphs' }
      );
    }


    // EROR STATE
    // setTimeout(() => {
    //     output.next(new SelectItemLoadingErrorState(new Error('Some random error for development.')));
    // }, 2000);

    // SUCCESS STATE
    setTimeout(() => {
      output.next(new CategoryLoadedState(categoryItem));
    }, 2000);

    /// <----------------- DEV CODE

    // const path = me.controller.replaceVariables(environment.api.dashboard.load.endpoint, { 'id': id });

    // me.controller.get(path).subscribe((data: Dashboard) => {

    //     output.next(new SelectItemLoadedState(data));
    //     output.complete();

    // }, (e: any) => {

    //     output.error(new SelectItemLoadingErrorState(e));
    //     output.complete();

    //     me.logger.error('loading failed', e);
    // });

    return output;
  }
  loadGroupCategory(payload: getGroupListPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new patternMatchingGroupCreatingState());
    }, 0);

    /// DEV CODE ----------------->

    // setTimeout(() => {
    // output.next(new derivedGroupCreatedState(METRIC_INDICES_DATA));
    // output.complete();
    // }, 2000);

    // setTimeout(() => {
    // output.error(new EventLoadingErrorState(new Error()));
    // }, 2000);

    /// <----------------- DEV CODE

    let path = '/web/metrictree/group';
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {
        output.next(new patternMatchingGroupCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    //const path = environment.api.URL.load.endpoint;
    // const payload = {
    // duration
    // };
    // me.controller.post(path, payload).subscribe(
    // (data: EventsTable) => {
    // output.next(new EventLoadedState(data));
    // output.complete();
    // },
    // (e: any) => {
    // output.error(new EventLoadingErrorState(e));
    // output.complete();

    // me.logger.error('Revenue Data loading failed', e);
    // }
    // );

    return output;
  }

  loadGraphData(payload: getGraphPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new patternMatchingGraphCreatingState());
    }, 0);

    let path = '/web/metrictree/graph';
    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

        output.next(new patternMatchingGraphCreatedState(data));
        output.complete();
      },
      (error: AppError) => {
        // output.error(new DashboardWidgetLoadingErrorState(error));
        // output.complete();
      }
    );
    return output;
  }

  getPatternMatchData(payload:patternMatchRequest): Observable<Store.State>{
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new matchPatternCreatingState());
    }, 0);
    me.controller.post(me.metaDatapath,payload).subscribe(
      (data: PatternMatchMetaDataResponseDTO) => {
        output.next(new matchPatternCreatedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new matchPatternCreatingErrorState(e));
        output.complete();

        me.logger.error('Catalogue Data loading failed', e);
      }
    );
    return output;
  }

  saveCatalogue(saveCatalogue:SaveCatalogue) {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new saveCatalogueCreatingState());
    }, 0);
    let path =environment.api.saveCatalogue.load.endpoint;
    me.controller.post(path,saveCatalogue).subscribe(
      (data: SaveCatlogueResponse ) => {
        output.next(new saveCatalogueCreatedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new saveCatalogueCreatingErrorState(e));
        output.complete();

        me.logger.error('save catalogue Data  failed', e);
      }
    );
    return output;
  }


  updateCatalogue(updateCatalogue:SaveCatalogue){
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new updateCatalogueCreatingState());
    }, 0);
    let path =environment.api.saveCatalogue.load.endpoint;
    me.controller.post(path,updateCatalogue).subscribe(
      (data: SaveCatlogueResponse ) => {
        output.next(new updateCatalogueCreatedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new updateCatalogueCreatingErrorState(e));
        output.complete();

        me.logger.error('update catalogue Data  failed', e);
      }
    );
    return output;
  }

  getCatalogue(catalogue:SaveCatalogue){
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new getCatalogueCreatingState());
    }, 0);

    let path =environment.api.saveCatalogue.load.endpoint;
    
    me.controller.post(path,catalogue).subscribe(
      (data: SaveCatlogueResponse ) => {
        output.next(new getCatalogueCreatedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new getCatalogueCreatingErrorState(e));
        output.complete();

        me.logger.error('get Catalogue Data loading failed', e);
      }
    );
    return output;
  }

  deleteCatalogue(deletePayload:SaveCatalogue){
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new deleteCatalogueCreatingState());
    }, 0);

    let path =environment.api.saveCatalogue.load.endpoint;
    
    me.controller.post(path,deletePayload).subscribe(
      (data: SaveCatlogueResponse ) => {
        output.next(new deleteCatalogueCreatedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new deleteCatalogueCreatingErrorState(e));
        output.complete();

        me.logger.error('get Catalogue Data loading failed', e);
      }
    );
    return output;
  }
  

}
