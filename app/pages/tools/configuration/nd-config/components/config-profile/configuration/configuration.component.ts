import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigHomeService } from '../../../services/config-home.service';
import { KeywordData, KeywordList } from '../../../containers/keyword-data';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  keywordGroup: any;
  profileId: number;
  toggleDisable: boolean;

  subscription: Subscription;
  subscriptionKeywordGroup: Subscription;

  adminMode: boolean;
  isProfilePerm: boolean;
  agentType: string = "";
  breadcrumb: BreadcrumbService;
  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configHomeService: ConfigHomeService, private store: Store<KeywordList>, breadcrumbService: BreadcrumbService) {
    this.agentType = sessionStorage.getItem("agentType");    
      //Initialize groupkeyword values
      this.keywordGroup = this.configKeywordsService.keywordGroup;
	this.breadcrumb = breadcrumbService;
  }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId']
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888 || this.profileId == 666666 || this.profileId == 999999)
        this.toggleDisable =  true;
	this.breadcrumb.add({label: 'Configuration', routerLink: `/nd-agent-config/profile/configuration/${this.profileId}`});
    });
    this.loadAdminInfo();
    this.loadKeywordData();
   /* // This is done because this.keywordGroup.general.exception.enable gives us "false" when enabled
    if (sessionStorage.getItem('exceptionCapturing') != 'true' && sessionStorage.getItem('exceptionCapturingSeqBlob') != "1" && sessionStorage.getItem('exceptionCapturingAdvanceSetting') == "0") {
      this.keywordGroup.general.exception.enable = false;
    }
    else if (sessionStorage.getItem('exceptionCapturing') == null && sessionStorage.getItem('exceptionCapturingSeqBlob') == null && sessionStorage.getItem('exceptionCapturingAdvanceSetting') == null) {
         this.keywordGroup.general.exception.enable = false;
    }
    else {
         this.keywordGroup.general.exception.enable = true;
    }
*/
    // This is done because if all the two keywords of monitor are disabled then the toggle in the configuration screen will also be disabled 
    // if (sessionStorage.getItem('enableBTMonitor') != "1" && sessionStorage.getItem('enableBackendMonitor') != "1") {
    //   this.keywordGroup.advance.monitors.enable=false;
    // }
  }
  //This method is used to see whether it is admin mode or not
  loadAdminInfo(): void {
    this.configHomeService.getMainData()
      .subscribe(data => {
        this.adminMode = data.adminMode;
      }
      );
  }

  loadKeywordData() {
    this.configKeywordsService.getProfileKeywords(this.profileId);

    //Getting whole keyword data values
    this.subscription = this.store.select<KeywordData>(store => store["keywordData"])
      .subscribe(data => {
        if (data){
          this.configKeywordsService.toggleKeywordData();
          this.subscriptionKeywordGroup = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.keywordGroup = data );
          this.configKeywordsService.toggleKeywordData();
        }
      });

  }

   /**This is used to enable/disable groupkeyword values. */
  // change(selectedKeywordGroup) {
  //   if(this.toggleDisable == true)
  //     {
  //       return;
  //     }
  //   for (let moduleName in this.keywordGroup) {
  //     let keywordGroupList = this.keywordGroup[moduleName];

  //     //keywordKey -> flowpath, hotspot...
  //     for (let keywordKey in keywordGroupList) {

  //       //Checking selected keywordGroup string with stored groupkeyword list key
  //       if (selectedKeywordGroup == keywordKey) {

  //         let keywordList = keywordGroupList[keywordKey].keywordList;

  //         for (let i = 0; i < keywordList.length; i++) {
  //           //When toggle moving for disable
  //           if (keywordGroupList[keywordKey].enable) {
  //             //Setting 0 value for disable keyword
  //             this.configKeywordsService.keywordData[keywordList[i]].value = "0";
  //           }
  //           else {
  //             //Setting Default value for enable keyword
  //             this.configKeywordsService.keywordData[keywordList[i]].value = this.configKeywordsService.keywordData[keywordList[i]].defaultValue;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //saving keyword values
  //   var toggle = "toggle"
  //   this.configKeywordsService.saveProfileKeywords(this.profileId,toggle);
  // }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
