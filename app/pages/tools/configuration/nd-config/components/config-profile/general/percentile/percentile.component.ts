import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api'
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigExceptionFilterService } from '../../../../services/config-exceptionfilter.service';
import { cloneObject, ConfigUiUtility} from '../../../../utils/config-utility';
import { Store } from "@ngrx/store";


@Component({
    selector: 'app-percentile',
    templateUrl: './percentile.component.html',
    styleUrls: ['./percentile.component.css']
})
export class PercentileComponent implements OnInit {

    @Input()
    saveDisable: boolean;
    profileId: number;
    index: number = 0;

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();
    percentile: Object;

    agentType: string = "";

    isProfilePerm: boolean;

    /** Flag for capture BT percentile */
    captureBTPercentile : boolean = false;

    /** Flag for capture IP percentile */
    captureIPPercentile : boolean = false;

    /**These are those keyword which are used in current screen. */
    keywordList: string[] = ['tDigestPercentileBT','tDigestPercentileIP', 'tDigestInstanceLevelDump'];

    /** Aggregation Duration dropdown for BT percentile */
    aggregationDurationForBTList: SelectItem[];

    /** Aggregation Duration dropdown for IP percentile */
    aggregationDurationForIPList: SelectItem[];

    aggregationDurationLabel = ['1 minute', '2 minute', '5 minute', '15 minute', '30 minute','1 hour','2 hour','4 hour', '8 hour', '12 hour', '24 hour'];
    aggregationDurationValue = ['1m', '2m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '24h'];

    /** groupID for BT and IP Percentile */
    groupIDForBTPercentile : any = 10793;
    groupIDForIPPercentile : any = 10794;

    /** graphID for BT and IP Percentile */
    graphIDForBTAndIPPercentile : any = 1;

    /** Aggregation duration variable for BT Percentile */
    aggregationDurationForBT : any;

    /** Aggregation duration variable for IP Percentile */
    aggregationDurationForIP : any;

    /** compress serialization variable for BT Percentile */
    compressSerializationForBT : boolean;

    /** compress serialization variable for IP Percentile */
    compressSerializationForIP : boolean;

    /** Delta and K variable for BT Percentile */
    deltaForBT : any;
    kForBT : any;

    /** Delta and K variable for IP Percentile */
    deltaForIP : any;
    kForIP : any;

    /** variable for Store Percentile Data at Instance Level */
    isInstanceLevelDump : boolean;
    constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<Object>, private route: ActivatedRoute, private configExceptionFilterService: ConfigExceptionFilterService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
        this.agentType = sessionStorage.getItem("agentType");
        
        this.getKeywordData();

        /** Filling the aggregation duration dropdown for IP and BT Percentile */
        this.aggregationDurationForBTList = ConfigUiUtility.createListWithKeyValue(this.aggregationDurationLabel, this.aggregationDurationValue);
        this.aggregationDurationForIPList = ConfigUiUtility.createListWithKeyValue(this.aggregationDurationLabel, this.aggregationDurationValue);
    }
    subscription: Subscription;
    percentileForm: boolean = true;

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        if (this.saveDisable || this.isProfilePerm)
            this.configUtilityService.infoMessage("Reset and Save are disabled");
    }


    saveKeywordData() {
        if(this.captureBTPercentile == false)
        {
            this.percentile['tDigestPercentileBT'].value = "0%205m%202%20100%20100%2010793%201";
        }
        else
        {
            let arr = ['1'];
            arr.push(this.aggregationDurationForBT);
            if(this.compressSerializationForBT)
                arr.push('2');
            else
                arr.push('1');
            arr.push(this.deltaForBT);
            arr.push(this.kForBT);
            arr.push(this.groupIDForBTPercentile);
            arr.push(this.graphIDForBTAndIPPercentile)
            this.percentile['tDigestPercentileBT'].value = arr.join("%20");
        }

        if(this.captureIPPercentile == false)
        {
            this.percentile['tDigestPercentileIP'].value = "0%205m%202%20100%20100%2010794%201";
        }
        else
        {
            let arr = ['1'];
            arr.push(this.aggregationDurationForIP);
            if(this.compressSerializationForIP)
                arr.push('2');
            else
                arr.push('1');
            arr.push(this.deltaForIP);
            arr.push(this.kForIP);
            arr.push(this.groupIDForIPPercentile);
            arr.push(this.graphIDForBTAndIPPercentile)
            this.percentile['tDigestPercentileIP'].value = arr.join("%20");
        }

        if(this.isInstanceLevelDump == false)
        {
            this.percentile['tDigestInstanceLevelDump'].value = 0;
        } 
        else
        {
            if(this.captureIPPercentile == false && this.captureBTPercentile == false)
            {
                this.percentile['tDigestInstanceLevelDump'].value = 0;
            }
            else
            {
                this.percentile['tDigestInstanceLevelDump'].value = 1;
            }
        }

        this.keywordData.emit(this.percentile);
    }

    /* This method is used to reset the keyword data */
    resetKeywordData() {
        let data = this.configKeywordsService.keywordData
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.percentile[key].value = data[key].value;
            }
          }
          this.methodToSetValue(this.percentile);
    }

    /* This method is used to reset the keyword data to its Default value */
    resetKeywordsDataToDefault() {
        let data = this.configKeywordsService.keywordData;
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.percentile[key].value = data[key].defaultValue;
            }
          }
        this.methodToSetValue(this.percentile);
    }

    //This method is used to set value of data depending on data received in its argument
    methodToSetValue(data){
        this.percentile = data;
        if ((this.percentile["tDigestPercentileBT"].value).includes("%20")) {
            let arr = (this.percentile["tDigestPercentileBT"].value).split("%20")
            if (arr[0] == "1") 
                this.captureBTPercentile = true;
            else
                this.captureBTPercentile = false;

            this.aggregationDurationForBT = arr[1];
                
            if(arr[2] == "2")
                this.compressSerializationForBT = true;
            else
                this.compressSerializationForBT = false;
            
            this.deltaForBT = arr[3];
            this.kForBT = arr[4];
        }
        if ((this.percentile["tDigestPercentileIP"].value).includes("%20")) {
            let arr = (this.percentile["tDigestPercentileIP"].value).split("%20")
            if (arr[0] == "1") 
                this.captureIPPercentile = true;
            else
            this.captureIPPercentile = false;
            
            this.aggregationDurationForIP = arr[1];
                
            if(arr[2] == "2")
                this.compressSerializationForIP = true;
            else
                this.compressSerializationForIP = false;
            
            this.deltaForIP = arr[3];
            this.kForIP = arr[4];
        }

        if(this.percentile["tDigestInstanceLevelDump"].value == 1)
            this.isInstanceLevelDump = true;
        else
            this.isInstanceLevelDump = false;
    }

    /* This method is used to get the existing keyword data from the backend */
    getKeywordData() {
        this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
            var keywordDataVal = {}
                this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
                })
            this.percentile = cloneObject(keywordDataVal);
            this.methodToSetValue(this.percentile );
        });
    }
    
  sendHelpNotification() {
     this.configKeywordsService.getHelpContent("General", "Percentile", "");
  }
}
