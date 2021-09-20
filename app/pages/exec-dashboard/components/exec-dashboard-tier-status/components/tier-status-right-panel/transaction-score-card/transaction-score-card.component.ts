import { TierStatusRightPanelService } from './../../../services/tier-status-right-panel.service';
import { ExecDashboardUtil } from './../../../../../utils/exec-dashboard-util';
import { TierStatusDataHandlerService } from './../../../services/tier-status-data-handler.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'app-transaction-score-card',
  templateUrl: './transaction-score-card.component.html',
  styleUrls: ['./transaction-score-card.component.css']
})
export class TransactionScoreCardComponent implements OnInit, OnChanges {
  @Input('transactionScoreCard') scoreCardObj
  className: string = "TransactionScoreCardComponent";
  val = 18609;
  valSlow = 0;
  valVerySlow = 0;
  valErrors = 9310;
  scoreCardArr:any = [];
  totalCount:number = 0;
  scoreCardData:any ={}
  isAvailable:boolean =true;

  constructor(public _dataHandlerService: TierStatusDataHandlerService, public _rightPanelService: TierStatusRightPanelService) { }
  ngOnChanges() {
    this.createTransactionScoreCardData();
    }
  ngOnInit() {
    // this.createTransactionScoreCardData();
  }
  createTransactionScoreCardData(){
    try {
      this.scoreCardData ={};
      this.isAvailable = this._dataHandlerService.isTransactionScoreCardAvlbl;
      this.totalCount = 0;
      if (Object.keys(this.scoreCardObj).length > 0) {
        this.scoreCardData = this.scoreCardObj;
        // this.isAvailable = true;
        // this.scoreCardObj['Errors'] = this.scoreCardData['Errors'];
        // this.scoreCardObj['Normal'] = this.scoreCardData['Normal'];
        // this.scoreCardObj['Slow'] = this.scoreCardData['Slow'];
        // this.scoreCardObj['Stalls'] = this.scoreCardData['Stalls'];
        // this.scoreCardObj['VerySlow'] = this.scoreCardData['VerySlow'];
        for (const key in this.scoreCardData) {
        if (this.scoreCardData.hasOwnProperty(key)) {
          const element = this.scoreCardData[key];
          // this.scoreCardArr.push(element);
          this.totalCount += element['data'];
        }
      }
        // this.totalCount = ExecDashboardUtil.numberToCommaSeperate(this.totalCount);
        // console.log('numberToCommaSeperate', this.totalCount);
      // sum = this.scoreCardArr.reduce((sum, key) => {
        //   return sum += key['avg'];
        // });
        // this.scoreCardObj['totalCount'] = (this.scoreCardArr)=>{}
        // this.scoreCardObj['totalCount'] = this.scoreCardObj['VerySlow']['avg'] + this.scoreCardObj['Slow']['avg'] + this.scoreCardObj['Errors']['avg'] + this.scoreCardObj['Normal']['avg']
      }else{
        this.isAvailable = false;
      }
    } catch (error) {
      console.log('Error inside createTransactionScoreCardData ',error);
    }
  }
  getRepString(rep) {
    rep = rep + ''; // coerce to string

    if (rep < 1000) { // return the same number
      return rep;
    }
    let val: any;

    // divide and format
    val = (rep / 1000);
    val = val.toFixed(rep % 1000 != 0) + 'k';
    return val;
  }
  /**
  * Removes null/NA from provided string
  */
  removeNullString(str: string): string {
    str = str.replace(/_null_/g, '_');
    str = str.replace(/_NULL_/g, '_');
    str = str.replace(/_na_/g, '_');
    str = str.replace(/_NA_/g, '_');
    return str;
  }
}
