export class CapabilitiesResponse {
    capabilityDesc: string;
    capabilityID: number;
    capabilityName: string;
    capabilityType: string;
    permissions: Permissions
}

export class Permissions {
    permissionType: string;
    reqTableData: RequestTableData[];
}

export class RequestTableData {
    source: string;
    tierList?: any[];
    projectName?: string;
    subProjList?: any[];
    component?: string;
    featureList?: any[];
    permission?: string;
    accessType?: string;
}