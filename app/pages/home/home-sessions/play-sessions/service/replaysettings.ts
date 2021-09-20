const AUTO_REPLAY_MODE = 3;
//Replay Mode
const MANUAL_REPLAY = 0;
const AUTO_REPLAY = 1;
const TIME_BASED_PROGRESS = 0;
const UACOUNT_BASED_PROGRESS = 1;

const AUTO_REPLAY_ACTUAL_DELAY_MODE = 0;
const AUTO_REPLAY_FIXED_DELAY_MODE = 1; 
const AUTO_REPLAY_SLOW_MODE = 2;
const AUTO_REPLAY_FAST_MODE = 3;
const nextPageLoadStartTime = 0;
const nextTaskInterval = 2000; //ms
const AutoReplayTimer = 0;
const AutoReplayWatchTimer = 0;

export class ReplaySettings{

static replayMode = MANUAL_REPLAY;
static userRole = ""; //user role- standard,admin
static pagecount= 0;//total no of pages in session
static pageindex= "0"; //page index of the session page detail page
static cavepochdiff= 631152000;//cav epoch diff
static serverOffset= 0;//server offset
static debugLevel = 5; //to see the current info in console
static replayColor= "#2a4e80"; //current replay color
static replayPrevColor= "#a60202"; //prev replay color
static startpageinstace = 1; //page instance from wher replay start
static autoSpeedType = 1; //used in actual replay for type (0-actual,2-slow,3-fast,1-fixed)
static autoSpeedValue= 1000; //used in actual replay for type value
static pageloadtime= 2000; //delay for page load time
static parentcount= 2; //no of parent count to be calculated
static totalEvents= 0; //total no of events to replay
static simulatePageLoadDelay : boolean = false; //this is to simulate page load delay. It will add the additional delay to simulate the high page response .
static replayUnexpectedMutation= false;  //replay unexpected result.
static progresBarMode= UACOUNT_BASED_PROGRESS; //TIME_BASED_PROGRESS
static showSilentUserActionCount= false;
static replayAutoFillSilently = true;
static skipFailedSnapshot= true;
static showTabs = false;
static pointer ='las-hand-pointer'; 
static showMouseMoveData = true; // show mouse move data  
}
