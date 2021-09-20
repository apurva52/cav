import { Component, OnInit } from '@angular/core';

import {Message, MessageService, ConfirmationService} from 'primeng/api';

import {ConfigUtilityService} from '../../services/config-utility.service';


@Component({
  selector: 'app-config-top-nav-bar',
  templateUrl: './config-top-nav-bar.component.html',
  styleUrls: ['./config-top-nav-bar.component.css']
})
export class ConfigTopNavBarComponent implements OnInit {
	
  constructor(private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private messageService: MessageService,) { }

  message: Message;

  ngOnInit() {
    this.configUtilityService.messageProvider$.subscribe(data=> {
      this.message = data;
      this.messageService.clear();
      this.messageService.add(this.message);
    });
  }

}
