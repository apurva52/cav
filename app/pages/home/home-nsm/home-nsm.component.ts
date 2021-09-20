import { Component, OnInit } from '@angular/core'; 
import { MenuItem, MegaMenuItem} from 'primeng/api';

@Component({
  selector: 'app-home-nsm',
  templateUrl: './home-nsm.component.html',
  styleUrls: ['./home-nsm.component.scss']
})
export class HomeNsmComponent implements OnInit {
  items: MenuItem[]; 
  display:boolean = true; 
  constructor() { }

  ngOnInit() {   
   
    this.items = [
      {
        label: 'Dashboard',
        
        routerLink: 'nsm-dashboard',
        

        
      },
      {
        label: 'servers',
        
        items: [
          { label: 'Master Blade', routerLink: 'blades' },
          { label: 'Master servers', routerLink: 'nsm-servers' }
        ]
      },
      {
        label: 'projects',
        
        routerLink:'nsm-projects'
      },
      {
        label: 'Vendors',
       
        routerLink: 'venders'
        
      },
      {
        label: 'Manage',
        
        
        items: [
          {
            label: 'serves',
            routerLink: 'mang-server'
           
          },
          {
            label: 'vendor', 
            routerLink: 'mang-vendor'
           
          },
          {
            label: 'Location', 
            routerLink :'mang-location'
            

          },
          {
            label: 'Teams',
            items: [
              {
                label: 'Team', 
                routerLink: 'mang-team'
                 },
              {
                label: 'Channel',
                routerLink: 'mang-channel'
              },
            ]

          }
        ]
      }, 
      {
        label: 'logs',
        items: [
          {
            label: 'Add Delete logs', 
            routerLink: 'nsmlogs',
           
            
          },
          {
            label: 'Blade Status',
            routerLink :'blade-status'
           
          },
          {
            label: 'Allocation Status',
            routerLink: 'allocation-status'

          },
          {
            label: 'Server Status', 
            items: [
              {
                label: 'CCs VPs',
                routerLink: 'CCS-Vps-status'

              },
              {
                label: 'VMs',  
                routerLink: 'vms-status'
              } 
            ]
           

          }
        ]
      }
    ];
    
    

  }

}
