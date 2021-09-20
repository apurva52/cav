import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-config-application',
  templateUrl: './agent-config-application.component.html',
  styleUrls: ['./agent-config-application.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AgentConfigApplicationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo() {
    this.router.navigate(['/nd-setting']);
  }

}
