import { Component, Input, OnChanges, OnInit, SimpleChange, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from '../page-dialog/page-dialog.component';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { Store } from 'src/app/core/store/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveDialogService } from './save-dialog.service';
import { MessageService, ConfirmationService, SelectItem } from 'primeng';
import { SaveSearchLoadedState, SaveSearchLoadingErrorState, SaveSearchLoadingState } from './save-dialog.state';
import { VisualizationService } from 'src/app/pages/create-visualization/service/visualization.service';
import { SessionService } from 'src/app/core/session/session.service';
@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class SaveDialogComponent extends PageDialogComponent 
implements OnInit {

  @Input() metricAgg
  @Input() bucketAgg
  visible : boolean;
  saveTitle: string;
  placeHolderVal: string;

  constructor(private tb: TimebarService,
    private sdService: SaveDialogService,
    private vs:VisualizationService,
    private route:ActivatedRoute,
    public sessionService: SessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
    this.placeHolderVal = 'Saved ' + (location.href.includes('visualization')? 'Visualization':'Search') + ' name'
  }
  
  ngOnChanges(changes: SimpleChange) {
    console.log(changes)
    for (const propName in changes) {

      if (changes.hasOwnProperty(propName)) {
        console.log(changes.hasOwnProperty(propName))
        console.log(propName)
        switch (propName) {
          case "metriAagg": {
            this.metricAgg = changes['metricAgg'].currentValue
            break;

          }
          case "buckeAagg": {
            this.bucketAgg = changes['bucketAgg'].currentValue
            // console.log("dbchange")
            // this.msearchresponsechange=true
            // this.tablevalue=false
            // if(changes["nfdbresponse"].firstChange==false){
            // this.ngOnInit()
            // }
          }
        }
      }
    }
  }
  closeDialog(){
    this.visible = false;
  }

  open(){
    const me = this;
    this.visible= true;
  }
  onLoading(state: SaveSearchLoadingState) {
    const me = this;
    
  }

  onLoadingError(state: SaveSearchLoadingErrorState) {
    const me = this;
  
  }

  onLoaded(state: SaveSearchLoadedState) {
    const me = this;
  }

  saveObject(event) {
    this.closeDialog();
    let saveObjVal = {}
    if (!location.href.includes('visualization')){
    saveObjVal = {
      type: 'logSearch',
      title: this.saveTitle,
      time: { from: this.tb.getValue().time.frameStart.value, to: this.tb.getValue().time.frameEnd.value },
      query: document.getElementById('searchQuery')['value'],
      date: new Date(),
      user:  this.sessionService.session.cctx.u
    }}
    else {
      saveObjVal = {
        type: 'logVisualization',
        title: this.saveTitle,
        time: { from: this.vs.getDuration().gte, to: this.vs.getDuration().lte },
        query: document.getElementById('searchQuery')['value'],
        metricAgg: this.metricAgg,
        bucketAgg: this.bucketAgg,
        chartType: this.route.queryParams['value'].name
      }
    }
    this.sdService.saveDialogData(saveObjVal).subscribe(
      (state: Store.State) => {
        if (state instanceof SaveSearchLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof SaveSearchLoadedState) {
          this.onLoaded(state);
          console.log('=========status code======::', state)
          if(state.data['statusCode'] == 409) {
            console.log('conflict version')
            this.confirmationService.confirm({
              header: 'Confirmation',
              message: 'Are you sure you want to overwrite ' + saveObjVal['title'],
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.sdService.saveExistData(saveObjVal).subscribe(
                  (state: Store.State) => {
                    if (state instanceof SaveSearchLoadingState) {
                      this.onLoading(state);
                      return;
                    }  
                    if (state instanceof SaveSearchLoadedState) {
                      this.onLoaded(state);                
                    this.messageService.add({
                      severity: 'success',
                      summary: (location.href.includes('visualization')? 'Visualization ':'Search ') + 'Saved Successfully.',
                      detail: 'Save ' + (location.href.includes('visualization')? 'Visualization':'Search'),
                    });
                    return;
                  }
                  })
              },
              reject: () => {
                  return;
              }
          });
          }
          else {
            console.log('saved searched')
          this.messageService.add({
            severity: 'success',
            summary: (location.href.includes('visualization')? 'Visualization ':'Search ') + 'Saved Successfully.',
            detail: 'Save ' + (location.href.includes('visualization')? 'Visualization':'Search'),
          });
          return; }
        }
      },
      (state: SaveSearchLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );
    console.log('save object value:::',saveObjVal);
  }
}
