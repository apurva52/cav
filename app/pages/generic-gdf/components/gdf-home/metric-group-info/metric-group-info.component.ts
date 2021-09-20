import { Component, OnInit, Input } from '@angular/core';
import { CustomMonitorService } from 'src/app/pages/monitor-up-down-status/configure-monitors/add-custom-monitor/services/custom-monitor.service';
import { UtilityService } from '../../../services/utility.service';
@Component({
  selector: 'app-metric-group-info',
  templateUrl: './metric-group-info.component.html',
  styleUrls: ['./metric-group-info.component.css']
})

export class MetricGroupInfoComponent implements OnInit {

  @Input() item: any;
  techList: any[] = [];// list of technology list
  cusCat: string
  isFromEdit :boolean;
  constructor(private cmsObj: CustomMonitorService,
  ) { }

  ngOnInit() {
    let availableTechList = this.cmsObj.getAvailableTechList();
    let techDisplayName = [];
    let techName = [];
    if(availableTechList)
    {
      for (let i = 0; i < availableTechList['_at'].length; i++) {
        techDisplayName.push(availableTechList['_at'][i].dn)
        techName.push(availableTechList['_at'][i].n)
      }
    }
    this.techList = UtilityService.createListWithKeyValue(techDisplayName, techName)
    this.techList.push({ label: '--Add New Technology--', value: 'addNewTechnology' });
    // for bug 111452 added custom category in the available tech list
    const found = this.techList.some(el => el.value === this.item['cat']);
    if (!found)
    {
      this.techList.push({ label: this.item['cat'], value: this.item['cat'] });
      this.techList.sort((a, b) => a.label.localeCompare(b.label))
    } 

    if (this.cmsObj.isFromEdit) {
      // let isCustomCat = false;
      this.isFromEdit = this.cmsObj.isFromEdit
      // this.techList.map(each => {
      //   if (each['value'] == this.item['cat']) {
      //     isCustomCat = true;
        
      //   }
      // })
      // if (!isCustomCat) {
      //   this.cusCat = this.item['cat'];
      //   this.item['cat'] = "addNewTechnology";
      // }
    }
  }

  //Method called when group desc is blank, so we will it with metric group name
  validateGrpInfo() {
    if (this.item.gdfInfo.gD == "" && this.item.gdfInfo.grpN.length < 64) // group name cannot be more than 64characters
      this.item.gdfInfo.gD = this.item.gdfInfo.grpN
  }

}
