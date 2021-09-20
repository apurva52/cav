import { TreeNode } from 'primeng';
import { TreeNodeMenu } from './graph-in-tree.model';

export const GRAPH_IN_TREE: TreeNodeMenu[] = [
  {
    label: 'System Metrics',
    data: 'System Metrics',
    icon: 'icons8 icons8-folder',
    children: [
      {
        label: 'Device Stats',
        data: {
          treeLevel: 'VECTOR',
        },
        icon: 'icons8 icons8-folder',
        children: [
          {
            label: 'Cavisson',
            icon: 'icons8 icons8-view-all',
            data: {
              treeLevel: 'GRAPH',
            },
          },
          {
            label: 'AdvanceFav',
            icon: 'icons8 icons8-view-all',
            data: {
              treeLevel: 'GRAPH',
            },
          },
        ],
      },
      {
        label: 'Test Metrics',
        data: {
          treeLevel: 'VECTOR',
        },
        icon: 'icons8 icons8-folder',
        children: [
          {
            label: 'Cavisson',
            icon: 'icons8 icons8-view-all',
            data: {
              treeLevel: 'GRAPH',
            },
          },
        ],
      },
      {
        label: 'Device Test',
        data: {
          treeLevel: 'VECTOR',
        },
        icon: 'icons8 icons8-folder',
        children: [
          {
            label: 'Device Stats',
            data: {
              treeLevel: 'VECTOR',
              selectable: false,
            },
            icon: 'icons8 icons8-folder',
            children: [
              {
                label: 'Device Stats',
                data: {
                  treeLevel: 'VECTOR',
                  selectable: false,
                },
                icon: 'icons8 icons8-folder',
                children: [
                  {
                    label: 'Device Stats',
                    data: {
                      treeLevel: 'VECTOR',
                    },
                    icon: 'icons8 icons8-folder',
                    children: [
                      {
                        label: 'Device Stats',
                        data: {
                          treeLevel: 'VECTOR',
                        },
                        icon: 'icons8 icons8-folder',
                        children: [
                          {
                            label: 'Device Stats',
                            data: {
                              treeLevel: 'VECTOR',
                            },
                            icon: 'icons8 icons8-folder',
                            children: [
                              {
                                label: 'Device Stats',
                                data: {
                                  treeLevel: 'VECTOR',
                                },
                                icon: 'icons8 icons8-folder',
                                children: [
                                  {
                                    label: 'Device Stats',
                                    data: {
                                      treeLevel: 'VECTOR',
                                    },
                                    icon: 'icons8 icons8-folder',
                                    children: [
                                      {
                                        label: 'Device Stats',
                                        data: {
                                          treeLevel: 'VECTOR',
                                        },
                                        icon: 'icons8 icons8-folder',
                                        children: [
                                          {
                                            label: 'Device Stats',
                                            data: {
                                              treeLevel: 'VECTOR',
                                            },
                                            icon: 'icons8 icons8-folder',
                                            children: [
                                              {
                                                label: 'Device Stats',
                                                data: {
                                                  treeLevel: 'VECTOR',
                                                },
                                                icon: 'icons8 icons8-folder',
                                                children: [
                                                  {
                                                    label: 'Device Stats',
                                                    data: {
                                                      treeLevel: 'VECTOR',
                                                    },
                                                    icon: 'icons8 icons8-folder',
                                                    children: [
                                                      {
                                                        label: 'Device Stats',
                                                        data: {
                                                          treeLevel: 'VECTOR',
                                                        },
                                                        icon: 'icons8 icons8-folder',
                                                        children: [
                                                          {
                                                            label: 'Device Stats',
                                                            data: {
                                                              treeLevel: 'VECTOR',
                                                            },
                                                            icon: 'icons8 icons8-folder',
                                                            children: [
                                                              {
                                                                label: 'Device Stats',
                                                                data: {
                                                                  treeLevel: 'VECTOR',
                                                                },
                                                                icon: 'icons8 icons8-folder',
                                                                children: [
                                                                  {
                                                                    label: 'Cavisson',
                                                                    icon: 'icons8 icons8-view-all',
                                                                    data: {
                                                                      treeLevel: 'GRAPH',
                                                                    },
                                                                  },
                                                                  {
                                                                    label: 'AdvanceFav',
                                                                    icon: 'icons8 icons8-view-all',
                                                                    data: {
                                                                      treeLevel: 'GRAPH',
                                                                    },
                                                                  },
                                                                ],
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'KPI',
    data: {
      treeLevel: 'VECTOR',
    },
    icon: 'icons8 icons8-folder',
    children: [
      {
        label: 'Cavisson',
        icon: 'icons8 icons8-view-all',
        data: {
          treeLevel: 'GRAPH',
        },
      },
      {
        label: 'AllGraphs',
        icon: 'icons8 icons8-view-all',
        data: {
          treeLevel: 'GRAPH',
        },
      },
      {
        label: 'AdvanceFav',
        icon: 'icons8 icons8-view-all',
        data: {
          treeLevel: 'GRAPH',
        },
      },
    ],
  },
];
