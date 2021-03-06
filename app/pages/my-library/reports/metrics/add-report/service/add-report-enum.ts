export enum ReportConstant {

    JSON_TYPE= "json",
    EXCEL_TYPE = "excel",
    FAV_TYPE= "fav",
    ALERT_TYPE= "alert",
    CSV_TYPE= "csv",


    EXCEL_REPORT = 0,
    WORD_REPORT = 1,
    HTML_REPORT = 2,
    GENERTE_REPORT = 3,
    COMPARE_REPORT = 4,
    HIERARCHICAL_REPORT = 5,
    STATS_REPORT = 7,
    Cmp_HTML_Report = 8,
    Cmp_WORD_Report = 9,
    SUMMARY_REPORT = 10,
    ALERT_DIGEST_EXCEL_REPORT = 11,
    ALERT_DIGEST_WORD_REPORT = 12,
    ALERT_DIGEST_PDF_REPORT = 13,
    CUSTOM_PDF_REPORT = 14,
    USER_SESSION_REPORT = 15,

    PERFORMANCE_TEST_HTML_REPORT = 6,

    ALL_GRAPH_REPORT = 0,
	SELECT_GRAPH_REPORT = 1,
	TEMPLATE_GRAPH_REPORT = 2,
	ALL_TRANSACTION_REPORT = 3,
	Favorite_GRAPH_REPORT = 4,

    NORMAL_GRAPH = 0,
    PERCENTILE_GRAPH = 1,
    SLAB_COUNT_GRAPH = 2,

    LINE_CHART = 0,
    BAR_CHART = 1,
    AREA_CHART = 2,
    STACKED_AREA_CHART = 3,
    STACKED_BAR_CHART = 4,
    PIE_CHART = 5,
    SCATTER_CHART = 6,
    TILE_CHART = 7,
    CORRELATED_CHART = 8,
    MULTIAXIS_CHART = 9,
    MULTILAYOUT_CHART = 10,
    STACKED_LINE_BAR_CHART = 11,
    DONUT_CHART = 12,

    AVG = 0,
    MIN = 1,
    MAX = 2,
    COUNT = 3,
    SUM_COUNT = 4,
    LAST = 5,

    ADD_MORE_REPORT_SET_ACTION = 1,
    EDIT_ADDED_REPORT_SET_ACTION = 2,
    VIEW_TEMPLATE_ONLY_ACTION = 3,
    EDIT_ACTION_ON_REPORT_SET_NODES = 4,
    VIEW_ACTION_ON_REPORT_SET_NODES = 5,

    EQUALS = 0,
    GRATER_THAN_EQUAL = 3,
    LESS_THAN_EQUAL = 4,
    TOP = 5,
    BOTTOM = 6,
    IN_BETWEEN = 7,

    INCLUDE = 0,
    EXCLUDE = 1,
}