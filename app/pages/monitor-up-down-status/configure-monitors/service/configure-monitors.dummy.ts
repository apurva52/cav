import { AvailableTechnology, CloudIntegration, ConfiguredMonitors, OtherMonitors } from "./configure-monitors.model";

export const CONFIGURED_MONITOR_DATA: ConfiguredMonitors = {

    monitors:[
        {
            title:'Java',
            technology:{
                asset:'assets/icons/java.svg',
                title:'Java'
            },
            instanceCount: '75',
            bgColor: '#215f96',
            tiers:'6',
            server:'20',
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
            title:'Oracle',
            technology:{
                asset:'assets/icons/oracle.svg',
                title:'Oracle'
            },
            instanceCount: '75',
            bgColor: '#af8888',
            tiers:'6',
            server:'20',
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
            title:'Tomcat',
            technology:{
                asset:'assets/icons/tomcat.svg',
                title:'Tomcat'
            },
            instanceCount: '75',
            bgColor: '#7ba37f',
            tiers:'6',
            server:'20',
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
            title:'Aws',
            technology:{
                asset:'assets/icons/aws.svg',
                title:'AWS'
            },
            instanceCount: '75',
            bgColor: '#a1a487',
            tiers:'6',
            server:'20',
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
            title:'Aws',
            technology:{
                asset:'assets/icons/aws.svg',
                title:'AWS'
            },
            instanceCount: '75',
            bgColor: '#809dad',
            tiers:'6',
            server:'20',
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        }
    ]
    
}

export const OTHER_MONITOR_DATA: OtherMonitors = {

    monitors:[
        {
          
            title:'Batch Jobs',
            
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
          
            title:'Check Monitor',
            
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            }  
        },
        {
          
            title:'Health Monitor',
            
            monitor: {
                total:'50',
                running:'0',
                failed:'20',
                disabled:'30'
            },
            routerLink: '/health-check-monitor'  
        }
    ]
    
}

export const AVAILABLE_TECHNOLOGY: AvailableTechnology = {

    data:[
        {
          
            serverName:'Apache Spark Server',
            
         
        },
        {
          
            serverName:'Apache Camel Server',
            
         
        },
        {
          
            serverName:'Cloud Foundry',
            
         
        },
        {
          
            serverName:'DNS And Certificate',
            
         
        },
        {
          
            serverName:'GCPOverAll',
            
         
        },
        {
          
            serverName:'Infinispan Monitor',
            
         
        },


    ]
    
}


export const CLOUD_INTEGRATION: CloudIntegration = {

    data:[
        {
          
            serverName:'AWS',
            logoUrl:'assets/icons/aws.svg',
            routerLink:'/aws-monitoring'
            
         
        },
        {
          
            serverName:'AZURE',
            logoUrl:'assets/icons/azure.svg',
            routerLink:''
            
         
        },
        {
          
            serverName:'GCP',
            logoUrl:'assets/icons/gcp.svg',
            routerLink:''
            
         
        }
    ]
    
}