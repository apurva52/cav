import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messagealert',
  templateUrl: './messagealert.component.html',
  styleUrls: ['./messagealert.component.css']
})
export class MessagealertComponent implements OnInit {

  static error =  null;
  static warn =  null;
  static log = null;
  static info = null;
  
  constructor()
  {
  }

  
  ngOnInit() {
  }
  
  removeMsg(){
    MessagealertComponent.error = null;
    MessagealertComponent.warn = null;
    MessagealertComponent.log = null;
    MessagealertComponent.info = null;  
  }
  
  get errorMsg(){
    return MessagealertComponent.error;
  }
  
  get warnMsg(){
    return MessagealertComponent.warn;
  }
  
  get logMsg(){
    return MessagealertComponent.log;
  }
  
  get infoMsg(){
    return MessagealertComponent.info;
  }
}
