import { ThreadDumpData } from './thread-dump.model';

export const PANEL_DUMMY: any = {
  panels: [
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
  ],
};

export const THREAD_DUMP_DATA: ThreadDumpData = {
  threadData: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Tier',
            valueField: 'tier',
            classes: 'text-left',
            isSort: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Server',
            valueField: 'server',
            classes: 'text-left',
            isSort: false,
            filter: {
              isFilter: false,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Instance',
            valueField: 'instance',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Start Time',
            valueField: 'start_time',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Stop Time',
            valueField: 'stop_time',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',

          },
          {
            label: 'User',
            valueField: 'user',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',

          },
          {
            label: 'Agent',
            valueField: 'agent',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',

          },
          {
            label: 'User Note',
            valueField: 'user_note',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            editableCol: {
              editable: true,
              editType: 'input',
            },
            selected: true,
            width: '10%',

          },
          {
            label: 'Status',
            valueField: 'status',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',
          },
          {
            label: 'Action',
            valueField: 'action',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: false,
              type: 'contains',
            },
            selected: true,
            iconField: true
          },
        ],
      },
    ],
    data: [
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        instance: 'SessionPageFail',
        start_time: 'Session and Page Failed',
        stop_time: '5',
        user:'UserName',
        agent:'Agent',
        user_note:'user Note',
        status: 'completed',
      },

      {
        tier: 'icons8 icons8-save-as',
        server: 'icons8 ',
        instance: 'Feedback',
        start_time: 'Feedback Event',
        stop_time: '5',
      },
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        instance: 'HighPageResponse',
        start_time: 'Event for long duration Session',
        stop_time: '5',
      },
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        instance: 'SessionHavingPageLoops',
        start_time: 'High Page Response Event',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'SessionHavingExceptions',
        start_time: 'Session Having Loop',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'ClickEvent',
        start_time: 'Sessions Having Exception',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-archive-folder',
        server: 'icons8 ',
        instance: 'AjaxError',
        start_time: 'Ajax Call Failure Event',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-archive-folder',
        server: 'icons8 ',
        instance: 'JsError',
        start_time: 'JS Error Failure Event',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-save-as',
        server: 'icons8 ',
        instance: 'SlowServerResponseTime',
        start_time: 'ND SlowTransaction',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        instance: 'PageDistorted',
        start_time: 'Web Page Distorted',
        stop_time: '5',
      },
    ],
    tableFilter: true,
  },
};
