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
import { Store } from '@ngrx/store';



@Component({
    selector: 'app-other',
    templateUrl: './other.component.html',
    styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

    @Input()
    saveDisable: boolean;
    profileId: number;
    index: number = 0;

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();
    other: Object;

    agentType: string = "";

    isProfilePerm: boolean;

    /**These are those keyword which are used in current screen. */
    keywordList: string[] = ['appLoggerType'];

    /** appLoggerTypeList dropdown for appLoggerType */
    appLoggerTypeList: SelectItem[];

    /** variable name for appLoggerType keyword */
    appLoggerType : string;

    /** label and value array for appLoggerType keyword */
    appLoggerTypeLabel = ['Select', 'SLF4J', 'LOG4J', 'LOG4J2', 'LOGBACK', 'OTHER'];
    appLoggerTypeValue = ['-', 'SLF4J', 'LOG4J', 'LOG4J2', 'LOGBACK', 'OTHER'];
    constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<Object>, private route: ActivatedRoute, private configExceptionFilterService: ConfigExceptionFilterService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
        this.agentType = sessionStorage.getItem("agentType");
        
        this.getKeywordData();

        /** Filling the appLoggerTypeList dropdown for appLoggerType */
        this.appLoggerTypeList = ConfigUiUtility.createListWithKeyValue(this.appLoggerTypeLabel, this.appLoggerTypeValue);
    }
    subscription: Subscription;
    otherForm: boolean = true;

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        if (this.saveDisable || this.isProfilePerm)
            this.configUtilityService.infoMessage("Reset and Save are disabled");
    }


    saveKeywordData() {
        this.other['appLoggerType'].value = this.appLoggerType;
        this.keywordData.emit(this.other);
    }

    /* This method is used to reset the keyword data */
    resetKeywordData() {
        let data = this.configKeywordsService.keywordData
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.other[key].value = data[key].value;
            }
          }
          this.methodToSetValue(this.other);
    }

    /* This method is used to reset the keyword data to its Default value */
    resetKeywordsDataToDefault() {
        let data = this.configKeywordsService.keywordData;
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.other[key].value = data[key].defaultValue;
            }
          }
        this.methodToSetValue(this.other);
    }

    //This method is used to set value of data depending on data received in its argument
    methodToSetValue(data){
        this.other = data;
        this.appLoggerType = this.other["appLoggerType"].value;
    }

    /* This method is used to get the existing keyword data from the backend */
    getKeywordData() {
        this.subscription = this.store.select(store => store["keywordData"]).subscribe(data => {
            var keywordDataVal = {}
                this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
                })
            this.other = cloneObject(keywordDataVal);
            this.methodToSetValue(this.other);
        });
       
    }
    
//   sendHelpNotification() {
//      this.configKeywordsService.getHelpContent("General", "other", "");
//   }
}
