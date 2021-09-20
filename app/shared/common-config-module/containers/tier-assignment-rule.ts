export class TierAssignmentRuleData{
    id: number;
    status: boolean;
    ruleName: string;
    tierName: string;
    serverName: string;
    ruleType: string;
    userName: string;
    customTierName: string;
    nonCustomTierName: string;
    customServerNameStr: string;
    serverNameListStr: string;
    topoName: string;
    customServerName = [];
    serverNameList = [];
}