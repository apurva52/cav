export interface RunCommandBeanInterface {

    userName?: string;
    userDefindCommad?: boolean;
    serverName?: string;
    isOutPutSaveOnServer?: boolean;
    serverTime?: string; //Format will be MM/dd/yyyy hh:mm:ss
    testRun?: string;
    subOutputOption?: string;
    subOutputValue?: number;
    filerKeyword?: string;
    serverDisplayName?: string;
    groupName?: string;
    commandName?: string;
    actualCommand?: string;
    role?: string;
    serverType?: string;
    viewType?: string;
    description?: string;
    searchKeyword?: string;
    isColumnContains?: boolean;
    cmdUIArgs?: string;
    actualCmdArgs?: string;
    maxInLineArguments?: string;
    separator?: string;
    iteration?: number;
}
