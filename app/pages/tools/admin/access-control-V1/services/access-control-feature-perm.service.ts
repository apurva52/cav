import { Injectable } from '@angular/core';
import { CapabilityConstant } from '../constants/capability-constants';
@Injectable()
export class AccessControlFeaturePermService {
  capabilityConstant = new CapabilityConstant();
   DefaultHighestPermission =[this.capabilityConstant.PERMISSiON_NO_PERM,this.capabilityConstant.PERMISSION_READ_ONLY,this.capabilityConstant.PERMISSION_READ_WRITE]
    DefaultLowestPermission =[this.capabilityConstant.PERMISSiON_NO_PERM , this.capabilityConstant.PERMISSION_READ_ONLY];
    DefaultTimePeriodPermission =[this.capabilityConstant.PERMISSiON_NO_PERM ,this.capabilityConstant.PERMISSIONLOW,this.capabilityConstant.PERMISSIONMEDIUM,this.capabilityConstant.PERMISSIONHIGH ]
   featurePermission =[
     {feature :'All',Pemissionarray : [this.capabilityConstant.PERMISSiON_NO_PERM]  },
     {feature :"Tree" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Organize Favorites" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Alert Settings" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Alert Policy" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Alert Actions" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Alert Baseline" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Alert Rules'" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Configuration" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Favorites" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Pattern Matching" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"AccessControl" , Pemissionarray : this.DefaultHighestPermission },
     {feature :"Add Favorite" , Pemissionarray : this.DefaultHighestPermission },
     {feature :'Transactions' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'MS SQL Query' , Pemissionarray : this.DefaultLowestPermission },
     {feature : 'Show Vector in Title' , Pemissionarray : this.DefaultLowestPermission },
     {feature : 'Events' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Run Time Progress', Pemissionarray : this.DefaultLowestPermission },
     {feature : 'Virtual User Trace' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Stats' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Logs' , Pemissionarray : this.DefaultLowestPermission },
     {feature : 'Graph Tree'  , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Compare' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Derived Graph' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Color Management' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Diagnostics' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Sync Point(s)' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Update Favorite' , Pemissionarray : this.DefaultLowestPermission },
//     {feature :'Save Layout' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Add New Layout' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Add Widget' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Layout Selection', Pemissionarray : this.DefaultLowestPermission },
     {feature :'Widget Settings' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Show Metric Data', Pemissionarray : this.DefaultLowestPermission },
     {feature :'Add to custom metrics' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Show Graph In Tree', Pemissionarray : this.DefaultLowestPermission },
     {feature :'Run Command' , Pemissionarray : this.DefaultLowestPermission },
     {feature :'Download As', Pemissionarray : this.DefaultLowestPermission },
     {feature :"All" , Pemissionarray : this.DefaultHighestPermission },
     {feature:'Update Data File', Pemissionarray : this.DefaultLowestPermission},
     {feature:'Time Period' ,Pemissionarray: this.DefaultTimePeriodPermission },
     {feature:'Reports' ,Pemissionarray: this.DefaultHighestPermission},
    {feature : 'Import data from Access Log file' , Pemissionarray : this.DefaultLowestPermission}

   ]


  constructor() { }
 

  fetchPermissionbyfeature(featurestring: string ,systemDefault : boolean) {
    if(systemDefault) {
      return this.DefaultHighestPermission
    }
    let featurearray = featurestring.split(',');
    let permissonarray = [];
    let highest = false;
    let timePeriod = false;
    for (let i = 0; i < featurearray.length; i++) {
      let index = this.featurePermission.map(function (e) {
        return e.feature
      }).indexOf(featurearray[i]);
      let singleFeatureArray;
      if (index > -1) {
        singleFeatureArray = this.featurePermission[index].Pemissionarray;
      }
      else {
        singleFeatureArray = this.DefaultHighestPermission;
      }
      let duplicates = permissonarray.filter(function (val) {
        return (singleFeatureArray.indexOf(val) != -1);
      });
      if (duplicates.length == 0) {
        permissonarray = singleFeatureArray;
      }
      else {
        permissonarray = duplicates;
      }
    }

    return permissonarray;
  }
}
