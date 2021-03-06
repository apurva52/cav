import { Component,Input,OnChanges } from '@angular/core';

@Component({
    selector: 'page-dump-lower-frame',
    templateUrl: 'page-dump-lower-frame.component.html',
    styleUrls: ['page-dump-lower-frame.component.scss']
})
export class PageDumpLowerFrameComponent {
    recFrame: any;
    snapshot: any;
    checkFlag: boolean;
    showIframeHider1: boolean = false;
 @Input() recordedFrame:any;
 @Input() recfrm:boolean;
 @Input() snapshotData:any;
 @Input() showIframeHider:boolean;
 constructor(){

 }
 ngOnChanges(){
     this.recFrame = this.recordedFrame;
     this.snapshot = this.snapshotData;
     this.checkFlag = this.recfrm;

     console.log('************** recFrame ',this.recFrame,' , this.snapshot ',this.snapshot,' , this.checkFlag',this.checkFlag);
 }

}
