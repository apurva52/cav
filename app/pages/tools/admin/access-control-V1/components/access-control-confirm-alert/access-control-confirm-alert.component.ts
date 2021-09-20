// import { Component, OnInit, Input } from '@angular/core';
// //import { MatDialogRef } from '@angular/material';
// import { MODEL_ACTION_CANCEL, MODEL_ACTION_OK } from '../../constants/access-control-constants';
// import { ModelWinDataInfo } from '../../containers/model-win-data-info';
// import { AccesControlDataService } from '../../services/acces-control-data.service'
// @Component({
//   selector: 'app-access-control-confirm-alert',
//   templateUrl: './access-control-confirm-alert.component.html',
//   styleUrls: ['./access-control-confirm-alert.component.css']
// })
// export class AccessControlConfirmAlertComponent implements OnInit {
//   @Input() modelInfo: ModelWinDataInfo;
//   donotShowDialogAgn: boolean = false;
//   constructor(
//     //private _dialog: MatDialogRef<AccessControlConfirmAlertComponent>,
//     private _modelService: AccesControlDataService) { }

//   ngOnInit() {
//   }

//   /* Closing the alert dialog on event. */
//   onClose($event) {
//     //this._dialog.close();

//     this.modelInfo.modelAction = MODEL_ACTION_CANCEL;
//     this._modelService.handleModelAction(this.modelInfo);
//   }

//   /* On confirming the message. */
//   onConfirm($event) {
//     if (this.donotShowDialogAgn) {
//       this._modelService.$isTopreventConfirmBox = this.donotShowDialogAgn;
//       localStorage.setItem("$isTopreventConfirmBox", "true");
//     }
//     // this._dialog.close();
//     this.modelInfo.modelAction = MODEL_ACTION_OK;
//     this._modelService.handleModelAction(this.modelInfo);
//   }

//   updateWindowSize() {
//     if (this.donotShowDialogAgn) {
//       //  this._dialog.updateSize('400px', '211px')
//     }
//     else {
//       //    this._dialog.updateSize('400px', '171px')
//     }
//   }
// }
