import { MessagealertComponent } from '../../messagealert/messagealert.component';
import { Injectable } from '@angular/core';

@Injectable({providedIn : 'root'})
export class MsgService {
  
  static duration = 10000;
  static log(message)
  {
    MessagealertComponent.log = message;
    setInterval(() => {
       MessagealertComponent.log = null;
    }, MsgService.duration);
  }
  
  static error(message)
  {
    MessagealertComponent.error = message; 
    setInterval(() => {
       MessagealertComponent.error = null;
    }, MsgService.duration);
  }
  
  static warn(message)
  {
    MessagealertComponent.warn = message; 
    setInterval(() => {
       MessagealertComponent.warn = null;
    }, 20000);
  }
  
  static info(message)
  {
    MessagealertComponent.info = message;
    setInterval(() => {
       MessagealertComponent.info = null;
    }, MsgService.duration);
  }
  
  constructor() { 
  }
  
 

}
