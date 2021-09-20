import { Component, OnInit } from '@angular/core';
import { TopologyInfo } from '../../interfaces/topology-info';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfirmationService } from 'primeng/api';
import { ConfigHomeService } from '../../services/config-home.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-config-topology-list',
  templateUrl: './config-topology-list.component.html',
  styleUrls: ['./config-topology-list.component.css']
})
export class ConfigTopologyListComponent implements OnInit {
  breadcrumb: BreadcrumbService;
  constructor(private configTopologyService: ConfigTopologyService, private configHomeService: ConfigHomeService, private configApplicationService: ConfigApplicationService, private router: Router, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
  }

  topologyData: TopologyInfo[];
  selectedTopology: TopologyInfo[];

  ROUTING_PATH = ROUTING_PATH;
  topoPerm: boolean;
  topologyNameList = []

  cols = [
    { field: 'topoName', header: 'Name' },
    { field: 'timeStamp', header: 'Last Updated On' }
    ];

  ngOnInit() {
	this.breadcrumb.add({label: 'Topology List', routerLink: '/nd-agent-config/topology-list'});
    this.topoPerm = +sessionStorage.getItem("TopologyAccess") == 4 ? true : false;
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topologyNameList = data;
      this.configApplicationService.addTopoDetails(this.topologyNameList).subscribe(data => {
        this.loadTopologyList();
      })
    })
  }

  loadTopologyList() {
    this.configTopologyService.getTopologyList().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i]["timeStamp"] == null) {
          data[i]["timeStamp"] = "-";
        }
      }
      //Method to sort data on the basis of timeStamp.
      data.sort(function(a, b){
        var keyA = new Date(a.timeStamp),
            keyB = new Date(b.timeStamp);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
      this.topologyData = data.reverse()// For temporary basis we are getting data from these keys
    });
  }
  routeToTreemain(selectedTypeId, selectedName, type) {
    sessionStorage.setItem("showserverinstance", "false");
    //Observable application name
    if (type == 'topology') {
      //it routes to (independent) topology screen
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology', selectedTypeId]);
    }
    else {
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedTypeId]);
    }
  }

  /** To delete topology */
  deleteTopology() {
    if (!this.selectedTopology || this.selectedTopology.length < 1) {
      this.configUtilityService.errorMessage("Select topology(s) to delete")
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete selected topology?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        let arrId = [];
        for (let i = 0; i < this.selectedTopology.length; i++) {
          arrId.push(this.selectedTopology[i].topoId);
        }
        let that = this;
        this.configTopologyService.deleteTopology(arrId).subscribe(data => {
          if (data.length == that.topologyData.length) {
            this.configUtilityService.errorMessage("Could not delete: Selected topology(s) may be applied to an application(s)")
          }
          else {
            this.topologyData = data;
            this.configUtilityService.infoMessage("Deleted successfully")
          }
          this.selectedTopology = [];
        })
      },
      reject: () => {

      }
    });
  }
  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    var arrHeader = { "0": 'Name', "1": "Last Updated On"};
    var arrcolSize = { "0": 3, "1": 3 };
    var arrAlignmentOfColumn = { "0": "left", "1": "right"};
    var arrFieldName = {"0": "topoName", "1" : "timeStamp"};
    let object =
      {
        data: this.topologyData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "Topology",
        fileName: "topology",
      }

      this.configTopologyService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data)
    })
  }

  /* for open download reports*/
  openDownloadReports(res) {
    window.open("/common/" + res);
  }

}
