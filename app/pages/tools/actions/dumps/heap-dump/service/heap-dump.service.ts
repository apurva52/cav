import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeapDumpService extends Store.AbstractService {
  heapPath: any;
  ibmAnalyzerUrl: any;
  ibmAnalyzerData: any;
  ibmHeapFileName: any;
  tiername:any;
  servername:any;
  isFromND:boolean;
  processIdWithInstance:any;
  appname:any;
  userName:any;
  downloadFile:any;
  startTime:string;
  endTime: string;
  isCompressed:any;
  loading1:boolean = false;
  blockuiForTakeHeapDump: boolean =false;
  heapFileExtension;
  private heapDataDataBroadcaster = new Subject<any>();

  constructor() {
    super();
  }

    //For heapPath
    public set $heapPath(value: any) {
      this.heapPath = value;
    }
    public get $heapPath() {
      return this.heapPath;
    }

    //For ibmAnalyzerUrl
    public set $ibmAnalyzerUrl(value: any) {
      this.ibmAnalyzerUrl = value;
    }
    public get $ibmAnalyzerUrl() {
      return this.ibmAnalyzerUrl;
    }

    //For ibmAnalyzerUrl
    public set $ibmAnalyzerData(value: any) {
      this.ibmAnalyzerData = value;
    }
    public get $ibmAnalyzerData() {
      return this.ibmAnalyzerData;
    }

    //For ibmAnalyzerUrl
    public set $ibmHeapFileName(value: any) {
      this.ibmHeapFileName = value;
    }
    public get $ibmHeapFileName() {
      return this.ibmHeapFileName;
    }

        //For tiername
    public set $tiername(value: any) {
      this.tiername = value;
    }
    public get $tiername() {
      return this.tiername;
    }

        //For servername
    public set $servername(value: any) {
      this.servername = value;
    }
    public get $servername() {
      return this.servername;
    }
    //For isFromND
    public set $isFromND(value: boolean) {
      this.isFromND = value;
    }
    public get $isFromND() {
      return this.heapPath;
    }

    //For processIdWithInstance
    public set $processIdWithInstance(value: any) {
      this.processIdWithInstance = value;
    }
    public get $processIdWithInstance() {
      return this.processIdWithInstance;
    }

    //For ibmAnalyzerUrl
    public set $appname(value: any) {
      this.appname = value;
    }
    public get $appname() {
      return this.appname;
    }

    //For userName
    public set $userName(value: any) {
      this.userName = value;
    }
    public get $userName() {
      return this.userName;
    }

        //For downloadFile
    public set $downloadFile(value: any) {
      this.downloadFile = value;
    }
    public get $downloadFile() {
      return this.downloadFile;
    }

        //For isCompressed
    public set $isCompressed(value: any) {
      this.isCompressed = value;
    }
    public get $isCompressed() {
      return this.isCompressed;
    }    
            //For heapDumpExtension
    public set $heapFileExtension(value:string) {
      this.heapFileExtension = value;
    }
    public get $heapFileExtension() {
      return this.heapFileExtension;
    }

        //For endTime
    public set $endTime(value: string) {
      this.endTime = value;
    }
    public get $endTime() {
      return this.endTime;
    }

    public set $startTime(value:string) {
      this.startTime = value;
    }
    public get $startTime() {
      return this.startTime;
    }
    getEmmiter(data) {
      this.heapDataDataBroadcaster.next(data);
    }
   public heapDumpDataObservable$: Observable<string> = this.heapDataDataBroadcaster.asObservable();
}
