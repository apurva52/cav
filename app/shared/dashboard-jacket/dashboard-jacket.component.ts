import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-jacket',
  templateUrl: './dashboard-jacket.component.html',
  styleUrls: ['./dashboard-jacket.component.scss']
})
export class DashboardJacketComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  moniteringDashboard: any = [
    { name: 'Page Monitoring Dashboard'},
    { name: 'My Dashboard'},
    { name: 'My Dashboard'},
    { name: 'My Dashboard'}
  ];

}
