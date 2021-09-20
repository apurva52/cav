export enum WidgetType {
  GRAPH_WIDGET = 1,
  DATA_WIDGET = 2,
  TABULAR_WIDGET = 3,
  GRAPH_WITH_TABULAR_WIDGET = 4,
  HEALTH_WIDGET =5,
  TEXT_WIDGET = 6,
  IMAGE_WIDGET = 7,
  LINE_SEPARATOR = 8,
  FILE_IMPORT_WIDGET = 9
}

export enum WidgetTypeValue {
  GRAPH_WIDGET = 'graph',
  DATA_WIDGET = 'data',
  TABULAR_WIDGET = 'tabular',
  GRAPH_WITH_TABULER_WIDGET = 'graph_with_tabular',
  HEALTH_WIDGET = 'system_health',
  TEXT_WIDGET = 'text',
  LABEL_WIDGET= 'label',
  IMAGE_WIDGET = 'image',
  LINE_SEPARATOR = 'line_seperator',
  FILE_IMPORT_WIDGET = 'file_import'
}

export enum WidgetTypeLabel {
  GRAPH_WIDGET = 'Graph',
  DATA_WIDGET = 'Data',
  TABULAR_WIDGET = 'Tabular',
  GRAPH_WITH_TABULER_WIDGET = 'Graph With Tabular',
  HEALTH_WIDGET = 'Health',
  TEXT_WIDGET = 'Text',
  LABEL_WIDGET= 'Label',
  IMAGE_WIDGET = 'Image',
  LINE_SEPARATOR = 'Line Seperator',
  FILE_IMPORT_WIDGET = 'File Import'
}


export enum GraphStatsType {
  TYPE_0  = "avg",
  TYPE_1 = "min",
  TYPE_2 = "max",
  TYPE_3  = "count",
  TYPE_4 = "count",
  TYPE_5 = "lastSample",
  TYPE_6 = "sum",
}




