import { Component, OnInit } from '@angular/core';
import { TierStatusCommonDataHandlerService } from './../../services/tier-status-common-data-handler.service';

@Component({
  selector: 'app-tier-status-top-panel',
  templateUrl: './tier-status-top-panel.component.html',
  styleUrls: ['./tier-status-top-panel.component.css']
})
export class TierStatusTopPanelComponent implements OnInit {
  className: string = "TierStatusTopPanelComponent";
  constructor( public _commonHandler: TierStatusCommonDataHandlerService) { }

  ngOnInit() {
  }

}
