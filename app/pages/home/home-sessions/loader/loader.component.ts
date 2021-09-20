import { Component, OnInit, Input } from '@angular/core';
import { ParseSessionFilters } from '../common/interfaces/parsesessionfilters';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() busy = false;
  @Input() w = "100%";
  @Input() h = "100%";
  @Input() position = "absolute";
  @Input() opacity = "0.2";
  @Input() top = "";  
  @Input() z_index = '';

  chkButton : boolean = true;
  constructor() 
  {
  }
  
  ngOnInit() {
   //if(document.getElementById("button1").style.display=="none")
   this.chkForExitButton();
  }
 exitLoop()
 {
  ParseSessionFilters.sessionFilters.autoCommand.particularPage = false;
  $(".button1").hide();
 }

 chkForExitButton()
 {
 if(!ParseSessionFilters.sessionFilters.autoCommand.particularPage)
  this.chkButton = true;
 else
  this.chkButton = false;
 if($(".button1").is(':visible'))
  {
   this.chkButton = true;
  }
  if(!ParseSessionFilters.sessionFilters.autoCommand.particularPage)
   $(".button1").hide();
  else
  $(".button1").show();
 } 
}
