import { GlobalDrillDownFilterData } from "./global-drilldown-filter.model";


export const GLOBAL_DRILL_DOWN_FILTER_DATA: GlobalDrillDownFilterData = {

  filterSection: [
    {
      name: 'Common Filter',
      data: [
        {
          check: 'test1',
          selectValues: [
            {
              label: 'xyz1',
              value: 'xyz1'
            },
            {
              label: 'xyz1',
              value: 'xyz1'
            },
            {
              label: 'xyz1',
              value: 'xyz1'
            },
            {
              label: 'xyz1',
              value: 'xyz1'
            },

          ]
        },
        {
          check: 'test2',
          selectValues: [
            {
              label: 'xyz2',
              value: 'xyz2'
            },
            {
              label: 'xyz2',
              value: 'xyz2'
            },
            {
              label: 'xyz2',
              value: 'xyz2'
            },
            {
              label: 'xyz2',
              value: 'xyz2'
            },

          ]
        },
        {
          check: 'test3',
          selectValues: [
            {
              label: 'xyz3',
              value: 'xyz3'
            },
            {
              label: 'xyz3',
              value: 'xyz3'
            },
            {
              label: 'xyz3',
              value: 'xyz3'
            },
            {
              label: 'xyz3',
              value: 'xyz3'
            },

          ]
        }
      ],
    },
    {
      name: 'Flowpath Filter',
      data: [
        {
          check: 'test4',
          selectValues: [
            {
              label: 'xyz4',
              value: 'xyz4'
            },
            {
              label: 'xyz4',
              value: 'xyz4'
            },
            {
              label: 'xyz4',
              value: 'xyz4'
            },
            {
              label: 'xyz4',
              value: 'xyz4'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        }
      ],
    },
    {
      name: 'BT',
      data: [
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        }
      ],
    },
    {
      name: 'Common Filter',
      data: [
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        },
        {
          check: 'test',
          selectValues: [
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },
            {
              label: 'xyz',
              value: 'xyz'
            },

          ]
        }
      ],
    }

  ],
  health: [
    {
      label: 'Flowpath',
      value: 'Flowpath'
    },
    {
      label: 'Flowpath GroupBy',
      value: 'FPG_BT'
    },
    {
      label: 'Method Timing',
      value: 'Method Timing'
    },
    {
      label: 'DB Report',
      value: 'DB Report'
    },
    {
      label: 'DB GroupBy',
      value: 'DBG_BT'
    },
    {
      label: 'Hotspot',
      value: 'Hotspot'
    }
    // {
    //   label: 'abc',
    //   value: 'abc'
    // },
    // {
    //   label: 'abc',
    //   value: 'abc'
    // },
    // {
    //   label: 'abc',
    //   value: 'abc'
    // },
    // {
    //   label: 'abc',
    //   value: 'abc'
    // }
  ],
  errorsec: [
    {
      label: 'xyz',
      value: 'xyz'
    },
    {
      label: 'xyz',
      value: 'xyz'
    },
    {
      label: 'xyz',
      value: 'xyz'
    },
    {
      label: 'xyz',
      value: 'xyz'
    },
    {
      label: 'xyz',
      value: 'xyz'
    }
  ],
  items: [
    {
      label: 'Live',
      items: [
        { label: 'Last 5 Minutes' },
        { label: 'Last 10 Minutes' },
        { label: 'Last 30 Minutes' },
        { label: 'Last 1 Hours' },
        { label: 'Last 2 Hours' },
        { label: 'Last 4 Hours' },
        { label: 'Last 6 Hours' },
        { label: 'Last 8 Hours' },
        { label: 'Last 12 Hours' },
        { label: 'Last 24 Hours' },
        { label: 'Today' },
        { label: 'Last 7 Days' },
        { label: 'Last 30 Days' },
        { label: 'Last 90 Days' },
        { label: 'This Week' },
        { label: 'This Month' },
        { label: 'This Year' }
      ]
    },
    {
      label: 'Past',
      items: [
        { label: 'Yesterday' },
        { label: 'Last Week' },
        { label: 'Last 2 Week' },
        { label: 'Last 3 Week' },
        { label: 'Last 4 Week' },
        { label: 'Last Month' },
        { label: 'Last 2 Month' },
        { label: 'Last 3 Month' },
        { label: 'Last 6 Month' },
        { label: 'Last Year' }
      ]
    },
    {
      label: 'Events',
      items: [
        {
          label: 'Black Friday',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Christmas Day',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Cyber Monday',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Good Friday',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'New Years Day',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Presidents Day',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Thanks Giving Day',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
        {
          label: 'Valentines Day',
          items: [
            { label: '2020' },
            { label: '2019' },
            { label: '2018' },
            { label: '2017' },
            { label: '2016' },
            { label: '2015' },
            { label: '2014' },
            { label: '2013' },
            { label: '2012' },
            { label: '2011' },
            { label: '2010' }
          ]
        },
      ]
    }
  ]

};
