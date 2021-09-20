export interface ConfiguredMonitors {
    
    monitors: Array<{
        title?: String,
    technology:any,
    instanceCount: String,
    bgColor: String,
    tiers:String,
    server:String,
    monitor: any
    }>;
    
}

export interface OtherMonitors {

    monitors: Array<{
  
    title:String,
    monitor: any,
    routerLink?: String
    }>;
    
}

export interface AvailableTechnology {

    data: Array<{
    
    serverName:String
    }>;
    
}

export interface CloudIntegration {

    data: Array<{
    
    serverName:String,
    logoUrl: String,
    routerLink: String
    }>;
    
}
