import { SettingsTable, SecureConnOption, StdCarrierOption, StdCarrierGateway } from './settings.model';

export const SETTINGS_TABLE: SettingsTable = {
    standerd: [
    {
      label: 'AT&T',
      value: 'AT&T'
    }
  ],
  domain: [
    {
      label: 'AT&T.net',
      value: 'AT&T.net'
    }
  ],
  headers: [
    {
      cols: [
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
        },
        {
          label: 'Time Period',
          valueField: 'time',
          classes: 'text-left',
        },
      ],
    },
  ],
  data: [
    {
      name:"Cavisson(Admin)",
      time:"Current"
    },
    {
      name:"XYZ",
      time:"2016-2019"
    }
  ],
};


export const SCECURE_CON_OPTION: SecureConnOption[] =
 [
    {label: 'TLS, if Available', value: 'TLS, if Available'},
    {label: 'TLS', value: 'TLS'},
    {label: 'SSL', value: 'SSL'}    
  ]


export const STD_CARRIER_TYPE_OPTION: StdCarrierOption[] =  
[
  {label: 'AT&T', value: 'AT&T'},
  {label: 'T-Mobile', value: 'T-Mobile'},
  {label: 'Verizon', value: 'Verizon'},
  {label: 'Sprint', value: 'Sprint'},
  {label: 'Virgin Mob', value: 'Virgin Mob'},
  {label: 'Tracfone', value: 'Tracfone'},
  {label: 'Boost Mobile', value: 'Boost Mobile'},
  {label: 'Metro PCS', value: 'Metro PCS'},    
  {label: 'Cricket', value: 'Cricket'},
  {label: 'Nextel', value: 'Nextel'},
  {label: 'Alltel', value: 'Alltel'},
  {label: 'Ptel', value: 'Ptel'},
  {label: 'Suncom', value: 'Suncom'},
  {label: 'Qwest', value: 'Qwest'},
  {label: 'U.S. Cellular', value: 'U.S. Cellular'}   
]

export const SECURE_CON_TYPE =
{
  TLS_IF_AVAIL: "TLS, if Available",
  TLS:"TLS",
  SSL:"SSL"
}

export const DEFAULT_VALUE_SECRE_CON_TYPE =
{
  TLS_IF_AVAIL: 25,
  TLS: 587,
  SSL: 465
}

export const SMS_CARR_TYPE = 
{
  STD_SMS_CARRIER: 0,
  CUSTOM_SMS_CARRIER:1
}

export const STD_CARRIER: StdCarrierGateway[] =
[
  {
    name:"AT&T",
    value:"txt.att.net"
  },
  {
    name:"T-Mobile",
    value:"tmomail.net"
  },
  {
    name:"Verizon",
    value:"vtext.com"
  },
  {
    name:"Sprint",
    value:"messaging.sprintpcs.com"
  },
  {
    name:"Virgin Mob",
    value: "vmobl.com"
  },
  {
    name:"Tracfone",
    value:"mmst5.tracfone.com"
  },
  {
    name:"Metro PCS",
    value:"mymetropcs.com"
  },
  {
    name:"Boost Mobile",
    value:"myboostmobile.com"
  },
  {
    name:"Cricket",
    value:"sms.mycricket.com"
  },
  {
    name:"Nextel",
    value:"messaging.nextel.com"
  },
  {
    name:"Alltel",
    value:"message.alltel.com"
  },
  {
    name: 'Ptel', 
    value: 'ptel.com'
  },
  {
    name: 'Suncom', 
    value: 'tms.suncom.com'
  },
  {
    name:'Qwest',
    value:'qwestmp.com'
  },
  {
    name:'U.S. Cellular',
    value:'email.uscc.net'
  }
]
