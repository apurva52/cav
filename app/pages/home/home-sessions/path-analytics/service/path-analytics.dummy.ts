import { PathAnalytics } from './path-analytics.model';

export const PATH_ANALYTICS_DATA: PathAnalytics = {
  pageOptions: [
    {
      label: 'Page',
      value: 'page',
    },
    {
      label: 'Page1',
      value: 'page1',
    },
  ],
  pathChart: {
    highchart: {
      title: {
        text: null,
      },
      accessibility: {
        point: {
          valueDescriptionFormat:
            '{index}. {point.from} to {point.to}, {point.weight}.',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          keys: ['from', 'to', 'weight'],
          data: [
            ['Google', 'Portugal', 15],
            ['Google', 'France', 1],
            ['Google', 'Spain', 1],
            ['Brazil', 'England', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 5],
            ['Canada', 'England', 1],
            ['Mexico', 'Portugal', 1],
            ['Mexico', 'France', 1],
            ['Mexico', 'Spain', 5],
            ['Mexico', 'England', 1],
            ['USA', 'Portugal', 1],
            ['USA', 'France', 1],
            ['USA', 'Spain', 1],
            ['USA', 'England', 5],
            ['Portugal', 'Angola', 2],
            ['Portugal', 'Senegal', 1],
            ['Portugal', 'Morocco', 1],
            ['Portugal', 'South Africa', 3],
            ['France', 'Angola', 1],
            ['France', 'Senegal', 3],
            ['France', 'Mali', 3],
            ['France', 'Morocco', 3],
            ['France', 'South Africa', 1],
            ['Spain', 'Senegal', 1],
            ['Spain', 'Morocco', 3],
            ['Spain', 'South Africa', 1],
            ['England', 'Angola', 1],
            ['England', 'Senegal', 1],
            ['England', 'Morocco', 2],
            ['England', 'South Africa', 7],
            ['South Africa', 'China', 5],
            ['South Africa', 'India', 1],
            ['South Africa', 'Japan', 3],
          ],
          type: 'sankey',
        },
      ] as Highcharts.SeriesOptionsType[],
    },
  },
};
