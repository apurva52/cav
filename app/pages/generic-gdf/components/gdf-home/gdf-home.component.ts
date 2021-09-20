import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';
import { UtilityService } from '../../services/utility.service';
import { GenericGDFData } from '../../containers/generic-gdf-data';
import { GenericGdfMessageService } from '../../services/generic-gdf-message.service';

@Component({
  selector: 'app-gdf-home',
  templateUrl: './gdf-home.component.html',
  styleUrls: ['./gdf-home.component.css']
})
export class GdfHomeComponent implements OnInit {

  metricList: SelectItem[]; // metric type list used in GDF
  gdfDetails: GenericGDFData;
  customMetric: string = ''; // variable to hold custom metric type 
  public message: Message[] = [];

  @Input() receivedColArr: any;
  constructor(private msgObj: GenericGdfMessageService) {
  }

  ngOnInit() {
    this.gdfDetails = new GenericGDFData();
    let metricListLabel = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
    let metricListValue = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
    this.metricList = UtilityService.createListWithKeyValue(metricListLabel, metricListValue);

    // this.msgObj.messageProvider$.subscribe(data=> this.message = data);
  }

  /**Method called when save is clicked to create GDF.*/
  saveGdfInfo() {
    //if custom metric is provided then metric type should be equal to user defined custom metric type.
    if (this.gdfDetails.mV == 'Custom Metrics' && this.customMetric != '') {
      this.gdfDetails.mV = this.customMetric;
    }

   // this.msgObj.successMessage("Gdf saved successfully.")

    this.clearFormData(); // on saving clear the fields of the form 

  }
  /**Method for the show filter in the datatable */
  // clear() {
  //   this.clearTableInfo.emit(true);
  // }

  /**Method to auto fill group description if left blank*/
  fillGrpDesc() {
    if (this.gdfDetails.gD == "") {
      this.gdfDetails.gD = this.gdfDetails.grpN
    }
  }

  /**Method to validate space in group name */
  validateGdfInfo(event) {
    let key = event.key;
    key = key.charCodeAt();
    if (key == 32 || this.gdfDetails.grpN.length > 64)
      return false;
  }

  /**Method called to clear form fields  */
  clearFormData() {
    this.gdfDetails = new GenericGDFData(); // clearing form fields
  }

}
