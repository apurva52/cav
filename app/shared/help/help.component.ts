import { Component, OnInit ,Input} from '@angular/core';
import {HelpModule} from 'src/app/shared/help/help.module';
import {CompareDataComponent} from './../compare-data/compare-data.component';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import help from './../help/help.json';
import helptable from './../help/helptable.json';
import { HelpService } from './services/help.services';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})

export class HelpComponent  implements OnInit {
  visibleSidebar2:boolean = false;
  showCloseIcon:boolean;
  HelpModule;
  helpContent;
  loading: boolean = true;
  headerName : string = "";
  @Input() CompareDataComponent :CompareDataComponent;
  constructor(private helpService: HelpService, private ref: ChangeDetectorRef ) {
    // super();
    showCloseIcon: Boolean;
   // this.helpContent=help;

  }

  ngOnInit(): void {
   // this.show();

  }

  getHelpContent(moduleName){
  const me=this;
  let payload={
    "name": moduleName
  }
  me.helpService.getHelpContent(payload).subscribe(data=>{
    me.loading = false;
    me.helpContent = data['data'];
    document.getElementById('formdata').innerHTML = me.helpContent;
    this.ref.detectChanges();

    }
  )
  }

 show(moduleName, headerName){

   let me =this;
   me.headerName = headerName;
   me.loading = true;
   me.visibleSidebar2=true;
   me.helpContent = "";
   document.getElementById('formdata').innerHTML = "";
   this.ref.detectChanges();
   me.getHelpContent(moduleName);

}

}
