import { TimeFilter } from './../../../../common/interfaces/timefilter';

export interface WaterfallItem {
    filename: string;
    url: string;
    host: string;
    initiatorType: string;
    contentType: string;
    startTime: number;
    duration: number;
    dur: string;
    timingRedirect: number | string;
    timingDNS: number | string;
    timingCache: number | string;
    timingTCP: number | string;
    timingRequest: number | string;
    timingResponse: number | string;
    transferSize: string;
    nextHopProtocol: string;
    isCache: boolean;
    differentOriginFlag: boolean;
    timingRedirectStart: number;
    timingPhaseGap1start: number;
    timingPhaseGap1: number;
    timingPhaseGap2start: number;
    timingPhaseGap2: number;
    timingPhaseGap3start: number;
    timingPhaseGap3: number;
    timingCacheStart: number;
    timingDNSStart: number;
    timingTCPStart: number;
    timingRequestStart: number;
    timingResponseStart: number;
}

export interface TrendFilterCriteria {
    timeFilter: TimeFilter;
    pages: number;
    bucket: number;
    domains: string;
    resource?: string;
}
