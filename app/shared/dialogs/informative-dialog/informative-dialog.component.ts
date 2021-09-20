import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { INFO_DIALOG } from '../../actions.constants';
import { PageDialogComponent } from '../../page-dialog/page-dialog.component';
import { DialogsService } from '../dialogs.service';
import { InfoData } from './service/info.model';

@Component({
  selector: 'app-informative-dialog',
  templateUrl: './informative-dialog.component.html',
  styleUrls: ['./informative-dialog.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class InformativeDialogComponent extends PageDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { read: ElementRef, static: false })
  content: ElementRef;

  @Input()
  data: InfoData;
  error: AppError;
  empty: boolean;
  loading: boolean;
  visible : boolean;

  constructor(private dialogService: DialogsService) {
    super();
  }

  /* This method is for getting event subscription every time user save widget settings */
  getSubscription() {
    const me = this;
    try {
      const data = this.dialogService.modelServiceProvider$.subscribe(
        result => {
          if(result.action == INFO_DIALOG )
          {
            me.data = result.data;
            me.open();
          }
        },
        error => {
          console.log('error in getting data ', error);
          data.unsubscribe();
        },
        () => {
          data.unsubscribe();
        }
      );
    } catch (error) {
      console.error('error in getting subscription');
    }
  }

  @Input()
  set setData(data:InfoData) {
    const me = this;
    me.data = data;
  }

  ngOnInit(): void {
    this.getSubscription();
  }

  ngAfterViewInit() {}

  closeDialog(){
    const me = this;
    me.visible = false;
  }

  open(){
    const me = this;
    me.visible= true;
  }

  showInformativeBox(title?: string, information?: string, button?:string){
    const me = this;
    me.data.title = title;
    me.data.information = information;
    me.data.button = button;

    me.show();
  }
}
