//const  SERVICE_URL = 'https://10.10.50.16:4431/configUI';
// const  SERVICE_URL = 'https://10.10.40.14/configUI';
//  const  SERVICE_URL = 'http://localhost:8090';


//For Production use this SERVICE_URL
 const SERVICE_URL = '/configUI';


export const GET_TOPOLOGY_LIST = `${SERVICE_URL}/tierGroup/getlistoftopology`;
export const GET_TIER_LIST = `${SERVICE_URL}/tierGroup/getlistoftier`;
export const SAVE_TIER_GROUP = `${SERVICE_URL}/tierGroup/savetiergroup`;
export const GET_TIER_GROUP_INFO = `${SERVICE_URL}/tierGroup/getlistoftiergroup`;
export const GET_DELETE_TIER_GROUP = `${SERVICE_URL}/tierGroup/getdeletedtiergroup`;
export const GET_UPDATE_TIER_GROUP = `${SERVICE_URL}/tierGroup/getupdatetiergroup`;
export const PATTERN_EXISTS_OR_NOT = `${SERVICE_URL}/tierGroup/getpatternexistsornot`;
/* URL for get user Name */
export const LOGGED_USER_NAME = `${SERVICE_URL}/home/getusername`;


/** URL for saving tier assign rule */
export const SAVE_TIER_ASSIGN_RULE = `${SERVICE_URL}/custom/tierassignrule/savetierassignrules`;

/** URL for getting tier assign rule */
export const GET_TIER_ASSIGN_RULE = `${SERVICE_URL}/custom/tierassignrule/gettierassignrules`;

/** URL for deleting tier assign rule */
export const DELETE_TIER_ASSIGN_RULE = `${SERVICE_URL}/custom/tierassignrule/deletetierassignrule`;

/** URL for deleting tier assign rule */
export const SAVE_TIER_ASSIGN_RULE_ON_FILE = `${SERVICE_URL}/custom/tierassignrule/savetierassignrulesonfile`;

/** URL for getting tier and server list */
export const GET_TIER_LIST_FOR_TIER_ASSIGN = `${SERVICE_URL}/custom/tierassignrule/gettierlist`;
export const GET_SERVER_LIST = `${SERVICE_URL}/custom/tierassignrule/getserverlist`;

