import { typ } from 'src/app/shared/metrics/relatedmetrics/service/relatedmetrics.model';
import { AggregateTransactionFlowmapData } from './aggregate-transaction-flowmap.model';

export const AGGREGATE_TRANSACTION_FLOWMAP_DATA: AggregateTransactionFlowmapData = {
  businessJacket: {
    headers: [
      {
        cols: [
          {
            label: 'Business Transaction',
            valueField: 'businessTransaction',
            classes: 'text-left',
          },
          {
            label: 'Start Time',
            valueField: 'startTime',
            classes: 'text-center',
          },
        ],
      },
    ],
    data: [
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard1 Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
      {
        businessTransaction: 'Dashboard Service/Req',
        startTime: '07:09(03/24/20)',
      },
    ],
  },
  nodeInfoData: {
    node: [
      {
        id: '1',
        type: 'cluster',
        // left: 58.5392,
        // top: 6.59954,
        tier: 'tier',
        server: 'server',
        instance: 'instance',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Entry',
        calls: 15,
        rspTime: 1700,
        icon: '',
        serverHealthMajorCircum: 100,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '2',
        type: 'nodeIndices',
        // left: 289.246,
        // top: 2.74217,
        tier: 'tier',
        server: 'server',
        instance: 'instance',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23 ',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 0,
        serverHealthCriticalCircum: 0,
      },
      {
        id: '3',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 50,
        serverHealthCriticalCircum: 25,
      },
      {
        id: '4',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 60,
        serverHealthCriticalCircum: 40,
      },
      {
        id: '5',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 20,
        serverHealthCriticalCircum: 10,
      },
      {
        id: '6',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 0,
        serverHealthCriticalCircum: 100,
      },
      {
        id: '7',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 80,
        serverHealthCriticalCircum: 16,
      },
      {
        id: '8',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '9',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 100,
        serverHealthCriticalCircum: 0,
      },
      {
        id: '10',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '11',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '12',
        type: 'nodeIndices',
        // left: 693.116,
        // top: -171.204,
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '13',
        type: 'lastLevelNodeIndices',
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
      {
        id: '14',
        type: 'lastLevelNodeIndices',
        tier: 'tier',
        server: 'server',
        instance: '25%',
        startTime: '02/05/2020',
        totalDuration: '20/2/20',
        percentage: '20%',
        nodeName: 'Cav23: Instance 1',
        calls: 15,
        rspTime: 1700,
        icon: './assets/icons8-png/icons8-java-100.png',
        serverHealthMajorCircum: 10,
        serverHealthCriticalCircum: 60,
      },
    ],
    edge: [
      { source: '1', target: '2', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.5, } },
      {
        source: '2', target: '3', data: {
          type: 'outputEdgeLabel',
          tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.9
        }
      },
      {
        source: '2', target: '4', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.9
        }
      },
      {
        source: '2', target: '5', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8
        }
      },
      {
        source: '2', target: '6', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8
        }
      },
      {
        source: '2', target: '7', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          bt:'bjdsfsdfdsfdsf ',
          error:'jnjnkn',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8
        }
      },
      {
        source: '2', target: '8', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8
        }
      },
      {
        source: '2', target: '9', data: {
          type: 'outputEdgeLabel', tier: 'tier',
          server: 'server',
          instance: '25%',
          startTime: '02/05/2020',
          totalDuration: '20/2/20',
          percentage: '20%', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8
        }
      },
      { source: '2', target: '10', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8 } },
      { source: '2', target: '11', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.8 } },
      { source: '2', target: '12', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.9 } },
      { source: '12', target: '12', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.9 } },
      { source: '3', target: '13', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.5 } },
      { source: '4', target: '14', data: { type: 'outputEdgeLabel', index: '1', rspTime: '1700ms', calls: '15', putMyLabelAt: 0.5 } },
    ],
  }
};
